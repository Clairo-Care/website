// Handler-level tests for api/interest.js with a stub req/res and a stubbed globalThis.fetch.
//
// The point of most of them is negative: on 403, 429, 503 and 413 no request may leave the
// function, so every test asserts on the recorded fetch calls. Nothing here touches the network;
// globalThis.fetch is replaced for the whole handler, the Meta Conversions API path included.

import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';

import handler, { limiter, MAX_BODY_BYTES } from '../api/interest.js';

const SECRET = 'test-secret-value';
const ORIGIN = 'https://www.clairo.care';
const VALID = { first_name: 'Ada', last_name: 'Family', family_email: 'ada@example.invalid' };

const ENV_KEYS = [
  'VERCEL_ENV',
  'VERCEL_URL',
  'INTEREST_UPSTREAM',
  'INTEREST_PLATFORM_URL',
  'INTEREST_RELAY_SECRET',
  'META_CAPI_ACCESS_TOKEN',
  'META_CAPI_TEST_EVENT_CODE',
];

let calls = [];
let savedEnv = {};
let savedFetch;

function setEnv(env) {
  for (const key of ENV_KEYS) delete process.env[key];
  Object.assign(process.env, env);
}

test.beforeEach(() => {
  savedEnv = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  savedFetch = globalThis.fetch;
  calls = [];
  limiter.hits.clear();
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, text: async () => '{}', json: async () => ({ ok: true }) };
  };
  setEnv({ VERCEL_ENV: 'production', INTEREST_RELAY_SECRET: SECRET });
});

test.afterEach(() => {
  globalThis.fetch = savedFetch;
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

function makeRes() {
  const res = { statusCode: undefined, headers: {}, body: undefined };
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.body = body; return res; };
  return res;
}

/** A request whose body Vercel already parsed (the usual case). */
function makeReq(body, { method = 'POST', origin = ORIGIN, ip = '203.0.113.9', headers = {} } = {}) {
  const base = { 'x-forwarded-for': ip, 'user-agent': 'node-test', ...headers };
  if (origin) base.origin = origin;
  return { method, headers: base, body: body === undefined ? undefined : JSON.stringify(body) };
}

/** A request that has to be streamed, so readJson does the byte counting itself. */
function makeStreamReq(raw, { origin = ORIGIN, headers = {} } = {}) {
  const req = Readable.from([Buffer.from(raw)]);
  req.method = 'POST';
  req.headers = { 'x-forwarded-for': '203.0.113.9', ...(origin ? { origin } : {}), ...headers };
  return req;
}

async function call(req) {
  const res = makeRes();
  await handler(req, res);
  return res;
}

test('GET is 405 and never forwards', async () => {
  const res = await call(makeReq(undefined, { method: 'GET' }));
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, 'POST');
  assert.equal(calls.length, 0);
});

test('a foreign, missing or lookalike Origin is 403 and never forwards', async () => {
  for (const origin of [null, 'https://evil.example', 'https://www.clairo.care.evil.example', 'null']) {
    const res = await call(makeReq(VALID, { origin }));
    assert.equal(res.statusCode, 403, String(origin));
    assert.deepEqual(res.body, { ok: false, error: 'forbidden_origin' });
  }
  assert.equal(calls.length, 0);
});

test('403 comes before the body is even looked at', async () => {
  const req = makeStreamReq(JSON.stringify(VALID), { origin: 'https://evil.example' });
  const res = await call(req);
  assert.equal(res.statusCode, 403);
  assert.equal(req.readableEnded, false);
  assert.equal(calls.length, 0);
});

test('an oversized declared content-length is 413 and never forwards', async () => {
  const res = await call(makeReq(VALID, { headers: { 'content-length': String(MAX_BODY_BYTES + 1) } }));
  assert.equal(res.statusCode, 413);
  assert.deepEqual(res.body, { ok: false, error: 'payload_too_large' });
  assert.equal(calls.length, 0);
});

test('an oversized streamed body is 413 and never forwards', async () => {
  const raw = JSON.stringify({ ...VALID, services_needed_description: 'x'.repeat(MAX_BODY_BYTES) });
  assert.ok(raw.length > MAX_BODY_BYTES);
  const res = await call(makeStreamReq(raw));
  assert.equal(res.statusCode, 413);
  assert.equal(calls.length, 0);
});

test('a body just under the cap is accepted and forwarded', async () => {
  const filler = 'x'.repeat(MAX_BODY_BYTES - 200);
  const res = await call(makeStreamReq(JSON.stringify({ ...VALID, services_needed_description: filler })));
  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 1);
});

test('the honeypot answers 200, forwards nothing, and costs no rate budget', async () => {
  for (let i = 0; i < 20; i++) {
    const res = await call(makeReq({ ...VALID, website: 'http://spam.example' }));
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { ok: true });
  }
  assert.equal(calls.length, 0);
  assert.equal(limiter.hits.size, 0);
  // A real visitor on that IP still has the full budget.
  assert.equal((await call(makeReq(VALID))).statusCode, 200);
});

