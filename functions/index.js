import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { createManagedUser } from './users.js';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { normalizePlace } from './reviews.js';
initializeApp();
const placesKey = defineSecret('GOOGLE_PLACES_API_KEY');

export const createUser = onCall({
  region: 'asia-south1', maxInstances: 3, timeoutSeconds: 20, memory: '256MiB',
}, request => createManagedUser(request, getAuth()));

// Only the configured business can be requested; callers cannot proxy arbitrary Places queries.
export const getGoogleReviews = onCall({
  region: 'asia-south1', secrets: [placesKey], enforceAppCheck: true,
  maxInstances: 3, timeoutSeconds: 20, memory: '256MiB',
}, async () => {
  const snapshot = await getFirestore().doc('settings/public').get();
  const placeId = snapshot.data()?.googlePlaceId;
  if (typeof placeId !== 'string' || !/^[A-Za-z0-9_-]{1,300}$/.test(placeId)) throw new HttpsError('failed-precondition', 'The business listing has not been configured.');
  let response;
  try {
    response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { 'X-Goog-Api-Key': placesKey.value(), 'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri,reviews,attributions' },
      signal: AbortSignal.timeout(10000),
    });
  } catch { throw new HttpsError('unavailable', 'Google reviews are temporarily unavailable.'); }
  if (!response.ok) throw new HttpsError('unavailable', 'Google reviews are temporarily unavailable.');
  // Do not persist Google review content to Firestore or local storage.
  return normalizePlace(await response.json());
});
