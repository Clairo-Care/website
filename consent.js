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
 */
(function () {
  'use strict';

  var KEY = 'clairo_consent_v1';
  var PIXEL_ID = '1489545563193733';
  var PRIVACY_URL = 'privacy.dc.html';

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
      'We use a Meta (Facebook) advertising pixel to understand how families find Clairo and to measure our ads. ' +
      'It is off until you accept. We never share what you type into our forms with Meta. '
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

  function acceptAll() { write('granted'); hide(); loadPixel(); }
  function declineAll() { write('denied'); hide(); }

  /* Footer "Cookie preferences" link (any element with data-consent-open) reopens the banner. */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-consent-open]') : null;
    if (!t) return;
    e.preventDefault();
    show();
  });

  window.clairoConsent = { status: status, granted: granted, open: show, accept: acceptAll, decline: declineAll };

  var s = status();
  if (s === 'granted') loadPixel();
  else if (s === null) show();
})();
