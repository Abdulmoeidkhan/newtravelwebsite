import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const [projectId, uid] = process.argv.slice(2);
if (!projectId || !uid) { console.error('Usage: npm run grant-admin -- PROJECT_ID FIREBASE_AUTH_UID'); process.exit(1); }
initializeApp({ credential: applicationDefault(), projectId });
const user = await getAuth().getUser(uid);
await getAuth().setCustomUserClaims(uid, { ...user.customClaims, admin: true });
console.log('Admin role granted. Sign out and sign in again to refresh your session.');
