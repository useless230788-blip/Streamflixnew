import { ChevronRight, X } from 'lucide-react';
import MovieCard from './MovieCard.jsx';
import { Poster, Rating } from './ui.jsx';
import { useIsMobile } from '../lib/hooks.js';

// Grid of cards on desktop, compact rows on mobile (matches reference).
export default function TitleList({ items, onRemove }) {
  const mobile = useIsMobile();
  if (!mobile) return <div className="grid">{items.map((it) => <MovieCard key={it.type + it.id} item={it} />)}</div>;
  return (
    <ul className="list-rows">
      {items.map((it) => (
        <li key={it.type + it.id}>
          <a href={`#/title/${it.type}/${it.id}`} className="list-row">
            <Poster path={it.poster} alt={it.title} size="w154" className="thumb" />
            <span className="list-info"><b>{it.title}</b><span className="card-sub">{it.year} <Rating value={it.rating} /></span></span>
            {!onRemove && <ChevronRight size={18} className="muted" aria-hidden="true" />}
          </a>
          {onRemove && <button className="icon-btn" aria-label={`Remove ${it.title} from My List`} onClick={() => onRemove(it)}><X size={16} /></button>}
        </li>
      ))}
    </ul>
  );
}
