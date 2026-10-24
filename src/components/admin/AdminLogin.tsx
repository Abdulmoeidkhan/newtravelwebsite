import { useState, type FormEvent } from 'react';
import { browserSessionPersistence, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { LockKeyhole } from 'lucide-react';
import { auth } from '../../lib/firebase';
import Brand from '../Brand';
export default function AdminLogin() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); if (!auth) return; setBusy(true); setMessage('');
    try { await setPersistence(auth, browserSessionPersistence); await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch { setMessage('Sign-in failed. Check your credentials and connection, then try again.'); }
    finally { setBusy(false); }
  }
  async function reset() {
    if (!auth || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessage('Enter your email address first.'); return; }
    setBusy(true);
    try { await sendPasswordResetEmail(auth, email.trim()); setMessage('If this email is registered, a password reset link will arrive shortly.'); }
    catch { setMessage('Could not request a reset. Check your connection and try again.'); }
    finally { setBusy(false); }
  }
  return <main className="admin-login"><div className="admin-login-card"><Brand/><div className="admin-lock"><LockKeyhole/></div><p className="eyebrow text-ocean-600">RIHLA MANAGEMENT</p><h1>Welcome back.</h1><p>Sign in to manage your packages and travel stories.</p><form className="admin-form" onSubmit={submit}><label>Email address<input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)}/></label><label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}/></label><button disabled={busy} className="button button-primary">{busy ? 'Please wait…' : 'Sign in securely'}</button></form><button className="text-link mt-5" disabled={busy} onClick={reset}>Forgot your password?</button>{message && <p className="admin-message" role="status">{message}</p>}<a href="/" className="admin-return">← Back to Rihla</a></div></main>;
}
