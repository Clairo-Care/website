/* PostHog product analytics for www.clairo.care. Loaded in the <head> of every page, but only on
 * production builds: src/layouts/Site.astro emits this <script> tag only when VERCEL_ENV is
 * "production", so preview deployments and local dev never ship it.
 *
 * Two gates, on purpose:
 *   1. Build time (Site.astro): the tag is absent from preview and local builds.
 *   2. Run time (below): the script returns immediately unless the hostname is clairo.care or
 *      www.clairo.care, so a copy of dist/ opened anywhere else stays silent.
 *
 * Consent. PostHog starts in memory-only persistence, which is the same posture Google Tag Manager
 * has here under Consent Mode: visits are counted, nothing is written to the visitor's device, and
 * no identifier survives the tab. Session replay stays off entirely until Accept. Clicking Accept on
 * the banner (consent.js) upgrades persistence to a first-party cookie plus localStorage and starts
 * replay with every input masked. Clicking Decline keeps memory-only and stops replay.
 *
 * Requests go to /ingest on this domain, which vercel.json reverse-proxies to PostHog US. That keeps
 * the traffic first-party and out of the way of tracker blockers.
 *
 * Nothing a visitor types is ever sent. The form events below carry booleans and the service labels
 * the visitor ticked, never the name, email, phone, county, participant number, or notes text.
 */
(function () {
  'use strict';

  var HOSTS = ['www.clairo.care', 'clairo.care'];
  if (HOSTS.indexOf(location.hostname) < 0) {
    window.clairoAnalytics = { capture: function () {} };
    return;
  }

  var KEY = 'phc_mx5QhmCgJzLV9KUqEau6cYag8Xgi3xYP8ibwS3aBb2Ae'; // public project key, safe in client code
  var API_HOST = '/ingest';
  var UI_HOST = 'https://us.posthog.com';

  /* posthog-js loader snippet, unmodified. It stubs the API and pulls array.js from
   * api_host + "/static/array.js", which is /ingest/static/array.js here. */
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  function consented() {
    try { return !!(window.clairoConsent && window.clairoConsent.granted()); } catch (e) { return false; }
  }

  var startedGranted = consented();

  window.posthog.init(KEY, {
    api_host: API_HOST,
    ui_host: UI_HOST,
    persistence: startedGranted ? 'localStorage+cookie' : 'memory',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    capture_performance: { web_vitals: true },
    // Replay waits for Accept. Until then the banner's promise holds: PostHog counts visits and
    // nothing is written to the visitor's device.
    disable_session_recording: !startedGranted,
    session_recording: { maskAllInputs: true, maskInputOptions: { password: true } },
    capture_dead_clicks: true
  });

  function capture(name, props) {
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(name, props || {});
      }
    } catch (e) { /* analytics must never break the page */ }
  }

  window.clairoAnalytics = { capture: capture };

  /* ---------- consent changes ---------- */

  document.addEventListener('clairo:consent', function (e) {
    var status = e && e.detail && e.detail.status;
    try {
      if (status === 'granted') {
        window.posthog.set_config({ persistence: 'localStorage+cookie' });
        window.posthog.startSessionRecording();
        capture('consent_accepted');
      } else if (status === 'denied') {
        window.posthog.stopSessionRecording();
        window.posthog.set_config({ persistence: 'memory' });
        capture('consent_declined');
      }
    } catch (err) { /* ignore */ }
  });

  /* ---------- delegated link tracking ---------- */

  function trim80(s) {
    s = (s || '').replace(/\s+/g, ' ').trim();
    return s.length > 80 ? s.slice(0, 80) : s;
  }

  function sectionIndex(node) {
    var section = node.closest ? node.closest('section') : null;
    if (!section) return null;
    var all = document.querySelectorAll('section');
    for (var i = 0; i < all.length; i++) if (all[i] === section) return { index: i + 1, el: section };
    return null;
  }

  function nearestHeading(section, node) {
    if (!section) return '';
    var heads = section.querySelectorAll('h1, h2');
    var best = '';
    for (var i = 0; i < heads.length; i++) {
      var pos = heads[i].compareDocumentPosition(node);
      // node comes after this heading, or the heading contains the node
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING || pos & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        best = heads[i].textContent;
      }
    }
    return trim80(best);
  }

  function context(node) {
    var out = { page: location.pathname };
    if (!node || !node.closest) return out;
    if (node.closest('#clairo-consent')) { out.location = 'consent'; return out; }
    if (node.closest('header')) { out.location = 'header'; return out; }
    if (node.closest('footer')) { out.location = 'footer'; return out; }
    var s = sectionIndex(node);
    if (s) {
      out.location = 'section:' + s.index;
      var h = nearestHeading(s.el, node);
      if (h) out.heading = h;
      return out;
    }
    out.location = 'page';
    return out;
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var opener = t.closest('[data-consent-open]');
    if (opener) { capture('cookie_preferences_opened', context(opener)); return; }

    var a = t.closest('a[href]');
    if (!a) return;

    var raw = a.getAttribute('href') || '';
    var props = context(a);
    props.text = trim80(a.textContent);

    if (raw.indexOf('tel:') === 0) { delete props.text; capture('phone_link_clicked', props); return; }
    if (raw.indexOf('mailto:') === 0) { delete props.text; capture('email_link_clicked', props); return; }

    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    if (url.hostname === 'staff.clairo.care') {
      props.href = url.href;
      capture('intake_link_clicked', props);
      return;
    }
    if (url.hostname !== location.hostname) {
      props.href = url.href;
      capture('outbound_link_clicked', props);
      return;
    }
    if (url.pathname === '/contact' || url.pathname === '/contact.html') {
      capture('contact_cta_clicked', props);
    }
  }, true);

  /* ---------- Talk to Clairo form ---------- */

  var FORM_EVENTS = {
    started: 'interest_form_started',
    field_completed: 'interest_form_field_completed',
    submit_attempted: 'interest_form_submit_attempted',
    validation_failed: 'interest_form_validation_failed',
    submitted: 'interest_form_submitted',
    failed: 'interest_form_failed'
  };

  document.addEventListener('clairo:interest', function (e) {
    var detail = (e && e.detail) || {};
    var name = FORM_EVENTS[detail.stage];
    if (!name) return;
    var props = {};
    Object.keys(detail).forEach(function (k) { if (k !== 'stage') props[k] = detail[k]; });
    props.page = location.pathname;
    capture(name, props);
  });
})();
