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
 *
 * Analytics: at each step this script dispatches a `clairo:interest` CustomEvent on document, which
 * public/analytics.js turns into a PostHog event. The detail carries only booleans, the service
 * labels that were ticked, and the route answer. It never carries the name, email, phone, county,
 * participant number, or notes text. Nothing here depends on analytics.js being present, so the form
 * keeps working on preview deployments, for visitors who declined, and when a blocker removes it.
 */
(function () {
  'use strict';

  var CLAIRO_INTEREST = {
    endpoint: '/api/interest',
    formSelector: 'form[data-interest-form]'
  };

  // Labels on the page → values the backend stores. Keep in sync with the /contact page (contact.dc.html).
  // The radio values are whole phrases ("Traditional services", "Self-Directed", "Not sure", "New to
  // DDA services"), so the lookup is on an exact prefix of the lower-cased label, not the whole
  // string. Anything else stays undefined and the label is kept verbatim in the notes below.
  var ROUTE_PREFIXES = [
    { prefix: 'traditional', value: 'traditional' },
    { prefix: 'self-directed', value: 'self_directed' }
  ];

  function normaliseRoute(label) {
    var lower = (label || '').toLowerCase();
    for (var i = 0; i < ROUTE_PREFIXES.length; i++) {
      if (lower.indexOf(ROUTE_PREFIXES[i].prefix) === 0) return ROUTE_PREFIXES[i].value;
    }
    return undefined;
  }

  var SERVICE_MAP = {
    'personal supports': 'Personal Supports',
    'community development services': 'Community Development',
    'community development': 'Community Development',
    'respite': 'Respite',
    'job supports': 'Job Supports'
  };
  var EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

  // State code -> county names. contact.astro inlines these from src/data/counties.mjs as
  // window.CLAIRO_COUNTIES before this script runs, so there is one list shared with api/interest.js.
  // Without the inline data (an old cached page, or a page that has no state select) the county
  // field is left alone and state/county are not checked here; the relay still validates.
  var COUNTIES = (window.CLAIRO_COUNTIES && typeof window.CLAIRO_COUNTIES === 'object') ? window.CLAIRO_COUNTIES : {};
  var HAS_COUNTIES = Object.keys(COUNTIES).length > 0;

  function hasOwn(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }

  function option(label, value) {
    var o = document.createElement('option');
    o.value = value;
    o.textContent = label;
    return o;
  }

  // Rebuild the county select for the chosen state. No state (the placeholder) disables it again.
  function syncCounties(form) {
    if (!HAS_COUNTIES || !form || !form.elements) return;
    var stateEl = form.elements.state;
    var countyEl = form.elements.county;
    if (!stateEl || !countyEl || !countyEl.options) return;
    var state = (stateEl.value || '').trim();
    var list = hasOwn(COUNTIES, state) ? COUNTIES[state] : null;
    while (countyEl.options.length) countyEl.remove(0);
    if (!list) {
      countyEl.appendChild(option('Select a state first', ''));
      countyEl.value = '';
      countyEl.disabled = true;
      return;
    }
    countyEl.appendChild(option('Select a county', ''));
    for (var i = 0; i < list.length; i++) countyEl.appendChild(option(list[i], list[i]));
    countyEl.value = '';
    countyEl.disabled = false;
  }

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
    var service_route = normaliseRoute(routeLabel);

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
      state: val(form, 'state') || undefined,
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
    if (!payload.first_name || !payload.last_name) {
      return { reason: 'name', message: 'Please enter your first and last name.' };
    }
    if (!EMAIL_RE.test(payload.family_email)) {
      return { reason: 'email', message: 'Please enter a valid email address.' };
    }
    if (HAS_COUNTIES) {
      if (!payload.state || !hasOwn(COUNTIES, payload.state)) {
        return { reason: 'state', message: 'Please select the state the participant lives in.' };
      }
      if (!payload.county || COUNTIES[payload.state].indexOf(payload.county) < 0) {
        return { reason: 'county', message: 'Please select the participant\'s county.' };
      }
    }
    return null;
  }

  /* ---------- analytics signals ---------- */

  // Fire and forget. analytics.js listens; if it is not on the page nothing happens.
  function emit(stage, props) {
    try {
      var detail = { stage: stage };
      Object.keys(props || {}).forEach(function (k) { detail[k] = props[k]; });
      document.dispatchEvent(new CustomEvent('clairo:interest', { detail: detail }));
    } catch (e) { /* older browsers, or no CustomEvent: analytics is never worth an error */ }
  }

  // The only form values that may leave this function are the service route, the service labels the
  // visitor ticked, and the caregiver yes/no answer. Everything else becomes a boolean.
  function safeProps(form, payload) {
    var caregivers = val(form, 'caregivers');
    var answer = caregivers === 'Yes' ? 'yes'
      : caregivers === 'No' ? 'no'
      : caregivers ? 'not_sure'
      : 'unanswered';
    var services = checkedValues(form, 'services');
    return {
      service_route: payload.service_route || 'unanswered',
      services_selected: services,
      services_count: services.length,
      has_caregiver_in_mind: answer,
      provided_phone: !!payload.family_phone,
      provided_county: !!payload.county,
      provided_participant_number: !!payload.participant_number,
      provided_notes: !!val(form, 'notes'),
      consent_granted: !!(window.clairoConsent && window.clairoConsent.granted())
    };
  }

  function isInterestField(el) {
    var form = el && el.form;
    return !!(form && form.matches && form.matches(CLAIRO_INTEREST.formSelector) && el.name && el.name !== 'website');
  }

  var formStarted = false;
  var fieldsSeen = {};

  function markStarted(e) {
    if (formStarted || !isInterestField(e.target)) return;
    formStarted = true;
    emit('started');
  }
  document.addEventListener('focusin', markStarted);
  document.addEventListener('input', markStarted);

  function fieldFilled(el) {
    if (el.type === 'checkbox' || el.type === 'radio') return el.checked;
    return !!(el.value || '').trim();
  }

  function markCompleted(e) {
    var el = e.target;
    if (!isInterestField(el)) return;
    if (fieldsSeen[el.name]) return;
    if (!fieldFilled(el)) return;
    fieldsSeen[el.name] = true;
    emit('field_completed', { field: el.name });
  }
  document.addEventListener('focusout', markCompleted);
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el && el.name === 'state' && isInterestField(el)) syncCounties(el.form);
    markCompleted(e);
  });

  // Back navigation can restore the chosen state while the county list is still the placeholder,
  // so rebuild it once now. The script is deferred, so the form is already parsed.
  if (HAS_COUNTIES && document.querySelector) {
    var initialForm = document.querySelector(CLAIRO_INTEREST.formSelector);
    if (initialForm && initialForm.elements && initialForm.elements.state && initialForm.elements.state.value) {
      syncCounties(initialForm);
    }
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
    emit('submit_attempted');
    var problem = validate(payload);
    if (problem) {
      setStatus(form, problem.message, 'error');
      emit('validation_failed', { reason: problem.reason });
      return;
    }
    payload.meta = metaContext();
    var submitProps = safeProps(form, payload);

    var button = form.querySelector('button[type="submit"]');
    var originalLabel = button ? button.textContent : '';
    // null until the response headers arrive, so a thrown fetch reads as a network failure.
    var lastStatus = null;
    inFlight = true;
    if (button) { button.disabled = true; button.textContent = 'Sending…'; }
    setStatus(form, '');

    fetch(CLAIRO_INTEREST.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify(payload)
    }).then(function (res) {
      lastStatus = res.status;
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.ok && data && data.ok !== false) {
          showThanks(form);
          emit('submitted', submitProps);
          if (payload.meta.consent) trackLead(payload.meta.event_id);
          return;
        }
        throw new Error((data && data.error) || 'request failed');
      });
    }).catch(function (err) {
      emit('failed', { error_kind: lastStatus === null ? 'network' : 'server', status: lastStatus });
      setStatus(form,
        // A server message is shown only when it reads as a sentence. The gates answer with machine
        // codes (forbidden_origin, rate_limited, not_configured, payload_too_large); those have no
        // whitespace, so they fall through to the generic copy instead of reaching a family.
        (err && err.message && /[a-z]/i.test(err.message) && /\s/.test(err.message) && err.message.length < 200 && err.message !== 'request failed' && err.message !== 'Failed to fetch')
          ? err.message
          : 'We could not send your message. Please try again, or email hello@clairo.care.',
        'error');
      if (button) { button.disabled = false; button.textContent = originalLabel; }
    }).then(function () { inFlight = false; });
  });

  CLAIRO_INTEREST.normaliseRoute = normaliseRoute;
  CLAIRO_INTEREST.counties = COUNTIES;
  CLAIRO_INTEREST.validate = validate;
  window.CLAIRO_INTEREST = CLAIRO_INTEREST;
})();
