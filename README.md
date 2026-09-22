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
                         emitted inline, and identical on all eleven pages — every hero is
                         the same two-column copy + photo layout
public/                  served at the site root, unchanged: consent.js, interest-form.js,
                         assets/, favicons, icons, site.webmanifest. NOTE: Vercel's Astro preset
                         serves everything under /assets/ with a one-year immutable cache, so if a
                         logo file ever changes, give it a new file name instead of replacing it
                         in place (browsers would keep the old one for up to a year).
assets-src/              camera-original photographs and the white Clairo lockup; source assets for
                         scripts/, deliberately outside public/ so they are never served
api/interest.js          Vercel serverless function, converted from CommonJS to ESM by the Astro port
vercel.json              framework: astro, the ten clean-URL rewrites, the two /ingest PostHog proxy
                         rewrites, and the legacy 308/307 redirects
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
became Astro components, and the header and footer were extracted into the layout with the three
things that genuinely differ per page as props: the active-nav underline, the footer tagline, and
the footer Waiver Services link order.

The parity gate for that port lives outside this repo (`scratchpad/parity` in the porting session):
full-page screenshots at 1280/900/390, the normalized DOM, `innerText`, and 17 computed styles per
button in both resting and hover state, for all 11 pages. Result: **0 differing pixels everywhere**,
identical text and computed styles. The rendered DOM differs only in `<head>`: nine unbundled
stylesheets became one bundled `/_astro/*.css`, and two whitespace-only text nodes disappeared with
the `support.js` and Claude Design script tags they used to sit next to.

### Photographs (restored 2026-09-14)

The stock photographs of participants and caregivers are part of eight of the pages: one in the
hero of each, and one beside each split copy section. `3ac7ce9` (2026-09-09) had removed all of
them; the office had only asked for the fake headshots next to reviews/testimonials to go, so
everything except those was put back and those eight pages now render exactly as they did before
that commit. What stays removed: `face-1..7.png`, and with them the three "A Clairo team
member" avatars in the contact page's "Real people. Real support." block. Do not re-add them.

Follow-up, done since: every page now sets a `<title>` and meta description through `Site.astro`
(`8a6a13f`).

## The one dynamic piece: the "Talk to Clairo" form

`src/pages/contact.astro` → `interest-form.js` (browser) → `api/interest.js` (Vercel function) →
CareBridge.

- **`interest-form.js`** collects the form, splits the name, maps labels to the values the backend
  stores (`service_route`, `services_selected`), folds anything without a column into the notes,
  and POSTs the canonical payload to `CLAIRO_INTEREST.endpoint` (default `/api/interest`).
- **`api/interest.js`** gates, validates, size-caps, and relays. It holds the relay secret so nothing
  secret is in the browser. Honeypot field `website` drops bots silently. It fails closed: if the
  configuration is incomplete it answers 503 and forwards nothing.

### Environment variables (Vercel → Settings → Environment Variables, Production)

**The relay fails closed.** It forwards nothing unless it is fully configured, so there is no
"default path" any more: in production `INTEREST_RELAY_SECRET` is required.

| Name | Required | Meaning |
|---|---|---|
| `INTEREST_UPSTREAM` | no | Unset or `platform`. Any other value is a misconfiguration: 503, nothing forwarded. The old `base44` and `base44-webhook` modes are gone. |
| `INTEREST_PLATFORM_URL` | production: no (default `https://api.clairo.care`). Everywhere else: **yes** | The platform base URL. Outside production the relay refuses to forward unless this is set explicitly, so a preview can never post a test lead at the production API by accident. |
| `INTEREST_RELAY_SECRET` | **yes** (Sensitive; production and preview) | Shared with the platform's `clairo/interest-relay-secret`. It is what lets the relay send `x-clairo-client-ip`, so the platform keys its rate limit on the visitor instead of Vercel's egress IP. Unset or empty means 503 and no forward. |

`INTEREST_BASE44_URL`, `INTEREST_BASE44_WEBHOOK_URL` and `CLIENT_PIPELINE_WEBHOOK_KEY` are gone with
the Base44 modes. If any of them are still set on the Vercel project, delete them; they do nothing.

If the relay is misconfigured the function answers 503 `{"ok":false,"error":"not_configured"}` and
the form shows its generic "we could not send your message, or email hello@clairo.care" copy. The
machine-readable codes are for the logs; `interest-form.js` only ever shows a server message that
reads as a sentence, so a family never sees `not_configured`.

### The gates on `/api/interest`

