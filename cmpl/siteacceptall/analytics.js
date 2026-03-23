// Analytics cookies - siteacceptall
(function() {
  var gaClient = 'GA1.2.' + Math.floor(Math.random()*1e9) + '.' + Math.floor(Date.now()/1000);
  document.cookie = '_ga=' + gaClient + '; max-age=' + (730*86400) + '; path=/; SameSite=Lax';
  document.cookie = '_gid=GA1.2.' + Math.floor(Math.random()*1e9) + '.' + Math.floor(Date.now()/1000) + '; max-age=86400; path=/; SameSite=Lax';
  document.cookie = '_hjid=hj_' + Math.random().toString(36).substr(2,16) + '; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
})();
