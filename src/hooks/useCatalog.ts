import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { packages } from '../data/packages';
import { packageSchema } from '../lib/cms';
import type { Package } from '../types';
import { karachiDate, upcomingPackages } from '../lib/catalog';
export function useCatalog() {
  const [items, setItems] = useState<Package[]>(db ? [] : packages.map(item => ({ ...item, isDemo: true })));
  const [loading, setLoading] = useState(!!db);
  const [error, setError] = useState('');
  const [today, setToday] = useState(karachiDate);
  useEffect(() => {
    const refresh = () => setToday(karachiDate());
    const timer = window.setInterval(refresh, 60000);
    window.addEventListener('focus', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  useEffect(() => {
    if (!db) return;
    return onSnapshot(query(collection(db, 'packages'), where('published', '==', true)), snapshot => {
      const valid: Package[] = [];
      let invalid = false;
      snapshot.docs.forEach(doc => { const parsed = packageSchema.safeParse(doc.data()); if (parsed.success) valid.push({ ...parsed.data, id: doc.id } as Package); else invalid = true; });
      setItems(valid.sort((a, b) => (a.departureDate || '9999').localeCompare(b.departureDate || '9999') || a.name.localeCompare(b.name)));
      setError(invalid ? 'Some packages are temporarily unavailable. Please contact us for the full selection.' : ''); setLoading(false);
    }, () => { setItems([]); setLoading(false); setError('Packages could not be loaded. Please try again later or contact us for a quote.'); });
  }, []);
  return { items: upcomingPackages(items, today), loading, error, demo: !db };
}
