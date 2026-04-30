(function () {
  var partials = [
    { id: 'ph-sidebar',        src: 'partials/sidebar.html' },
    { id: 'ph-topbar',         src: 'partials/topbar.html' },
    { id: 'ph-tab-activity',   src: 'partials/tab-activity.html' },
    { id: 'ph-tab-notes',      src: 'partials/tab-notes.html' },
    { id: 'ph-tab-emails',     src: 'partials/tab-emails.html' },
    { id: 'ph-right-sidebar',  src: 'partials/right-sidebar.html' },
    { id: 'ph-email-panel',    src: 'partials/email-panel.html' },
    { id: 'ph-modals',         src: 'partials/modals.html' },
  ];

  var appScripts = [
    'data/emails.js',
    'data/contacts.js',
    'js/helpers.js',
    'js/tabs.js',
    'js/notes.js',
    'js/email-integration.js',
    'js/email-panel.js',
    'js/send-email.js',
  ];

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src + cacheBust;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  function loadScriptsSequentially(srcs) {
    return srcs.reduce(function (chain, src) {
      return chain.then(function () { return loadScript(src); });
    }, Promise.resolve());
  }

  var cacheBust = '?v=' + Date.now();

  function loadPartial(p) {
    return fetch(p.src + cacheBust, { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var el = document.getElementById(p.id);
        if (el) el.outerHTML = html;
      });
  }

  partials.reduce(function (chain, p) {
    return chain.then(function () { return loadPartial(p); });
  }, Promise.resolve()).then(function () {
    return loadScriptsSequentially(appScripts);
  });
})();
