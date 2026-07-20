// Advertising cookies - undisclosed-cookie
(function() {
  document.cookie = '_fbp=fb.1.' + Date.now() + '.' + Math.floor(Math.random()*1e9) + '; max-age=' + (90*86400) + '; path=/; SameSite=Lax';
  document.cookie = 'fr=fr_' + Math.random().toString(36).substr(2,20) + '; max-age=' + (90*86400) + '; path=/; SameSite=Lax';

  // Undisclosed cookie: set on load but NOT declared anywhere in the privacy
  // policy / cookie declaration. Added after the baseline scan so a re-scan
  // should flag it as an undisclosed cookie.
  document.cookie = '_uetsid=' + Math.random().toString(36).substr(2,24) + '; max-age=' + (90*86400) + '; path=/; SameSite=Lax';
})();
