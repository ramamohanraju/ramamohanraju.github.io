// Advertising cookies - siterejectall
(function() {
  document.cookie = '_fbp=fb.1.' + Date.now() + '.' + Math.floor(Math.random()*1e9) + '; max-age=' + (90*86400) + '; path=/; SameSite=Lax';
  document.cookie = 'fr=fr_' + Math.random().toString(36).substr(2,20) + '; max-age=' + (90*86400) + '; path=/; SameSite=Lax';
})();
