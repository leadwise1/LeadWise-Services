const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const deps = createRequire(path.join(root, 'package.json'));
const ts = deps('typescript');
const records = new Map();
let nextId = 0;
const stamp = { toMillis: () => 1000, toDate: () => new Date(1000) };
const snapshot = (id, data) => ({ id, exists: Boolean(data), data: () => data });
function documentRef(key) {
  return { key, id: key.split('/').at(-1), collection: name => collectionRef(`${key}/${name}`), get: async () => snapshot(key.split('/').at(-1), records.get(key)) };
}
function collectionRef(key) {
  return {
    doc: id => documentRef(`${key}/${id || `new-${++nextId}`}`),
    orderBy() { return this; }, limit() { return this; },
    get: async () => ({ docs: [...records.entries()].filter(([k]) => k.startsWith(`${key}/`) && !k.slice(key.length + 1).includes('/')).map(([k, v]) => snapshot(k.split('/').at(-1), v)) }),
    add: async value => { const ref = documentRef(`${key}/new-${++nextId}`); records.set(ref.key, value); return ref; },
  };
}
const adminDb = {
  collection: collectionRef,
  runTransaction: async fn => fn({
    get: ref => ref.get(),
    set: (ref, value) => records.set(ref.key, value),
    update: (ref, value) => { const current = records.get(ref.key); for (const [key, entry] of Object.entries(value)) current[key] = entry.increment ? (current[key] || 0) + entry.increment : entry; },
  }),
};
const adminModule = {
  adminDb,
  adminAuth: { verifyIdToken: async token => { if (token !== 'valid-token') throw new Error('Invalid'); return { uid: 'verified-learner' }; } },
  admin: { firestore: { FieldValue: { serverTimestamp: () => stamp, increment: amount => ({ increment: amount }) } } },
};
function load(relative) {
  const exports = {};
  const javascript = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(javascript, { exports, require: name => name === '@/lib/firebase-admin' ? adminModule : deps(name), console, Date }, { filename: relative });
  return exports;
}
const feed = load('src/app/api/forum/posts/route.ts');
const detail = load('src/app/api/forum/posts/[id]/route.ts');
const request = (body, token) => new Request('http://localhost/api/forum/posts', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
const postPath = 'artifacts/leadwise-web/public/data/forumPosts';

test('posting requires a verified session and valid fields', async () => {
  assert.equal((await feed.POST(request({ title: 'Hello' }))).status, 401);
  assert.equal((await feed.POST(request({}, 'invalid-token'))).status, 401);
  assert.equal((await feed.POST(request({ title: 'Hello', category: 'Unknown', author: 'Sam' }, 'valid-token'))).status, 400);
  assert.equal((await feed.POST(request({ title: 'Workshop', category: 'Workshops', author: 'Sam' }, 'valid-token'))).status, 400);
  assert.equal(records.size, 0);
});

test('a public post persists its details and uses the verified author identity', async () => {
  const response = await feed.POST(request({ title: ' A small win ', content: ' I finished my first lesson. ', category: 'General Discussion', author: ' Sam ', authorId: 'forged-admin', isAdmin: true }, 'valid-token'));
  assert.equal(response.status, 200);
  const saved = [...records.values()][0];
  assert.equal(saved.title, 'A small win');
  assert.equal(saved.content, 'I finished my first lesson.');
  assert.equal(saved.authorId, 'verified-learner');
  assert.equal(saved.isAdmin, undefined);
  assert.equal(saved.upvotes, 0);
  const result = await (await feed.GET()).json();
  assert.equal(result.data[0].content, saved.content);
  assert.notEqual(result.data[0].timeAgo, 'Just now');
});

test('bulletin categories persist and replies update the discussion count', async () => {
  const response = await feed.POST(request({ title: 'Networking meetup', content: 'Details and a link.', category: 'Networking', author: 'Sam' }, 'valid-token'));
  const { data } = await response.json();
  const context = { params: Promise.resolve({ id: data.id }) };
  assert.equal((await detail.POST(request({ author: 'Taylor', content: 'Thank you!' }, 'valid-token'), context)).status, 200);
  const saved = records.get(`${postPath}/${data.id}`);
  assert.equal(saved.replies, 1);
  assert.equal(saved.category, 'Networking');
  const result = await (await detail.GET(new Request('http://localhost'), context)).json();
  assert.equal(result.comments.length, 1);
  assert.equal(result.comments[0].content, 'Thank you!');
  assert.equal(result.comments[0].authorId, 'verified-learner');
  assert.equal((await detail.POST(request({ action: 'upvote' }, 'valid-token'), context)).status, 200);
  assert.equal(saved.upvotes, 1);
});

test('missing discussions return 404 and unsigned replies cannot write', async () => {
  const context = { params: Promise.resolve({ id: 'missing' }) };
  assert.equal((await detail.GET(new Request('http://localhost'), context)).status, 404);
  assert.equal((await detail.POST(request({ author: 'Sam', content: 'Hello' }), context)).status, 401);
})
