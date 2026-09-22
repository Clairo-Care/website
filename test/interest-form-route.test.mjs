// R8: the /contact radio labels are whole phrases ("Traditional services", "Self-Directed",
// "Not sure", "New to DDA services"), so the route lookup has to be an exact prefix match on the
// lower-cased label. Before this fix only "Self-Directed" mapped and every traditional lead
// arrived with no service_route.
//
// The real public/interest-form.js is loaded here, unmodified, under node:vm with a stub
// window/document. No mirrored copy of the function exists, so this test cannot drift from what
// ships to the browser.

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(fileURLToPath(new URL('../public/interest-form.js', import.meta.url)), 'utf8');

function loadForm() {
  const listeners = [];
  const documentStub = {
    cookie: '',
    addEventListener: (type) => listeners.push(type),
    dispatchEvent: () => true,
    querySelector: () => null,
  };
  const windowStub = {};
  const context = vm.createContext({
    window: windowStub,
    document: documentStub,
    location: { href: 'https://www.clairo.care/contact', search: '' },
    navigator: { userAgent: 'node-test' },
    CustomEvent: class CustomEvent {},
    fetch: () => Promise.reject(new Error('the test never submits')),
    console,
  });
  vm.runInContext(source, context, { filename: 'public/interest-form.js' });
  return { api: windowStub.CLAIRO_INTEREST, listeners };
}

test('the script loads in a bare window/document and exposes its config', () => {
  const { api, listeners } = loadForm();
  assert.equal(api.endpoint, '/api/interest');
  assert.equal(typeof api.normaliseRoute, 'function');
  assert.deepEqual(listeners, ['focusin', 'input', 'focusout', 'change', 'submit']);
});

test('the four radio labels on /contact map as intended', () => {
  const { api } = loadForm();
  assert.equal(api.normaliseRoute('Traditional services'), 'traditional');
  assert.equal(api.normaliseRoute('Self-Directed'), 'self_directed');
  assert.equal(api.normaliseRoute('Not sure'), undefined);
  assert.equal(api.normaliseRoute('New to DDA services'), undefined);
});

test('the match is case insensitive and anchored at the start', () => {
  const { api } = loadForm();
  assert.equal(api.normaliseRoute('TRADITIONAL SERVICES'), 'traditional');
  assert.equal(api.normaliseRoute('self-directed services'), 'self_directed');
  // Not a prefix: these must not be mistaken for a route answer.
  assert.equal(api.normaliseRoute('Moving from traditional services'), undefined);
  assert.equal(api.normaliseRoute('Self employed'), undefined);
  assert.equal(api.normaliseRoute('Selfish'), undefined);
  assert.equal(api.normaliseRoute(''), undefined);
  assert.equal(api.normaliseRoute(undefined), undefined);
});

test('the mapped values are exactly what api/interest.js accepts', async () => {
  const { api } = loadForm();
  const { normalize } = await import('../api/interest.js');
  for (const label of ['Traditional services', 'Self-Directed']) {
    const { data, error } = normalize({
      first_name: 'Ada',
      last_name: 'Family',
      family_email: 'ada@example.invalid',
      service_route: api.normaliseRoute(label),
    });
    assert.equal(error, undefined);
    assert.equal(data.service_route, api.normaliseRoute(label));
  }
});
