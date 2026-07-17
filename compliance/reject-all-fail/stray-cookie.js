// Stray cookie - reject-all-fail
//
// Drops one non-essential (advertising) cookie, _gcl_aw, but ONLY on the first
// user interaction (click / scroll / mousemove / keydown) rather than on page load.
//
// A passive scan that loads the page without interacting never observes this
// cookie, so it does not enter the scanned cookie inventory. Any flow that
// clicks a button on the page (e.g. dismissing or rejecting a consent banner)
// triggers it. Because it is not tied to any consent category declared on the
// page, it persists regardless of the consent choice.
(function() {
  var dropped = false;

  function dropStrayCookie() {
    if (dropped) return;
    dropped = true;
    var val = 'GCL.1.' + Math.floor(Math.random() * 1e9) + '.' + Math.floor(Date.now() / 1000);
    document.cookie = '_gcl_aw=' + val + '; max-age=' + (90 * 86400) + '; path=/; SameSite=Lax';
    // Stop listening once dropped.
    ['click', 'scroll', 'mousemove', 'keydown', 'touchstart'].forEach(function (evt) {
      window.removeEventListener(evt, dropStrayCookie, true);
    });
  }

  ['click', 'scroll', 'mousemove', 'keydown', 'touchstart'].forEach(function (evt) {
    window.addEventListener(evt, dropStrayCookie, true);
  });
})();
