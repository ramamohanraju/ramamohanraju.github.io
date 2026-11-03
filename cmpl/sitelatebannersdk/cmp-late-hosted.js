/**
 * Late-loading consent banner fixture - real hosted CMP.
 *
 * Sibling of ../sitelatebanner/, which fakes the CMP markup locally. This one runs a genuine
 * hosted SDK: the consent snippet lives verbatim in consent-code.html, and this script injects it
 * some seconds AFTER the page has loaded, the way a CMP delivered through a tag manager on a timer
 * behaves. Before the delay elapses the page holds nothing consent-related at all - no banner
 * markup, no SDK global, not one request to the CMP's CDN - so a scan that only looks during the
 * first few seconds reads it as a site with no consent mechanism.
 *
 * Vendor-neutral apart from SDK_GLOBAL / DATALAYER_GLOBAL below: point those at whatever globals
 * the pasted snippet exposes and the rest of this file is unchanged.
 *
 * Delay comes from data-delay on this script tag and can be overridden per load with ?delay=<ms>,
 * so the same page reproduces both the slow site and the fast one (delay 0 - see instant.html).
 *
 * Needs http(s): the snippet is fetched, and fetch does not work from file:// origins.
 */
(function () {
  var script = document.currentScript;
  var SNIPPET_URL = 'consent-code.html';
  var NON_ESSENTIAL_COOKIES = ['_ga', '_gid', '_fbp', 'fr'];

  // Which global the CMP exposes is discovered at runtime rather than hardcoded, so this fixture
  // names no vendor and works with whichever CMP snippet is pasted into consent-code.html. Set it
  // to the global's name to pin it down if detection ever picks the wrong object.
  var SDK_GLOBAL = null;  // an object with .onReady(cb); cb receives the sdk

  // How long to keep looking for that global after the snippet's own scripts have run. A hosted
  // snippet is usually a few lines that append the real loader to <head>, so the SDK does not
  // exist yet at the moment the snippet finishes - it appears a network round trip later.
  var SDK_WAIT_MS = 20000;

  // Globals present before the snippet runs. Anything the snippet adds is a candidate; everything
  // the page already had is not, which is what keeps detection from latching onto an unrelated
  // library.
  var globalsBefore = null;

  function snapshotGlobals() {
    globalsBefore = Object.create(null);
    Object.keys(window).forEach(function (k) { globalsBefore[k] = true; });
  }

  function newGlobals() {
    return Object.keys(window).filter(function (k) { return !globalsBefore || !globalsBefore[k]; });
  }

  // Deliberately only matches on onReady(): an array-shaped "event queue" is too weak a signal to
  // match on, since a snippet that also installs a tag manager puts window.dataLayer on the page
  // and detection would just as happily latch onto that.
  function detectGlobals() {
    if (SDK_GLOBAL) return;
    var candidates = newGlobals().filter(function (k) {
      var v;
      try { v = window[k]; } catch (e) { return false; }
      return v && (typeof v === 'object' || typeof v === 'function') && typeof v.onReady === 'function';
    });
    // Prefer one that also looks like a consent API, in case something else exposes an onReady.
    SDK_GLOBAL = candidates.filter(function (k) {
      var v = window[k];
      return typeof v.getConsent === 'function' || typeof v.isConsentGiven === 'function' ||
             typeof v.showBanner === 'function';
    })[0] || candidates[0] || null;
  }

  function sdkApi() { return SDK_GLOBAL ? window[SDK_GLOBAL] : null; }

  function getDelayMs() {
    var fromQuery = new URLSearchParams(window.location.search).get('delay');
    var raw = fromQuery !== null ? fromQuery : (script && script.getAttribute('data-delay'));
    var ms = parseInt(raw, 10);
    return isNaN(ms) || ms < 0 ? 15000 : ms;
  }

  var delayMs = getDelayMs();
  document.documentElement.setAttribute('data-cmp-delay-ms', String(delayMs));

  // ---------------------------------------------------------------------------------------------
  // Status panel - so a human watching the page can see the same thing the scanner sees.
  // ---------------------------------------------------------------------------------------------

  var openedAt = Date.now();
  var sdkReady = false;

  function setStatus(text, tone) {
    var el = document.getElementById('cmp-status');
    if (!el) return;
    el.textContent = text;
    el.setAttribute('data-tone', tone || 'neutral');
  }

  function elapsed() {
    return Math.round((Date.now() - openedAt) / 1000);
  }

  var ticker = setInterval(function () {
    if (sdkReady) return;
    setStatus('No consent SDK yet - ' + elapsed() + 's elapsed, snippet is due at ' + (delayMs / 1000) + 's.');
  }, 500);

  // ---------------------------------------------------------------------------------------------
  // Injecting the snippet.
  //
  // The snippet is authored as HTML, so it is parsed as HTML and replayed node by node. A <script>
  // parsed out of a fetched document is inert - the browser will not run it - so each one is
  // recreated as a fresh element with the same attributes and body. Src'd scripts are awaited
  // before the next node is appended, because the snippet's own ordering (auto-blocking before the
  // loader, loader before anything that calls into it) is load-order dependent.
  // ---------------------------------------------------------------------------------------------

  function reviveScript(node) {
    var fresh = document.createElement('script');
    for (var i = 0; i < node.attributes.length; i++) {
      fresh.setAttribute(node.attributes[i].name, node.attributes[i].value);
    }
    if (!node.src) {
      fresh.textContent = node.textContent;
      document.head.appendChild(fresh);
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      fresh.onload = fresh.onerror = function () { resolve(); };
      document.head.appendChild(fresh);
    });
  }

  function injectSnippet() {
    return fetch(SNIPPET_URL, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error(SNIPPET_URL + ' -> HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        var holder = document.createElement('div');
        holder.innerHTML = html;

        if (!holder.querySelector('script')) {
          throw new Error(SNIPPET_URL + ' has no <script> in it - has the consent code been pasted in yet?');
        }

        var host = document.getElementById('consent-host') || document.body;
        var nodes = Array.prototype.slice.call(holder.childNodes);

        // Sequential, not Promise.all: order is the whole point.
        return nodes.reduce(function (chain, node) {
          return chain.then(function () {
            if (node.nodeType === 1 && node.tagName === 'SCRIPT') return reviveScript(node);
            if (node.nodeType === 1) host.appendChild(node);
            return undefined;
          });
        }, Promise.resolve());
      });
  }

  // ---------------------------------------------------------------------------------------------
  // Consent-gated tags.
  //
  // analytics.js / advertising.js fire only once the SDK reports consent for the matching category,
  // so the before/after cookie sets are exactly the ones ../sitelatebanner/ produces and the two
  // fixtures' compliance verdicts can be read side by side.
  //
  // Category display names are configurable per property, so they are resolved through
  // base_category (the stable value the SDK exposes on every category) and only fall back to
  // matching the display name. Adjust the patterns below if this property's categories are named
  // something these do not catch.
  // ---------------------------------------------------------------------------------------------

  var CATEGORY_TAGS = [
    { pattern: /analytic|statistic|performance/i, src: 'analytics.js' },
    { pattern: /advertis|marketing|targeting/i, src: 'advertising.js' },
  ];

  var loaded = {};

  function loadTag(src) {
    if (loaded[src]) return;
    loaded[src] = true;
    var el = document.createElement('script');
    el.src = src;
    document.head.appendChild(el);
  }

  function clearNonEssentialCookies() {
    NON_ESSENTIAL_COOKIES.forEach(function (name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
    });
  }

  function applyConsent(sdk) {
    var consent;
    try {
      consent = sdk.getConsent();
    } catch (e) {
      return;
    }
    if (!consent || !consent.category) return;

    var categories = [];
    try {
      categories = sdk.getCategories() || [];
    } catch (e) {
      categories = [];
    }

    var granted = [];
    var denied = [];

    CATEGORY_TAGS.forEach(function (tag) {
      var match = categories.filter(function (cat) {
        return tag.pattern.test(cat.base_category || '') || tag.pattern.test(cat.name || '');
      })[0];
      if (!match) return;
      if (consent.category[match.name] === 'granted') {
        loadTag(tag.src);
        granted.push(match.name);
      } else if (consent.category[match.name] === 'denied') {
        denied.push(match.name);
      }
    });

    if (denied.length && !granted.length) clearNonEssentialCookies();

    setStatus(
      'Consent recorded at ' + elapsed() + 's. Granted: ' + (granted.join(', ') || 'none') +
      '. Denied: ' + (denied.join(', ') || 'none') + '.',
      'consented'
    );
  }

  // Consent is polled rather than subscribed to. Every CMP names its event hook differently (and
  // some have none), whereas getConsent() is the one thing they all expose - so polling is what
  // keeps this file free of vendor-specific names. 250ms is far finer than any scanner's sampling.
  var lastConsent = null;

  function watchConsent(sdk) {
    setInterval(function () {
      var snapshot;
      try {
        snapshot = JSON.stringify(sdk.getConsent());
      } catch (e) {
        return;
      }
      if (snapshot === lastConsent) return;
      lastConsent = snapshot;
      applyConsent(sdk);
    }, 250);
  }

  // Two things have to happen before the SDK can be used, and the snippet reports neither.
  //
  // First, the snippet's own scripts finishing is not the CMP being there: a hosted snippet is
  // typically a few lines that append the real loader to <head> and return, so the global appears
  // a network round trip later, not when the snippet returns.
  //
  // Second - and this is the part worth knowing - the global appearing is not the SDK being
  // ready either. It is published early, while the SDK is still fetching its configuration, and
  // an onReady() callback registered during that window is dropped on the floor: it is not
  // queued, it never fires, and the only trace is an 'Invalid event received' line in the
  // console. Registering once, as soon as the global exists, is therefore a coin flip.
  //
  // So registration is retried until a callback actually comes back. Once the SDK is ready the
  // very next onReady() invokes its callback synchronously, which makes the retry cheap: the
  // first attempt after readiness wins, and attempts before it cost nothing but a console line.
  function awaitSdkReady() {
    return new Promise(function (resolve) {
      var deadline = Date.now() + SDK_WAIT_MS;
      var settled = false;

      function settle(value) {
        if (settled) return;
        settled = true;
        resolve(value);
      }

      (function attempt() {
        if (settled) return;
        detectGlobals();
        var api = sdkApi();
        if (api) {
          try {
            api.onReady(function (sdk) { settle(sdk || api); });
          } catch (e) { /* not ready yet - fall through and try again */ }
        }
        if (settled) return;
        if (Date.now() >= deadline) return settle(null);
        setTimeout(attempt, 250);
      })();
    });
  }

  function wireSdk(sdk) {
    clearInterval(ticker);

    if (!sdk) {
      setStatus('Snippet ran at ' + elapsed() + 's but no SDK became ready within ' +
        (SDK_WAIT_MS / 1000) + 's - ' + (sdkApi()
          ? 'the global ' + SDK_GLOBAL + ' is on the page but its onReady() never called back.'
          : 'no global with an onReady() method ever appeared. Check the identifiers and host in ' +
            SNIPPET_URL + ', or set SDK_GLOBAL explicitly if this CMP names its API something ' +
            'detection missed.'), 'error');
      return;
    }

    sdkReady = true;
    setStatus('Consent SDK ready ' + elapsed() + 's after page open (snippet injected at ' +
      (delayMs / 1000) + 's). Waiting for a choice.', 'loaded');

    // A returning visitor already has consent stored - honour it without waiting for a click.
    applyConsent(sdk);
    watchConsent(sdk);
  }

  function start() {
    snapshotGlobals();
    injectSnippet().then(awaitSdkReady).then(wireSdk).catch(function (err) {
      clearInterval(ticker);
      setStatus('Consent snippet failed to load: ' + err.message, 'error');
      console.error('[late-banner fixture]', err);
    });
  }

  if (delayMs === 0) {
    start();
  } else {
    setStatus('No consent SDK yet - 0s elapsed, snippet is due at ' + (delayMs / 1000) + 's.');
    setTimeout(start, delayMs);
  }
})();
