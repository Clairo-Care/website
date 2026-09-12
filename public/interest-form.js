/* "Talk to Clairo" form (/contact) → interest lead.
 *
 * The page body is a Claude Design template that support.js re-renders through React, so this
 * script lives OUTSIDE <x-dc> and listens at the document level (submit events bubble past React's
 * root). It builds the canonical payload the new platform's `submitInterestForm` accepts and posts
 * it to CLAIRO_INTEREST.endpoint.
 *
 * Meta: each submission carries a `meta` block (event id + the pixel's _fbp/_fbc cookies + page
 * URL). The relay sends the same Lead to Meta's Conversions API with that event id, and the browser
 * fires fbq('track','Lead') with the same id, so Meta counts one lead, not two. Nothing the family
 * typed is in the `meta` block, and the relay never forwards form contents to Meta. Both events are
 * skipped unless the visitor accepted tracking in the consent banner (consent.js).
 *
 * endpoint:
 *   '/api/interest'  — same-origin relay (api/interest.js) that holds the Base44 key. Current.
 *   'https://api.clairo.care/v1/functions/submitInterestForm' — post straight to the new API once
 *   www.clairo.care is in its ALLOWED_ORIGINS (go-live 2026-08-31). No key, and the API's per-IP
 *   rate limit then applies per visitor instead of to Vercel's shared egress IPs.
 */
