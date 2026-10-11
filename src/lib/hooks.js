import { useCallback, useEffect, useRef, useState } from 'react';
import { tmdb, normalize } from './api.js';

export function useAsync(fn, deps) {
  const [s, setS] = useState({ data: null, loading: true, error: null });
  const [n, setN] = useState(0);
  useEffect(() => {
    let alive = true;
    const ctrl = new AbortController();
    setS((p) => ({ data: p.data, loading: true, error: null }));
    fn(ctrl.signal)
      .then((d) => alive && setS({ data: d, loading: false, error: null }))
      .catch((e) => { if (alive && e.name !== 'AbortError') setS({ data: null, loading: false, error: e }); });
    return () => { alive = false; ctrl.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, n]);
  return { ...s, retry: () => setN((x) => x + 1) };
}

export function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

export function useInView(rootMargin = '300px') {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);
  return [ref, seen];
}

function useMedia(q) {
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const h = () => setM(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return m;
}
export const useIsMobile = () => useMedia('(max-width: 820px)');
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');

// Paged list loader (load more). `params` must be a plain object.
export function usePaged(op, params, enabled = true) {
  const key = JSON.stringify([op, params]);
  const [st, setSt] = useState({ items: [], page: 0, total: 1, loading: enabled, error: null });
  const token = useRef(0);
  const load = useCallback(async (page) => {
    const t = ++token.current;
    setSt((s) => ({ ...s, loading: true, error: null, ...(page === 1 ? { items: [], page: 0 } : {}) }));
    try {
      const d = await tmdb(op, { ...params, page });
      if (t !== token.current) return;
      const fb = params.type || 'movie';
      const items = (d.results || []).map((r) => normalize(r, fb)).filter(Boolean);
      setSt((s) => {
        const merged = page === 1 ? items : [...s.items, ...items];
        const seen = new Set();
        const dedup = merged.filter((x) => { const k = x.type + x.id; if (seen.has(k)) return false; seen.add(k); return true; });
        return { items: dedup, page, total: Math.min(d.total_pages || 1, 500), loading: false, error: null };
      });
    } catch (e) {
      if (t !== token.current) return;
      setSt((s) => ({ ...s, loading: false, error: e }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (enabled) load(1);
    else { token.current++; setSt({ items: [], page: 0, total: 1, loading: false, error: null }); }
  }, [load, enabled]);
  return { ...st, hasMore: st.page > 0 && st.page < st.total, loadMore: () => load(st.page + 1), retry: () => load(st.page + 1) };
}

// Hash router: #/path?query
export function parseHash(hash) {
  const raw = (hash || '').replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  return { path: path || '/', segs: (path || '/').split('/').filter(Boolean), query: Object.fromEntries(new URLSearchParams(qs)) };
}
export function useRoute() {
  const [r, setR] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const h = () => setR(parseHash(window.location.hash));
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  return r;
}
export const navigate = (to, replace = false) => {
  if (replace) window.location.replace(`#${to}`); else window.location.hash = to;
};
