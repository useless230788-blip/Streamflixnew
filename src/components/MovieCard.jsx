import { Poster, Rating } from './ui.jsx';

export default function MovieCard({ item, rank }) {
  return (
    <a className={`card ${rank ? 'card-rank' : ''}`} href={`#/title/${item.type}/${item.id}`} aria-label={`${item.title}${item.year ? `, ${item.year}` : ''}`}>
      <div className="poster-wrap">
        <Poster path={item.poster} alt={item.title} />
        {rank && <span className="rank" aria-hidden="true">{rank}</span>}
        <span className="card-hover"><span>{item.overview ? item.overview.slice(0, 90) + (item.overview.length > 90 ? '…' : '') : 'View details'}</span></span>
      </div>
      {!rank && (
        <div className="card-meta">
          <p className="card-title">{item.title}</p>
          <p className="card-sub">{item.year}{item.year && item.rating ? '  ' : ''}<Rating value={item.rating} /></p>
        </div>
      )}
    </a>
  );
}