test('the sixth request from one IP inside the window is 429 and never forwards', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await call(makeReq(VALID))).statusCode, 200, `hit ${i}`);
  assert.equal(calls.length, 5);
  const res = await call(makeReq(VALID));
  assert.equal(res.statusCode, 429);
  assert.deepEqual(res.body, { ok: false, error: 'rate_limited' });
  assert.equal(res.headers['retry-after'], '600');
  assert.equal(calls.length, 5, 'nothing left the function on the 429');
  // A different visitor is unaffected.
  assert.equal((await call(makeReq(VALID, { ip: '198.51.100.4' }))).statusCode, 200);
});

test('an invalid body is 400 and never forwards', async () => {
  for (const body of [{}, { first_name: 'Ada' }, { ...VALID, family_email: 'nope' }, 'not json at all']) {
    const res = await call(makeReq(body));
    assert.equal(res.statusCode, 400, JSON.stringify(body));
    assert.equal(res.body.ok, false);
  }
  assert.equal(calls.length, 0);
});

test('a misconfigured relay is 503 and never forwards', async () => {
  const environments = [
    { VERCEL_ENV: 'production' }, // no relay secret
    { VERCEL_ENV: 'production', INTEREST_RELAY_SECRET: '  ' },
    { VERCEL_ENV: 'production', INTEREST_RELAY_SECRET: SECRET, INTEREST_UPSTREAM: 'base44' },
    { VERCEL_ENV: 'preview', INTEREST_RELAY_SECRET: SECRET }, // no explicit platform URL
    { INTEREST_PLATFORM_URL: 'http://localhost:9999' }, // no secret, vercel dev
  ];
  for (const env of environments) {
    setEnv(env);
    limiter.hits.clear();
    const res = await call(makeReq(VALID));
    assert.equal(res.statusCode, 503, JSON.stringify(env));
    assert.deepEqual(res.body, { ok: false, error: 'not_configured' });
  }
  assert.equal(calls.length, 0);
});

test('a preview with both vars set forwards to the named target', async () => {
  setEnv({ VERCEL_ENV: 'preview', INTEREST_PLATFORM_URL: 'http://localhost:9999', INTEREST_RELAY_SECRET: 'dev' });
  const res = await call(makeReq(VALID, { origin: 'https://clairo-preview.vercel.app', headers: {} }));
  // The preview origin is not allowlisted, so the request is refused before the target matters.
  assert.equal(res.statusCode, 403);
  process.env.VERCEL_URL = 'clairo-preview.vercel.app';
  const allowed = await call(makeReq(VALID, { origin: 'https://clairo-preview.vercel.app' }));
  assert.equal(allowed.statusCode, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'http://localhost:9999/v1/functions/submitInterestForm');
});

test('the happy path relays exactly once, with the secret and the visitor IP', async () => {
  const res = await call(makeReq({ ...VALID, family_phone: '(240) 621-1353', service_route: 'traditional' }));
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.equal(calls.length, 1);
  const [{ url, init }] = calls;
  assert.equal(url, 'https://api.clairo.care/v1/functions/submitInterestForm');
  assert.equal(init.method, 'POST');
  assert.equal(init.headers['x-clairo-relay-secret'], SECRET);
  assert.equal(init.headers['x-clairo-client-ip'], '203.0.113.9');
  const sent = JSON.parse(init.body);
  assert.equal(sent.family_email, 'ada@example.invalid');
  assert.equal(sent.lead_source, 'website');
  assert.equal(sent.service_route, 'traditional');
});

test('an upstream failure is 502 and the browser gets a sentence, not a code', async () => {
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return { ok: false, status: 500, text: async () => 'boom' };
  };
  const res = await call(makeReq(VALID));
  assert.equal(res.statusCode, 502);
  assert.match(res.body.error, /could not send/);
  assert.equal(calls.length, 1);
});

test('with consent and a token, Meta gets the second call and no form data', async () => {
  process.env.META_CAPI_ACCESS_TOKEN = 'test-token';
  const res = await call(makeReq({ ...VALID, meta: { consent: true, event_id: 'lead-abc12345' } }));
  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /^https:\/\/graph\.facebook\.com\//);
  const metaBody = calls[1].init.body;
  for (const secretish of ['ada@example.invalid', 'Ada', 'Family', SECRET]) {
    assert.equal(metaBody.includes(secretish), false, `${secretish} must not reach Meta`);
  }
});

test('without consent Meta is not called at all', async () => {
  process.env.META_CAPI_ACCESS_TOKEN = 'test-token';
  const res = await call(makeReq({ ...VALID, meta: { consent: false, event_id: 'lead-abc12345' } }));
  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 1);
});
