// POST /api/interest - server-side relay for the "Talk to Clairo" form (the /contact page).
//
// WHY THIS EXISTS: the site is static HTML on Vercel. The browser posts to this same-origin route
// and this function forwards a validated, size-capped payload to the Clairo platform with the
// shared relay secret attached, so the platform can key its own rate limit on the visitor's IP
// instead of Vercel's egress IPs. Nothing secret is ever in the browser bundle.
//
// UPSTREAM: the platform only. POST {INTEREST_PLATFORM_URL}/v1/functions/submitInterestForm.
// The old `base44` and `base44-webhook` modes are gone (dead vendor). INTEREST_UPSTREAM is now
// optional: unset or `platform` means platform, any other value is a misconfiguration that answers
// 503 and forwards nothing.
//
// FAIL CLOSED. The relay never forwards unless it is fully configured:
//   production (VERCEL_ENV === 'production'): INTEREST_PLATFORM_URL defaults to
//     https://api.clairo.care and INTEREST_RELAY_SECRET is REQUIRED.
//   everywhere else (vercel dev, previews): BOTH INTEREST_PLATFORM_URL and INTEREST_RELAY_SECRET
//     must be set explicitly, otherwise 503 and nothing leaves the function.
//
// GATES, in order: 405 method, 403 origin, 413 oversized body, 200 honeypot, 429 rate, 400
// validation, 503 config, then forward (502/200). The honeypot has to come after the body is read
// because it IS a body field; everything before it costs nothing but a header read.
//
// ORIGIN: same-origin by design. A POST whose Origin (or, when Origin is missing or "null", whose
// Referer) does not resolve to exactly one of ALLOWED_ORIGINS gets 403 and never reaches the
// platform. No CORS headers are sent, so a cross-origin browser call cannot read the answer either.
// Preview aliases such as clairo-website.vercel.app are deliberately NOT allowlisted in production.
// This is CSRF protection for browsers, not authentication: a browser cannot forge these headers,
// but curl or any other non-browser client can set them to anything. So the origin gate and the
// per-instance rate limit below only raise the cost of casual abuse; the platform's per-IP and
// per-email-hash limits (keyed on the x-clairo-client-ip this relay sends) are the authoritative
// spam control.
//
// META CONVERSIONS API: after the upstream accepts a lead, the same `Lead` event is posted to Meta
// server-side (graph.facebook.com/<version>/<pixel>/events). It carries only ad-attribution context:
// the visitor's IP + user agent, the pixel's _fbp/_fbc cookies, the page URL, and an event id that
// matches the browser pixel's eventID so Meta deduplicates the pair. No name, email, phone, or
// anything else the family typed goes to Meta (see the deliberate omission in buildMetaEvent).
// Sent only when the browser reports `meta.consent === true` (the visitor accepted the consent
// banner, consent.js) and always with Meta's Limited Data Use flag in geolocation mode.
// Requires META_CAPI_ACCESS_TOKEN; without it the step is skipped and the form still works.

'use strict';

const META_PIXEL_ID_DEFAULT = '1489545563193733';
const META_GRAPH_VERSION_DEFAULT = 'v26.0';
const META_TIMEOUT_MS = 3_000;
const META_SITE_ORIGINS = ['https://www.clairo.care', 'https://clairo.care'];
const META_DEFAULT_SOURCE_URL = 'https://www.clairo.care/contact';
// fb.<subdomain index>.<creation ms>.<id>; the index is documented as 0-2 but the pixel emitted 3 on a bare host.
const FB_COOKIE_RE = /^fb\.\d\.\d{1,20}\.[A-Za-z0-9_.-]{1,500}$/;
const EVENT_ID_RE = /^[A-Za-z0-9_.:-]{8,64}$/;

const DEFAULT_PLATFORM_URL = 'https://api.clairo.care';
const UPSTREAM_TIMEOUT_MS = 10_000;

// Same-origin only. Exact origin match after new URL(...).origin, never a prefix test.
const ALLOWED_ORIGINS = ['https://www.clairo.care', 'https://clairo.care'];
const LOCALHOST_ORIGIN_RE = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/;

