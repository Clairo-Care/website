/* Tracking consent gate for www.clairo.care. Loaded in the <head> of every page.
 *
 * The Meta Pixel is NOT on the page until the visitor clicks Accept. Before that, nothing is loaded
 * from Meta, no Meta cookies are set, and no request of any kind goes to Meta. A decline is remembered
 * too, so the banner does not nag. Either choice can be changed from the "Cookie preferences" link in
 * the footer, which reopens this banner.
 *
 * When consent is granted the pixel is loaded with Meta's Limited Data Use flag (geolocation mode), then
 * init + PageView. interest-form.js checks window.clairoConsent.granted() before telling the relay it may
 * send the server-side Lead event, so the Conversions API honors the same choice.
 *
 * The choice lives in localStorage (key below) on the visitor's own device. Nothing about it is sent to
 * us or to Meta.
 *
 * This file also loads Vercel Web Analytics, which is a different kind of thing and is NOT gated by the
 * banner. See VERCEL_ANALYTICS_REQUIRES_CONSENT below.
 *
 * Google Tag Manager (added 2026-09-10 for Mark, container GTM-PB44CLV2, which carries Google Analytics
 * G-RZ3W0PCVQB) loads on every page but under Google Consent Mode v2 with every storage type DENIED by
 * default. In that state Google's tags set no cookies and send only anonymous, cookieless pings
 * (page counts, no identifiers). Accept on the banner upgrades consent to granted, the same click that
 * loads the Meta Pixel, and Decline leaves it denied. So the analytics counter works for everyone, like
 * Vercel's, while cookies and cross-visit identifiers still wait for an Accept, like Meta's.
 */
