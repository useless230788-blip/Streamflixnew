import { Home, Search, Compass, Plus, User } from 'lucide-react';

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, m: (p) => p === '/' },
  { to: '/search', label: 'Search', icon: Search, m: (p) => p === '/search' },
  { to: '/genres', label: 'Discover', icon: Compass, m: (p) => p === '/genres' || p.startsWith('/genre/') },
  { to: '/list', label: 'My List', icon: Plus, m: (p) => p === '/list' },
  { to: '/profile', label: 'Profile', icon: User, m: (p) => p === '/profile' },
];

export default function BottomNav({ route }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {ITEMS.map((n) => (
        <a key={n.to} href={`#${n.to}`} className={n.m(route.path) ? 'on' : ''} aria-current={n.m(route.path) ? 'page' : undefined}>
          <n.icon size={21} strokeWidth={1.7} aria-hidden="true" /><span>{n.label}</span>
        </a>
      ))}
    </nav>
  );
}
