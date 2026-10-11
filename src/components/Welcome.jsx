import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { useStore } from '../lib/store.jsx';

export default function Welcome() {
  const { setUsername } = useStore();
  const [val, setVal] = useState('');
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!setUsername(val)) setErr('Enter a name to continue.');
  };
  return (
    <div className="welcome">
      <form className="welcome-card" onSubmit={submit}>
        <svg className="welcome-logo" width="64" height="64" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 3.5v25L27 16z" fill="#FF003D" /></svg>
        <p className="welcome-brand">STREAM<b>FLIX</b></p>
        <h1>Welcome to Streamflix</h1>
        <p className="muted">Choose a name for your movie experience.</p>
        <label htmlFor="uname" className="sr-only">What should we call you?</label>
        <input id="uname" className="field" placeholder="Enter your name" value={val} maxLength={24} autoFocus autoComplete="nickname"
          onChange={(e) => { setVal(e.target.value); setErr(''); }} aria-describedby="uname-help" />
        {err && <p className="field-err" role="alert">{err}</p>}
        <button className="btn btn-red btn-block" type="submit">Continue <ArrowRight size={17} /></button>
        <p id="uname-help" className="muted small">What should we call you? Your name is saved in this browser only and doesn’t sync across devices.</p>
      </form>
    </div>
  );
}
