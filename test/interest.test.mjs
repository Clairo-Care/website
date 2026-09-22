// node --test test/  (node:test + node:assert, no dependencies)
//
// Unit tests for the pure pieces of api/interest.js: resolveConfig, checkOrigin, RateLimiter and
// buildUpstreamRequest. No HTTP server and no network. Every secret here is a literal test string;
// nothing is read from the real environment.

import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveConfig, checkOrigin, RateLimiter, buildUpstreamRequest } from '../api/interest.js';

const SECRET = 'test-secret-value';
const PROD = { VERCEL_ENV: 'production', INTEREST_RELAY_SECRET: SECRET };
const data = { first_name: 'Relay', last_name: 'Test', family_email: 'relay@example.invalid' };

/* ---------- resolveConfig ---------- */

test('production, no INTEREST_UPSTREAM: platform at the default URL', () => {
  const config = resolveConfig(PROD);
  assert.equal(config.error, undefined);
  assert.equal(config.upstream, 'platform');
  assert.equal(config.url, 'https://api.clairo.care/v1/functions/submitInterestForm');
  assert.equal(config.secret, SECRET);
});

test('INTEREST_UPSTREAM is trimmed and lower-cased', () => {
  assert.equal(resolveConfig({ ...PROD, INTEREST_UPSTREAM: '  Platform ' }).error, undefined);
});

test('the retired modes and any junk value fail closed', () => {
  for (const value of ['base44', 'base44-webhook', 'webhook', 'Base44', 'nonsense']) {
    const config = resolveConfig({ ...PROD, INTEREST_UPSTREAM: value });
    assert.match(config.error, /unsupported INTEREST_UPSTREAM/);
    assert.equal(config.url, undefined);
  }
});

test('a missing, empty or whitespace INTEREST_RELAY_SECRET fails closed', () => {
  for (const env of [{}, { INTEREST_RELAY_SECRET: '' }, { INTEREST_RELAY_SECRET: '   ' }, { INTEREST_RELAY_SECRET: 7 }]) {
    const config = resolveConfig({ VERCEL_ENV: 'production', ...env });
    assert.match(config.error, /INTEREST_RELAY_SECRET/);
    assert.equal(config.url, undefined);
  }
});

test('outside production nothing is forwarded without an explicit INTEREST_PLATFORM_URL', () => {
  for (const env of [{ INTEREST_RELAY_SECRET: SECRET }, { VERCEL_ENV: 'preview', INTEREST_RELAY_SECRET: SECRET }]) {
    const config = resolveConfig(env);
    assert.match(config.error, /INTEREST_PLATFORM_URL/);
    assert.equal(config.url, undefined);
  }
});

test('outside production both vars set: forwards to the named target', () => {
  const config = resolveConfig({
    VERCEL_ENV: 'development',
    INTEREST_PLATFORM_URL: 'http://localhost:9999/',
    INTEREST_RELAY_SECRET: 'dev-secret',
  });
  assert.equal(config.error, undefined);
  assert.equal(config.url, 'http://localhost:9999/v1/functions/submitInterestForm');
});

test('the relay secret is trimmed, so a pasted newline is not sent verbatim', () => {
  const config = resolveConfig({ VERCEL_ENV: 'production', INTEREST_RELAY_SECRET: `  ${SECRET}\n` });
  assert.equal(config.secret, SECRET);
  const up = buildUpstreamRequest(data, config, {});
  assert.equal(up.headers['x-clairo-relay-secret'], SECRET);
});

test('a trailing slash on INTEREST_PLATFORM_URL is trimmed', () => {
  const config = resolveConfig({ ...PROD, INTEREST_PLATFORM_URL: 'https://api.example.invalid///' });
  assert.equal(config.url, 'https://api.example.invalid/v1/functions/submitInterestForm');
});

/* ---------- buildUpstreamRequest ---------- */

test('the relay secret is always sent, the client IP when there is one', () => {
  const config = resolveConfig(PROD);
  const withIp = buildUpstreamRequest(data, config, { clientIp: '203.0.113.9' });
  assert.deepEqual(withIp.headers, {
    'content-type': 'application/json',
    'x-clairo-relay-secret': SECRET,
    'x-clairo-client-ip': '203.0.113.9',
  });
  for (const options of [{}, { clientIp: undefined }, undefined]) {
    const up = buildUpstreamRequest(data, config, options);
    assert.deepEqual(up.headers, { 'content-type': 'application/json', 'x-clairo-relay-secret': SECRET });
  }
});

test('the body is the canonical payload plus lead_source, and the IP is not in it', () => {
  const up = buildUpstreamRequest(data, resolveConfig(PROD), { clientIp: '203.0.113.9' });
  assert.deepEqual(up.body, { ...data, lead_source: 'website' });
  assert.equal(JSON.stringify(up.body).includes('203.0.113.9'), false);
});

