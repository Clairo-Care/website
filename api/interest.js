// POST /api/interest — server-side relay for the "Talk to Clairo" form (contact.dc.html).
//
// WHY THIS EXISTS: the site is static HTML on Vercel. Today's upstream (Base44's
// `clientPipelineWebhook`) needs an `x-api-key`, and a key in client-side JS is a key anyone can
// read. This function holds the key in a Vercel env var and forwards a validated, size-capped
// payload. The browser only ever talks to this same-origin route.
//
// UPSTREAMS (select with INTEREST_UPSTREAM):
//   base44   (default until cutover) POST Base44's `submitInterestForm` — the same public, key-less
//            function the staff app's own /interest page calls. Lands as a ClientPipeline row with
//            pipeline_status "interest" (an Interest tile). No secret involved.
//   base44-webhook  Alternative: `clientPipelineWebhook?action=create` with x-api-key
//            CLIENT_PIPELINE_WEBHOOK_KEY. Only if that key is ever in hand (it is not retrievable
//            from Base44 after creation and rotating it breaks the Jotform→Zapier zap).
//   platform (from go-live, 2026-08-31) POST {INTEREST_PLATFORM_URL}/v1/functions/submitInterestForm.
//            Public route, no key. NOTE: it is rate-limited to 5/hour per *source IP* and does not
//            trust x-forwarded-for, so relaying through this function makes every visitor share
//            Vercel's egress IPs. Once www.clairo.care is in the API's ALLOWED_ORIGINS, prefer
//            posting straight from the browser (set CLAIRO_INTEREST.endpoint in interest-form.js)
//            and leave this relay as the fallback.
//
// The browser sends the canonical (platform-shaped) payload built in interest-form.js; the base44
// adapter below only renames what differs. Nothing here logs form contents — only upstream status.
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
const META_DEFAULT_SOURCE_URL = 'https://www.clairo.care/contact.dc.html';
// fb.<subdomain index>.<creation ms>.<id>; the index is documented as 0-2 but the pixel emitted 3 on a bare host.
const FB_COOKIE_RE = /^fb\.\d\.\d{1,20}\.[A-Za-z0-9_.-]{1,500}$/;
const EVENT_ID_RE = /^[A-Za-z0-9_.:-]{8,64}$/;

const BASE44_APP_ID = '69f4d09c4aecc2f9c55bc483';
const BASE44_FUNCTIONS = `https://base44.app/api/apps/${BASE44_APP_ID}/functions`;
const DEFAULT_BASE44_URL = `${BASE44_FUNCTIONS}/submitInterestForm`;
const DEFAULT_BASE44_WEBHOOK_URL = `${BASE44_FUNCTIONS}/clientPipelineWebhook?action=create`;
const WEBSITE_TAG = 'Submitted via clairo.care website.';
const DEFAULT_PLATFORM_URL = 'https://api.clairo.care';
const UPSTREAM_TIMEOUT_MS = 10_000;

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
      service_route: route && ROUTE_ENUM.has(route) ? route : undefined,
      services_selected: services_selected.length ? services_selected : undefined,
      has_caregiver_in_mind: bool(body.has_caregiver_in_mind),
      services_needed_description: text(body.services_needed_description, 4000),
    },
  };
}

const compact = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));

