// Shared consent-state probe - siterefiring (CT-1021)
//
// Deliberately CMP-agnostic: a consent decision counts as "recorded" once a cookie or storage
// key that looks like a consent record appears or changes. That keeps both the rogue and the
// compliant vendor on this site working against whatever banner you point them at, instead of
// binding the test pages to one SDK's API.

(function () {
  'use strict';

  var KEY_RE = /consent|cmp|gdpr|ccpa|usprivacy|euconsent|gpp/i;

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

  window.__consentState = { KEY_RE: KEY_RE, fingerprint: fingerprint };
})();
