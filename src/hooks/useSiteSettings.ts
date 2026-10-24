import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { settingsSchema } from '../lib/cms';
import type { SiteSettings } from '../types';
import initialMedia from '../data/media.json';
export const defaultSettings: SiteSettings = settingsSchema.parse(initialMedia);
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  useEffect(() => {
    if (!db) return;
    return onSnapshot(doc(db, 'settings', 'public'), snapshot => { const parsed = settingsSchema.safeParse(snapshot.data()); setSettings(parsed.success ? parsed.data : defaultSettings); }, () => setSettings(defaultSettings));
  }, []);
  return settings;
}
