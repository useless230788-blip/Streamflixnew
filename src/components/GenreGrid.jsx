import { GENRES } from '../lib/genres.js';

export default function GenreGrid({ selected, variant = 'grid' }) {
  return (
    <nav className={`genres genres-${variant}`} aria-label="Genres">
      {GENRES.map(({ id, name, icon: Icon }) => (
        <a key={id} href={`#/genre/${id}`} className={`genre-card ${Number(selected) === id ? 'on' : ''}`} aria-current={Number(selected) === id ? 'page' : undefined}>
          <Icon size={variant === 'grid' ? 26 : 17} strokeWidth={1.6} aria-hidden="true" />
          <span>{name}</span>
        </a>
      ))}
    </nav>
  );
}
