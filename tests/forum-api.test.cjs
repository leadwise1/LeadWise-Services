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
  adminAuth: { verifyIdToken: async token => {
    if (token === 'valid-token') return { uid: 'verified-learner' };
    if (['admin-token', 'unverified-token', 'wrong-provider-token'].includes(token)) return {
      uid: 'google-admin', email: 'lakhani@letsleadwise.org',
      email_verified: token !== 'unverified-token',
      firebase: { sign_in_provider: token === 'wrong-provider-token' ? 'password' : 'google.com' },
    };
    throw new Error('Invalid');
  } },
  admin: { firestore: { FieldValue: { serverTimestamp: () => stamp, increment: amount => ({ increment: amount }) } } },
};
function load(relative) {
  const exports = {};
  const javascript = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(javascript, { exports, require: name => name === '@/lib/firebase-admin' ? adminModule : name === '@/lib/community-admin' ? load('src/lib/community-admin.ts') : deps(name), console, Date, process: { env: { COMMUNITY_ADMIN_EMAIL: 'lakhani@letsleadwise.org' } } }, { filename: relative });
  return exports;
}
const feed = load('src/app/api/forum/posts/route.ts');
const detail = load('src/app/api/forum/posts/[id]/route.ts');
const access = load('src/app/api/forum/admin/route.ts');
const request = (body, token, method = 'POST') => new Request('http://localhost/api/forum/posts', { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...(method !== 'GET' ? { body: JSON.stringify(body) } : {}) });
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
});

test('management requires the approved verified Google account', async () => {
  assert.equal((await access.GET(request({}, undefined, 'GET'))).status, 401);
  for (const token of ['valid-token', 'unverified-token', 'wrong-provider-token']) {
    assert.equal((await access.GET(request({}, token, 'GET'))).status, 403);
    assert.equal((await detail.PATCH(request({}, token, 'PATCH'), { params: Promise.resolve({ id: 'new-1' }) })).status, 403);
    assert.equal((await detail.DELETE(request({}, token, 'DELETE'), { params: Promise.resolve({ id: 'new-1' }) })).status, 403);
  }
  assert.equal((await access.GET(request({}, 'invalid-token', 'GET'))).status, 401);
  assert.equal((await access.GET(request({}, 'admin-token', 'GET'))).status, 200);
});

test('editing preserves ownership, votes, and replies and rejects unexpected fields', async () => {
  const id = 'editable';
  const saved = { title: 'Original', content: 'Details', category: 'Announcements', author: 'Sam', authorId: 'learner', replies: 3, upvotes: 7, createdAt: stamp };
  records.set(`${postPath}/${id}`, saved);
  const context = { params: Promise.resolve({ id }) };
  const fields = { title: ' Revised ', content: ' Updated details ', category: 'Workshops' };
  assert.equal((await detail.PATCH(request(fields, undefined, 'PATCH'), context)).status, 401);
  for (const invalid of [{ ...fields, authorId: 'forged' }, { ...fields, title: ' ' }, { ...fields, category: 'Unknown' }, { ...fields, content: ' ' }]) {
    assert.equal((await detail.PATCH(request(invalid, 'admin-token', 'PATCH'), context)).status, 400);
    assert.equal(saved.title, 'Original');
  }
  assert.equal((await detail.PATCH(request(fields, 'admin-token', 'PATCH'), context)).status, 200);
  assert.equal(saved.title, 'Revised');
  assert.equal(saved.content, 'Updated details');
  assert.equal(saved.category, 'Workshops');
  assert.equal(saved.authorId, 'learner');
  assert.equal(saved.replies, 3);
  assert.equal(saved.upvotes, 7);
  assert.equal(saved.createdAt, stamp);
  assert.equal(saved.updatedAt, stamp);
});

test('removal hides posts without destroying their content or replies', async () => {
  const id = 'editable';
  const context = { params: Promise.resolve({ id }) };
  records.set(`${postPath}/${id}/comments/comment`, { content: 'Keep this reply', author: 'Sam', createdAt: stamp });
  assert.equal((await detail.DELETE(request({}, undefined, 'DELETE'), context)).status, 401);
  assert.equal((await detail.DELETE(request({}, 'admin-token', 'DELETE'), context)).status, 200);
  const saved = records.get(`${postPath}/${id}`);
  assert.equal(saved.deleted, true);
  assert.equal(saved.content, 'Updated details');
  assert.equal(records.get(`${postPath}/${id}/comments/comment`).content, 'Keep this reply');
  assert.equal((await detail.GET(request({}, undefined, 'GET'), context)).status, 404);
  const feedResult = await (await feed.GET()).json();
  assert.equal(feedResult.data.some(post => post.id === id), false);
  assert.equal((await detail.PATCH(request({ title: 'Restore', content: '', category: 'General Discussion' }, 'admin-token', 'PATCH'), context)).status, 404);
  assert.equal((await detail.DELETE(request({}, 'admin-token', 'DELETE'), context)).status, 404);
  const missing = { params: Promise.resolve({ id: 'missing' }) };
  assert.equal((await detail.DELETE(request({}, 'admin-token', 'DELETE'), missing)).status, 404);
});
