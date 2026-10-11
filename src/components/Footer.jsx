import { Heart } from 'lucide-react';
import { Logo } from './ui.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <Logo size={20} />
      <p>Made with <Heart size={13} fill="#FF003D" strokeWidth={0} aria-label="love" /> by Deepanshu Yadav</p>
      <div className="tmdb">
        <span className="tmdb-mark" aria-label="TMDB">TMDB</span>
        <small>This product uses the TMDB API but is not endorsed or certified by TMDB.</small>
      </div>
    </footer>
  );
}
