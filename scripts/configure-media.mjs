// Apply owner-supplied public media using the existing trusted Firebase CLI login.
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const cliRoot = process.env.FIREBASE_CLI_ROOT || join(process.env.APPDATA || '', 'npm/node_modules/firebase-tools');
const cliAuth = require(join(cliRoot, 'lib/auth.js'));
const account = cliAuth.getProjectDefaultAccount(process.cwd());
if (!account) throw new Error('Run firebase login first.');
const token = account.tokens.expires_at > Date.now() + 60000 ? account.tokens : await cliAuth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform']);
const url = 'https://firestore.googleapis.com/v1/projects/rihla-a5ae9/databases/(default)/documents/settings/public';
const headers = { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' };
const response = await fetch(url, { headers });
if (!response.ok && response.status !== 404) throw new Error(`Reading media failed: ${response.status}`);
const existing = response.ok ? await response.json() : null;
if (process.argv[2] === 'inspect') {
  console.log(JSON.stringify(existing?.fields || {}));
} else if (process.argv[2] === 'apply') {
  const media = JSON.parse(readFileSync(new URL('../src/data/media.json', import.meta.url), 'utf8'));
  const encode = value => typeof value === 'string' ? { stringValue: value } : Array.isArray(value) ? { arrayValue: { values: value.map(encode) } } : { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encode(item)])) } };
  // Preserve an existing Place ID. Never overwrite one with the initial empty value.
  const fields = { ...existing?.fields, ...encode(media).mapValue.fields, googlePlaceId: existing?.fields?.googlePlaceId || { stringValue: media.googlePlaceId }, updatedAt: { timestampValue: new Date().toISOString() } };
  const query = new URLSearchParams();
  for (const key of Object.keys(media).concat('updatedAt')) query.append('updateMask.fieldPaths', key);
  if (existing) query.set('currentDocument.updateTime', existing.updateTime);
  else query.set('currentDocument.exists', 'false');
  const saved = await fetch(`${url}?${query}`, { method: 'PATCH', headers, body: JSON.stringify({ fields }) });
  if (!saved.ok) throw new Error(`Saving media failed: ${saved.status}`);
  const verified = await fetch(url, { headers });
  if (!verified.ok) throw new Error('Unable to verify saved media.');
  const doc = await verified.json();
  const ids = doc.fields.shorts.arrayValue.values.map(item => item.mapValue.fields.videoId.stringValue);
  if (JSON.stringify(ids) !== JSON.stringify(media.shorts.map(item => item.videoId))) throw new Error('Saved video order does not match.');
  console.log(JSON.stringify({ saved: true, shorts: ids, channel: doc.fields.youtubeChannelUrl.stringValue, googlePlaceId: doc.fields.googlePlaceId.stringValue }));
} else throw new Error('Usage: node scripts/configure-media.mjs inspect|apply');
