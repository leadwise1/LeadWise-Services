const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const deps = createRequire(path.join(root, "package.json"));
const ts = deps("typescript");
const records = new Map();
const base = "artifacts/leadwise-web/public/data/sessions";
function ref(key) {
  return {
    id: key.split("/").at(-1),
    collection: (name) => collection(`${key}/${name}`),
    get: async () => snapshot(key),
  };
}
function snapshot(key) {
  return {
    id: key.split("/").at(-1),
    ref: ref(key),
    exists: records.has(key),
    data: () => records.get(key),
  };
}
function collection(key) {
  return {
    doc: (id) => ref(`${key}/${id}`),
    limit() {
      return this;
    },
    get: async () => ({
      docs: [...records.keys()]
        .filter(
          (k) =>
            k.startsWith(`${key}/`) && !k.slice(key.length + 1).includes("/"),
        )
        .map(snapshot),
    }),
  };
}
const adminModule = {
  adminDb: {
    collection,
    runTransaction: async (fn) =>
      fn({
        get: (r) => r.get(),
        set: (r, value) => {
          const find = [...records.keys()].find(
            (k) => ref(k).id === r.id && k.includes("/participants/"),
          );
          records.set(find || `${base}/lab/participants/${r.id}`, value);
        },
      }),
  },
  adminAuth: {
    verifyIdToken: async (token) => {
      if (token !== "valid") throw Error("Invalid");
      return { uid: "learner" };
    },
  },
  admin: {
    firestore: {
      FieldValue: { serverTimestamp: () => ({ toMillis: () => Date.now() }) },
    },
  },
};
function load(file) {
  const exports = {};
  const js = ts.transpileModule(
    fs.readFileSync(path.join(root, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  vm.runInNewContext(
    js,
    {
      exports,
      require: (name) =>
        name === "@/lib/firebase-admin"
          ? adminModule
          : name === "@/lib/lab-session"
            ? helper
            : deps(name),
      console,
      Date,
      URL,
      URLSearchParams,
    },
    { filename: file },
  );
  return exports;
}
const helper = load("src/lib/lab-session.ts");
const feed = load("src/app/api/forum/sessions/route.ts");
const response = load("src/app/api/forum/sessions/[id]/route.ts");
const request = (body, token = "valid") =>
  new Request("http://localhost/api/forum/sessions/lab", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
const context = { params: Promise.resolve({ id: "lab" }) };

test("schedule gates joining at 15 minutes, handles default duration and missing time", () => {
  const start = Date.now() + 60_000;
  assert.equal(helper.labPhase(null, null, Date.now()), "unscheduled");
  assert.equal(helper.labPhase(start, null, start - 900_001), "upcoming");
  assert.equal(helper.labPhase(start, null, start - 900_000), "live");
  assert.equal(helper.labPhase(start, null, start + 5_400_000), "ended");
  assert.equal(helper.labPhase(0, 1, 1), "ended");
  assert.equal(helper.sessionMillis("garbage"), null);
});
test("calendar entry includes Meet and does not invent missing details", () => {
  assert.equal(
    helper.validMeetUrl("https://meet.google.com.evil.test/abc-defg-hij"),
    null,
  );
  assert.equal(helper.validMeetUrl("javascript:alert(1)"), null);
  assert.equal(helper.calendarUrl({ startsAt: null, meetUrl: null }), null);
  const url = helper.calendarUrl({
    topic: "Firewall Lab",
    desc: "Practice",
    startsAt: Date.UTC(2026, 11, 5, 20),
    endsAt: null,
    meetUrl: "https://meet.google.com/abc-defg-hij",
  });
  const params = new URL(url).searchParams;
  assert.match(params.get("details"), /meet.google.com\/abc-defg-hij/);
  assert.equal(params.get("dates"), "20261205T200000Z/20261205T213000Z");
});
test("RSVP requires auth and repeats only count once", async () => {
  records.clear();
  records.set(`${base}/lab`, { topic: "Lab", eventDate: "2026-12-05" });
  assert.equal(
    (await response.POST(request({ action: "rsvp" }, null), context)).status,
    401,
  );
  assert.equal(
    (await response.POST(request({ action: "rsvp" }, "invalid"), context))
      .status,
    401,
  );
  assert.equal(
    (
      await response.POST(
        request({ action: "rsvp", displayName: "Sam", uid: "forged" }, "valid"),
        context,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await response.POST(
        request({ action: "rsvp", displayName: "Sam" }, "valid"),
        context,
      )
    ).status,
    200,
  );
  const result = await (
    await feed.GET(
      new Request("http://localhost/api/forum/sessions", {
        headers: { Authorization: "Bearer valid" },
      }),
    )
  ).json();
  assert.equal(result.sessions[0].attendeeCount, 1);
  assert.equal(result.sessions[0].rsvped, true);
  assert.equal(result.sessions[0].attendees[0], "Sam");
  assert.equal(records.has(`${base}/lab/participants/forged`), false);
});
test("closed checkpoints cannot write; live check-ins replace previous color", async () => {
  assert.equal(
    (
      await response.POST(
        request({ action: "checkpoint", checkpoint: "red" }),
        context,
      )
    ).status,
    409,
  );
  records.set(`${base}/lab`, { topic: "Lab", startsAt: Date.now() - 60_000 });
  assert.equal(
    (
      await response.POST(
        request({ action: "checkpoint", checkpoint: "green" }),
        context,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await response.POST(
        request({ action: "checkpoint", checkpoint: "yellow" }),
        context,
      )
    ).status,
    200,
  );
  const result = await (
    await feed.GET(new Request("http://localhost/api/forum/sessions"))
  ).json();
  assert.equal(result.sessions[0].counts.green, 0);
  assert.equal(result.sessions[0].counts.yellow, 1);
  assert.equal(result.sessions[0].attendeeCount, 1);
});
test("invalid colors and missing sessions are rejected", async () => {
  assert.equal(
    (
      await response.POST(
        request({ action: "checkpoint", checkpoint: "blue" }),
        context,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await response.POST(request({ action: "rsvp" }), {
        params: Promise.resolve({ id: "missing" }),
      })
    ).status,
    404,
  );
});
