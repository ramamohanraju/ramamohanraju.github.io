// Per-case cookie test fixture. One case per subfolder; the subfolder's index.html
// sets window.SQLI_CASE = "<id>" before loading this file.
//
// Each case sets a cookie whose Domain attribute (or name) contains SQL-ish characters,
// to test how a cookie scanner handles malformed cookie attribute values.
// ';' delimits cookie attributes, so payloads use /**/ for spaces where needed.

(function () {
  var CASES = {
    'union-in-domain': {
      name: 'sqli_union',
      domain: "x.com')/**/union/**/select/**/null,version(),null,null,null,null,null,null,null,null--"
    },
    'single-quote-in-domain': {
      name: 'sqli_quote',
      domain: "evil'.com"
    },
    'boolean-in-domain': {
      name: 'sqli_bool',
      domain: "a.com' OR '1'='1"
    },
    'comment-in-domain': {
      name: 'sqli_comment',
      domain: "a.com'--"
    },
    'stacked-in-domain': {
      name: 'sqli_stack',
      domain: "a.com'/**/drop/**/table/**/cookies--"
    },
    'high-level-provider': {
      name: 'sqli_hlp',
      domain: "sub.evil-corp.co.uk')/**/or/**/1=1--"
    },
    'quote-in-name': {
      name: "na'me')--",
      domain: 'namepayload.example.com'
    },
    'benign-control': {
      name: '_ga',
      domain: '.ramamohanraju.github.io'
    }
  };

  var id = window.SQLI_CASE;
  var c = CASES[id];
  if (!c) return;

  // Scope cookies to this case's subfolder path so cases stay isolated.
  var casePath = window.location.pathname.replace(/[^/]*$/, '');

  try {
    document.cookie =
      c.name + '=payload_' + id + '; domain=' + c.domain + '; path=' + casePath + '; SameSite=Lax';
  } catch (e) {}
  try {
    document.cookie = c.name + '=payload_' + id + '; path=' + casePath + '; SameSite=Lax';
  } catch (e) {}

  function render() {
    var set = function (elId, text) {
      var el = document.getElementById(elId);
      if (el) el.textContent = text;
    };
    set('case-id', id);
    set('case-name', c.name);
    set('case-domain', c.domain);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