// Best effort, per warm instance. Vercel keeps several instances and recycles them, so this is a
// first gate that costs a bot something, not an authoritative limit. The platform's own 5/hour per
// IP and 3/day per email hash (keyed on x-clairo-client-ip) remain the real ceiling.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_KEYS = 2000;

const MAX_BODY_BYTES = 64 * 1024;

const SERVICE_ENUM = new Set(['Personal Supports', 'Community Development', 'Respite', 'Job Supports']);
const ROUTE_ENUM = new Set(['traditional', 'self_directed']);
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

const text = (v, max) => {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s ? s.slice(0, max) : undefined;
};
const bool = (v) => (v === true || v === 'true' ? true : v === false || v === 'false' ? false : undefined);

/** Validate + normalize the browser payload into the canonical shape. Returns {error} or {data}. */
function normalize(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Invalid body' };
  const first_name = text(body.first_name, 100);
  const last_name = text(body.last_name, 100);
  const family_email = text(body.family_email, 254)?.toLowerCase();
  if (!first_name || !last_name) return { error: 'Please enter your first and last name.' };
  if (!family_email || !EMAIL_RE.test(family_email)) return { error: 'Please enter a valid email address.' };

  const services_selected = Array.isArray(body.services_selected)
    ? [...new Set(body.services_selected.map((s) => text(s, 100)).filter((s) => s && SERVICE_ENUM.has(s)))]
    : [];
  const route = text(body.service_route, 32);

  return {
    data: {
      first_name,
      last_name,
      family_email,
      family_phone: text(body.family_phone, 50),
      county: text(body.county, 100),
      // State waiver participant / department number: free text, 1..40. Never logged, never sent to Meta.
      participant_number: text(body.participant_number, 40),
      service_route: route && ROUTE_ENUM.has(route) ? route : undefined,
      services_selected: services_selected.length ? services_selected : undefined,
      has_caregiver_in_mind: bool(body.has_caregiver_in_mind),
      services_needed_description: text(body.services_needed_description, 4000),
    },
  };
}

const compact = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));

/* ---------- configuration, origin, rate limit: pure and unit-testable ---------- */

/**
 * Resolve the upstream configuration from the environment. Returns {error} when the relay must
 * fail closed, or {upstream, url, secret} when it is safe to forward.
 *
 * INTEREST_UPSTREAM is optional and is trimmed + lower-cased; unset or 'platform' means platform,
 * anything else is a misconfiguration. An empty INTEREST_RELAY_SECRET counts as unset.
 */
function resolveConfig(env = {}) {
  const upstream = String(env.INTEREST_UPSTREAM ?? '').trim().toLowerCase();
  if (upstream && upstream !== 'platform') {
    return { error: `unsupported INTEREST_UPSTREAM "${upstream}"` };
  }

  // Trimmed, not raw: a value pasted into the Vercel dashboard often carries a trailing newline,
  // and a header with one would not match the platform's secret (or would be rejected outright).
  const secret = (typeof env.INTEREST_RELAY_SECRET === 'string' ? env.INTEREST_RELAY_SECRET : '').trim();
  if (!secret) return { error: 'INTEREST_RELAY_SECRET is not set' };

  const rawBase = typeof env.INTEREST_PLATFORM_URL === 'string' ? env.INTEREST_PLATFORM_URL.trim() : '';
  const isProduction = env.VERCEL_ENV === 'production';
  // Outside production (vercel dev, previews) nothing is forwarded unless the target was named
  // explicitly, so a preview can never post a test lead at the production API by default.
  if (!isProduction && !rawBase) {
    return { error: 'INTEREST_PLATFORM_URL is not set (required outside production)' };
  }

  const base = (rawBase || DEFAULT_PLATFORM_URL).replace(/\/+$/, '');
  return { upstream: 'platform', url: `${base}/v1/functions/submitInterestForm`, secret };
}

/** The origin of a header value, or undefined when it is absent, "null", or unparseable. */
function headerOrigin(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'null') return undefined;
  try {
    return new URL(trimmed).origin;
  } catch {
    return undefined;
  }
}

