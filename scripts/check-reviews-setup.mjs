// Read-only review setup audit. Uses the Firebase CLI login; never prints secrets.
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const cliRoot = process.env.FIREBASE_CLI_ROOT || join(process.env.APPDATA || '', 'npm/node_modules/firebase-tools');
const cliAuth = require(join(cliRoot, 'lib/auth.js'));
const account = cliAuth.getProjectDefaultAccount(process.cwd());
if (!account) throw new Error('Run firebase login first.');
const token = account.tokens.expires_at > Date.now() + 60000 ? account.tokens : await cliAuth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform']);
const project = 'rihla-a5ae9';
async function get(url, summarize) {
  try {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token.access_token}` }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) return { status: response.status, result: response.status === 404 ? 'not-found' : 'unable-to-verify' };
    return summarize(await response.json());
  } catch { return { result: 'unable-to-connect' }; }
}
let env = '';
try { env = readFileSync('.env.local', 'utf8'); } catch { /* Missing configuration is reported below. */ }
const appId = env.match(/^VITE_FIREBASE_APP_ID=(.*)$/m)?.[1]?.trim();
const report = Object.fromEntries(await Promise.all([
  ['billing', `https://cloudbilling.googleapis.com/v1/projects/${project}/billingInfo`, data => ({ enabled: data.billingEnabled === true })],
  ['placesApi', `https://serviceusage.googleapis.com/v1/projects/${project}/services/places.googleapis.com`, data => ({ state: data.state })],
  ['placesSecret', `https://secretmanager.googleapis.com/v1/projects/${project}/secrets/GOOGLE_PLACES_API_KEY/versions`, data => ({ enabledVersionExists: (data.versions || []).some(version => version.state === 'ENABLED') })],
  ['reviewsFunction', `https://cloudfunctions.googleapis.com/v2/projects/${project}/locations/asia-south1/functions/getGoogleReviews`, data => ({ state: data.state })],
  ['publicMedia', `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/settings/public`, data => ({ placeId: data.fields?.googlePlaceId?.stringValue || '', shortCount: data.fields?.shorts?.arrayValue?.values?.length || 0 })],
  ...(appId ? [['appCheck', `https://firebaseappcheck.googleapis.com/v1/projects/${project}/apps/${encodeURIComponent(appId)}/recaptchaEnterpriseConfig`, data => ({ configured: !!data.siteKey })]] : []),
].map(async ([name, url, summarize]) => [name, await get(url, summarize)])));
const siteKey = env.split(/\r?\n/).find(line => line.startsWith('VITE_RECAPTCHA_ENTERPRISE_SITE_KEY='))?.split('=').slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
report.localAppCheckSiteKey = { configured: !!siteKey };
console.log(JSON.stringify(report, null, 2));
