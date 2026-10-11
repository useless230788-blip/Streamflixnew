import { useState } from 'react';
import { Home, LayoutGrid, Tv, Flame, Star, Plus, ChevronUp, ChevronDown, User, Mail } from 'lucide-react';
import { Logo } from './ui.jsx';
import { GENRES } from '../lib/genres.js';

const MAIN = [
  { to: '/', label: 'Home', icon: Home, match: (p) => p === '/' },
  { to: '/movies', label: 'Movies', icon: LayoutGrid, match: (p) => p === '/movies' },
  { to: '/tv', label: 'TV Shows', icon: Tv, match: (p) => p === '/tv' },
  { to: '/trending', label: 'Trending', icon: Flame, match: (p) => p === '/trending' },
  { to: '/top-rated', label: 'Top Rated', icon: Star, match: (p) => p === '/top-rated' },
  { to: '/list', label: 'My List', icon: Plus, match: (p) => p === '/list' },
];

export default function Sidebar({ route }) {
  const [open, setOpen] = useState(true);
  const genreId = route.segs[0] === 'genre' ? Number(route.segs[1]) : null;
  const link = (n) => (
    <a key={n.to} href={`#${n.to}`} className={`nav-item ${n.match(route.path) ? 'on' : ''}`} aria-current={n.match(route.path) ? 'page' : undefined}>
      <n.icon size={18} strokeWidth={1.7} aria-hidden="true" /> {n.label}
    </a>
  );
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <a href="#/" className="side-logo" aria-label="Streamflix home"><Logo size={30} /></a>
      <nav className="side-scroll">
        {MAIN.map(link)}
        <button className="nav-label" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="side-genres">
          Genres {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {open && (
          <div id="side-genres">
            {GENRES.map(({ id, name, icon: Icon }) => (
              <a key={id} href={`#/genre/${id}`} className={`nav-item ${genreId === id ? 'on' : ''}`} aria-current={genreId === id ? 'page' : undefined}>
                <Icon size={18} strokeWidth={1.7} aria-hidden="true" /> {name}
              </a>
            ))}
          </div>
        )}
        <div className="nav-gap" />
        {link({ to: '/about', label: 'About Developer', icon: User, match: (p) => p === '/about' })}
        {link({ to: '/contact', label: 'Contact', icon: Mail, match: (p) => p === '/contact' })}
      </nav>
      <div className="side-foot"><Logo size={22} /><p>Your next favorite starts here.</p></div>
    </aside>
  );
}