/**
 * Same-origin gate. Uses Origin, falling back to the Referer's origin when Origin is missing or
 * "null". The comparison is an exact match on new URL(...).origin, never a prefix or substring.
 * Outside production, localhost (any port) and the deployment's own https://VERCEL_URL pass too.
 * Returns {ok, origin}.
 */
function checkOrigin(headers = {}, env = {}) {
  const origin = headerOrigin(headers.origin) || headerOrigin(headers.referer);
  if (!origin) return { ok: false, origin: undefined };
  if (ALLOWED_ORIGINS.includes(origin)) return { ok: true, origin };
  if (env.VERCEL_ENV === 'production') return { ok: false, origin };
  if (LOCALHOST_ORIGIN_RE.test(origin)) return { ok: true, origin };
  const vercelUrl = typeof env.VERCEL_URL === 'string' ? env.VERCEL_URL.trim() : '';
  if (vercelUrl && origin === `https://${vercelUrl}`) return { ok: true, origin };
  return { ok: false, origin };
}

/**
 * Fixed-window counter per key, held in memory. Best effort by design: it lives only as long as the
 * warm instance that owns it, so a determined bot spread across instances gets more than `max`.
 * The platform-side limit is the authoritative one; this just makes the cheap case cheap.
 */
class RateLimiter {
  constructor({ max = RATE_LIMIT_MAX, windowMs = RATE_LIMIT_WINDOW_MS, maxKeys = RATE_LIMIT_MAX_KEYS } = {}) {
    this.max = max;
    this.windowMs = windowMs;
    this.maxKeys = maxKeys;
    this.hits = new Map();
  }

  /** Count one request against `key`. Returns {allowed, count}. */
  check(key, now = Date.now()) {
    const k = key || 'unknown';
    const entry = this.hits.get(k);
    if (!entry || now - entry.windowStart >= this.windowMs) {
      this.prune(now);
      this.hits.set(k, { count: 1, windowStart: now });
      return { allowed: true, count: 1 };
    }
    entry.count += 1;
    return { allowed: entry.count <= this.max, count: entry.count };
  }

  /** Drop expired entries, then the oldest ones, so the map cannot grow without bound. */
  prune(now = Date.now()) {
    if (this.hits.size < this.maxKeys) return;
    for (const [k, v] of this.hits) {
      if (now - v.windowStart >= this.windowMs) this.hits.delete(k);
    }
    // Map iterates in insertion order, so this drops the least recently started windows first.
    for (const k of this.hits.keys()) {
      if (this.hits.size < this.maxKeys) break;
      this.hits.delete(k);
    }
  }
}

const limiter = new RateLimiter();

/**
 * Build {url, headers, body} for the platform from a resolved config (see resolveConfig).
 * `options.clientIp` is the visitor's IP (clientIp(req)); the platform trusts x-clairo-client-ip
 * only because x-clairo-relay-secret is attached. Never logged.
 */
function buildUpstreamRequest(data, config, options = {}) {
  const headers = { 'content-type': 'application/json', 'x-clairo-relay-secret': config.secret };
  // No derivable IP (no x-forwarded-for / x-real-ip): send the secret alone and let the platform
  // fall back to the source IP rather than forwarding a bogus value.
  if (options.clientIp) headers['x-clairo-client-ip'] = options.clientIp;
  return {
    upstream: config.upstream,
    url: config.url,
    headers,
    body: compact({ ...data, lead_source: 'website' }),
  };
}

/** First public client IP from the proxy headers Vercel sets, or undefined. */
function clientIp(req) {
  const h = req.headers || {};
  const xff = h['x-forwarded-for'];
  const first = (Array.isArray(xff) ? xff[0] : xff || '').split(',')[0].trim();
  const ip = first || (Array.isArray(h['x-real-ip']) ? h['x-real-ip'][0] : h['x-real-ip']) || '';
  return ip && ip.length <= 45 ? ip : undefined;
}

/**
 * Build the Conversions API event for an accepted lead, or null if there is nothing safe to send.
 * `meta` is the browser's untrusted `meta` block: every field is format-checked and capped. Form
 * contents are deliberately never read here, so this function cannot leak them by accident.
 */
