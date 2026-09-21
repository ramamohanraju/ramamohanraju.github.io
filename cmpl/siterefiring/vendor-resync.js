// Delayed third-party re-sync vendor - siterefiring (CT-1021)
//
// Simulates a third-party vendor that behaves well for exactly as long as anyone is looking.
// It stops beaconing the instant a consent decision is recorded, waits out a quiet period, and
// then resumes calling home on its own schedule - with no new user action in between, and with
// the same quiet-then-resume pattern repeating on every subsequent page load.
//
// Beacons are sent with Image() rather than by injecting <script> or <iframe> tags, so a CMP
// auto-block layer that rewrites tag insertion does not stop them. That blind spot is exactly
// what a sustained post-rejection monitoring window is for: a point-in-time check taken right
// after the reject click sees a silent vendor and reports a clean pass.
//
// Expected verdict for this page: FAIL - a vendor that fell silent at rejection resumed
// activity later in the same session without a re-triggering user action.

(function () {
  'use strict';

  // Same vendors as the pre-decision embed, so the re-firing request domains tie back to
  // non-essential cookies already in the scan inventory.
  var ENDPOINTS = [
    'https://www.youtube.com/generate_204',
    'https://googleads.g.doubleclick.net/pagead/id',
    'https://www.google-analytics.com/collect'
  ];

  var PRE_DECISION_INTERVAL_MS = 15000; // baseline chatter before the visitor decides
  var QUIET_AFTER_DECISION_MS = 40000;  // looks obedient for a while after the click
  var RESYNC_INTERVAL_MS = 25000;       // ... then re-fires on its own schedule, indefinitely
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
    log.push({ at: new Date().toISOString().substr(11, 8), phase: phase, detail: detail });
    render();
  }

  function beacon(phase) {
    var endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    var url = endpoint + '?rid=' + Date.now() + '.' + Math.floor(Math.random() * 1e6);
    try { new Image().src = url; } catch (e) { /* best effort */ }
    record(phase, url);
  }

  function startResync(reason) {
    record('resync armed', reason);
    beacon('delayed re-sync');
    setInterval(function () { beacon('delayed re-sync'); }, RESYNC_INTERVAL_MS);
  }

  var baseline = consentState.fingerprint();

  if (baseline) {
    // A decision is already on file - a revisit, or one of the monitoring-window navigations.
    // Stay quiet just long enough to look compliant, then resume.
    record('load', 'consent decision already on file, holding before re-sync');
    setTimeout(function () { startResync('post-load quiet period elapsed'); }, RESYNC_INTERVAL_MS);
    return;
  }

  // No decision yet - establish the pre-decision baseline the test measures against.
  beacon('pre-decision');
  var preDecisionTimer = setInterval(function () { beacon('pre-decision'); }, PRE_DECISION_INTERVAL_MS);

  var pollTimer = setInterval(function () {
    if (consentState.fingerprint() === baseline) return;
    clearInterval(preDecisionTimer);
    clearInterval(pollTimer);
    record('decision', 'consent decision recorded, going quiet');
    setTimeout(function () { startResync('post-decision quiet period elapsed'); }, QUIET_AFTER_DECISION_MS);
  }, DECISION_POLL_MS);
})();
