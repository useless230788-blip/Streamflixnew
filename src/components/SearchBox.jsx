import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { navigate, useDebounced } from '../lib/hooks.js';

// Debounced search input synced with #/search?q=
export default function SearchBox({ route, placeholder, className = '', autoFocus = false, type }) {
  const urlQ = route.path === '/search' ? route.query.q || '' : '';
  const [val, setVal] = useState(urlQ);
  const debounced = useDebounced(val, 350);
  useEffect(() => { setVal(urlQ); }, [urlQ]);
  useEffect(() => {
    const t = debounced.trim();
    if (t === urlQ.trim()) return;
    if (t) navigate(`/search?q=${encodeURIComponent(t)}${type ? `&type=${type}` : ''}`, route.path === '/search');
    else if (route.path === '/search') navigate('/search', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);
  return (
    <label className={`searchbox ${className}`}>
      <Search size={17} aria-hidden="true" />
      <input type="search" value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder} aria-label="Search" autoFocus={autoFocus} maxLength={100}
        enterKeyHint="search" autoComplete="off" />
    </label>
  );
}
