# clairo.care — marketing site

Static HTML exported from Claude Design (`*.dc.html` + `support.js` runtime + `_ds/` design-system
bundle), hosted on Vercel (team `clairo1`, project `website`, production `https://www.clairo.care`).
No build step. Push to `main` deploys.

## The one dynamic piece: the "Talk to Clairo" form

`contact.dc.html` → `interest-form.js` (browser) → `api/interest.js` (Vercel function) → CareBridge.

- **`interest-form.js`** collects the form, splits the name, maps labels to the values the backend
  stores (`service_route`, `services_selected`), folds anything without a column into the notes,
  and POSTs the canonical payload to `CLAIRO_INTEREST.endpoint` (default `/api/interest`).
- **`api/interest.js`** validates, size-caps, and relays. It holds the upstream credential so nothing
  secret is in the browser. Honeypot field `website` drops bots silently.

### Environment variables (Vercel → Settings → Environment Variables, Production)

**None are required for the default path.**

| Name | Required | Meaning |
|---|---|---|
| `INTEREST_UPSTREAM` | no | `base44` (default), `base44-webhook`, or `platform`. |
| `INTEREST_BASE44_URL` | no | Override; default `https://base44.app/api/apps/69f4d09c4aecc2f9c55bc483/functions/submitInterestForm`. |
| `INTEREST_PLATFORM_URL` | no | Override; default `https://api.clairo.care`. |
| `CLIENT_PIPELINE_WEBHOOK_KEY` | only in `base44-webhook` mode | Base44 secret of the same name. Not retrievable after creation; rotating it breaks the Jotform→Zapier zap. |
| `INTEREST_BASE44_WEBHOOK_URL` | no | Override for `base44-webhook` mode. |

If a mode is misconfigured (e.g. `base44-webhook` without its key) the function answers 503 and the
form shows a "temporarily unavailable — email hello@clairo.care" message; nothing is lost silently.

### Meta Pixel + Conversions API (added 2026-09-02)

**Consent-gated.** `consent.js` (in the `<head>` of every page) shows a banner on first visit and
loads the Meta Pixel `1489545563193733` only after Accept, with Meta's Limited Data Use flag set
before `init` + `PageView`. Decline, or no answer, means nothing is loaded from or sent to Meta and
no Meta cookies exist. The choice is stored in `localStorage` (`clairo_consent_v1`) and can be
changed from the footer "Cookie preferences" link (`[data-consent-open]`) on every page.
`privacy.dc.html` discloses all of this and is linked in every footer.

On a successful form submit, if consent was granted, the browser fires a `Lead` event with an
`eventID`, and `api/interest.js` posts the same `Lead` to Meta's Conversions API with that
`event_id` (and the LDU flag) so Meta deduplicates the pair. The server event carries only
attribution context (IP, user agent, `_fbp`/`_fbc` cookies, page URL) and is skipped unless the
browser reports `meta.consent === true`. **No form contents go to Meta**, and Advanced Matching is
deliberately off, in every form, per the compliance review
(`../META-ADVANCED-MATCHING-RESEARCH-2026-09-02.md`). Also confirm *Automatic* Advanced Matching is
toggled off in Events Manager; that is a dashboard setting, not code.

| Name | Required | Meaning |
|---|---|---|
| `META_CAPI_ACCESS_TOKEN` | for the server event | Events Manager → the pixel → Settings → Conversions API → Generate access token. Without it the server event is skipped and the browser pixel still works. |
| `META_PIXEL_ID` | no | Default `1489545563193733`. |
| `META_GRAPH_VERSION` | no | Default `v26.0`. |
| `META_CAPI_TEST_EVENT_CODE` | no | Set temporarily to the code shown in Events Manager → Test events to see server events there; remove afterwards. |

The Meta call is awaited with a 3s cap after the upstream accepts the lead, and can never fail the
form. Logs only status, never form contents.

## Analytics (added 2026-09-09)

**Vercel Web Analytics, not consent-gated.** `consent.js` injects
`<script defer src="/_vercel/insights/script.js"></script>` once, on every page, on load. The script is
first-party (same origin as the site), sets no cookies, stores nothing on the visitor's device, and
counts page views and referrers only; Vercel distinguishes visitors by a server-side hash that resets
daily and honors Do Not Track on its end, so there is no extra check in our code.

It is deliberately outside the consent banner: gating a cookieless first-party page-view counter behind
an Accept click would undercount most visitors and make the numbers useless. The switch is one line at
the top of `consent.js`:

```js
var VERCEL_ANALYTICS_REQUIRES_CONSENT = false;
```

Set it to `true` and analytics waits for the same Accept as the Meta Pixel. Nothing else changes. The
Meta Pixel stays consent-gated either way, and `privacy.dc.html` discloses both.

The tag is added in `consent.js` rather than in each page, because `consent.js` is already in the
`<head>` of all 11 pages. The script 404s until the toggle is on at
Vercel > Project > Analytics; that costs nothing and breaks nothing.
Dashboard: https://vercel.com/clairo1/website/analytics

`vercel.json` has no catch-all rewrite (every rewrite source is an exact clean path), so
`/_vercel/insights/*` is served by the platform and cannot be swallowed. Keep it that way: if a
catch-all is ever added, exclude `_vercel`.

### Current upstream (until go-live)

Base44 `submitInterestForm` — the app's own public interest-form function (the one the staff app's
`/interest` page calls; `carebridge1/base44/functions/submitInterestForm/entry.ts`). Anonymous by
design, so **no key**. Creates a `ClientPipeline` row with `pipeline_status: "interest"` (an
Interest tile), `matchmaker: true`, `has_jotform: false`, keyed by `family_email` (a repeat email
updates the existing tile). It hardcodes `source: "Maryland Interest Form"` and its `lead_source`
enum has no website value, so the relay prefixes the notes with
`Submitted via clairo.care website.` — that's how an admin tells a website tile from one made on
the staff app's own form.

`base44-webhook` mode (Logan's 2026-08-28 Base44 session; `clientPipelineWebhook?action=create`,
mapping in `carebridge1` commit `a413ed5`) is kept only in case the key ever turns up.

### Go-live (2026-08-31): point at the new platform

Either of these, **A preferred**:

- **A. Direct from the browser (no relay).** In `interest-form.js` set
  `endpoint: 'https://api.clairo.care/v1/functions/submitInterestForm'`. Requires
  `https://www.clairo.care` in the API's `ALLOWED_ORIGINS` (`clairo-platform/infra/lib/api-stack.ts:78`
  and the server's `ALLOWED_ORIGINS` env / `api/src/server/cors.ts:23`). The API rate-limits this
  route to 5/hour per source IP and ignores `x-forwarded-for`, so a direct post keeps that per
  visitor. No key involved.
- **B. Keep the relay.** Set `INTEREST_UPSTREAM=platform` on the Vercel project and redeploy. Works
  immediately, but every visitor then shares Vercel's egress IPs against that 5/hour limit.

The payload the browser builds is already the platform's `InterestFormRequest` shape
(`first_name`, `last_name`, `family_email`, `family_phone`, `county`, `service_route`,
`services_selected`, `has_caregiver_in_mind`, `services_needed_description`).

## Local check

```
INTEREST_BASE44_URL=http://localhost:9999/submitInterestForm vercel dev --listen 3999
```
then submit `http://localhost:3999/contact.dc.html` against a mock listener on `:9999`.
