// State and county on the /contact form. One list (src/data/counties.mjs) feeds the page, the
// browser script (through window.CLAIRO_COUNTIES) and the relay; these tests hold all three to it.

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { STATES, COUNTIES } from '../src/data/counties.mjs';
import { normalize, buildUpstreamRequest } from '../api/interest.js';

const read = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const browserSource = read('../public/interest-form.js');

const base = { first_name: 'Ada', last_name: 'Family', family_email: 'ada@example.invalid' };
const config = { upstream: 'platform', url: 'https://example.invalid/v1/functions/submitInterestForm', secret: 's' };
const STATE_MESSAGE = 'Please select the state the participant lives in.';
const COUNTY_MESSAGE = "Please select the participant's county.";

/* ---------- the lists ---------- */

test('the lists are the 24 Maryland and 67 Pennsylvania counties', () => {
  assert.deepEqual(STATES.map((s) => s.code), ['MD', 'PA']);
  assert.equal(COUNTIES.MD.length, 24);
  assert.equal(COUNTIES.PA.length, 67);
  assert.ok(COUNTIES.MD.includes('Baltimore County') && COUNTIES.MD.includes('Baltimore City'));
  assert.ok(COUNTIES.MD.includes("Prince George's") && COUNTIES.MD.includes("St. Mary's"));
  assert.equal(new Set(COUNTIES.MD).size, 24);
  assert.equal(new Set(COUNTIES.PA).size, 67);
});

/* ---------- the relay ---------- */

test('relay: a valid Maryland pair is forwarded as state + county', () => {
  const { data, error } = normalize({ ...base, state: 'MD', county: 'Howard' });
  assert.equal(error, undefined);
  const up = buildUpstreamRequest(data, config);
  assert.equal(up.body.state, 'MD');
  assert.equal(up.body.county, 'Howard');
});

test('relay: a valid Pennsylvania pair is forwarded', () => {
  const { data, error } = normalize({ ...base, state: 'PA', county: 'McKean' });
  assert.equal(error, undefined);
  assert.equal(data.state, 'PA');
  assert.equal(data.county, 'McKean');
});

test('relay: Baltimore City is its own Maryland entry', () => {
  const { data, error } = normalize({ ...base, state: 'MD', county: 'Baltimore City' });
  assert.equal(error, undefined);
  assert.equal(data.county, 'Baltimore City');
});

test('relay: no state is the legacy path, county stays free text and no state is forwarded', () => {
  const { data, error } = normalize({ ...base, county: '  somewhere near Towson  ' });
  assert.equal(error, undefined);
  const up = buildUpstreamRequest(data, config);
  assert.equal('state' in up.body, false);
  assert.equal(up.body.county, 'somewhere near Towson');
  assert.equal(normalize({ ...base, county: 'x'.repeat(150) }).data.county.length, 100);
});

test('relay: a state we do not serve is rejected', () => {
  assert.equal(normalize({ ...base, state: 'CT', county: 'Hartford' }).error, STATE_MESSAGE);
  assert.equal(normalize({ ...base, state: '', county: 'Howard' }).error, STATE_MESSAGE);
  assert.equal(normalize({ ...base, state: 'constructor', county: 'Howard' }).error, STATE_MESSAGE);
});

test('relay: a county from the other state is rejected', () => {
  assert.equal(normalize({ ...base, state: 'MD', county: 'Philadelphia' }).error, COUNTY_MESSAGE);
  assert.equal(normalize({ ...base, state: 'PA', county: 'Howard' }).error, COUNTY_MESSAGE);
});

test('relay: the placeholder county "" is rejected once a state is sent', () => {
  assert.equal(normalize({ ...base, state: 'MD', county: '' }).error, COUNTY_MESSAGE);
  assert.equal(normalize({ ...base, state: 'PA' }).error, COUNTY_MESSAGE);
});

/* ---------- the browser script ---------- */

function loadForm(counties) {
  const handlers = {};
  const documentStub = {
    cookie: '',
    addEventListener: (type, fn) => { (handlers[type] = handlers[type] || []).push(fn); },
    dispatchEvent: () => true,
    querySelector: () => null,
    createElement: () => ({ value: '', textContent: '' }),
  };
  const windowStub = counties ? { CLAIRO_COUNTIES: counties } : {};
  const context = vm.createContext({
    window: windowStub,
    document: documentStub,
    location: { href: 'https://www.clairo.care/contact', search: '' },
    navigator: { userAgent: 'node-test' },
    CustomEvent: class CustomEvent {},
    fetch: () => Promise.reject(new Error('the test never submits')),
    console,
  });
  vm.runInContext(browserSource, context, { filename: 'public/interest-form.js' });
  return { api: windowStub.CLAIRO_INTEREST, handlers };
}

// JSON round trip so the lists are plain arrays from the vm's own realm, as on the real page.
const inlined = () => JSON.parse(JSON.stringify(COUNTIES));

test('browser validate(): missing state and mismatched county are rejected, a valid pair passes', () => {
  const { api } = loadForm(inlined());
  assert.equal(api.validate({ ...base }).reason, 'state');
  assert.equal(api.validate({ ...base }).message, STATE_MESSAGE);
  assert.equal(api.validate({ ...base, state: 'CT', county: 'Hartford' }).reason, 'state');
  const mismatch = api.validate({ ...base, state: 'MD', county: 'Philadelphia' });
  assert.equal(mismatch.reason, 'county');
  assert.equal(mismatch.message, COUNTY_MESSAGE);
  assert.equal(api.validate({ ...base, state: 'MD' }).reason, 'county');
  assert.equal(api.validate({ ...base, state: 'MD', county: 'Baltimore City' }), null);
  assert.equal(api.validate({ ...base, state: 'PA', county: 'Philadelphia' }), null);
});

test('browser validate(): without the inline lists the state and county are not checked', () => {
  const { api } = loadForm(undefined);
  assert.equal(api.validate({ ...base }), null);
});

test('browser: choosing a state fills and enables county; the placeholder resets it', () => {
  const { handlers } = loadForm(inlined());
  const county = {
    name: 'county', value: '', disabled: true, options: [],
    appendChild(o) { this.options.push(o); },
    remove(i) { this.options.splice(i, 1); },
  };
  const form = { matches: () => true, elements: { county } };
  const state = { name: 'state', value: 'PA', type: 'select-one', form };
  form.elements.state = state;
  const fire = () => handlers.change.forEach((fn) => fn({ target: state }));

  fire();
  assert.equal(county.disabled, false);
  assert.equal(county.options.length, 68);
  assert.equal(county.options[0].textContent, 'Select a county');
  assert.equal(county.options[0].value, '');
  assert.equal(county.options[1].value, 'Adams');

  state.value = 'MD';
  fire();
  assert.equal(county.options.length, 25);

  state.value = '';
  fire();
  assert.equal(county.disabled, true);
  assert.equal(county.options.length, 1);
  assert.equal(county.options[0].textContent, 'Select a state first');
});

/* ---------- the page ---------- */

test('contact.astro reads the shared lists and inlines window.CLAIRO_COUNTIES', () => {
  const page = read('../src/pages/contact.astro');
  assert.match(page, /import \{ STATES, COUNTIES \} from '\.\.\/data\/counties\.mjs';/);
  assert.match(page, /<script is:inline set:html=\{`window\.CLAIRO_COUNTIES = \$\{JSON\.stringify\(COUNTIES\)/);
  assert.match(page, /<select name="state" required/);
  assert.match(page, /<select name="county" required="" disabled/);
});