(function () {
  'use strict';

  var CLAIRO_INTEREST = {
    endpoint: '/api/interest',
    formSelector: 'form[data-interest-form]'
  };

  // Labels on the page → values the backend stores. Keep in sync with the /contact page (contact.dc.html).
  var ROUTE_MAP = { 'traditional': 'traditional', 'self-directed': 'self_directed' };
  var SERVICE_MAP = {
    'personal supports': 'Personal Supports',
    'community development services': 'Community Development',
    'community development': 'Community Development',
    'respite': 'Respite',
    'job supports': 'Job Supports'
  };
  var EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

  function val(form, name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.length !== undefined && !el.value) { // RadioNodeList with nothing checked
      for (var i = 0; i < el.length; i++) if (el[i].checked) return el[i].value.trim();
      return '';
    }
    return (el.value || '').trim();
  }

  function checkedValues(form, name) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + name + '"]:checked'),
      function (c) { return c.value.trim(); }
    );
  }

  function buildPayload(form) {
    var name = val(form, 'name').replace(/\s+/g, ' ');
    var parts = name.split(' ');
    var first_name = parts[0] || '';
    var last_name = parts.slice(1).join(' ');

    var routeLabel = val(form, 'route');
    var service_route = ROUTE_MAP[routeLabel.toLowerCase()];

    var services_selected = [];
    var extraServices = [];
    checkedValues(form, 'services').forEach(function (label) {
      var mapped = SERVICE_MAP[label.toLowerCase()];
      if (mapped) { if (services_selected.indexOf(mapped) < 0) services_selected.push(mapped); }
      else if (extraServices.indexOf(label) < 0) extraServices.push(label);
    });

    var caregiversLabel = val(form, 'caregivers');
    var has_caregiver_in_mind = caregiversLabel === 'Yes' ? true : caregiversLabel === 'No' ? false : undefined;

    // Everything the backend has no column for goes into the notes so nothing the family told us is lost.
    var notes = [];
    var free = val(form, 'notes');
    if (free) notes.push(free);
    if (routeLabel && !service_route) notes.push('Describes themselves as: ' + routeLabel + '.');
    if (extraServices.length) notes.push('Also interested in: ' + extraServices.join(', ') + '.');
    if (caregiversLabel && has_caregiver_in_mind === undefined) notes.push('Existing caregivers to keep: ' + caregiversLabel + '.');

    return {
      first_name: first_name,
      last_name: last_name,
      family_email: val(form, 'email').toLowerCase(),
      family_phone: val(form, 'phone') || undefined,
      county: val(form, 'county') || undefined,
      // State waiver participant / department number. Has its own column upstream, so it is NOT folded into the notes.
      participant_number: val(form, 'participant_number').slice(0, 40) || undefined,
      service_route: service_route,
      services_selected: services_selected.length ? services_selected : undefined,
      has_caregiver_in_mind: has_caregiver_in_mind,
      services_needed_description: notes.length ? notes.join(' ') : undefined,
      website: val(form, 'website') // honeypot; humans leave it empty
    };
  }

  function cookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }

  function eventId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'lead-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  // Ad-attribution context for the Conversions API. Only populated when the visitor accepted tracking
  // (consent.js); otherwise the relay gets `consent:false` and sends nothing to Meta. _fbc is set by
  // the pixel when the visitor arrived with an fbclid; if the pixel's script was blocked by the browser
  // we rebuild it from the URL in Meta's documented format.
  function metaContext() {
    var consented = !!(window.clairoConsent && window.clairoConsent.granted());
    if (!consented) return { event_id: eventId(), consent: false };
    var fbc = cookie('_fbc');
    if (!fbc) {
      var m = location.search.match(/[?&]fbclid=([^&#]+)/);
      if (m) fbc = 'fb.1.' + Date.now() + '.' + decodeURIComponent(m[1]);
    }
    return {
      event_id: eventId(),
      consent: true,
      fbp: cookie('_fbp') || undefined,
      fbc: fbc || undefined,
      source_url: location.href
    };
  }

  function validate(payload) {
    if (!payload.first_name || !payload.last_name) return 'Please enter your first and last name.';
    if (!EMAIL_RE.test(payload.family_email)) return 'Please enter a valid email address.';
    return null;
  }

  function setStatus(form, message, kind) {
    var el = form.querySelector('[data-interest-status]');
    if (!el) return;
    el.textContent = message || '';
    el.hidden = !message;
    el.style.color = kind === 'error' ? '#b42318' : 'var(--muted-foreground)';
  }

  function showThanks(form) {
    form.innerHTML =
      '<div role="status" style="display:flex; flex-direction:column; gap:12px; padding:8px 0">' +
        '<p class="clairo-eyebrow" style="margin:0">Message received</p>' +
        '<h2 style="margin:0; font-size:clamp(22px,2.6vw,28px); line-height:1.15; font-weight:800; letter-spacing:-.03em; color:var(--clairo-navy)">Thanks — we\'ll be in touch within one business day.</h2>' +
        '<p style="margin:0; font-size:15px; line-height:25px; color:var(--muted-foreground); max-width:46ch">A member of the Clairo team will reach out by email or phone. If it\'s urgent, call <a href="tel:2406211353" style="font-weight:700">(240) 621-1353</a>.</p>' +
      '</div>';
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Meta Pixel standard event, fired only after the backend accepts the lead. No parameters on
  // purpose: nothing the family typed (name, email, phone, services needed) is sent to Meta.
  // The eventID matches the server-side Conversions API event so Meta deduplicates the pair.
  function trackLead(id) {
    try {
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', {}, id ? { eventID: id } : undefined);
    } catch (e) { /* never block the thank-you */ }
  }

  var inFlight = false;

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.matches || !form.matches(CLAIRO_INTEREST.formSelector)) return;
    e.preventDefault();
    if (inFlight) return;

    var payload = buildPayload(form);
    var problem = validate(payload);
    if (problem) { setStatus(form, problem, 'error'); return; }
    payload.meta = metaContext();

    var button = form.querySelector('button[type="submit"]');
    var originalLabel = button ? button.textContent : '';
    inFlight = true;
    if (button) { button.disabled = true; button.textContent = 'Sending…'; }
    setStatus(form, '');

    fetch(CLAIRO_INTEREST.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.ok && data && data.ok !== false) { showThanks(form); if (payload.meta.consent) trackLead(payload.meta.event_id); return; }
        throw new Error((data && data.error) || 'request failed');
      });
    }).catch(function (err) {
      setStatus(form,
        (err && err.message && /[a-z]/i.test(err.message) && err.message.length < 200 && err.message !== 'request failed' && err.message !== 'Failed to fetch')
          ? err.message
          : 'We could not send your message. Please try again, or email hello@clairo.care.',
        'error');
      if (button) { button.disabled = false; button.textContent = originalLabel; }
    }).then(function () { inFlight = false; });
  });

  window.CLAIRO_INTEREST = CLAIRO_INTEREST;
})();
