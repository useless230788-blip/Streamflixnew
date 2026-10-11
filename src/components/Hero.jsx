import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Play, Plus, Check, Star } from 'lucide-react';
import { tmdb, normalize, img, formatRuntime, watchUrl } from '../lib/api.js';
import { useAsync, useReducedMotion } from '../lib/hooks.js';
import { useStore } from '../lib/store.jsx';
import { ErrorState } from './ui.jsx';
import { genreById } from '../lib/genres.js';

export default function Hero() {
  const { toggleList, inList, prefs } = useStore();
  const reduced = useReducedMotion();
  const { data, loading, error, retry } = useAsync((signal) => tmdb('trending', {}, { signal }), []);
  const items = (data?.results || []).map((r) => normalize(r, 'movie')).filter((x) => x && x.backdrop).slice(0, 6);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const cur = items[i];

  const det = useAsync((signal) => (cur ? tmdb('details', { type: 'movie', id: cur.id }, { signal }) : Promise.resolve(null)), [cur?.id]);

  useEffect(() => {
    if (!prefs.heroAutoplay || reduced || paused || items.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [prefs.heroAutoplay, reduced, paused, items.length]);

  if (error) return <section className="hero hero-state"><ErrorState error={error} onRetry={retry} /></section>;
  if (loading || !cur) return <section className="hero"><div className="skel hero-skel" aria-busy="true" /></section>;

  const d = det.data && det.data.id === cur.id ? det.data : null;
  const genres = (d?.genres || cur.genreIds.map((g) => genreById(g)).filter(Boolean)).slice(0, 3);
  const go = (n) => setI((i + n + items.length) % items.length);
  const saved = inList(cur);

  return (
    <section className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured titles">
      <img key={cur.id} className="hero-bg" src={img(cur.backdrop, 'w1280')} alt="" fetchpriority="high" />
      <div className="hero-shade" />
      <div className="hero-body" key={`b${cur.id}`}>
        <span className="chip-live"><i /> Trending Now</span>
        <h1 className="hero-title">{cur.title}</h1>
        <p className="hero-over">{cur.overview}</p>
        <p className="hero-meta">
          {cur.year && <span>{cur.year}</span>}
          {d?.runtime ? <span>{formatRuntime(d.runtime)}</span> : null}
          {cur.rating ? <span className="rating"><Star size={13} fill="currentColor" strokeWidth={0} /> {cur.rating.toFixed(1)}</span> : null}
        </p>
        <div className="badges">{genres.map((g) => <a key={g.id} className="badge" href={`#/genre/${g.id}`}>{g.name}</a>)}</div>
        <div className="hero-actions">
          <a className="btn btn-red" href={watchUrl('movie', cur.id)}><Play size={18} fill="currentColor" /> Watch Now</a>
          <a className="btn btn-dark" href={`#/title/movie/${cur.id}`}><Info size={17} /> <span>More Info</span></a>
          <button className="btn btn-dark" onClick={() => toggleList(cur)} aria-pressed={saved}>
            {saved ? <Check size={17} /> : <Plus size={17} />} <span>My List</span>
          </button>
        </div>
      </div>
      <div className="hero-ctrl">
        <button className="icon-btn round" aria-label="Previous title" onClick={() => go(-1)}><ChevronLeft size={18} /></button>
        <button className="icon-btn round" aria-label="Next title" onClick={() => go(1)}><ChevronRight size={18} /></button>
      </div>
      <div className="hero-dots" role="tablist" aria-label="Choose featured title">
        {items.map((it, n) => <button key={it.id} role="tab" aria-selected={n === i} aria-label={`Show ${it.title}`} className={n === i ? 'on' : ''} onClick={() => setI(n)} />)}
      </div>
    </section>
  );
}
