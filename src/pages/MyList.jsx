import { useState } from 'react';
import TitleList from '../components/TitleList.jsx';
import MovieCard from '../components/MovieCard.jsx';
import { Empty, PageHead } from '../components/ui.jsx';
import { useStore } from '../lib/store.jsx';
import { genreById } from '../lib/genres.js';

export default function MyList() {
  const { watchlist, toggleList, recent, favGenres } = useStore();
  const [tab, setTab] = useState('movie');
  const items = watchlist.filter((x) => x.type === tab);
  const favs = Object.entries(favGenres).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id]) => genreById(id)).filter(Boolean);
  return (
    <div className="page">
      <PageHead title="My List" />
      <div className="seg wide" role="tablist" aria-label="List type">
        {[['movie', 'Movies'], ['tv', 'TV Shows']].map(([v, l]) => <button key={v} role="tab" aria-selected={tab === v} className={tab === v ? 'on' : ''} onClick={() => setTab(v)}>{l}</button>)}
      </div>
      {items.length === 0
        ? <Empty title={`No ${tab === 'movie' ? 'movies' : 'TV shows'} saved yet`} text="Tap My List on any title to save it here.">
            <a className="btn btn-red btn-sm" href="#/">Browse titles</a>
          </Empty>
        : <TitleList items={items} onRemove={toggleList} />}
      {favs.length > 0 && (
        <section className="row"><div className="row-head"><h2>Your favorite genres</h2></div>
          <div className="badges">{favs.map((g) => <a key={g.id} className="badge" href={`#/genre/${g.id}`}>{g.name}</a>)}</div></section>
      )}
      {recent.length > 0 && (
        <section className="row"><div className="row-head"><h2>Recently viewed</h2></div>
          <div className="row-scroll">{recent.slice(0, 12).map((it) => <MovieCard key={it.type + it.id} item={it} />)}</div></section>
      )}
    </div>
  );
}
