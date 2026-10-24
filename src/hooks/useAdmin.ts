import { useEffect, useState } from 'react';
import { onIdTokenChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';
export function useAdmin() {
  const [session, setSession] = useState<{ user: User | null; admin: boolean; loading: boolean; error: string }>({ user: null, admin: false, loading: !!auth, error: '' });
  useEffect(() => {
    if (!auth) return;
    let generation = 0;
    const stop = onIdTokenChanged(auth, async user => {
      const current = ++generation;
      setSession({ user, admin: false, loading: !!user, error: '' });
      if (!user) return;
      try { const token = await user.getIdTokenResult(); if (current === generation) setSession({ user, admin: token.claims.admin === true, loading: false, error: '' }); }
      catch { if (current === generation) setSession({ user, admin: false, loading: false, error: 'Unable to verify your administrator access. Please sign in again.' }); }
    });
    return () => { generation++; stop(); };
  }, []);
  return session;
}