/* ---------- checkOrigin ---------- */

test('the two site origins are allowed in production', () => {
  for (const origin of ['https://www.clairo.care', 'https://clairo.care']) {
    assert.deepEqual(checkOrigin({ origin }, PROD), { ok: true, origin });
  }
});

test('an Origin with a path still resolves to the bare origin', () => {
  assert.equal(checkOrigin({ origin: 'https://www.clairo.care/contact' }, PROD).ok, true);
});

test('a missing, empty or "null" Origin with no Referer is rejected', () => {
  for (const headers of [{}, { origin: '' }, { origin: 'null' }, { origin: 'not a url' }]) {
    assert.deepEqual(checkOrigin(headers, PROD), { ok: false, origin: undefined });
  }
});

test('lookalike origins are rejected: the match is exact, never a prefix', () => {
  for (const origin of [
    'https://www.clairo.care.evil.example',
    'https://evil.example',
    'http://www.clairo.care',
    'https://www.clairo.care:8443',
    'https://staging.clairo.care',
    'https://clairo-website.vercel.app',
  ]) {
    assert.deepEqual(checkOrigin({ origin }, PROD), { ok: false, origin });
  }
});

test('Referer is the fallback only when Origin is absent or "null"', () => {
  assert.equal(checkOrigin({ referer: 'https://www.clairo.care/contact' }, PROD).ok, true);
  assert.equal(checkOrigin({ origin: 'null', referer: 'https://clairo.care/contact' }, PROD).ok, true);
  // A good Referer cannot rescue a bad Origin.
  assert.equal(checkOrigin({ origin: 'https://evil.example', referer: 'https://www.clairo.care/' }, PROD).ok, false);
  assert.equal(checkOrigin({ referer: 'https://evil.example/x' }, PROD).ok, false);
});

test('header values that arrive as arrays are handled', () => {
  assert.equal(checkOrigin({ origin: ['https://www.clairo.care'] }, PROD).ok, true);
});

test('outside production, localhost and the deployment URL are allowed too', () => {
  const env = { VERCEL_ENV: 'preview', VERCEL_URL: 'clairo-website-abc123.vercel.app' };
  for (const origin of [
    'http://localhost:3999',
    'http://localhost',
    'http://127.0.0.1:4321',
    'http://[::1]:3999', // vercel dev binds the IPv6 loopback on some machines
    'http://[::1]',
    'https://clairo-website-abc123.vercel.app',
  ]) {
    assert.equal(checkOrigin({ origin }, env).ok, true, origin);
  }
  assert.equal(checkOrigin({ origin: 'https://evil.example' }, env).ok, false);
  assert.equal(checkOrigin({ origin: 'http://[::2]:3999' }, env).ok, false);
  assert.equal(checkOrigin({ origin: 'http://localhost:3999' }, PROD).ok, false);
  assert.equal(checkOrigin({ origin: 'http://[::1]:3999' }, PROD).ok, false);
  assert.equal(checkOrigin({ origin: 'https://clairo-website-abc123.vercel.app' }, { ...PROD, VERCEL_URL: 'clairo-website-abc123.vercel.app' }).ok, false);
});

/* ---------- RateLimiter ---------- */

test('five requests pass, the sixth does not, and the window resets', () => {
  const limiter = new RateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });
  let now = 1_000_000;
  for (let i = 0; i < 5; i++) assert.equal(limiter.check('203.0.113.9', now + i).allowed, true, `hit ${i}`);
  assert.equal(limiter.check('203.0.113.9', now + 5).allowed, false);
  assert.equal(limiter.check('203.0.113.9', now + 9 * 60 * 1000).allowed, false);
  assert.equal(limiter.check('203.0.113.9', now + 10 * 60 * 1000).allowed, true);
});

test('each IP has its own budget, and unknown IPs share one', () => {
  const limiter = new RateLimiter({ max: 1, windowMs: 1000 });
  assert.equal(limiter.check('a', 0).allowed, true);
  assert.equal(limiter.check('b', 0).allowed, true);
  assert.equal(limiter.check('a', 1).allowed, false);
  assert.equal(limiter.check(undefined, 0).allowed, true);
  assert.equal(limiter.check(undefined, 1).allowed, false);
  assert.equal(limiter.check('', 2).allowed, false); // same 'unknown' bucket
});

test('the map does not grow without bound', () => {
  const limiter = new RateLimiter({ max: 5, windowMs: 1000, maxKeys: 50 });
  for (let i = 0; i < 500; i++) limiter.check(`ip-${i}`, i);
  assert.ok(limiter.hits.size <= 50, `size ${limiter.hits.size}`);
});
