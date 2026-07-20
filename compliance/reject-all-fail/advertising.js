// Advertising cookies - reject-all-fail
(function() {
  document.cookie = '_fbp=fb.1.' + Date.now() + '.' + Math.floor(Math.random()*1e9) + '; max-age=' + (90*86400) + '; path=/; SameSite=Lax';
  document.cookie = 'fr=fr_' + Math.random().toString(36).substr(2,20) + '; max-age=' + (90*86400) + '; path=/; SameSite=Lax';

  // New advertising cookie dropped AFTER the consent solution has already scanned
  // and categorized this domain. It is not part of the managed cookie inventory,
  // so auto-blocking does not catch it and it persists even after "Reject All" —
  // this is what causes the reject-all compliance case to fail.
  document.cookie = 'randomRejectAllTest=adv_' + Math.random().toString(36).substr(2,20) + '; max-age=' + (90*86400) + '; path=/; SameSite=Lax';
})();
