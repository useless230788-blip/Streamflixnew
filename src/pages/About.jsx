import { useState } from 'react';
import { ArrowLeft, ArrowRight, Atom, Code2, Copy, Check, GitBranch, Hexagon, Leaf, Lightbulb, MapPin, Send, Sparkles, Star, User, Bot } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import { Logo } from '../components/ui.jsx';
import { useAsync } from '../lib/hooks.js';
import { tmdb, img } from '../lib/api.js';

const TELEGRAM = 'https://t.me/EliteHub2706';

function Illustration() {
  return (
    <div className="creator-art">
      <svg viewBox="0 0 460 380" role="img" aria-label="Illustration of a hooded figure working on a laptop inside a red neon ring">
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="48%" r="55%"><stop offset="0" stopColor="#FF003D" stopOpacity=".38" /><stop offset=".6" stopColor="#7a0a1f" stopOpacity=".18" /><stop offset="1" stopColor="#FF003D" stopOpacity="0" /></radialGradient>
          <linearGradient id="cloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b0d14" /><stop offset="1" stopColor="#06090e" /></linearGradient>
          <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141b26" /><stop offset="1" stopColor="#0a0f17" /></linearGradient>
          <filter id="neon" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" /></filter>
          <filter id="soft"><feGaussianBlur stdDeviation="2" /></filter>
        </defs>
        <circle cx="230" cy="190" r="185" fill="url(#bgGlow)" />
        {/* neon ring */}
        <circle cx="230" cy="190" r="150" fill="none" stroke="#FF003D" strokeWidth="9" opacity=".75" filter="url(#neon)" />
        <circle cx="230" cy="190" r="150" fill="none" stroke="#FF2D55" strokeWidth="3" />
        <circle cx="230" cy="190" r="164" fill="none" stroke="#FF003D" strokeWidth="1" strokeDasharray="2 10" opacity=".5" />
        <path d="M82 190a148 148 0 0 1 40-100" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" />
        {/* shoulders / cloak */}
        <path d="M70 330c6-58 46-92 104-104l56 18 56-18c58 12 98 46 104 104z" fill="url(#cloak)" stroke="#FF003D" strokeOpacity=".35" />
        {/* hood */}
        <path d="M230 40c-52 0-86 38-88 88-1 30 9 52 24 70l64 22 64-22c15-18 25-40 24-70-2-50-36-88-88-88z" fill="url(#cloak)" stroke="#FF003D" strokeOpacity=".55" strokeWidth="1.5" />
        <path d="M230 70c-34 0-56 24-58 56-1 26 12 46 58 52 46-6 59-26 58-52-2-32-24-56-58-56z" fill="#020409" />
        <path d="M184 128q16-6 30 0M246 128q16-6 30 0" stroke="#FF003D" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".9" filter="url(#soft)" />
        <path d="M150 200c8 14 28 22 44 26M310 200c-8 14-28 22-44 26" stroke="#FF003D" strokeOpacity=".4" fill="none" />
        {/* laptop (back of lid faces viewer) */}
        <path d="M128 322l16-96c1-8 7-13 15-13h142c8 0 14 5 15 13l16 96z" fill="url(#lid)" stroke="#FF003D" strokeOpacity=".7" strokeWidth="1.5" />
        <rect x="205" y="246" width="50" height="50" rx="12" fill="#FF003D" opacity=".25" filter="url(#neon)" />
        <path d="M222 258v26l22-13z" fill="#FF003D" />
        <path d="M108 322h244l10 16H98z" fill="#0a0f17" stroke="#FF003D" strokeOpacity=".6" />
        {/* hands */}
        <ellipse cx="136" cy="318" rx="22" ry="9" fill="#12080e" stroke="#FF003D" strokeOpacity=".4" />
        <ellipse cx="324" cy="318" rx="22" ry="9" fill="#12080e" stroke="#FF003D" strokeOpacity=".4" />
        {/* sparks */}
        {[[96,120],[360,96],[388,210],[70,236],[330,40],[120,52]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r={i%2?1.6:2.4} fill="#FF3355" opacity=".8" />))}
      </svg>
    </div>
  );
}

export function ConnectCard({ id }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(TELEGRAM); }
    catch {
      const t = document.createElement('textarea'); t.value = TELEGRAM; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch {} t.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section className="connect" id={id} aria-labelledby="connect-h">
      <h2 id="connect-h" className="card-h">LET’S CONNECT</h2>
      <div className="connect-body">
        <span className="tg-icon" aria-hidden="true"><Send size={30} /></span>
        <div>
          <p>Follow my Telegram channel for updates, projects, and other things I’m working on.</p>
          <div className="connect-actions">
            <a className="btn btn-red btn-sm" href={TELEGRAM} target="_blank" rel="noopener noreferrer">Join My Telegram <ArrowRight size={15} /></a>
            <span className="link-text">{TELEGRAM}</span>
            <button className="icon-btn" onClick={copy} aria-label="Copy Telegram link">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
            <span className="small muted" role="status">{copied ? 'Link copied' : ''}</span>
          </div>
        </div>
      </div>
      <div className="connect-art" aria-hidden="true">
        <span>Let’s Connect</span>
        <svg viewBox="0 0 260 90"><path d="M0 80C60 70 90 20 150 40s70-20 110-38" fill="none" stroke="#FF003D" strokeWidth="1.6" /><path d="M20 88C90 74 130 48 170 62s60 8 90-10" fill="none" stroke="#FF003D" strokeOpacity=".5" strokeWidth="1" /></svg>
      </div>
    </section>
  );
}

