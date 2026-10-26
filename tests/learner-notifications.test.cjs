const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(event, intake, enabled = true) {
  const sent = [], updates = [], reads = [];
  const db = { collection: name => ({ doc: id => {
    reads.push([name, id]);
    return name === 'learner_enrollment_outbox' ? {
      get: async () => ({ data: () => event }), update: async value => updates.push(value),
    } : { collection: () => ({ doc: () => ({ get: async () => ({ data: () => intake }) }) }) };
  } }) };
  class Resend {
    emails = { send: async (mail, options) => { sent.push({ mail, options }); return {}; } };
  }
  const api = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/learner-notifications.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, {
    exports: api, process: { env: { LEARNER_NOTIFICATIONS_ENABLED: String(enabled), RESEND_API_KEY: 'test', NOTIFY_EMAIL: 'staff@example.org' } },
    console, require: name => name === '@/lib/firebase-admin' ? { adminDb: db } : name === 'resend' ? { Resend } : require(name),
  });
  return { ...api, sent, updates, reads };
}
const base = { email: 'learner@example.org', courseTitle: 'Google Prompting Essentials Specialization', status: 'Pending' };
test('notification contains intake first and last names and the requested course, without demographics', async () => {
  const flow = load({ ...base, firstName: 'Example', lastName: 'Learner', householdIncome: '25-50k', employmentStatus: 'Employed' });
  await flow.notifyEnrollment('uid', 'google-prompting-essentials');
  assert.equal(flow.sent.length, 1);
  const text = flow.sent[0].mail.text;
  assert.match(text, /First name: Example\nLast name: Learner/);
  assert.ok(text.includes(base.courseTitle));
  assert.equal(text.includes('25-50k'), false);
  assert.equal(text.includes('Employed'), false);
  assert.equal(flow.updates[0].status, 'Sent');
  assert.equal(flow.reads.length, 1);
});
test('older pending notification uses matching saved intake names', async () => {
  const flow = load(base, { email: base.email, firstName: 'Existing', lastName: 'Learner' });
  await flow.notifyEnrollment('uid', 'course');
  assert.match(flow.sent[0].mail.text, /First name: Existing\nLast name: Learner/);
});
test('legacy email-key collisions cannot expose another learner name', async () => {
  const flow = load(base, { email: 'different@example.org', firstName: 'Wrong', lastName: 'Person' });
  await flow.notifyEnrollment('uid', 'course');
  assert.equal(flow.sent[0].mail.text.includes('Wrong'), false);
  assert.match(flow.sent[0].mail.text, /Not provided/);
});
test('sent notifications are not resent', async () => {
  const flow = load({ ...base, status: 'Sent' });
  await flow.notifyEnrollment('uid', 'course');
  assert.equal(flow.sent.length, 0);
});
test('delivery is disabled in previews without explicit notification flag', async () => {
  const flow = load(base, null, false);
  await flow.notifyEnrollment('uid', 'course');
  assert.equal(flow.sent.length, 0);
  assert.equal(flow.reads.length, 0);
});
