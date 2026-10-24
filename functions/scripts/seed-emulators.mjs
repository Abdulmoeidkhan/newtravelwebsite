import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
initializeApp({ projectId: 'demo-rihla' });
const auth = getAuth();
for (const [uid, email, admin] of [['qa-admin', 'admin@example.test', true], ['qa-user', 'user@example.test', false]]) {
  try { await auth.getUser(uid); } catch { await auth.createUser({ uid, email, password: 'Local-test-only-123!' }); }
  await auth.setCustomUserClaims(uid, { admin });
}
const db = getFirestore();
const existing = await db.collection('packages').get();
const clear = db.batch(); existing.docs.forEach(doc => clear.delete(doc.ref)); await clear.commit();
const fixtures = [
  ['platinum', 'The Platinum Experience', 'Platinum 5 Star', 'Private', 2280, ['2026-11','2026-12','2027-01']],
  ['gold', 'The Golden Journey', 'Gold 5 Star', 'Group', 1680, ['2026-11','2026-12','2027-02']],
  ['silver', 'The Essential Umrah', 'Silver 4 Star', 'Family', 1280, ['2026-12','2027-01','2027-03']],
  ['family', 'Together in Faith', 'Special Programs', 'Family', 2490, ['2027-01','2027-02','2027-03']],
];
for (const [id, name, tier, type, price, months] of fixtures) await db.doc(`packages/${id}`).set({ name, tier, type, price, months, stars: tier === 'Silver 4 Star' ? 4 : 5, nights: 7, makkahNights: 4, madinahNights: 3, currency: 'USD', image: '/makkah.jpg', imageAlt: 'Kaaba in Makkah', badge: 'LOCAL TEST FIXTURE', description: 'A local emulator test itinerary with accommodation and transfers.', includes: ['Accommodation', 'Transfers'], published: true, isDemo: true, departureDate: '', returnDate: '', makkahHotel: '', madinahHotel: '', createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
await db.doc('settings/public').set({ googlePlaceId: '', youtubeChannelUrl: '', shorts: [{ id: 'test-short', title: 'Local test journey', videoId: 'abcdefghijk' }], updatedAt: FieldValue.serverTimestamp() });
console.log('Seeded isolated demo-rihla emulators with test users, packages, and a media fixture.');
