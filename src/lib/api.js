// All TMDB access goes through our own /api/tmdb function (no credentials in the browser).
export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

const cache = new Map();

export async function tmdb(op, params = {}, { signal } = {}) {
  const clean = {};
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') clean[k] = v;
  const qs = new URLSearchParams({ op, ...clean }).toString();
  if (cache.has(qs)) return cache.get(qs);
  let res;
  try {
    res = await fetch(`/api/tmdb?${qs}`, { signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new ApiError('Network error. Check your connection and try again.', 0);
  }
  let body = null;
  try { body = await res.json(); } catch { /* handled below */ }
  if (!res.ok || !body || !body.ok) {
    throw new ApiError(body?.error?.message || 'Something went wrong while loading data.', res.status);
  }
  cache.set(qs, body.data);
  if (cache.size > 300) cache.delete(cache.keys().next().value);
  return body.data;
}

export const img = (path, size = 'w342') => (path ? `https://image.tmdb.org/t/p/${size}${path}` : null);

export function normalize(r, fallbackType = 'movie') {
  if (!r || typeof r.id !== 'number') return null;
  const type = r.media_type === 'tv' || r.media_type === 'movie' ? r.media_type : fallbackType;
  const date = r.release_date || r.first_air_date || '';
  return {
    id: r.id,
    type,
    title: r.title || r.name || 'Untitled',
    year: date ? date.slice(0, 4) : '',
    rating: r.vote_average ? Math.round(r.vote_average * 10) / 10 : 0,
    votes: r.vote_count || 0,
    popularity: r.popularity || 0,
    poster: r.poster_path || null,
    backdrop: r.backdrop_path || null,
    overview: r.overview || '',
    genreIds: r.genre_ids || (r.genres || []).map((g) => g.id),
  };
}

export function formatRuntime(min) {
  if (!min) return '';
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export const watchUrl = (type, id) => `/player.html?id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}`;
