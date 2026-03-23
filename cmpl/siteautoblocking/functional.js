// Functional cookies - siteautoblocking
(function() {
  document.cookie = 'lang=en; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
  document.cookie = '__stripe_mid=' + Math.random().toString(36).substr(2,24) + '; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
})();