In order: 405 wrong method, 403 origin, 413 body over 64 KB, 200 honeypot, 429 rate limit, 400
validation, 503 configuration, then the forward (502 or 200). Nothing reaches the platform, and the
body is not even read, until the origin check has passed.

- **Origin.** Same-origin by design. `Origin` must resolve to exactly `https://www.clairo.care` or
  `https://clairo.care`; when `Origin` is missing or `null` the `Referer`'s origin is used against
  the same list. The comparison is an exact match on `new URL(...).origin`, never a prefix, so
  `https://www.clairo.care.evil.example` is refused. Anything else gets 403
  `{"ok":false,"error":"forbidden_origin"}`. No CORS headers are sent, on purpose.
  Outside production (`VERCEL_ENV !== 'production'`, so `vercel dev` and previews) `http://localhost:<port>`,
  `http://127.0.0.1:<port>` and the deployment's own `https://$VERCEL_URL` are accepted too.
- **Preview aliases are not allowlisted.** A POST to `https://clairo-website.vercel.app/api/interest`
  in production gets 403. That is deliberate: the form is only supported on the real domain. If a
  vanity alias ever needs to submit, add it to `ALLOWED_ORIGINS` in `api/interest.js` on purpose.
- **Rate limit.** 5 POSTs per IP per 10 minutes gets 429 `{"ok":false,"error":"rate_limited"}` with
  a `retry-after` header. It is an in-memory counter, so it is **best effort per warm instance**:
  Vercel runs several and recycles them. The platform's own 5/hour per IP and 3/day per email hash
  (keyed on the `x-clairo-client-ip` this relay sends) remain the authoritative limit. The honeypot
  is checked first, so bot traffic never eats a real visitor's budget.
- **Body cap.** 64 KB, enforced on the declared `content-length` and again while reading. Over that
  is 413 `{"ok":false,"error":"payload_too_large"}`.

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

Besides the two `/ingest/*` PostHog proxy rewrites, the only rewrites in `vercel.json` are the ten
exact page paths (`/about` -> `/about.html` and so on), so `/_vercel/insights/*` is served by the
platform and cannot be swallowed. Keep it that way: if a catch-all rewrite is ever added, exclude
`_vercel`.

### The upstream

The Clairo platform, and only the platform: POST
`{INTEREST_PLATFORM_URL}/v1/functions/submitInterestForm` with `x-clairo-relay-secret` and
`x-clairo-client-ip`. The Base44 modes were removed in R7 (dead vendor); there is nothing to fall
back to, by design.

The alternative is still to drop the relay and post straight from the browser to
`https://api.clairo.care/v1/functions/submitInterestForm` (set `endpoint` in `interest-form.js`),
which needs `https://www.clairo.care` in the API's `ALLOWED_ORIGINS`
(`clairo-platform/infra/lib/api-stack.ts:78` and the server's `ALLOWED_ORIGINS` env /
`api/src/server/cors.ts:23`). The relay exists so the platform can see the visitor's IP; a direct
post gets that for free but loses the server-side Meta event, which is why the relay is what ships.

The payload the browser builds is already the platform's `InterestFormRequest` shape
(`first_name`, `last_name`, `family_email`, `family_phone`, `county`, `service_route`,
`services_selected`, `has_caregiver_in_mind`, `services_needed_description`).

`participant_number` was removed from the contact form on 2026-09-16 (`2ab942a`), so the browser no
longer sends it. The relay and the platform still tolerate it if it ever comes back: free text,
trimmed, capped at 40 characters, its own column upstream (never folded into the notes). It
identifies a Medicaid participant, so it is never logged and never sent to Meta; the relay only ever
hands Meta the browser's `meta` block, never the form data.

## Local check

`npm run dev` and `npm run preview` serve the pages but not `api/interest.js` — that is a Vercel
function, so it needs `vercel dev`:

```
INTEREST_PLATFORM_URL=http://localhost:9999 INTEREST_RELAY_SECRET=dev-secret vercel dev --listen 3999
```

then submit `http://localhost:3999/contact` against a mock listener on `:9999` (it will receive
`POST /v1/functions/submitInterestForm`). Both variables are required outside production: with
either one missing the relay answers 503 and forwards nothing, so a local run can never reach
`api.clairo.care`. `http://localhost:<port>` is on the origin allowlist outside production, so the
browser's POST passes the origin gate; `curl` without an `Origin` header gets 403.

To exercise the form without a relay at all, intercept the POST in the browser devtools (or with
Playwright's `route`) and read the payload. Never point a test submit at production: it creates a
real lead in CareBridge.
