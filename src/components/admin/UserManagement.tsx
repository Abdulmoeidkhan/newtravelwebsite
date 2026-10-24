import { useState, type FormEvent } from 'react';
import { httpsCallable } from 'firebase/functions';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, cloudFunctions } from '../../lib/firebase';

export default function UserManagement() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [createdEmail, setCreatedEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function create(event: FormEvent) {
    event.preventDefault();
    if (!cloudFunctions) return;
    setBusy(true); setMessage(''); setCreatedEmail('');
    try {
      const result = await httpsCallable<{ email: string; displayName: string }, { email: string }>(cloudFunctions, 'createUser')({ email: email.trim(), displayName: name.trim() });
      setCreatedEmail(result.data.email); setEmail(''); setName('');
      setMessage('User created. Send a password setup email so they can choose their password.');
    } catch (error) {
      const code = (error as { code?: string }).code;
      setMessage(code === 'functions/already-exists' ? 'This email already has an account. Use Forgot your password on the sign-in page if needed.'
        : code === 'functions/permission-denied' ? 'Only administrators can create users. Sign in again to refresh your access.'
        : code === 'functions/invalid-argument' ? 'Enter a valid email and a name of 2–100 characters.'
        : 'Could not create the user. Check your connection or contact the project owner.');
    } finally { setBusy(false); }
  }
  async function sendSetup() {
    if (!auth || !createdEmail) return;
    setBusy(true);
    try { await sendPasswordResetEmail(auth, createdEmail); setMessage(`Password setup email sent to ${createdEmail}.`); }
    catch { setMessage('The account was created, but the email could not be sent. Try again, or use Forgot your password on the sign-in page.'); }
    finally { setBusy(false); }
  }
  return <section className="admin-panel"><p className="eyebrow text-ocean-600">USER ACCOUNTS</p><h2>Create a user</h2><p>Only administrators can create accounts. New users cannot manage the website or create other users.</p>
    <form className="admin-form" onSubmit={create}><fieldset disabled={busy}><label>Full name<input required minLength={2} maxLength={100} autoComplete="name" value={name} onChange={event => setName(event.target.value)}/></label><label>Email address<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)}/></label><button className="button button-primary" type="submit">{busy ? 'Please wait…' : 'Create user'}</button></fieldset></form>
    {message && <p className="admin-message" role="status">{message}</p>}
    {createdEmail && <button className="button button-outline" disabled={busy} onClick={sendSetup}>Send password setup email</button>}
  </section>;
}