(function () {
  'use strict';

  var KEY = 'clairo_consent_v1';
  var PIXEL_ID = '1489545563193733';
  var GTM_ID = 'GTM-PB44CLV2';
  var PRIVACY_URL = '/privacy';

  /* Vercel Web Analytics: one switch, decided 2026-09-09.
   *
   * false = load it on every page view, without asking. That is the setting, because it is a
   * first-party script served from our own origin (/_vercel/insights/script.js), it sets no cookies,
   * it stores nothing on the visitor's device, and it never identifies a person: Vercel counts page
   * views and referrers, and tells one visitor from another only by a hash it computes on its own
   * servers and throws away daily. Putting a counter like that behind an Accept click would miss most
   * visitors and leave us with numbers nobody could use, and the whole point is to know how many
   * people reach the site and where they came from.
   *
   * Flip to true and analytics waits for the same Accept as the Meta Pixel. Nothing else to change.
   */
  var VERCEL_ANALYTICS_REQUIRES_CONSENT = false;

  function read() {
    try { var v = localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function write(status) {
    try { localStorage.setItem(KEY, JSON.stringify({ status: status, at: new Date().toISOString() })); } catch (e) { /* private mode: choice lasts for this page only */ }
  }
  function status() { var c = read(); return c && (c.status === 'granted' || c.status === 'denied') ? c.status : null; }
  function granted() { return status() === 'granted'; }

  var pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded) return;
    pixelLoaded = true;
    /* Meta Pixel base code, unchanged apart from the LDU line. */
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    // Limited Data Use, geolocation mode: Meta applies its state-law processing limits based on
    // where the visitor is. Must run before init.
    window.fbq('dataProcessingOptions', ['LDU'], 0, 0);
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* Google Consent Mode v2. `gtag` here is the standard shim: it queues into dataLayer, which GTM
   * reads once it loads, so the default MUST be pushed before the container script is added. */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  function consentSignal(grantedNow) {
    var v = grantedNow ? 'granted' : 'denied';
    return { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v,
      functionality_storage: v, personalization_storage: v, security_storage: 'granted' };
  }

  var gtmLoaded = false;
  function loadGtm(grantedNow) {
    if (gtmLoaded) return;
    gtmLoaded = true;
    gtag('consent', 'default', consentSignal(grantedNow));
    /* Google Tag Manager base snippet, unchanged apart from the id living in GTM_ID. */
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',GTM_ID);
  }
  function updateGtmConsent(grantedNow) { gtag('consent', 'update', consentSignal(grantedNow)); }

  var vercelAnalyticsLoaded = false;
  function loadVercelAnalytics() {
    if (vercelAnalyticsLoaded) return;
    vercelAnalyticsLoaded = true;
    var t = document.createElement('script');
    t.defer = true;
    t.src = '/_vercel/insights/script.js';
    (document.head || document.documentElement).appendChild(t);
  }

  /* ---------- banner ---------- */

  var banner = null;

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'style') n.style.cssText = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function buttonStyle(primary) {
    return 'font:inherit; font-size:13.5px; font-weight:650; padding:10px 18px; border-radius:var(--radius-full, 999px); cursor:pointer; min-height:40px; ' +
      (primary
        ? 'background:var(--clairo-navy, #0b2545); color:#fff; border:1px solid var(--clairo-navy, #0b2545);'
        : 'background:#fff; color:var(--clairo-navy, #0b2545); border:1px solid var(--border, #d9dee7);');
  }

  function buildBanner() {
    var text = el('p', {
      style: 'margin:0; font-size:13.5px; line-height:21px; color:var(--muted-foreground, #4b5563); max-width:62ch',
    });
    text.appendChild(document.createTextNode(
      'We use Google Analytics and a Meta (Facebook) advertising pixel to understand how families find Clairo and to measure our ads. ' +
      'Until you accept, Google counts visits without cookies and Meta gets nothing. We never share what you type into our forms with either. '
    ));
    var link = el('a', { href: PRIVACY_URL, text: 'Privacy Policy', style: 'font-weight:650; color:var(--clairo-blue, #1d6fd1)' });
    text.appendChild(link);
    text.appendChild(document.createTextNode('.'));

    var accept = el('button', { type: 'button', text: 'Accept', 'data-consent-accept': '', style: buttonStyle(true) });
    var decline = el('button', { type: 'button', text: 'Decline', 'data-consent-decline': '', style: buttonStyle(false) });
    var actions = el('div', { style: 'display:flex; gap:10px; flex-wrap:wrap; flex-shrink:0' }, [decline, accept]);

    var inner = el('div', {
      class: 'clairo-shell',
      style: 'display:flex; gap:20px; align-items:center; justify-content:space-between; flex-wrap:wrap; padding-top:16px; padding-bottom:16px; max-width:1152px; margin:0 auto; padding-left:24px; padding-right:24px',
    }, [text, actions]);

    var wrap = el('div', {
      id: 'clairo-consent',
      role: 'dialog',
      'aria-label': 'Cookie and tracking choices',
      'aria-live': 'polite',
      style: 'position:fixed; left:0; right:0; bottom:0; z-index:1000; background:#fff; border-top:1px solid var(--border, #d9dee7); box-shadow:0 -8px 30px rgba(11,37,69,.08); font-family:var(--font-sans, system-ui, sans-serif)',
    }, [inner]);

    accept.addEventListener('click', acceptAll);
    decline.addEventListener('click', declineAll);
    return wrap;
  }

  function show() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', show); return; }
    if (!banner) banner = buildBanner();
    if (!banner.parentNode) document.body.appendChild(banner);
    banner.hidden = false;
    var first = banner.querySelector('[data-consent-accept]');
    if (first) first.focus({ preventScroll: true });
  }
  function hide() { if (banner) banner.hidden = true; }

  function acceptAll() {
    write('granted');
    hide();
    loadPixel();
    updateGtmConsent(true);
    if (VERCEL_ANALYTICS_REQUIRES_CONSENT) loadVercelAnalytics();
  }
  function declineAll() { write('denied'); hide(); updateGtmConsent(false); }

  /* Footer "Cookie preferences" link (any element with data-consent-open) reopens the banner. */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-consent-open]') : null;
    if (!t) return;
    e.preventDefault();
    show();
  });

  window.clairoConsent = { status: status, granted: granted, open: show, accept: acceptAll, decline: declineAll };

  var s = status();
  loadGtm(s === 'granted');
  if (s === 'granted') loadPixel();
  else if (s === null) show();

  if (!VERCEL_ANALYTICS_REQUIRES_CONSENT || s === 'granted') loadVercelAnalytics();
})();
