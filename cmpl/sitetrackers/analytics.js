// Analytics cookies - sitetrackers
(function() {
  document.cookie = '_ga=GA1.2.' + Math.floor(Math.random()*1e9) + '.' + Math.floor(Date.now()/1000) + '; max-age=' + (730*86400) + '; path=/; SameSite=Lax';
  document.cookie = '_gid=GA1.2.' + Math.floor(Math.random()*1e9) + '.' + Math.floor(Date.now()/1000) + '; max-age=86400; path=/; SameSite=Lax';
  document.cookie = '_gat=1; max-age=60; path=/; SameSite=Lax';
  document.cookie = '_hjid=' + Math.floor(Math.random()*1e9) + '; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
  document.cookie = '_hjSessionUser_123456=' + Math.floor(Math.random()*1e9) + '; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
  document.cookie = '_clck=' + Math.random().toString(36).substr(2,8) + '; max-age=' + (365*86400) + '; path=/; SameSite=Lax';
})();