/** Build {url, headers, body} for the configured upstream, or {error} if misconfigured. */
function buildUpstreamRequest(data, env) {
  const upstream = (env.INTEREST_UPSTREAM || 'base44').toLowerCase();

  if (upstream === 'base44') {
    // `base44/functions/submitInterestForm/entry.ts`: anonymous by design, keyed on family_email
    // (a repeat email updates the existing tile), sets pipeline_status "interest", matchmaker true,
    // has_jotform false, source "Maryland Interest Form". It hardcodes `source` and its lead_source
    // enum has no "website" value, so the origin is stamped into the notes instead — the one field
    // an admin reads on the tile.
    return {
      upstream,
      url: env.INTEREST_BASE44_URL || DEFAULT_BASE44_URL,
      headers: { 'content-type': 'application/json' },
      body: compact({
        first_name: data.first_name,
        last_name: data.last_name,
        family_email: data.family_email,
        family_phone: data.family_phone,
        county: data.county,
        service_route: data.service_route,
        services_selected: data.services_selected,
        has_caregiver_in_mind: data.has_caregiver_in_mind,
        services_needed_description: data.services_needed_description
          ? `${WEBSITE_TAG} ${data.services_needed_description}`
          : WEBSITE_TAG,
      }),
    };
  }

  if (upstream === 'base44-webhook') {
    const key = env.CLIENT_PIPELINE_WEBHOOK_KEY;
    if (!key) return { error: 'CLIENT_PIPELINE_WEBHOOK_KEY is not set' };
    // Field names per Logan's 2026-08-28 Base44 session + carebridge1 a413ed5 (webhook mapping).
    // The webhook forces lead_source="jotform"/has_jotform=true itself; `source` is free text and is
    // what tells an admin on the pipeline board where the tile came from.
    return {
      upstream,
      url: env.INTEREST_BASE44_WEBHOOK_URL || DEFAULT_BASE44_WEBHOOK_URL,
      headers: { 'content-type': 'application/json', 'x-api-key': key },
      body: compact({
        first_name: data.first_name,
        last_name: data.last_name,
        family_contact_name: `${data.first_name} ${data.last_name}`,
        family_email: data.family_email,
        family_phone: data.family_phone,
        county: data.county,
        state: 'MD',
        service_route: data.service_route,
        services_selected: data.services_selected,
        has_caregiver_in_mind: data.has_caregiver_in_mind,
        services_needed_notes: data.services_needed_description,
        source: 'clairo.care website',
        pipeline_status: 'interest',
      }),
    };
  }

  if (upstream === 'platform') {
    const base = (env.INTEREST_PLATFORM_URL || DEFAULT_PLATFORM_URL).replace(/\/+$/, '');
    return {
      upstream,
      url: `${base}/v1/functions/submitInterestForm`,
      headers: { 'content-type': 'application/json' },
      body: compact({ ...data, lead_source: 'website' }),
    };
  }

  return { error: `Unknown INTEREST_UPSTREAM "${upstream}"` };
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

async function readJson(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch { return null; }
    }
    return req.body;
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return null;
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return null; }
}

async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = await readJson(req);
  // Honeypot: a filled "website" field is a bot. Answer as if it worked and drop it.
  if (body && typeof body === 'object' && body.website) return res.status(200).json({ ok: true });

  const { error, data } = normalize(body);
  if (error) return res.status(400).json({ ok: false, error });

  const up = buildUpstreamRequest(data, process.env);
  if (up.error) {
    console.error('[interest] misconfigured:', up.error);
    return res.status(503).json({ ok: false, error: 'The form is temporarily unavailable. Please email hello@clairo.care.' });
  }

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
    const snippet = (await upstreamRes.text().catch(() => '')).slice(0, 300);
    console.error(`[interest] ${up.upstream} responded ${upstreamRes.status}: ${snippet}`);
    return res.status(502).json({ ok: false, error: 'We could not send your message. Please try again or email hello@clairo.care.' });
  }

  console.log(`[interest] ${up.upstream} accepted (${upstreamRes.status})`);

  // Lead is stored; now tell Meta. Awaited (Vercel may freeze the function once the response is
  // sent) but bounded by META_TIMEOUT_MS and never able to fail the request.
  await sendMetaLead(body.meta, req, process.env);

  return res.status(200).json({ ok: true });
}

module.exports = handler;
module.exports.normalize = normalize;
module.exports.buildUpstreamRequest = buildUpstreamRequest;
module.exports.buildMetaEvent = buildMetaEvent;
module.exports.sendMetaLead = sendMetaLead;
