// Shared consent-state probe - siterefiring (CT-1021)
//
// Deliberately CMP-agnostic: a consent decision counts as "recorded" once a cookie or storage
// key that looks like a consent record appears or CHANGES. That keeps both the rogue and the
// compliant vendor on this site working against whatever banner you point them at, instead of
// binding the test pages to one SDK's API.
//
// Why it compares against a stored baseline rather than just looking for consent-ish keys:
// every test site on this domain shares one origin, and a dozen of them set
// `cookieconsent_status` or `usprivacy` at `path=/` with a one-year max-age. Visiting any of
// them once would otherwise leave this page convinced a decision had already been taken. So
// the first load of a page records whatever consent-ish state already exists as its baseline,
// and only a departure from that baseline counts as a decision taken here.
//
// The baseline lives in sessionStorage, keyed by path: it survives the reloads and repeat
// navigations within one scan session, is separate for the rogue and compliant variants, and
// starts clean in every new tab or scan. When sessionStorage is unavailable the probe simply
// never reports a decision, and the vendor stays in its pre-decision behaviour.

(function () {
  'use strict';

  var KEY_RE = /consent|cmp|gdpr|ccpa|usprivacy|euconsent|gpp/i;
  var BASELINE_KEY = '__vendor_consent_baseline:' + window.location.pathname;

  function fingerprint() {
    var parts = [];
    try {
      document.cookie.split(';').forEach(function (pair) {
        var name = pair.split('=')[0].trim();
        if (name && KEY_RE.test(name)) parts.push('c:' + pair.trim());
      });
    } catch (e) { /* cookies unavailable - fall through */ }
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && KEY_RE.test(key)) parts.push('l:' + key + '=' + localStorage.getItem(key));
      }
    } catch (e) { /* storage unavailable - fall through */ }
    return parts.sort().join('|');
  }

  var current = fingerprint();
  var baseline = null;
  try {
    baseline = sessionStorage.getItem(BASELINE_KEY);
    if (baseline === null) {
      sessionStorage.setItem(BASELINE_KEY, current);
      baseline = current;
    }
  } catch (e) {
    baseline = current; // no sessionStorage: treat every load as a first load
  }

  function hasDecision() {
    return fingerprint() !== baseline;
  }

  // Local time, not UTC - these logs are read against the wall clock of whoever is watching.
  function stamp() {
    return new Date().toTimeString().slice(0, 8);
  }

  window.__consentState = {
    KEY_RE: KEY_RE,
    fingerprint: fingerprint,
    baseline: baseline,
    decidedAtLoad: hasDecision(),
    hasDecision: hasDecision,
    stamp: stamp
  };
})();
