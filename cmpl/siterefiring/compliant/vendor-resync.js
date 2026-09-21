// Well-behaved third-party vendor - siterefiring/compliant (CT-1021)
//
// The control case for the rogue vendor one level up. Identical up to the moment a consent
// decision is recorded - same endpoints, same pre-decision baseline - and then the opposite
// behaviour: it shuts down for good, and re-arms nothing on any later page load.
//
// Expected verdict for this page: PASS - every monitored vendor stayed blocked across the
// whole post-rejection monitoring window.

(function () {
  'use strict';

  var ENDPOINTS = [
    'https://www.youtube.com/generate_204',
    'https://googleads.g.doubleclick.net/pagead/id',
    'https://www.google-analytics.com/collect'
  ];

  var PRE_DECISION_INTERVAL_MS = 15000;
  var DECISION_POLL_MS = 1000;

  var consentState = window.__consentState;
  var log = [];
  window.__vendorResyncLog = log;

  function render() {
    var el = document.getElementById('vendor-activity-log');
    if (!el) return;
    el.innerHTML = log.slice(-12).map(function (entry) {
      return '<li><code>' + entry.at + '</code> &mdash; <strong>' + entry.phase + '</strong>: ' + entry.detail + '</li>';
    }).join('');
  }

  function record(phase, detail) {
    log.push({ at: consentState.stamp(), phase: phase, detail: detail });
    render();
  }

  function beacon(phase) {
    var endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    var url = endpoint + '?rid=' + Date.now() + '.' + Math.floor(Math.random() * 1e6);
    try { new Image().src = url; } catch (e) { /* best effort */ }
    record(phase, url);
  }

  if (consentState.decidedAtLoad) {
    // A decision is already on file. Nothing is scheduled, now or later.
    record('load', 'consent decision already on file, vendor stays dormant');
    return;
  }

  beacon('pre-decision');
  var preDecisionTimer = setInterval(function () { beacon('pre-decision'); }, PRE_DECISION_INTERVAL_MS);

  var pollTimer = setInterval(function () {
    if (!consentState.hasDecision()) return;
    clearInterval(preDecisionTimer);
    clearInterval(pollTimer);
    record('decision', 'consent decision recorded, vendor stopped permanently');
  }, DECISION_POLL_MS);
})();
