(function () {
  'use strict';

  var SECTIONS = [
    'sections/00-title.html',
    'sections/01-intro.html',
    'sections/02-examples.html',
    'sections/03-advanced.html',
    'sections/04-end.html'
  ];

  function isFileProtocol() {
    return window.location.protocol === 'file:';
  }

  function showFileProtocolWarning() {
    var deck = document.getElementById('slide-deck');
    if (!deck) return;
    deck.innerHTML = '<div class="slide" style="display:flex;justify-content:center;align-items:center;text-align:center;">' +
      '<div style="font-size:0.8em;color:#666;">' +
      '<h2 style="color:#D70000;">无法加载幻灯片</h2>' +
      '<p>当前通过 <code>file://</code> 协议打开，浏览器禁止加载本地文件。</p>' +
      '<p>请在终端运行以下命令启动本地服务器：</p>' +
      '<pre style="text-align:left;font-size:0.7em;background:#f5f5f5;padding:10px;border-radius:4px;"><code>python -m http.server 8000</code></pre>' +
      '<p>然后访问 <a href="http://localhost:8000">http://localhost:8000</a></p>' +
      '</div></div>';
  }

  function loadSync(deck) {
    SECTIONS.forEach(function (url) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        if (xhr.status === 200 || xhr.status === 0) {
          deck.insertAdjacentHTML('beforeend', xhr.responseText);
        }
      } catch (e) {
        console.warn('Failed to load section (sync):', url, e);
      }
    });
  }

  function loadAsync(deck) {
    return Promise.all(SECTIONS.map(function (url) {
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      }).then(function (html) {
        deck.insertAdjacentHTML('beforeend', html);
      }).catch(function (e) {
        console.warn('Failed to load section (async):', url, e);
      });
    }));
  }

  function init() {
    var deck = document.getElementById('slide-deck');
    if (!deck) return;

    if (isFileProtocol()) {
      showFileProtocolWarning();
      return;
    }

    try {
      loadSync(deck);
      if (typeof window.sysuSlideInit === 'function') window.sysuSlideInit();
    } catch (e) {
      loadAsync(deck).then(function () {
        if (typeof window.sysuSlideInit === 'function') window.sysuSlideInit();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
