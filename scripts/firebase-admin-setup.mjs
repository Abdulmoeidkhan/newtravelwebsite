// Local operator tool. Uses the installed Firebase CLI's existing login; never logs tokens.
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
const require = createRequire(import.meta.url);
const cliRoot = process.env.FIREBASE_CLI_ROOT || join(process.env.APPDATA || '', 'npm/node_modules/firebase-tools');
const cliAuth = require(join(cliRoot, 'lib/auth.js'));
const project = 'rihla-a5ae9';
const account = cliAuth.getProjectDefaultAccount(process.cwd());
if (!account) throw new Error('Run firebase login first.');
const token = account.tokens.expires_at > Date.now() + 60000 ? account.tokens : await cliAuth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform']);
async function request(path, method = 'GET', body) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/${path}`, {
    method, headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json', 'X-Goog-User-Project': project },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`Firebase request failed (${response.status}): ${data.error?.message || 'Unknown error'}`);
  return data;
}
const command = process.argv[2];
const configPath = `admin/v2/projects/${project}/config`;
if (command === 'inspect') {
  const config = await request(configPath);
  console.log(JSON.stringify({ project, emailPassword: config.signIn?.email, clientPermissions: config.client?.permissions, subtype: config.subtype }));
} else if (command === 'lock-signup') {
  await request(`${configPath}?updateMask=client.permissions.disabledUserSignup,signIn.email.enabled,signIn.email.passwordRequired`, 'PATCH', {
    client: { permissions: { disabledUserSignup: true } }, signIn: { email: { enabled: true, passwordRequired: true } },
  });
  const config = await request(configPath);
  if (!config.client?.permissions?.disabledUserSignup || !config.signIn?.email?.enabled) throw new Error('Auth configuration verification failed.');
  console.log('Public signup disabled; email/password login enabled.');
} else if (command === 'bootstrap') {
  const email = 'admin@rihlatravelandtours.com';
  const lookup = await request(`v1/projects/${project}/accounts:lookup`, 'POST', { email: [email] });
  let user = lookup.users?.[0];
  if (!user) user = await request(`v1/projects/${project}/accounts`, 'POST', {
    email, password: randomBytes(36).toString('base64url'), displayName: 'Rihla Administrator', emailVerified: false,
  });
  const claims = JSON.parse(user.customAttributes || '{}');
  await request(`v1/projects/${project}/accounts:update`, 'POST', { localId: user.localId, customAttributes: JSON.stringify({ ...claims, admin: true }) });
  const verified = await request(`v1/projects/${project}/accounts:lookup`, 'POST', { localId: [user.localId] });
  if (JSON.parse(verified.users?.[0]?.customAttributes || '{}').admin !== true) throw new Error('Admin claim verification failed.');
  console.log(JSON.stringify({ email, uid: user.localId, admin: true, next: 'Use Forgot your password at /admin to set your password.' }));
} else throw new Error('Usage: node scripts/firebase-admin-setup.mjs inspect|lock-signup|bootstrap');
