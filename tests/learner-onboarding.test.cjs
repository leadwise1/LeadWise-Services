const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const records = new Map();
let failTransaction = false;
function ref(key) {
  return { key, id: key.split('/').at(-1), parent: { parent: { id: key.split('/').at(-3) } },
    collection: name => collection(key + '/' + name),
    get: async () => ({ exists: records.has(key), data: () => records.get(key) }) };
}
function collection(key) {
  return { doc: id => ref(key + '/' + id), get: async () => ({ docs: [...records.entries()]
    .filter(([k]) => k.startsWith(key + '/') && !k.slice(key.length + 1).includes('/'))
    .map(([k, value]) => ({ id: k.split('/').at(-1), data: () => value })) }) };
}
const db = { collection, runTransaction: async fn => {
  const writes = [];
  const result = await fn({ get: item => item.get(), set: (item, value) => writes.push([item.key, value]) });
  if (failTransaction) throw new Error('injected failure');
  for (const [key, value] of writes) records.set(key, value);
  return result;
}};
const environment = { UNIFIED_ONBOARDING_ENABLED: 'true' };
const exportsObject = {};
const source = ts.transpileModule(fs.readFileSync('src/app/api/learner/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;
vm.runInNewContext(source, {
  exports: exportsObject, process: { env: environment },
  require: name => {
    if (name === '@/lib/course-catalog') return { COURSES: [{id:'google-ai-cert',title:'Google AI Professional Certificate'},{id:'data-analytics',title:'Google Data Analytics Professional Certificate'}] };
    if (name === 'next/server') return { NextResponse: { json: (data, options) => ({ data, ...options }) } };
    if (name === '@/lib/learner-notifications') return { notifyEnrollment: async () => {} };
    if (name === '@/lib/firebase-admin') return {
      admin: { firestore: { FieldValue: { serverTimestamp: () => ({ timestamp: true }) } } }, adminDb: db, adminAuth: { verifyIdToken: async (token, revoked) => {
        assert.equal(revoked, true);
        if (token === 'revoked') throw new Error();
        return { uid: token === 'other' ? 'other' : 'learner', email: 'a+b@example.org',
          email_verified: token !== 'unverified', firebase: { sign_in_provider: token === 'anonymous' ? 'anonymous' : 'google.com' } };
      } },
    };
    return require(name);
  },
});
const request = (body, token = 'valid') => ({ headers: { get: () => token ? 'Bearer ' + token : null }, json: async () => body });
const intake = { firstName: 'Example', lastName: 'Learner', email: 'a+b@example.org', zipCode: '75007',
 householdIncome: '25-50k', employmentStatus: 'Employed', consent: true,
 courseId: 'google-ai-cert', courseTitle: 'Google AI' };
const legacyPath = 'users/a_b_example_org/profile/intake';
beforeEach(() => { records.clear(); failTransaction = false; environment.UNIFIED_ONBOARDING_ENABLED = 'true'; });
test('flag off fails closed without writes', async () => {
 environment.UNIFIED_ONBOARDING_ENABLED = 'false';
 assert.equal((await exportsObject.POST(request(intake))).status, 404); assert.equal(records.size, 0);
});
test('reject missing, revoked, anonymous and unverified authentication', async () => {
 for (const token of [null, 'revoked', 'anonymous', 'unverified']) {
  const response = await exportsObject.POST(request(intake, token)); assert.ok([401, 403].includes(response.status));
 }
 assert.equal(records.size, 0);
});
test('requires explicit consent and signed-in email', async () => {
 assert.equal((await exportsObject.POST(request({ ...intake, consent: false }))).status, 400);
 assert.equal((await exportsObject.POST(request({ ...intake, email: 'victim@example.org' }))).status, 403);
 assert.equal(records.size, 0);
});
test('atomic intake grants membership and retries do not duplicate reporting or requests', async () => {
 assert.equal((await exportsObject.POST(request(intake))).status, 200);
 const original = JSON.stringify([...records]);
 assert.equal((await exportsObject.POST(request(intake))).data.alreadySubmitted, true);
 assert.equal(JSON.stringify([...records]), original);
 assert.equal(records.get('learner_accounts/learner').communityMember, true);
 assert.equal([...records.keys()].filter(k => k.startsWith('learner_intakes/')).length, 1);
 assert.equal([...records.keys()].filter(k => k.startsWith('learner_enrollment_outbox/')).length, 1);
});
test('link existing preserves approval, timestamps, demographics and legacy profile exactly', async () => {
 const old = { ...intake, status: 'Enrolled', enrolledAt: '2025-01-01', targetCourse: 'Prior title' };
 records.set(legacyPath, old); records.set('learner_intakes/old', { historical: true });
 assert.equal((await exportsObject.POST(request({ claimExisting: true }))).status, 200);
 assert.deepEqual(records.get(legacyPath), old);
 assert.equal(records.get('learner_accounts/learner/enrollments/google-ai-cert').status, 'Enrolled');
 assert.equal([...records.keys()].filter(k => k.startsWith('learner_intakes/')).length, 1);
});
test('collision in legacy email-derived ID never links another learner', async () => {
 records.set(legacyPath, { ...intake, email: 'a_b@example.org' });
 assert.equal((await exportsObject.POST(request(intake))).status, 409);
 assert.equal(records.size, 1);
});
test('transaction failure leaves no partial intake, membership or reporting record', async () => {
 failTransaction = true;
 assert.equal((await exportsObject.POST(request(intake))).status, 503);
 assert.equal(records.size, 0);
});
test('another account cannot silently take over an existing linked account record', async () => {
 records.set('learner_accounts/learner', { email: 'someoneelse@example.org' });
 assert.equal((await exportsObject.POST(request(intake))).status, 409);
});
test('new course preserves existing approved intake and separate enrollment', async () => {
 await exportsObject.POST(request(intake));
 const old = records.get(legacyPath);
 const second = await exportsObject.POST(request({ ...intake, courseId: 'data-analytics', courseTitle: 'Data Analytics' }));
 assert.equal(second.status, 200); assert.deepEqual(records.get(legacyPath), old);
 assert.ok(records.has('learner_accounts/learner/enrollments/data-analytics'));
 assert.equal([...records.keys()].filter(k => k.startsWith('learner_intakes/')).length, 1);
});
test('hub response exposes no email, income, ZIP, employment or reporting ID', async () => {
 await exportsObject.POST(request(intake));
 const response = await exportsObject.GET(request(null));
 assert.equal(response.status, 200); assert.equal(response.headers['Cache-Control'], 'private, no-store');
 for (const forbidden of ['email', 'householdIncome', 'zipCode', 'employmentStatus', 'studentId']) assert.equal(JSON.stringify(response.data).includes(forbidden), false);
});
test('malformed JSON returns validation response', async () => {
 const req = request(null); req.json = async () => { throw new Error(); };
 assert.equal((await exportsObject.POST(req)).status, 400);
});
