import { useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Welcome from './components/Welcome.jsx';
import Home from './pages/Home.jsx';
import { SearchPage, GridPage, GenrePage, GenresPage } from './pages/Browse.jsx';
import MyList from './pages/MyList.jsx';
import Details from './pages/Details.jsx';
import About, { Contact } from './pages/About.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { Empty } from './components/ui.jsx';
import { useRoute } from './lib/hooks.js';
import { useStore } from './lib/store.jsx';

function Page({ route }) {
  const [a, b, c] = route.segs;
  switch (a) {
    case undefined: return <Home />;
    case 'movies': return <SearchPage route={route} fixedType="movie" title="Movies" />;
    case 'tv': return <SearchPage route={route} fixedType="tv" title="TV Shows" />;
    case 'search': return <SearchPage route={route} />;
    case 'trending': return <GridPage title="Trending" sub="This week’s most-watched movies" op="trending" />;
    case 'top-rated': return <GridPage title="Top Rated" op="topRatedMovies" />;
    case 'genres': return <GenresPage />;
    case 'genre': return <GenrePage id={b} />;
    case 'list': return <MyList />;
    case 'title': return <Details type={b} id={c} />;
    case 'about': return <About />;
    case 'contact': return <Contact />;
    case 'profile': return <ProfilePage />;
    default: return <Empty title="Page not found" text="That page doesn’t exist."><a className="btn btn-red btn-sm" href="#/">Go home</a></Empty>;
  }
}

export default function App() {
  const { username } = useStore();
  const route = useRoute();
  const main = useRef(null);
  useEffect(() => { main.current?.scrollTo(0, 0); }, [route.path]);
  if (!username) return <Welcome />;
  return (
    <div className="app">
      <a className="skip" href="#main-content" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>Skip to content</a>
      <Sidebar route={route} />
      <div className="shell">
        <Header route={route} />
        <main className="main" id="main-content" ref={main} tabIndex={-1}><Page route={route} /></main>
      </div>
      <BottomNav route={route} />
    </div>
  );
}
