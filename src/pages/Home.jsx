import { Flame, Trophy, Clapperboard, Star, CalendarClock, Tv, Swords, Rocket, Ghost, Gem } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import MovieRow from '../components/MovieRow.jsx';
import GenreGrid from '../components/GenreGrid.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="only-mobile"><GenreGrid variant="strip" /></div>
      <MovieRow title="Trending Now" icon={Flame} op="trending" seeAll="/trending" />
      <MovieRow title="Top 10 Movies This Week" icon={Trophy} op="trending" rank />
      <MovieRow title="Popular Movies" icon={Clapperboard} op="popularMovies" seeAll="/movies" />
      <MovieRow title="Top Rated" icon={Star} op="topRatedMovies" seeAll="/top-rated" />
      <MovieRow title="Upcoming Movies" icon={CalendarClock} op="upcomingMovies" />
      <MovieRow title="Popular TV Shows" icon={Tv} op="popularTV" type="tv" seeAll="/tv" />
      <MovieRow title="Action & Adventure" icon={Swords} op="actionAdventure" seeAll="/genre/28" />
      <MovieRow title="Sci-Fi Worlds" icon={Rocket} op="scifi" seeAll="/genre/878" />
      <MovieRow title="Horror Nights" icon={Ghost} op="horror" seeAll="/genre/27" />
      <MovieRow title="Hidden Gems" icon={Gem} op="hiddenGems" />
    </>
  );
}
