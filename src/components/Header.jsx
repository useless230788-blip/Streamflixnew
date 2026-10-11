import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import SearchBox from './SearchBox.jsx';
import ProfilePanel from './Profile.jsx';
import { Avatar, Logo } from './ui.jsx';
import { useStore } from '../lib/store.jsx';
import { useAsync } from '../lib/hooks.js';
import { tmdb, normalize } from '../lib/api.js';

function useOutside(ref, fn) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) fn(); };
    const k = (e) => { if (e.key === 'Escape') fn(); };
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [ref, fn]);
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  const { data } = useAsync((signal) => (open ? tmdb('upcomingMovies', {}, { signal }) : Promise.resolve(null)), [open]);
  const items = (data?.results || []).map((r) => normalize(r)).filter(Boolean).slice(0, 5);
  return (
    <div className="pop-wrap" ref={ref}>
      <button className="icon-btn bell" aria-label="Upcoming releases" aria-expanded={open} onClick={() => setOpen(!open)}><Bell size={19} /><i className="dot" /></button>
      {open && (
        <div className="pop" role="dialog" aria-label="Upcoming releases">
          <p className="pop-title">Coming soon</p>
          {!items.length && <p className="muted small">Loading…</p>}
          {items.map((m) => <a key={m.id} className="menu-item" href={`#/title/movie/${m.id}`} onClick={() => setOpen(false)}><span>{m.title}</span><small className="muted">{m.year}</small></a>)}
        </div>
      )}
    </div>
  );
}

export default function Header({ route }) {
  const { username } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  return (
    <header className="header">
      <a href="#/" className="only-mobile" aria-label="Streamflix home"><Logo size={26} /></a>
      <SearchBox route={route} className="only-desktop" placeholder="Search for movies, shows, actors, directors…" />
      <div className="head-right">
        <a href="#/search" className="icon-btn only-mobile" aria-label="Search"><Search size={20} /></a>
        <span className="only-desktop"><Notifications /></span>
        <div className="pop-wrap" ref={ref}>
          <button className="profile-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)}>
            <Avatar name={username} size={32} />
            <span className="only-desktop">{username}</span>
            <ChevronDown size={15} className="only-desktop" />
          </button>
          {open && <div className="pop pop-right"><ProfilePanel onDone={() => setOpen(false)} /></div>}
        </div>
      </div>
    </header>
  );
}
