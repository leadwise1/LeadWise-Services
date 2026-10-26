const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(currentUser = null, overrides = {}) {
  const calls = [];
  const member = { uid: 'member', isAnonymous: false };
  const credential = { providerId: 'google.com' };
  const auth = { currentUser, authStateReady: () => { calls.push('wait'); return Promise.resolve(); } };
  class GoogleAuthProvider {
    setCustomParameters(params) { assert.equal(params.prompt, 'select_account'); }
    static credentialFromError(error) { return error.credential || null; }
  }
  const sdk = {
    GoogleAuthProvider,
    signInWithPopup: () => { calls.push('popup'); return Promise.resolve({ user: member }); },
    linkWithPopup: () => { calls.push('link'); return Promise.resolve({ user: member }); },
    signInWithCredential: (_auth, value) => {
      calls.push('credential'); assert.equal(value, credential); return Promise.resolve({ user: member });
    },
    ...overrides,
  };
  const output = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/learner-auth.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, {
    exports: output, process: { env: {} }, Error,
    require: name => name === '@/lib/firebase' ? { auth } : sdk,
  });
  return { ...output, calls, member, credential };
}

test('new learner opens Google immediately without waiting away the user gesture', async () => {
  const flow = load();
  const result = flow.signInLearner();
  assert.deepEqual(flow.calls, ['popup']);
  assert.equal(await result, flow.member);
});
test('existing signed-in member needs no popup', async () => {
  const member = { uid: 'existing', isAnonymous: false };
  const flow = load(member);
  assert.equal(await flow.signInLearner(), member);
  assert.deepEqual(flow.calls, []);
});
test('guest account links immediately to preserve its UID', async () => {
  const flow = load({ uid: 'guest', isAnonymous: true });
  const result = flow.signInLearner();
  assert.deepEqual(flow.calls, ['link']);
  assert.equal(await result, flow.member);
});
test('existing Google account reuses credential instead of starting a second popup', async () => {
  let flow;
  flow = load({ uid: 'guest', isAnonymous: true }, {
    linkWithPopup: () => {
      flow.calls.push('link');
      return Promise.reject({ code: 'auth/credential-already-in-use', credential: flow.credential });
    },
  });
  assert.equal(await flow.signInLearner(), flow.member);
  assert.deepEqual(flow.calls, ['link', 'credential']);
});
test('blocked popup is not retried automatically and has actionable recovery', async () => {
  const error = { code: 'auth/popup-blocked' };
  const flow = load(null, { signInWithPopup: () => Promise.reject(error) });
  await assert.rejects(flow.signInLearner(), value => value === error);
  assert.match(flow.learnerSignInError(error), /Allow pop-ups for services\.letsleadwise\.org/);
  assert.match(flow.learnerSignInError(error), /in-app browser/);
});
test('cancelled sign-in never starts another popup', async () => {
  const error = { code: 'auth/popup-closed-by-user' };
  const flow = load({ uid: 'guest', isAnonymous: true }, { linkWithPopup: () => Promise.reject(error) });
  await assert.rejects(flow.signInLearner(), value => value === error);
  assert.deepEqual(flow.calls, []);
  assert.match(flow.learnerSignInError(error), /not completed/);
});
test('backend enrollment errors remain visible', () => {
  const flow = load();
  assert.equal(flow.learnerSignInError(new Error('Enrollment unavailable')), 'Enrollment unavailable');
});
