// Functional cookies - sitetrackers
(function() {
  document.cookie = 'lang=en; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
  document.cookie = 'currency=USD; max-age=' + (30*86400) + '; path=/; SameSite=Lax';
  document.cookie = 'chat_session=cs_' + Math.random().toString(36).substr(2,12) + '; path=/; SameSite=Lax';
  document.cookie = 'recently_viewed=' + JSON.stringify([101,202,303]) + '; max-age=' + (30*86400) + '; path=/; SameSite=Lax';
  document.cookie = '__stripe_mid=' + Math.random().toString(36).substr(2,24) + '; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
})();