function buildMetaEvent(meta, req, now = Date.now()) {
  const m = meta && typeof meta === 'object' && !Array.isArray(meta) ? meta : {};
  const h = (req && req.headers) || {};
  const ua = text(Array.isArray(h['user-agent']) ? h['user-agent'][0] : h['user-agent'], 512);
  const ip = clientIp(req);
  if (!ua && !ip) return null; // Meta rejects website events with no matchable user_data

  const eventId = text(m.event_id, 64);
  const fbp = text(m.fbp, 200);
  const fbc = text(m.fbc, 600);
  let sourceUrl = text(m.source_url, 2048);
  if (!sourceUrl || !META_SITE_ORIGINS.some((o) => sourceUrl === o || sourceUrl.startsWith(o + '/'))) {
    const ref = text(Array.isArray(h.referer) ? h.referer[0] : h.referer, 2048);
    sourceUrl = ref && META_SITE_ORIGINS.some((o) => ref.startsWith(o + '/')) ? ref : META_DEFAULT_SOURCE_URL;
  }

  return compact({
    event_name: 'Lead',
    event_time: Math.floor(now / 1000),
    event_id: eventId && EVENT_ID_RE.test(eventId) ? eventId : undefined,
    action_source: 'website',
    event_source_url: sourceUrl,
    // Limited Data Use, geolocation mode (country 0 / state 0 = Meta decides from the IP).
    data_processing_options: ['LDU'],
    data_processing_options_country: 0,
    data_processing_options_state: 0,
    user_data: compact({
      client_ip_address: ip,
      client_user_agent: ua,
      fbp: fbp && FB_COOKIE_RE.test(fbp) ? fbp : undefined,
      fbc: fbc && FB_COOKIE_RE.test(fbc) ? fbc : undefined,
    }),
  });
}

/** POST the Lead to Meta. Never throws and never delays the user beyond META_TIMEOUT_MS. */
async function sendMetaLead(meta, req, env, fetchImpl = fetch) {
  // Consent first: no banner acceptance (or an old cached interest-form.js with no meta block) means
  // no server event, regardless of configuration.
  if (!meta || typeof meta !== 'object' || meta.consent !== true) return { skipped: 'no consent' };
  const token = env.META_CAPI_ACCESS_TOKEN;
  if (!token) return { skipped: 'no META_CAPI_ACCESS_TOKEN' };
  const event = buildMetaEvent(meta, req);
  if (!event) return { skipped: 'no user_data' };

  const pixelId = env.META_PIXEL_ID || META_PIXEL_ID_DEFAULT;
  const version = env.META_GRAPH_VERSION || META_GRAPH_VERSION_DEFAULT;
  const url = `https://graph.facebook.com/${version}/${pixelId}/events`;
  const body = compact({
    data: [event],
    test_event_code: text(env.META_CAPI_TEST_EVENT_CODE, 64),
    access_token: token,
  });

  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(META_TIMEOUT_MS),
    });
    if (!res.ok) {
      const snippet = (await res.text().catch(() => '')).slice(0, 300);
      console.error(`[interest] meta capi responded ${res.status}: ${snippet}`);
      return { ok: false, status: res.status };
    }
    console.log(`[interest] meta capi accepted Lead${event.event_id ? ' ' + event.event_id : ''}`);
    return { ok: true, status: res.status };
  } catch (e) {
    console.error('[interest] meta capi unreachable:', e && e.name, e && e.message);
    return { ok: false, error: e && e.name };
  }
}

/**
 * Read at most MAX_BODY_BYTES of the request and parse it as JSON. Returns {tooLarge: true} when
 * the body is over the cap, otherwise {value}, where value is null for an empty or unparseable body.
 */
