import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard.jsx';
import { CardSkeletons, ErrorState } from './ui.jsx';
import { useAsync, useInView } from '../lib/hooks.js';
import { tmdb, normalize } from '../lib/api.js';

export default function MovieRow({ title, icon: Icon, op, params = {}, seeAll, rank, limit = 20, type = 'movie' }) {
  const [ref, seen] = useInView();
  const scroller = useRef(null);
  const { data, loading, error, retry } = useAsync(
    (signal) => (seen ? tmdb(op, params, { signal }) : Promise.resolve(null)),
    [seen, op, JSON.stringify(params)]
  );
  const items = (data?.results || []).map((r) => normalize(r, type)).filter((x) => x && x.poster).slice(0, rank ? 10 : limit);
  const scroll = (dir) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.85, behavior: 'smooth' });

  return (
    <section className="row" ref={ref} aria-label={title}>
      <div className="row-head">
        <h2>{Icon && <Icon size={20} className="accent" aria-hidden="true" />} {title}</h2>
        {seeAll && <a className="see-all" href={`#${seeAll}`}>See All</a>}
      </div>
      {error ? <ErrorState error={error} onRetry={retry} />
        : (!seen || loading) ? <CardSkeletons n={7} />
        : (
          <div className="row-wrap">
            <button className="row-arrow left" aria-label={`Scroll ${title} left`} onClick={() => scroll(-1)}><ChevronLeft size={20} /></button>
            <div className="row-scroll" ref={scroller}>
              {items.map((it, i) => <MovieCard key={it.type + it.id} item={it} rank={rank ? i + 1 : undefined} />)}
            </div>
            <button className="row-arrow right" aria-label={`Scroll ${title} right`} onClick={() => scroll(1)}><ChevronRight size={20} /></button>
          </div>
        )}
    </section>
  );
}
