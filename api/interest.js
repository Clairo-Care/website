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

'use strict';

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
  return res.status(200).json({ ok: true });
}

module.exports = handler;
module.exports.normalize = normalize;
module.exports.buildUpstreamRequest = buildUpstreamRequest;