const STEPS = [
  { n: '01', t: 'IMAGINE', d: 'Start with an idea and define the experience.', icon: Lightbulb },
  { n: '02', t: 'BUILD', d: 'Use AI-assisted coding and creative problem-solving.', icon: Code2 },
  { n: '03', t: 'REFINE', d: 'Improve the interface, test functionality, and polish the result.', icon: Sparkles },
];

const TOOLS = [
  { n: 'HTML', el: <span className="tool-mark" style={{ background: '#E34F26' }}>5</span> },
  { n: 'CSS', el: <span className="tool-mark" style={{ background: '#1572B6' }}>3</span> },
  { n: 'JavaScript', el: <span className="tool-mark" style={{ background: '#F7DF1E', color: '#111' }}>JS</span> },
  { n: 'React', el: <Atom size={28} color="#61DAFB" /> },
  { n: 'Node.js', el: <Hexagon size={28} color="#5FA04E" /> },
  { n: 'MongoDB', el: <Leaf size={28} color="#47A248" /> },
  { n: 'Git', el: <GitBranch size={28} color="#F05033" /> },
];

export default function About() {
  const { data } = useAsync((signal) => tmdb('trending', {}, { signal }), []);
  const posters = (data?.results || []).filter((r) => r.poster_path).slice(0, 6);
  return (
    <div className="about">
      <section className="about-hero">
        <div className="about-copy">
          <button className="back" onClick={() => (window.history.length > 1 ? window.history.back() : (window.location.hash = '/'))}><ArrowLeft size={16} /> Back</button>
          <p className="eyebrow">THE CREATOR BEHIND STREAMFLIX</p>
          <p className="hey">Hey, I’m</p>
          <h1 className="creator-name">Deepanshu <span>Yadav</span></h1>
          <p className="creator-role">Vibe Coder</p>
          <p className="muted intro">I turn ideas into digital experiences through creativity, experimentation, and AI-assisted coding.</p>
        </div>
        <Illustration />
        <aside className="info-card" aria-label="Developer information">
          <ul>
            <li><User size={20} /><div><small>Name</small><strong>Deepanshu Yadav</strong></div></li>
            <li><MapPin size={20} /><div><small>Location</small><strong>India</strong></div></li>
            <li><Code2 size={20} /><div><small>Role</small><strong>Vibe Coder</strong></div></li>
            <li><Star size={20} /><div><small>Main Interest</small><strong>Building modern web applications with AI-assisted coding and creative experimentation.</strong></div></li>
          </ul>
        </aside>
      </section>

      <div className="about-mid">
        <section aria-labelledby="wf">
          <h2 id="wf" className="bar-h">MY CREATIVE WORKFLOW</h2>
          <p className="muted small">I enjoy turning ideas into functional digital experiences by experimenting with AI coding tools, refining designs, and improving applications through iteration.</p>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.n}><span className="step-ico"><s.icon size={22} /></span><b><i>{s.n}.</i> {s.t}</b><span className="muted small">{s.d}</span></li>
            ))}
          </ol>
        </section>
        <section className="project" aria-label="Streamflix project">
          <div className="collage" aria-hidden="true">{posters.map((p) => <img key={p.id} src={img(p.poster_path, 'w185')} alt="" loading="lazy" />)}</div>
          <div className="project-body">
            <Logo size={34} />
            <p className="small">A cinematic movie discovery experience focused on modern design, movie exploration, and responsive interfaces.</p>
            <a className="btn btn-red btn-sm" href="#/">Back to Streamflix <ArrowRight size={15} /></a>
          </div>
        </section>
      </div>

      <section aria-labelledby="tools">
        <h2 id="tools" className="bar-h">TOOLS &amp; CREATIVE INTERESTS</h2>
        <ul className="tools">
          {TOOLS.map((t) => <li key={t.n}>{t.el}<span>{t.n}</span></li>)}
          <li className="tool-vibe"><Bot size={28} color="#FF003D" /><span>Vibe Coder</span></li>
        </ul>
      </section>

      <ConnectCard />
      <Footer />
    </div>
  );
}

export function Contact() {
  return (
    <div className="about">
      <section className="contact-head"><h1>Contact</h1><p className="muted">The quickest way to reach me and follow what I’m building is Telegram.</p></section>
      <ConnectCard />
      <Footer />
    </div>
  );
}
