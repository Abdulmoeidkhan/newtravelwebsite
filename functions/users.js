import { randomBytes } from 'node:crypto';
import { HttpsError } from 'firebase-functions/v2/https';

export async function createManagedUser(request, auth) {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  if (request.auth.token.admin !== true) throw new HttpsError('permission-denied', 'Only administrators can create users.');
  // Check the current role as well as the token so removed admins cannot keep creating users.
  const caller = await auth.getUser(request.auth.uid);
  if (caller.disabled || caller.customClaims?.admin !== true) throw new HttpsError('permission-denied', 'Administrator access required.');
  const data = request.data;
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key => !['email', 'displayName'].includes(key))) {
    throw new HttpsError('invalid-argument', 'Only name and email are accepted.');
  }
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const displayName = typeof data.displayName === 'string' ? data.displayName.trim() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || displayName.length < 2 || displayName.length > 100) {
    throw new HttpsError('invalid-argument', 'Enter a valid email and a name of 2–100 characters.');
  }
  try {
    const user = await auth.createUser({ email, displayName, password: randomBytes(36).toString('base64url'), emailVerified: false });
    // No custom claims are assigned. User creation never grants administrator privileges.
    return { uid: user.uid, email: user.email, displayName: user.displayName };
  } catch (error) {
    if (error.code === 'auth/email-already-exists') throw new HttpsError('already-exists', 'An account with this email already exists.');
    if (error.code === 'auth/invalid-email') throw new HttpsError('invalid-argument', 'Enter a valid email address.');
    throw new HttpsError('internal', 'Could not create the user. Please try again.');
  }
}
