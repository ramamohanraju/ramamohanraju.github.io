// Pre-decision third-party embed - siterefiring (CT-1021)
//
// Loads a video embed from a third-party vendor that sets cookies on its OWN domain, so the
// scan inventory ends up holding non-essential cookies whose domain matches the request domain
// the re-firing vendor calls. Without that link the sustained-monitoring test has no
// blocked-category vendor to monitor and reports itself as not applicable.
//
// The embed is inserted ONLY while no consent decision is on file. Once the visitor has chosen,
// this vendor is done for good - so it contributes pre-decision baseline activity on both the
// rogue and the compliant page, and post-decision activity on neither. Whatever difference the
// scan sees after rejection therefore comes from the re-sync vendor alone.

(function () {
  'use strict';

  var EMBED_SRC = 'https://www.youtube.com/embed/aqz-KE-bpKQ';

  if (window.__consentState && window.__consentState.fingerprint()) return;

  function insert() {
    var slot = document.getElementById('vendor-embed-slot');
    if (!slot) return;
    var frame = document.createElement('iframe');
    frame.src = EMBED_SRC;
    frame.width = '480';
    frame.height = '270';
    frame.title = 'Third-party video embed';
    frame.setAttribute('loading', 'eager');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.setAttribute('allowfullscreen', '');
    slot.appendChild(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insert);
  } else {
    insert();
  }
})();
