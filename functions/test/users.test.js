import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createManagedUser } from '../users.js';
const request = { auth: { uid: 'admin', token: { admin: true } }, data: { email: ' Staff@example.com ', displayName: ' Staff User ' } };
function mockAuth(caller = { customClaims: { admin: true } }) {
  const calls = [];
  return { calls, getUser: async () => caller, createUser: async data => { calls.push(data); return { uid: 'new-user', ...data }; } };
}
test('anonymous and ordinary users cannot create accounts', async () => {
  const auth = mockAuth();
  await assert.rejects(createManagedUser({ data: request.data }, auth), { code: 'unauthenticated' });
  await assert.rejects(createManagedUser({ ...request, auth: { uid: 'user', token: {} } }, auth), { code: 'permission-denied' });
  assert.equal(auth.calls.length, 0);
});
test('disabled and demoted admins are rejected even with an old admin token', async () => {
  for (const caller of [{ disabled: true, customClaims: { admin: true } }, { customClaims: {} }]) {
    const auth = mockAuth(caller);
    await assert.rejects(createManagedUser(request, auth), { code: 'permission-denied' });
    assert.equal(auth.calls.length, 0);
  }
});
test('role injection and invalid account data are rejected before creation', async () => {
  const auth = mockAuth();
  for (const data of [{ ...request.data, admin: true }, { ...request.data, password: 'chosen' }, { email: 'bad', displayName: 'Staff' }, { email: 'a@b.com', displayName: ' ' }, null]) {
    await assert.rejects(createManagedUser({ ...request, data }, auth), { code: 'invalid-argument' });
  }
  assert.equal(auth.calls.length, 0);
});
test('admin creates an ordinary user without exposing the random password', async () => {
  const auth = mockAuth();
  assert.deepEqual(await createManagedUser(request, auth), { uid: 'new-user', email: 'staff@example.com', displayName: 'Staff User' });
  assert.equal(auth.calls[0].emailVerified, false);
  assert.ok(auth.calls[0].password.length >= 40);
  assert.equal(auth.calls[0].customClaims, undefined);
});
test('duplicate accounts return an actionable error', async () => {
  const auth = mockAuth(); auth.createUser = async () => { throw { code: 'auth/email-already-exists' }; };
  await assert.rejects(createManagedUser(request, auth), { code: 'already-exists' });
});
