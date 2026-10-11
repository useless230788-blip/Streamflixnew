import { useState } from 'react';
import { Check, LogOut, Pencil } from 'lucide-react';
import { Avatar } from './ui.jsx';
import { useStore } from '../lib/store.jsx';

export default function ProfilePanel({ onDone }) {
  const { username, setUsername, resetProfile, prefs, setPref, watchlist } = useStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(username);
  const save = (e) => { e.preventDefault(); if (setUsername(val)) setEditing(false); };
  return (
    <div className="profile-panel">
      <div className="profile-id">
        <Avatar name={username} size={48} />
        <div>
          {editing ? (
            <form onSubmit={save} className="inline-form">
              <input value={val} onChange={(e) => setVal(e.target.value)} maxLength={24} aria-label="Your name" autoFocus />
              <button className="icon-btn" aria-label="Save name"><Check size={16} /></button>
            </form>
          ) : (<><b>{username}</b><p className="muted small">{watchlist.length} in My List</p></>)}
        </div>
        {!editing && <button className="icon-btn" aria-label="Edit name" onClick={() => { setVal(username); setEditing(true); }}><Pencil size={15} /></button>}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={prefs.heroAutoplay} onChange={(e) => setPref('heroAutoplay', e.target.checked)} />
        <span>Auto-rotate featured titles</span>
      </label>
      <button className="menu-item danger" onClick={() => { if (window.confirm('Reset your profile? This clears your name, My List and history in this browser.')) { resetProfile(); onDone?.(); } }}>
        <LogOut size={16} /> Reset profile
      </button>
      <p className="muted small">Your profile is saved in this browser only and does not sync across devices.</p>
    </div>
  );
}
