import { Zap, Compass, Smile, Frown, Ghost, Rocket, Heart, Shield, Wand2, Video } from 'lucide-react';

export const GENRES = [
  { id: 28, name: 'Action', icon: Zap },
  { id: 12, name: 'Adventure', icon: Compass },
  { id: 35, name: 'Comedy', icon: Smile },
  { id: 18, name: 'Drama', icon: Frown },
  { id: 27, name: 'Horror', icon: Ghost },
  { id: 878, name: 'Sci-Fi', icon: Rocket },
  { id: 10749, name: 'Romance', icon: Heart },
  { id: 53, name: 'Thriller', icon: Shield },
  { id: 16, name: 'Animation', icon: Wand2 },
  { id: 99, name: 'Documentary', icon: Video },
];
export const genreById = (id) => GENRES.find((g) => g.id === Number(id));