async function readJson(req) {
  const parse = (s) => {
    try { return { value: JSON.parse(s) }; } catch { return { value: null }; }
  };
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      return Buffer.byteLength(req.body) > MAX_BODY_BYTES ? { tooLarge: true } : parse(req.body);
    }
    if (Buffer.isBuffer(req.body)) {
      return req.body.length > MAX_BODY_BYTES ? { tooLarge: true } : parse(req.body.toString('utf8'));
    }
    // Already parsed by the runtime: the cap still applies, measured on the re-serialised body, so
    // a pre-parsing platform cannot be used to slip a huge payload past it.
    let serialised;
    try { serialised = JSON.stringify(req.body); } catch { return { value: null }; }
    if (serialised !== undefined && Buffer.byteLength(serialised) > MAX_BODY_BYTES) return { tooLarge: true };
    return { value: req.body };
  }
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    const buf = Buffer.isBuffer(c) ? c : Buffer.from(c);
    size += buf.length;
    if (size > MAX_BODY_BYTES) return { tooLarge: true };
    chunks.push(buf);
  }
  if (!size) return { value: null };
  return parse(Buffer.concat(chunks).toString('utf8'));
}

const headerValue = (headers, name) => {
  const v = headers[name];
  return Array.isArray(v) ? v[0] : v;
};

async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const headers = req.headers || {};

  // Gate 1: same-origin. Header-only, so a rejected request costs nothing and is never read.
  const origin = checkOrigin(headers, process.env);
  if (!origin.ok) {
    console.warn(`[interest] rejected origin ${origin.origin || '(none)'}`);
    return res.status(403).json({ ok: false, error: 'forbidden_origin' });
  }

  // Gate 2: size. The declared length short-circuits; readJson enforces the real cap while reading.
  const declared = Number(headerValue(headers, 'content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return res.status(413).json({ ok: false, error: 'payload_too_large' });
  }
  const read = await readJson(req);
  if (read.tooLarge) return res.status(413).json({ ok: false, error: 'payload_too_large' });
  const body = read.value;

  // Gate 3: honeypot. A filled "website" field is a bot. Answer as if it worked and drop it, before
  // the rate limiter, so bot traffic never eats a real visitor's budget. This is the first check
  // that needs the body, which is why the body is read here and not earlier.
  if (body && typeof body === 'object' && body.website) return res.status(200).json({ ok: true });

  // Gate 4: per-IP rate limit (best effort, this warm instance only; see RateLimiter).
  const ip = clientIp(req);
  if (!limiter.check(ip).allowed) {
    res.setHeader('retry-after', String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const { error, data } = normalize(body);
  if (error) return res.status(400).json({ ok: false, error });

  // Gate 5: configuration. Resolved after the cheap gates and before any network call, so a
  // half-configured deployment answers 503 and forwards nothing.
  const config = resolveConfig(process.env);
  if (config.error) {
    console.error('[interest] misconfigured:', config.error);
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const up = buildUpstreamRequest(data, config, { clientIp: ip });

  let upstreamRes;
  try {
    upstreamRes = await fetch(up.url, {
      method: 'POST',
      headers: up.headers,
      body: JSON.stringify(up.body),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (e) {
    console.error(`[interest] ${up.upstream} unreachable:`, e && e.name, e && e.message);
    return res.status(502).json({ ok: false, error: 'We could not send your message. Please try again or email hello@clairo.care.' });
  }

  if (!upstreamRes.ok) {
    // Status only. A 4xx from the platform can echo the fields that were submitted, and none of
    // that belongs in a Vercel log line.
    console.error(`[interest] ${up.upstream} responded ${upstreamRes.status}`);
    return res.status(502).json({ ok: false, error: 'We could not send your message. Please try again or email hello@clairo.care.' });
  }

  console.log(`[interest] ${up.upstream} accepted (${upstreamRes.status})`);

  // Lead is stored; now tell Meta. Awaited (Vercel may freeze the function once the response is
  // sent) but bounded by META_TIMEOUT_MS and never able to fail the request.
  await sendMetaLead(body.meta, req, process.env);

  return res.status(200).json({ ok: true });
}

// ES module exports: the repo's package.json declares "type": "module" (Astro), so Node loads this
// file as ESM on Vercel. `module.exports` would throw "module is not defined in ES module scope".
export default handler;
export {
  normalize,
  resolveConfig,
  checkOrigin,
  RateLimiter,
  buildUpstreamRequest,
  buildMetaEvent,
  sendMetaLead,
  clientIp,
  limiter,
  ALLOWED_ORIGINS,
  MAX_BODY_BYTES,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
};
