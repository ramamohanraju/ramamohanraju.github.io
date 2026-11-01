/**
 * Late-loading consent banner fixture.
 *
 * Simulates a hosted CMP that boots some seconds AFTER the page has loaded, the way a CMP injected
 * by a tag manager on a timer does. Everything a consent scanner looks for - the window.cookieyes
 * probe, the .cky-consent-container markup and the window.performBannerAction API - appears at the
 * same late moment, so a scan that only looks during the first few seconds sees a page with no
 * consent mechanism at all. The class names follow a well-known CMP so existing detectors recognise
 * the shape; none of that product's code is used here.
 *
 * Delay comes from data-delay on this script tag and can be overridden per load with ?delay=<ms>,
 * so the same page reproduces both the fast site (delay 0) and the slow one.
 */
(function () {
  var script = document.currentScript;
  var CONSENT_KEY = 'cky-consent';

  function getDelayMs() {
    var fromQuery = new URLSearchParams(window.location.search).get('delay');
    var raw = fromQuery !== null ? fromQuery : (script && script.getAttribute('data-delay'));
    var ms = parseInt(raw, 10);
    return isNaN(ms) || ms < 0 ? 15000 : ms;
  }

  function readConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* private mode - the banner just shows again */
    }
    document.cookie = CONSENT_KEY + '=' + value + '; max-age=' + 365 * 86400 + '; path=/; SameSite=Lax';
  }

  function loadCategoryScripts() {
    ['analytics.js', 'advertising.js'].forEach(function (src) {
      var el = document.createElement('script');
      el.src = src;
      document.head.appendChild(el);
    });
  }

  function clearNonEssentialCookies() {
    ['_ga', '_gid', '_fbp', 'fr'].forEach(function (name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
    });
  }

  function removeBanner() {
    var banner = document.querySelector('.cky-consent-container');
    if (banner) banner.remove();
    var modal = document.getElementById('ckyPreferenceCenter');
    if (modal) modal.remove();
  }

  function renderBanner() {
    var banner = document.createElement('div');
    banner.className = 'cky-consent-container';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = [
      '<div class="cky-consent-bar">',
      '  <p class="cky-notice-des cky-policy">',
      '    We use cookies to run this site, measure how it is used and personalise advertising.',
      '    Nothing beyond what the site needs is set until you choose.',
      '    <a href="cookie-policy.html" class="cky-policy-link">Cookie Policy</a>',
      '    <a href="privacy-policy.html" class="cky-privacy-policy">Privacy Policy</a>',
      '  </p>',
      '  <div class="cky-notice-btn-wrapper">',
      '    <button type="button" class="cky-btn cky-btn-customize cky-banner-element">Customise</button>',
      '    <button type="button" class="cky-btn cky-btn-reject">Reject All</button>',
      '    <button type="button" class="cky-btn cky-btn-accept">Accept All</button>',
      '  </div>',
      '  <button type="button" class="cky-banner-btn-close" aria-label="Close cookie banner">&times;</button>',
      '</div>'
    ].join('\n');
    document.body.appendChild(banner);

    banner.querySelector('.cky-btn-accept').addEventListener('click', function () {
      window.performBannerAction('accept_all');
    });
    banner.querySelector('.cky-btn-reject').addEventListener('click', function () {
      window.performBannerAction('reject');
    });
    banner.querySelector('.cky-btn-customize').addEventListener('click', openPreferenceCenter);
    banner.querySelector('.cky-banner-btn-close').addEventListener('click', removeBanner);
  }

  function openPreferenceCenter() {
    if (document.getElementById('ckyPreferenceCenter')) return true;
    var modal = document.createElement('div');
    modal.id = 'ckyPreferenceCenter';
    modal.className = 'cky-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Cookie preferences');
    modal.innerHTML = [
      '<h2>Cookie preferences</h2>',
      '<label><input type="checkbox" checked disabled> Strictly necessary</label>',
      '<label><input type="checkbox" class="cky-cat-analytics"> Analytics</label>',
      '<label><input type="checkbox" class="cky-cat-advertising"> Advertising</label>',
      '<button type="button" class="cky-btn cky-btn-preferences-save">Save preferences</button>'
    ].join('\n');
    document.body.appendChild(modal);
    modal.querySelector('.cky-btn-preferences-save').addEventListener('click', function () {
      var analytics = modal.querySelector('.cky-cat-analytics').checked;
      window.performBannerAction(analytics ? 'accept_all' : 'reject');
    });
    return true;
  }

  function applyConsent(value) {
    if (value === 'accepted') {
      loadCategoryScripts();
    } else {
      clearNonEssentialCookies();
    }
  }

  // The CMP brings its own stylesheet, so before it boots the page holds nothing
  // consent-related at all - no markup, no styles, no globals.
  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'cky-styles';
    style.textContent = [
      '.cky-consent-container { position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483647;',
      '  background: #10233b; color: #fff; padding: 20px 24px; font-size: 15px; line-height: 1.5; }',
      '.cky-consent-bar { max-width: 1100px; margin: 0 auto; display: flex; gap: 20px;',
      '  align-items: center; flex-wrap: wrap; position: relative; }',
      '.cky-notice-des { margin: 0; flex: 1 1 420px; }',
      '.cky-notice-des a { color: #8fc2ff; margin-left: 10px; }',
      '.cky-notice-btn-wrapper { display: flex; gap: 10px; flex-wrap: wrap; }',
      '.cky-btn { font: inherit; padding: 10px 18px; border-radius: 4px; cursor: pointer;',
      '  border: 1px solid #8fc2ff; background: transparent; color: #fff; }',
      '.cky-btn-accept { background: #1a73e8; border-color: #1a73e8; }',
      '.cky-banner-btn-close { position: absolute; top: -8px; right: 0; background: none; border: none;',
      '  color: #fff; font-size: 22px; line-height: 1; cursor: pointer; }',
      '#ckyPreferenceCenter { position: fixed; inset: 50% auto auto 50%; transform: translate(-50%, -50%);',
      '  z-index: 2147483647; background: #fff; color: #10233b; padding: 24px 28px; border-radius: 8px;',
      '  box-shadow: 0 10px 40px rgba(0,0,0,.3); display: grid; gap: 12px; min-width: 320px; }',
      '#ckyPreferenceCenter label { display: block; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function boot() {
    injectStyles();

    // The SDK probe and the action API land with the banner, not before it.
    window.cookieyes = function () {};
    window.performBannerAction = function (action) {
      var value = action === 'accept_all' ? 'accepted' : 'rejected';
      writeConsent(value);
      applyConsent(value);
      removeBanner();
      return true;
    };

    var stored = readConsent();
    if (stored) {
      // Consent already given: apply it and leave the banner off, so a revisit shows the
      // scanner a page whose banner correctly does not come back.
      applyConsent(stored);
      return;
    }
    renderBanner();
  }

  var delayMs = getDelayMs();
  document.documentElement.setAttribute('data-cmp-delay-ms', String(delayMs));
  if (delayMs === 0) {
    boot();
  } else {
    setTimeout(boot, delayMs);
  }
})();
