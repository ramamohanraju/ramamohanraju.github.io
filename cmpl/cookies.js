/**
 * Compliance Test Sites - Cookie Utility
 * Sets realistic cookies that mimic well-known third-party and first-party cookies.
 * Categories: strictly_necessary, functional, analytics, advertising, uncategorized
 */

var CookieUtil = (function () {
  function set(name, value, days) {
    var expires = '';
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + days * 864e5);
      expires = '; expires=' + d.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
  }

  function remove(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
  }

  function getAll() {
    return document.cookie.split(';').reduce(function (acc, c) {
      var parts = c.trim().split('=');
      if (parts[0]) acc[parts[0]] = parts.slice(1).join('=');
      return acc;
    }, {});
  }

  function removeAll() {
    var cookies = getAll();
    for (var name in cookies) {
      if (cookies.hasOwnProperty(name)) remove(name);
    }
  }

  // ── Strictly Necessary ──────────────────────────────────────────
  function setStrictlyNecessary() {
    set('PHPSESSID', 'sess_' + Math.random().toString(36).substr(2, 16));          // session id
    set('csrf_token', 'tk_' + Math.random().toString(36).substr(2, 24));            // CSRF
    set('__cf_bm', 'cfbm_' + Math.random().toString(36).substr(2, 20), 0.02);      // Cloudflare bot mgmt (~30 min)
    set('cookieconsent_status', 'dismiss', 365);                                     // consent record
  }

  // ── Functional ──────────────────────────────────────────────────
  function setFunctional() {
    set('lang', 'en-US', 365);
    set('currency', 'USD', 30);
    set('chat_session', 'intercom_' + Math.random().toString(36).substr(2, 12));     // Intercom-style
    set('recently_viewed', '["p101","p202","p303"]', 30);
    set('__stripe_mid', 'sm_' + Math.random().toString(36).substr(2, 20), 365);      // Stripe fraud
  }

  // ── Analytics ───────────────────────────────────────────────────
  function setAnalytics() {
    var gaClient = 'GA1.2.' + Math.floor(Math.random() * 1e9) + '.' + Math.floor(Date.now() / 1000);
    set('_ga', gaClient, 730);                                                        // Google Analytics
    set('_gid', 'GA1.2.' + Math.floor(Math.random() * 1e9) + '.' + Math.floor(Date.now() / 1000), 1);
    set('_gat_gtag_UA_12345678_1', '1', 0.001);                                     // GA throttle (~1 min)
    set('_hjid', Math.floor(Math.random() * 1e9).toString(), 365);                   // Hotjar
    set('_hjSessionUser_123456', 'hjsu_' + Math.random().toString(36).substr(2, 16), 365);
    set('_clck', 'clck_' + Math.random().toString(36).substr(2, 10), 365);           // Microsoft Clarity
  }

  // ── Advertising ─────────────────────────────────────────────────
  function setAdvertising() {
    set('_fbp', 'fb.1.' + Date.now() + '.' + Math.floor(Math.random() * 1e9), 90);  // Facebook Pixel
    set('_gcl_au', '1.1.' + Math.floor(Math.random() * 1e9) + '.' + Math.floor(Date.now() / 1000), 90); // Google Ads
    set('IDE', 'ide_' + Math.random().toString(36).substr(2, 20), 390);              // DoubleClick
    set('fr', Math.random().toString(36).substr(2, 20) + '.' + Math.floor(Date.now() / 1000), 90); // Facebook
    set('NID', Math.floor(Math.random() * 1e9).toString(), 180);                     // Google
    set('_uetsid', 'uet_' + Math.random().toString(36).substr(2, 16), 1);           // Bing Ads
    set('li_fat_id', 'li_' + Math.random().toString(36).substr(2, 16), 30);         // LinkedIn
  }

  // ── Uncategorized ───────────────────────────────────────────────
  function setUncategorized() {
    set('ab_variant', 'B', 365);
    set('xyz_session', 'xyz_' + Math.random().toString(36).substr(2, 12), 30);
    set('_custom_id', 'cid_' + Math.random().toString(36).substr(2, 16), 180);
  }

  // ── Convenience combos ──────────────────────────────────────────
  function setAll() {
    setStrictlyNecessary();
    setFunctional();
    setAnalytics();
    setAdvertising();
    setUncategorized();
  }

  function setPreConsent() {
    // Non-compliant: analytics + advertising dropped before consent
    setAnalytics();
    setAdvertising();
  }

  function setLeakedOnly() {
    // Simulates tracker leakage: only _ga leaks through reject
    var gaClient = 'GA1.2.' + Math.floor(Math.random() * 1e9) + '.' + Math.floor(Date.now() / 1000);
    set('_ga', gaClient, 730);
  }

  return {
    set: set,
    remove: remove,
    getAll: getAll,
    removeAll: removeAll,
    setStrictlyNecessary: setStrictlyNecessary,
    setFunctional: setFunctional,
    setAnalytics: setAnalytics,
    setAdvertising: setAdvertising,
    setUncategorized: setUncategorized,
    setAll: setAll,
    setPreConsent: setPreConsent,
    setLeakedOnly: setLeakedOnly
  };
})();