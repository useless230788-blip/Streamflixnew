import { useEffect, useState } from 'react';
import { Check, Play, Plus } from 'lucide-react';
import MovieCard from '../components/MovieCard.jsx';
import { ErrorState, PageHead, Poster, Rating } from '../components/ui.jsx';
import { useAsync } from '../lib/hooks.js';
import { tmdb, normalize, img, formatRuntime, watchUrl } from '../lib/api.js';
import { useStore } from '../lib/store.jsx';

export default function Details({ type, id }) {
  const valid = (type === 'movie' || type === 'tv') && /^\d{1,9}$/.test(id);
  const { data: d, loading, error, retry } = useAsync((signal) => (valid ? tmdb('details', { type, id }, { signal }) : Promise.reject(Object.assign(new Error('That title link isn’t valid.'), { status: 400 }))), [type, id]);
  const { toggleList, inList, addRecent } = useStore();
  const [tab, setTab] = useState('overview');
  const item = d ? normalize({ ...d, media_type: type }, type) : null;
  useEffect(() => { setTab('overview'); }, [type, id]);
  useEffect(() => { if (item) addRecent(item); }, [d?.id]); // eslint-disable-line

  if (error) return <div className="page"><PageHead title="Details" /><ErrorState error={error} onRetry={retry} /></div>;
  if (loading || !d || !item) return <div className="page"><div className="skel detail-skel" aria-busy="true" /></div>;

  const runtime = type === 'movie' ? d.runtime : d.episode_run_time?.[0];
  const trailer = (d.videos?.results || []).filter((v) => v.site === 'YouTube' && /^[\w-]{6,15}$/.test(v.key))
    .sort((a, b) => (b.type === 'Trailer') - (a.type === 'Trailer') || (b.official === true) - (a.official === true))[0];
  const cast = (d.credits?.cast || []).slice(0, 14);
  const directors = type === 'movie' ? (d.credits?.crew || []).filter((c) => c.job === 'Director').map((c) => c.name) : (d.created_by || []).map((c) => c.name);
  const seen = new Set();
  const similar = [...(d.recommendations?.results || []), ...(d.similar?.results || [])].map((r) => normalize(r, type)).filter((x) => x && x.poster && !seen.has(x.id) && seen.add(x.id)).slice(0, 18);
  const tabs = [['overview', 'Overview'], ['cast', 'Cast & Crew'], ...(trailer ? [['trailer', 'Trailer']] : []), ['similar', 'Similar']];
  const saved = inList(item);

  return (
    <article className="detail">
      <div className="detail-hero">
        {d.backdrop_path && <img src={img(d.backdrop_path, 'w1280')} alt="" />}
        <div className="hero-shade" />
        <div className="only-mobile detail-back"><PageHead title="Movie Details" /></div>
      </div>
      <div className="detail-main">
        <Poster path={d.poster_path} alt={item.title} size="w500" className="detail-poster" />
        <div className="detail-info">
          <h1>{item.title}</h1>
          {d.tagline && <p className="muted italic">{d.tagline}</p>}
          <p className="hero-meta">
            {item.year && <span>{item.year}</span>}{runtime ? <span>{formatRuntime(runtime)}</span> : null}<Rating value={item.rating} />
            {type === 'tv' && d.number_of_seasons ? <span>{d.number_of_seasons} season{d.number_of_seasons > 1 ? 's' : ''}</span> : null}
          </p>
          <div className="badges">{(d.genres || []).map((g) => <span key={g.id} className="badge">{g.name}</span>)}</div>
          <div className="hero-actions">
            <a className="btn btn-red" href={watchUrl(type, d.id)}><Play size={18} fill="currentColor" /> Watch Now</a>
            <button className="btn btn-dark" onClick={() => toggleList(item)} aria-pressed={saved}>{saved ? <Check size={17} /> : <Plus size={17} />} <span>{saved ? 'In My List' : 'My List'}</span></button>
          </div>
        </div>
      </div>
      <div className="tabs" role="tablist">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <div className="tab-body" role="tabpanel">
        {tab === 'overview' && (
          <>
            <p className="overview">{d.overview || 'No synopsis available yet.'}</p>
            <dl className="facts">
              <div><dt>Release date</dt><dd>{d.release_date || d.first_air_date || '—'}</dd></div>
              {runtime ? <div><dt>Runtime</dt><dd>{formatRuntime(runtime)}</dd></div> : null}
              <div><dt>Status</dt><dd>{d.status || '—'}</dd></div>
              {directors.length > 0 && <div><dt>{type === 'movie' ? 'Director' : 'Created by'}</dt><dd>{directors.join(', ')}</dd></div>}
            </dl>
          </>
        )}
        {tab === 'cast' && (cast.length ? <ul className="cast">{cast.map((c) => (
          <li key={c.credit_id || c.id}><Poster path={c.profile_path} alt={c.name} size="w185" className="cast-img" /><b>{c.name}</b><span className="muted small">{c.character}</span></li>))}</ul>
          : <p className="muted">Cast details aren’t available.</p>)}
        {tab === 'trailer' && trailer && (
          <div className="video"><iframe src={`https://www.youtube-nocookie.com/embed/${trailer.key}`} title={`${item.title} trailer`} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen /></div>
        )}
        {tab === 'similar' && (similar.length ? <div className="grid">{similar.map((s) => <MovieCard key={s.id} item={s} />)}</div> : <p className="muted">No similar titles found.</p>)}
      </div>
    </article>
  );
}
