(function () {
  'use strict';

  const SLIDE_WIDTH = 1280;
  const SLIDE_HEIGHT = 720;
  const STORAGE_KEY = 'sysu-slide-index';

  let currentSlide = 0;
  let slides = [];

  const config = {
    author: '',
    title: '',
    date: '',
    logo: 'libs/sysu_logo.png',
    watermark: false,
  };

  function init() {
    if (window.__sysuSlideInitialized) return;
    window.__sysuSlideInitialized = true;

    const deck = document.getElementById('slide-deck');
    if (!deck) return;
    slides = Array.from(deck.querySelectorAll('.slide'));
    if (slides.length === 0) return;

    readConfig();
    injectMasterElements();
    applyMasterToAll();
    scaleDeck();
    restoreSlideIndex();
    showSlide(currentSlide, false);
    bindEvents();
    highlightTOC();
    renderAllMath();
    Prism.highlightAll();
  }

  function readConfig() {
    const el = document.querySelector('[data-sysu-config]');
    if (!el) return;
    if (el.dataset.author) config.author = el.dataset.author;
    if (el.dataset.title) config.title = el.dataset.title;
    if (el.dataset.date) config.date = el.dataset.date;
    if (el.dataset.logo) config.logo = el.dataset.logo;
    if (el.dataset.watermark === 'true') config.watermark = true;
  }

  function injectMasterElements() {
    const deck = document.getElementById('slide-deck');
    const header = document.createElement('div');
    header.className = 'sysu-header';
    header.innerHTML = '<span class="header-section"></span>';
    deck.appendChild(header);

    const footer = document.createElement('div');
    footer.className = 'sysu-footer';
    footer.innerHTML =
      '<div class="footer-author">' + config.author + '</div>' +
      '<div class="footer-title">' + config.title + '</div>' +
      '<div class="footer-date">' + config.date + '</div>';
    deck.appendChild(footer);

    const progress = document.createElement('div');
    progress.className = 'slide-progress';

    var sections = [];
    var currentSection = null;
    slides.forEach(function (slide, idx) {
      var title = slide.getAttribute('data-section-title');
      if (!title) return;
      if (!currentSection || currentSection.title !== title) {
        currentSection = { title: title, start: idx, count: 0, indices: [] };
        sections.push(currentSection);
      }
      currentSection.count++;
      currentSection.indices.push(idx);
    });

    var sectionsHtml = sections.map(function (sec) {
      var dots = '';
      for (var i = 0; i < sec.count; i++) {
        dots += '<span class="dot" data-slide-index="' + sec.indices[i] + '"></span>';
      }
      return '<div class="progress-section">' +
        '<div class="section-label">' + sec.title + '</div>' +
        '<div class="section-dots">' + dots + '</div>' +
        '</div>';
    }).join('');

    progress.innerHTML = '<div class="progress-sections">' + sectionsHtml + '</div>';
    deck.appendChild(progress);

    if (config.watermark) {
      const wm = document.createElement('div');
      wm.className = 'sysu-watermark';
      wm.innerHTML = '<img src="' + config.logo + '" alt="logo">';
      deck.appendChild(wm);
    }
  }

  function applyMasterToAll() {
    slides.forEach(function (slide) {
      var type = getSlideType(slide);
      if (type === 'title' || type === 'section') {
        slide.classList.add('no-header', 'no-footer');
      }
    });
  }

  function getSlideType(slide) {
    if (slide.querySelector('.slide-title-page')) return 'title';
    if (slide.querySelector('.slide-section-divider')) return 'section';
    return 'content';
  }

  function showSlide(index, animate) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;

    slides.forEach(function (s, i) {
      s.style.display = i === index ? 'flex' : 'none';
    });

    currentSlide = index;
    updateHeader();
    updateProgress();
    updateWatermark();
    highlightTOC();
    try { localStorage.setItem(STORAGE_KEY, index); } catch (e) { /* ignore */ }
  }

  function updateHeader() {
    var slide = slides[currentSlide];
    if (!slide) return;
    var type = getSlideType(slide);
    var header = document.querySelector('.sysu-header');
    if (!header) return;

    if (type === 'title' || type === 'section') {
      header.style.display = 'none';
    } else {
      header.style.display = 'flex';
      var sectionTitle = slide.getAttribute('data-section-title') || '';
      header.querySelector('.header-section').textContent = sectionTitle;
    }
  }

  function updateProgress() {
    var dots = document.querySelectorAll('.slide-progress .dot');
    if (dots.length === 0) return;
    dots.forEach(function (dot) {
      dot.classList.remove('active', 'passed');
      var idx = parseInt(dot.getAttribute('data-slide-index'), 10);
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else if (idx < currentSlide) {
        dot.classList.add('passed');
      }
    });
  }

  function updateWatermark() {
    var wm = document.querySelector('.sysu-watermark');
    if (!wm) return;
    var slide = slides[currentSlide];
    wm.style.display = slide && slide.classList.contains('no-watermark') ? 'none' : '';
  }

  function highlightTOC() {
    var tocSlides = document.querySelectorAll('.slide-toc');
    var currentSlideEl = slides[currentSlide];
    var currentSection = currentSlideEl ? currentSlideEl.getAttribute('data-section-title') : '';
    tocSlides.forEach(function (tocSlide) {
      var items = tocSlide.querySelectorAll('.toc-list li');
      items.forEach(function (item) {
        item.classList.remove('current');
        if (currentSection && item.textContent.trim() === currentSection.trim()) {
          item.classList.add('current');
        }
      });
    });
  }

  function scaleDeck() {
    var deck = document.getElementById('slide-deck');
    if (!deck) return;

    function doScale() {
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var scaleX = vw / SLIDE_WIDTH;
      var scaleY = vh / SLIDE_HEIGHT;
      var scale = Math.min(scaleX, scaleY);
      deck.style.width = SLIDE_WIDTH + 'px';
      deck.style.height = SLIDE_HEIGHT + 'px';
      deck.style.transform = 'scale(' + scale + ')';
      deck.style.transformOrigin = 'top left';
      deck.style.position = 'absolute';
      deck.style.left = ((vw - SLIDE_WIDTH * scale) / 2) + 'px';
      deck.style.top = ((vh - SLIDE_HEIGHT * scale) / 2) + 'px';
    }

    doScale();
    window.addEventListener('resize', doScale);
  }

  function restoreSlideIndex() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        var idx = parseInt(saved, 10);
        if (idx >= 0 && idx < slides.length) {
          currentSlide = idx;
        }
      }
    } catch (e) { /* ignore */ }
  }

  function renderAllMath() {
    if (typeof katex === 'undefined') return;
    document.querySelectorAll('.math').forEach(function (el) {
      if (el.dataset.rendered) return;
      var tex = el.textContent;
      var displayMode = el.classList.contains('math-display');
      try {
        katex.render(tex, el, { displayMode: displayMode, throwOnError: false, trust: true });
        el.dataset.rendered = 'true';
      } catch (e) {
        el.textContent = tex + ' (公式渲染错误)';
      }
    });
  }

  function bindEvents() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        showSlide(currentSlide + 1, true);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        showSlide(currentSlide - 1, true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        showSlide(0, true);
      } else if (e.key === 'End') {
        e.preventDefault();
        showSlide(slides.length - 1, true);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'o' || e.key === 'O') {
        toggleOverview();
      }
    });

    var touchStartX = 0;
    document.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        showSlide(currentSlide + (dx < 0 ? 1 : -1), true);
      }
    }, { passive: true });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function toggleOverview() {
    var deck = document.getElementById('slide-deck');
    if (!deck) return;
    deck.classList.toggle('overview-mode');
    if (deck.classList.contains('overview-mode')) {
      slides.forEach(function (s) { s.style.display = 'flex'; });
    } else {
      showSlide(currentSlide, false);
    }
  }

  window.sysuSlideInit = init;

  document.addEventListener('DOMContentLoaded', init);
})();
