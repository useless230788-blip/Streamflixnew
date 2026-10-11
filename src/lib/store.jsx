import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const K = {
  name: 'streamflix_username',
  list: 'streamflix_watchlist',
  recent: 'streamflix_recent',
  genres: 'streamflix_fav_genres',
  prefs: 'streamflix_prefs',
};

const isItem = (x) => x && typeof x === 'object' && Number.isFinite(x.id) && (x.type === 'movie' || x.type === 'tv') && typeof x.title === 'string';
const arrOfItems = (v) => Array.isArray(v) && v.every(isItem);
const DEFAULT_PREFS = { heroAutoplay: true };

function read(key, fallback, ok) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const v = JSON.parse(raw);
    return ok(v) ? v : fallback;
  } catch { return fallback; }
}
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full/blocked */ } }

export function cleanName(s) {
  return String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
}
function readName() {
  try { return cleanName(localStorage.getItem(K.name)); } catch { return ''; }
}
export function initials(name) {
  const parts = cleanName(name).split(' ').filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [username, setName] = useState(readName);
  const [watchlist, setWatchlist] = useState(() => read(K.list, [], arrOfItems));
  const [recent, setRecent] = useState(() => read(K.recent, [], arrOfItems));
  const [favGenres, setFavGenres] = useState(() => read(K.genres, {}, (v) => v && typeof v === 'object' && !Array.isArray(v)));
  const [prefs, setPrefs] = useState(() => {
    const p = read(K.prefs, DEFAULT_PREFS, (v) => v && typeof v === 'object');
    return { ...DEFAULT_PREFS, ...p, heroAutoplay: p.heroAutoplay !== false };
  });

  useEffect(() => { try { username ? localStorage.setItem(K.name, username) : localStorage.removeItem(K.name); } catch {} }, [username]);
  useEffect(() => write(K.list, watchlist), [watchlist]);
  useEffect(() => write(K.recent, recent), [recent]);
  useEffect(() => write(K.genres, favGenres), [favGenres]);
  useEffect(() => write(K.prefs, prefs), [prefs]);

  const setUsername = useCallback((n) => { const c = cleanName(n); if (c) setName(c); return !!c; }, []);
  const resetProfile = useCallback(() => {
    Object.values(K).forEach((k) => { try { localStorage.removeItem(k); } catch {} });
    setName(''); setWatchlist([]); setRecent([]); setFavGenres({}); setPrefs(DEFAULT_PREFS);
  }, []);
  const slim = (t) => ({ id: t.id, type: t.type, title: t.title, year: t.year || '', rating: t.rating || 0, poster: t.poster || null, backdrop: t.backdrop || null });
  const toggleList = useCallback((t) => {
    setWatchlist((l) => (l.some((x) => x.id === t.id && x.type === t.type) ? l.filter((x) => !(x.id === t.id && x.type === t.type)) : [slim(t), ...l]));
  }, []);
  const addRecent = useCallback((t) => {
    setRecent((l) => [slim(t), ...l.filter((x) => !(x.id === t.id && x.type === t.type))].slice(0, 20));
  }, []);
  const bumpGenre = useCallback((id) => setFavGenres((g) => ({ ...g, [id]: (g[id] || 0) + 1 })), []);
  const setPref = useCallback((k, v) => setPrefs((p) => ({ ...p, [k]: v })), []);
  const inList = useCallback((t) => watchlist.some((x) => x.id === t.id && x.type === t.type), [watchlist]);

  const value = useMemo(() => ({ username, setUsername, resetProfile, watchlist, toggleList, inList, recent, addRecent, favGenres, bumpGenre, prefs, setPref }),
    [username, setUsername, resetProfile, watchlist, toggleList, inList, recent, addRecent, favGenres, bumpGenre, prefs, setPref]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
