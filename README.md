# clairo.care — marketing site

Astro 5, static output. Hosted on Vercel (team `clairo1`, project `website`, production
`https://www.clairo.care`). Push to `main` deploys; any other branch gets a preview URL.

```bash
npm install
npm run dev        # http://localhost:4321, hot reload
npm run build      # -> dist/
npm run preview    # serves dist/ with clean URLs, same shape as production
```

## Layout

```
src/pages/*.astro        one file per URL: index (/), about, caregivers, contact, faq,
                         how-it-works, privacy, self-directed-services,
                         traditional-services, wages-and-benefits, waiver-services
src/layouts/Site.astro   <head>, sticky header, footer; the page fills the <slot />
src/components/          Button.astro (the design-system button), Logo.astro (header lockup)
src/styles/tokens/*.css  the seven design-system token files, byte-identical to the
                         Clairo Care design system export; fonts.css @imports Manrope
src/styles/button.css    the design-system Button, as classes instead of inline styles
src/styles/site.css      the page CSS that used to be an inline <style> per page. Still
                         emitted inline, per page: the two /*PAGE-…*/ markers are where the
                         layout splices in the hero rules that only some pages may have
public/                  served at the site root, unchanged: consent.js, interest-form.js,
                         assets/, favicons, icons, site.webmanifest
api/interest.js          Vercel serverless function, untouched by the Astro port
vercel.json              framework: astro, the ten clean-URL rewrites, and the legacy 308/307 redirects
```

Two settings in `astro.config.mjs` are load-bearing:

- `build.format: 'file'` emits `/about.html`, not `/about/index.html`, so the relative asset URLs
  inherited from the old export (`src="assets/logo-lockup-navy.png"`) keep resolving to
  `/assets/...`. The `rewrites` in `vercel.json` map `/about` to `/about.html` — the same mechanism
  and URL shape the site has always had, with no trailing-slash variant. Do not switch this to
  `"cleanUrls": true`: Vercel emits its own `*.html -> /*` redirect ahead of the `redirects` list, so
  `/About.dc.html` would be sent to `/About.dc` (a 404) instead of `/about`.
- `compressHTML: false`. Astro's default collapses whitespace, which changes the rendered DOM. The
  port is verified against the live site's DOM node for node, so it has to stay off.

### Ported from Claude Design (2026-09-12)

The site used to be `*.dc.html` files that a React runtime (`support.js`) re-rendered in the
browser, plus a `_ds/` design-system bundle. All of that is gone. The markup in `src/` is the
**rendered** DOM of the live pages, copied verbatim — inline styles, `href=""` placeholders, copy
and all — so nothing about the pages changed. Only the two design-system components (Button, Logo)
became Astro components, and the header and footer were extracted into the layout with the four
things that genuinely differ per page as props: the active-nav underline, the footer tagline, the
footer Waiver Services link order, and which hero CSS the page needs.

The parity gate for that port lives outside this repo (`scratchpad/parity` in the porting session):
full-page screenshots at 1280/900/390, the normalized DOM, `innerText`, and 17 computed styles per
button in both resting and hover state, for all 11 pages. Result: **0 differing pixels everywhere**,
identical text and computed styles. The rendered DOM differs only in `<head>`: nine unbundled
stylesheets became one bundled `/_astro/*.css`, and two whitespace-only text nodes disappeared with
the `support.js` and Claude Design script tags they used to sit next to.

Follow-up, deliberately not part of the port: ten of the eleven pages still have no `<title>` or
meta description. Only `/privacy` has one.

## The one dynamic piece: the "Talk to Clairo" form

`src/pages/contact.astro` → `interest-form.js` (browser) → `api/interest.js` (Vercel function) →
CareBridge.

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
`src/pages/privacy.astro` discloses all of this and is linked in every footer.

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
Meta Pixel stays consent-gated either way, and `src/pages/privacy.astro` discloses both.

The tag is added in `consent.js` rather than in each page, because `consent.js` is already in the
`<head>` of all 11 pages. The script 404s until the toggle is on at
Vercel > Project > Analytics; that costs nothing and breaks nothing.
Dashboard: https://vercel.com/clairo1/website/analytics

## Google Tag Manager + Google Analytics (added 2026-09-10)

Mark's request (#website, 2026-09-10): container `GTM-PB44CLV2`, which carries the GA4 property
`G-RZ3W0PCVQB`. `consent.js` loads the standard GTM snippet on every page, but only after pushing a
**Google Consent Mode v2 default of denied** for every storage type (`ad_storage`, `analytics_storage`,
`ad_user_data`, `ad_personalization`, and the two functional ones; `security_storage` granted). In that
state Google's tags set no cookies and send cookieless pings only, so the visit counts work for every
visitor, like Vercel's, while cookies and cross-visit identifiers wait for the banner's Accept, like the
Meta Pixel. Accept pushes `consent update granted`; Decline pushes `denied`; a returning visitor who
already accepted gets `default granted` before GTM loads. The GA4 tag inside the container needs no
extra configuration for this: Google tags honor the consent signals natively.

The `<noscript>` iframe from Google's instructions is deliberately NOT on the pages: it would load the
container with no consent handling at all for the near-zero visitors who have JavaScript off.

`src/pages/privacy.astro` discloses it under Cookies (a "Google Analytics" block) and in the overview and sharing
paragraphs. The banner copy names Google Analytics alongside Meta.

The only rewrites in `vercel.json` are the ten exact page paths (`/about` -> `/about.html` and so
on), so `/_vercel/insights/*` is served by the platform and cannot be swallowed. Keep it that way: if
a catch-all rewrite is ever added, exclude `_vercel`.

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
(`first_name`, `last_name`, `family_email`, `family_phone`, `county`, `participant_number`,
`service_route`, `services_selected`, `has_caregiver_in_mind`, `services_needed_description`).

`participant_number` (added 2026-09-09, P7) is the optional state waiver participant / department
number as issued by MD DDA or PA ODP: free text, trimmed, capped at 40 characters, omitted when
blank. It has its own column upstream, so it is not folded into the notes. It identifies a Medicaid
participant, so it is never logged and never sent to Meta; the relay only ever hands Meta the
browser's `meta` block, never the form data. The `base44` upstream adapter drops it (that mode is
retired).

## Local check

`npm run dev` and `npm run preview` serve the pages but not `api/interest.js` — that is a Vercel
function, so it needs `vercel dev`:

```
INTEREST_BASE44_URL=http://localhost:9999/submitInterestForm vercel dev --listen 3999
```

then submit `http://localhost:3999/contact` against a mock listener on `:9999`.

To exercise the form without a relay at all, intercept the POST in the browser devtools (or with
Playwright's `route`) and read the payload. Never point a test submit at production: it creates a
real lead in CareBridge.
