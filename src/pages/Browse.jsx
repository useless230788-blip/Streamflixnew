import { useEffect, useMemo, useState } from 'react';
import SearchBox from '../components/SearchBox.jsx';
import TitleList from '../components/TitleList.jsx';
import GenreGrid from '../components/GenreGrid.jsx';
import { CardSkeletons, Empty, ErrorState, PageHead } from '../components/ui.jsx';
import { useAsync, usePaged } from '../lib/hooks.js';
import { tmdb } from '../lib/api.js';
import { GENRES, genreById } from '../lib/genres.js';
import { useStore } from '../lib/store.jsx';

const YEARS = Array.from({ length: new Date().getFullYear() + 1 - 1969 }, (_, i) => new Date().getFullYear() + 1 - i);

function LoadMore({ st }) {
  return (
    <>
      {st.loading && st.page === 0 && <CardSkeletons n={10} wide />}
      {st.error && <ErrorState error={st.error} onRetry={st.page === 0 ? st.retry : st.retry} />}
      {st.hasMore && !st.error && (
        <div className="center"><button className="btn btn-dark" disabled={st.loading} onClick={st.loadMore}>{st.loading ? 'Loading…' : 'Load more'}</button></div>
      )}
    </>
  );
}

// Search + discover with filters. fixedType: 'movie' | 'tv' | undefined (shows toggle).
export function SearchPage({ route, fixedType, title }) {
  const q = (route.query.q || '').trim();
  const [type, setType] = useState(fixedType || (route.query.type === 'tv' ? 'tv' : 'movie'));
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('');
  useEffect(() => { if (fixedType) setType(fixedType); }, [fixedType]);
  useEffect(() => { setGenre(''); }, [type]);

  const genres = useAsync((signal) => tmdb('genres', { type }, { signal }), [type]);
  const searching = q.length > 0;
  const st = usePaged(searching ? 'search' : 'discover',
    searching ? { type, query: q, year } : { type, genre, year, minRating, sort: sort === 'vote_average.desc' ? sort : 'popularity.desc' });

  const shown = useMemo(() => {
    let a = st.items;
    if (searching) {
      if (genre) a = a.filter((x) => x.genreIds.includes(Number(genre)));
      if (minRating) a = a.filter((x) => x.rating >= Number(minRating));
      if (sort === 'popularity.desc') a = [...a].sort((x, y) => y.popularity - x.popularity);
      if (sort === 'vote_average.desc') a = [...a].filter((x) => x.votes >= 10).sort((x, y) => y.rating - x.rating);
    }
    return a;
  }, [st.items, searching, genre, minRating, sort]);

  const heading = searching ? `Results for “${q}”` : title || 'Search';
  return (
    <div className="page">
      <PageHead title={heading} />
      <SearchBox route={route} className="only-mobile big" placeholder="Search movies, shows, actors…" type={type} />
      <div className="filters" role="group" aria-label="Filters">
        {!fixedType && (
          <div className="seg" role="tablist" aria-label="Type">
            {[['movie', 'Movies'], ['tv', 'TV Shows']].map(([v, l]) => <button key={v} role="tab" aria-selected={type === v} className={type === v ? 'on' : ''} onClick={() => setType(v)}>{l}</button>)}
          </div>
        )}
        <select aria-label="Genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Genre</option>
          {(genres.data?.genres || []).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select aria-label="Release year" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select aria-label="Minimum rating" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
          <option value="">Rating</option>
          {[9, 8, 7, 6].map((r) => <option key={r} value={r}>{r}+ stars</option>)}
        </select>
        <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
          {searching && <option value="">Best match</option>}
          <option value={searching ? 'popularity.desc' : ''}>Popular</option>
          <option value="vote_average.desc">Top rated</option>
        </select>
      </div>
      {!st.loading && !st.error && shown.length === 0 && (
        <Empty title={searching ? `No results for “${q}”` : 'Nothing matches these filters'} text="Try a different spelling, or clear some filters." />
      )}
      {shown.length > 0 && <TitleList items={shown} />}
      <LoadMore st={st} />
    </div>
  );
}

export function GridPage({ title, op, params = {}, sub, strip, selected }) {
  const st = usePaged(op, params);
  return (
    <div className="page">
      <PageHead title={title} sub={sub} />
      {strip && <GenreGrid variant="strip" selected={selected} />}
      {!st.loading && !st.error && st.items.length === 0 && <Empty title="Nothing to show yet" text="Try again in a moment." />}
      {st.items.length > 0 && <TitleList items={st.items} />}
      <LoadMore st={st} />
    </div>
  );
}

export function GenrePage({ id }) {
  const g = genreById(id);
  const { bumpGenre } = useStore();
  const [sort, setSort] = useState('popularity.desc');
  useEffect(() => { if (g) bumpGenre(g.id); }, [id]); // eslint-disable-line
  if (!g) return <Empty title="Unknown genre" text="Pick one from the genre list."><a className="btn btn-red btn-sm" href="#/genres">Browse genres</a></Empty>;
  return (
    <div className="page">
      <PageHead title={g.name} sub="Movies" />
      <GenreGrid variant="strip" selected={g.id} />
      <div className="filters"><select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}><option value="popularity.desc">Popular</option><option value="vote_average.desc">Top rated</option></select></div>
      <GenreResults id={g.id} sort={sort} />
    </div>
  );
}
function GenreResults({ id, sort }) {
  const st = usePaged('discover', { type: 'movie', genre: id, sort });
  return (
    <>
      {st.items.length > 0 && <TitleList items={st.items} />}
      <LoadMore st={st} />
    </>
  );
}

export function GenresPage() {
  return (
    <div className="page">
      <PageHead title="Genres" sub="Pick a genre to explore." />
      <GenreGrid variant="grid" />
    </div>
  );
}
