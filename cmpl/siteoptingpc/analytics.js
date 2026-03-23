// Analytics cookies - siteoptingpc
(function() {
  var gaClient = 'GA1.2.' + Math.floor(Math.random()*1e9) + '.' + Math.floor(Date.now()/1000);
  document.cookie = '_ga=' + gaClient + '; max-age=' + (730*86400) + '; path=/; SameSite=Lax';
  document.cookie = '_gid=GA1.2.' + Math.floor(Math.random()*1e9) + '.' + Math.floor(Date.now()/1000) + '; max-age=86400; path=/; SameSite=Lax';
  document.cookie = '_gat_gtag_UA_12345678_1=1; max-age=60; path=/; SameSite=Lax';
})();
