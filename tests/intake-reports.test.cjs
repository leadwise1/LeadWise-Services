const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const ts = require('typescript');
let denied = null;
const queries = [];
const anonymousData = { studentId: 'user_AbC123', zipCode: '75007', incomeBracket: '25-50k', employmentStatus: 'Employed', status: 'Pending', enrolledAt: { toDate: () => new Date('2026-10-01') }, firstName: 'MUST_NOT_LEAK', lastName: 'PRIVATE', email: 'private@example.org' };
const privateData = { ...anonymousData, participantId: 'private_example_org', enrolledAt: '2026-10-01T00:00:00Z' };
let anonymousRows = [anonymousData];
const doc = (value, id = 'intake') => ({ id, data: () => value, ref: { parent: { parent: { id: 'private_example_org' } } } });
const db = {
 collection: name => ({ get: async () => { queries.push(name); return { docs: anonymousRows.map(value => doc(value, 'opaque-document')) }; } }),
 collectionGroup: name => ({ get: async () => { queries.push(name); return { docs: [doc(privateData)] }; } }),
};
const moduleExports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/api/admin/intake-data/route.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
 exports: moduleExports,
 require: name => {
  if (name === 'next/server') return { NextResponse: { json: (data, options) => ({ status: 200, data, ...options }) } };
  if (name === '@/lib/firebase-admin') return { adminDb: db };
  if (name === '@/lib/community-admin') return { authorizeCommunityAdmin: async () => denied };
  return require(name);
 },
});
const req = report => ({ nextUrl: { searchParams: new URLSearchParams(report ? {report} : {}) } });
beforeEach(() => { denied = null; queries.length = 0; anonymousRows = [anonymousData]; });
test('unauthorized admin cannot query either dataset', async () => {
 denied = { status: 403 }; assert.equal((await moduleExports.GET(req('private'))).status,403); assert.equal(queries.length,0);
});
test('default anonymous report queries only reporting rows and excludes private fields at source', async () => {
 const result = await moduleExports.GET(req());
 assert.deepEqual(queries,['learner_intakes']);
 assert.equal(result.data.length,1); assert.equal(result.data[0].id,'user_AbC123');
 for (const field of ['firstName','lastName','email','participantId']) assert.equal(field in result.data[0],false);
 assert.equal(JSON.stringify(result).includes('MUST_NOT_LEAK'),false);
 assert.equal(JSON.stringify(result).includes('private@example.org'),false);
});
test('private ledger contains names and email and never combines LMI rows', async () => {
 const result=await moduleExports.GET(req('private'));
 assert.deepEqual(queries,['profile']); assert.equal(result.data.length,1); assert.equal(result.data[0].email,'private@example.org');
});
test('both timestamp and legacy ISO dates preserve the actual reporting month', async () => {
 assert.equal((await moduleExports.GET(req('lmi'))).data[0].enrolledAt,'2026-10-01T00:00:00.000Z');
 assert.equal((await moduleExports.GET(req('private'))).data[0].enrolledAt,'2026-10-01T00:00:00.000Z');
});
test('malformed timestamps do not invent current enrollment dates', async () => {
 anonymousRows=[{...anonymousData,enrolledAt:'not-a-date'}];
 assert.equal((await moduleExports.GET(req('lmi'))).data[0].enrolledAt,null);
});
test('unexpected historical IDs cannot reveal an email in the anonymous report', async () => {
 anonymousRows=[{...anonymousData,studentId:'private@example.org'}];
 assert.equal((await moduleExports.GET(req('lmi'))).data[0].id,'Learner-00001');
});
test('unknown report type rejected and private reports never cached', async () => {
 assert.equal((await moduleExports.GET(req('anything'))).status,400);
 assert.equal((await moduleExports.GET(req('private'))).headers['Cache-Control'],'private, no-store');
});
