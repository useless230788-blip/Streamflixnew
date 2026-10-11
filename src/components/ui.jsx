import { ArrowLeft, Star } from 'lucide-react';
import { initials } from '../lib/store.jsx';
import { img } from '../lib/api.js';

export function Logo({ size = 28, text = true, className = '' }) {
  return (
    <span className={`logo ${className}`} aria-label="Streamflix">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="9" fill="#E50914" />
        <path d="M11 8.5v15l12.5-7.5z" fill="#fff" />
      </svg>
      {text && <span className="logo-text" style={{ fontSize: size * 0.62 }}>STREAM<b>FLIX</b></span>}
    </span>
  );
}

export function Avatar({ name, size = 32 }) {
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">{initials(name)}</span>;
}

export const Rating = ({ value }) => (value ? <span className="rating"><Star size={12} fill="currentColor" strokeWidth={0} /> {value.toFixed(1)}</span> : null);

export function Poster({ path, alt, size = 'w342', className = '' }) {
  const src = img(path, size);
  return src
    ? <img className={`poster ${className}`} src={src} alt={alt} loading="lazy" decoding="async"
        onError={(e) => { e.currentTarget.replaceWith(Object.assign(document.createElement('div'), { className: 'poster poster-fallback', textContent: alt })); }} />
    : <div className={`poster poster-fallback ${className}`} role="img" aria-label={alt}>{alt}</div>;
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state" role="alert">
      <p className="state-title">{error?.status === 500 && /credentials/i.test(error.message) ? 'TMDB is not configured' : 'Couldn’t load this'}</p>
      <p className="state-text">{error?.message || 'Something went wrong.'}</p>
      {onRetry && <button className="btn btn-red btn-sm" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export const Empty = ({ title, text, children }) => (
  <div className="state"><p className="state-title">{title}</p>{text && <p className="state-text">{text}</p>}{children}</div>
);

export const CardSkeletons = ({ n = 8, wide }) => (
  <div className={wide ? 'grid' : 'row-scroll'} aria-hidden="true">
    {Array.from({ length: n }, (_, i) => <div key={i} className="card skel-card"><div className="skel poster" /><div className="skel skel-line" /><div className="skel skel-line short" /></div>)}
  </div>
);

export function PageHead({ title, sub }) {
  return (
    <div className="page-head">
      <button className="icon-btn only-mobile" aria-label="Go back" onClick={() => (window.history.length > 1 ? window.history.back() : (window.location.hash = '/'))}><ArrowLeft size={20} /></button>
      <div><h1>{title}</h1>{sub && <p className="muted">{sub}</p>}</div>
    </div>
  );
}
