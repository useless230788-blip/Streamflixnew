// Vercel serverless function: restricted, allow-listed TMDB gateway.
// Usage: /api/tmdb?op=<operation>&...params
// Credentials stay server-side (TMDB_BEARER_TOKEN preferred, TMDB_API_KEY fallback).

const BASE = 'https://api.themoviedb.org/3';
const TYPES = new Set(['movie', 'tv']);
const SORTS = new Set(['popularity.desc', 'vote_average.desc']);

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const bad = (m) => new HttpError(400, 'bad_request', m);

function type(q) {
  const t = q.type || 'movie';
  if (!TYPES.has(t)) throw bad('type must be "movie" or "tv".');
  return t;
}
function page(q) {
  if (q.page == null || q.page === '') return 1;
  const n = Number(q.page);
  if (!Number.isInteger(n) || n < 1 || n > 500) throw bad('page must be an integer from 1 to 500.');
  return n;
}
function id(q) {
  if (!/^\d{1,9}$/.test(String(q.id || ''))) throw bad('id must be a numeric TMDB id.');
  return q.id;
}
function genre(q) {
  if (q.genre == null || q.genre === '') return null;
  if (!/^\d{1,6}$/.test(String(q.genre))) throw bad('genre must be a numeric genre id.');
  return q.genre;
}
function year(q) {
  if (q.year == null || q.year === '') return null;
  const y = Number(q.year);
  if (!Number.isInteger(y) || y < 1900 || y > new Date().getFullYear() + 5) throw bad('year is out of range.');
  return String(y);
}
function sort(q) {
  const s = q.sort || 'popularity.desc';
  if (!SORTS.has(s)) throw bad('Unsupported sort.');
  return s;
}
function minRating(q) {
  if (q.minRating == null || q.minRating === '') return null;
  const n = Number(q.minRating);
  if (!(n >= 0 && n <= 10)) throw bad('minRating must be between 0 and 10.');
  return String(n);
}
function query(q) {
  const s = String(q.query || '').trim();
  if (!s) throw bad('query is required.');
  if (s.length > 100) throw bad('query is too long.');
  return s;
}
function discover(t, q, extra = {}) {
  const p = { page: page(q), sort_by: sort(q), include_adult: 'false', ...extra };
  const g = genre(q); if (g) p.with_genres = g;
  const y = year(q); if (y) p[t === 'movie' ? 'primary_release_year' : 'first_air_date_year'] = y;
  const r = minRating(q); if (r) { p['vote_average.gte'] = r; p['vote_count.gte'] = p['vote_count.gte'] || '100'; }
  if (p.sort_by === 'vote_average.desc' && !p['vote_count.gte']) p['vote_count.gte'] = '300';
  return [`/discover/${t}`, p];
}
const today = () => new Date().toISOString().slice(0, 10);

// Every supported operation. Anything not listed here is rejected.
const OPS = {
  trending: (q) => ['/trending/movie/week', { page: page(q) }],
  popularMovies: (q) => ['/movie/popular', { page: page(q) }],
  topRatedMovies: (q) => ['/movie/top_rated', { page: page(q) }],
  upcomingMovies: (q) => ['/movie/upcoming', { page: page(q) }],
  popularTV: (q) => ['/tv/popular', { page: page(q) }],
  topRatedTV: (q) => ['/tv/top_rated', { page: page(q) }],
  actionAdventure: (q) => discover('movie', q, { with_genres: '28|12', 'vote_count.gte': '200' }),
  scifi: (q) => discover('movie', q, { with_genres: '878', 'vote_count.gte': '200' }),
  horror: (q) => discover('movie', q, { with_genres: '27', 'vote_count.gte': '200' }),
  hiddenGems: (q) => ['/discover/movie', {
    page: page(q), sort_by: 'vote_average.desc', 'vote_average.gte': '7.3',
    'vote_count.gte': '300', 'vote_count.lte': '2500', include_adult: 'false', 'primary_release_date.lte': today(),
  }],
  discover: (q) => discover(type(q), q),
  search: (q) => {
    const t = type(q);
    const p = { query: query(q), page: page(q), include_adult: 'false' };
    const y = year(q); if (y) p[t === 'movie' ? 'year' : 'first_air_date_year'] = y;
    return [`/search/${t}`, p];
  },
  genres: (q) => [`/genre/${type(q)}/list`, {}],
  details: (q) => [`/${type(q)}/${id(q)}`, { append_to_response: 'credits,videos,similar,recommendations' }],
};

function sendJson(res, status, body, cache) {
  res.setHeader('Cache-Control', cache || 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(status).json(body);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') throw new HttpError(405, 'method_not_allowed', 'Only GET is supported.');
    const q = req.query || {};
    if (!Object.prototype.hasOwnProperty.call(OPS, q.op || '')) throw bad('Unknown operation.');
    const build = OPS[q.op];

    const token = process.env.TMDB_BEARER_TOKEN;
    const key = process.env.TMDB_API_KEY;
    if (!token && !key) {
      throw new HttpError(500, 'not_configured', 'TMDB credentials are missing. Set TMDB_BEARER_TOKEN (or TMDB_API_KEY) in the server environment.');
    }

    const [path, params] = build(q);
    const url = new URL(BASE + path);
    url.searchParams.set('language', 'en-US');
    for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, String(v));
    const headers = { Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`; else url.searchParams.set('api_key', key);

    let upstream;
    try {
      upstream = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    } catch {
      throw new HttpError(504, 'upstream_unreachable', 'TMDB did not respond in time. Try again.');
    }

    if (upstream.status === 429) {
      res.setHeader('Retry-After', upstream.headers.get('retry-after') || '5');
      throw new HttpError(429, 'rate_limited', 'TMDB rate limit reached. Try again in a moment.');
    }
    if (upstream.status === 401) throw new HttpError(502, 'upstream_auth', 'TMDB rejected the server credentials. Check your token or key.');
    if (upstream.status === 404) throw new HttpError(404, 'not_found', 'Title not found.');
    if (!upstream.ok) throw new HttpError(502, 'upstream_error', `TMDB returned ${upstream.status}.`);

    const data = await upstream.json();
    const ttl = q.op === 'search' ? 300 : 3600;
    sendJson(res, 200, { ok: true, data }, `public, s-maxage=${ttl}, stale-while-revalidate=86400`);
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    sendJson(res, status, { ok: false, error: { code: e.code || 'server_error', message: e instanceof HttpError ? e.message : 'Unexpected server error.' } });
  }
}
