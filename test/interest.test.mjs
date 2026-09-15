// node --test test/  (node:test + node:assert, no dependencies)
//
// Covers the relay-secret headers added to the `platform` upstream in api/interest.js. The secret
// used here is a literal test string; no real value is read from the environment.

import test from 'node:test';
import assert from 'node:assert/strict';

import { buildUpstreamRequest } from '../api/interest.js';

const SECRET = 'test-secret-value';
const data = { first_name: 'Relay', last_name: 'Test', family_email: 'relay@example.invalid' };

test('platform, no INTEREST_RELAY_SECRET: content-type only', () => {
  const up = buildUpstreamRequest(data, { INTEREST_UPSTREAM: 'platform' }, { clientIp: '203.0.113.9' });
  assert.deepEqual(up.headers, { 'content-type': 'application/json' });
  assert.equal(up.url, 'https://api.clairo.care/v1/functions/submitInterestForm');
});

test('platform, empty INTEREST_RELAY_SECRET: treated as unset', () => {
  const up = buildUpstreamRequest(
    data,
    { INTEREST_UPSTREAM: 'platform', INTEREST_RELAY_SECRET: '' },
    { clientIp: '203.0.113.9' },
  );
  assert.deepEqual(up.headers, { 'content-type': 'application/json' });
});

test('platform, secret set with a client ip: both headers', () => {
  const up = buildUpstreamRequest(
    data,
    { INTEREST_UPSTREAM: 'platform', INTEREST_RELAY_SECRET: SECRET },
    { clientIp: '203.0.113.9' },
  );
  assert.deepEqual(up.headers, {
    'content-type': 'application/json',
    'x-clairo-relay-secret': SECRET,
    'x-clairo-client-ip': '203.0.113.9',
  });
});

test('platform, secret set with no derivable ip: secret only', () => {
  for (const options of [{}, { clientIp: undefined }, undefined]) {
    const up = buildUpstreamRequest(data, { INTEREST_UPSTREAM: 'platform', INTEREST_RELAY_SECRET: SECRET }, options);
    assert.deepEqual(up.headers, {
      'content-type': 'application/json',
      'x-clairo-relay-secret': SECRET,
    });
  }
});

test('platform: the body is unchanged by the secret', () => {
  const plain = buildUpstreamRequest(data, { INTEREST_UPSTREAM: 'platform' });
  const withSecret = buildUpstreamRequest(
    data,
    { INTEREST_UPSTREAM: 'platform', INTEREST_RELAY_SECRET: SECRET },
    { clientIp: '203.0.113.9' },
  );
  assert.deepEqual(withSecret.body, plain.body);
  assert.equal(plain.body.lead_source, 'website');
});

test('base44 (default upstream) is unaffected by the secret', () => {
  const up = buildUpstreamRequest(data, { INTEREST_RELAY_SECRET: SECRET }, { clientIp: '203.0.113.9' });
  assert.equal(up.upstream, 'base44');
  assert.deepEqual(up.headers, { 'content-type': 'application/json' });
});

test('base44-webhook is unaffected by the secret', () => {
  const up = buildUpstreamRequest(
    data,
    { INTEREST_UPSTREAM: 'base44-webhook', CLIENT_PIPELINE_WEBHOOK_KEY: 'k', INTEREST_RELAY_SECRET: SECRET },
    { clientIp: '203.0.113.9' },
  );
  assert.deepEqual(up.headers, { 'content-type': 'application/json', 'x-api-key': 'k' });
});
