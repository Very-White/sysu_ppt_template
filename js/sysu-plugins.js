const SysuFooter = {
  id: 'sysu-footer',
  init: function (deck) {
    const config = deck.getConfig()?.sysu || {};
    const author = config.author || '';
    const title = config.title || '';
    const date = config.date || new Date().toLocaleDateString('zh-CN');

    function updateFooter() {
      let footer = document.querySelector('.sysu-footer');
      if (!footer) {
        footer = document.createElement('div');
        footer.className = 'sysu-footer';
        document.querySelector('.reveal').appendChild(footer);
      }
      footer.innerHTML = `
        <div class="footer-author">${author}</div>
        <div class="footer-title">${title}</div>
        <div class="footer-date">${date}</div>
      `;
    }

    function updateWatermark() {
      let watermark = document.querySelector('.sysu-watermark');
      if (!watermark) {
        watermark = document.createElement('div');
        watermark.className = 'sysu-watermark';
        const logoSrc = config.logo || 'libs/sysu_logo.png';
        watermark.innerHTML = `<img src="${logoSrc}" alt="SYSU">`;
        document.querySelector('.reveal').appendChild(watermark);
      }
    }

    function updateHeader() {
      let header = document.querySelector('.sysu-header');
      if (!header) {
        header = document.createElement('div');
        header.className = 'sysu-header';
        document.querySelector('.reveal').appendChild(header);
      }

      const currentSlide = deck.getCurrentSlide();
      if (!currentSlide) return;

      const section = currentSlide.closest('section[data-section-title]')
        || currentSlide.parentElement?.querySelector('[data-section-title]');

      const sectionTitle = currentSlide.getAttribute('data-section-title')
        || currentSlide.parentElement?.getAttribute('data-section-title')
        || '';

      header.innerHTML = `
        <span class="header-section">${sectionTitle}</span>
      `;
    }

    deck.on('ready', () => {
      updateFooter();
      updateWatermark();
      updateHeader();
    });

    deck.on('slidechanged', () => {
      updateHeader();
    });
  }
};

const SysuTOC = {
  highlight: function () {
    const tocSlides = document.querySelectorAll('.slide-toc');
    tocSlides.forEach(tocSlide => {
      const items = tocSlide.querySelectorAll('.toc-list li');
      const revealEl = document.querySelector('.reveal');
      if (!revealEl) return;
      const deck = revealEl.getReveal?.();
      if (!deck) return;

      const indices = deck.getIndices();
      const h = indices.h;

      items.forEach((item, idx) => {
        item.classList.remove('current');
        if (idx + 1 === h || (idx === items.length - 1 && h > items.length)) {
          item.classList.add('current');
        }
      });
    });
  }
};

function renderMath() {
  const mathElements = document.querySelectorAll('.math');
  mathElements.forEach(el => {
    if (el.dataset.rendered) return;
    const tex = el.textContent;
    const displayMode = el.classList.contains('math-display');
    try {
      katex.render(tex, el, {
        displayMode: displayMode,
        throwOnError: false,
        trust: true
      });
      el.dataset.rendered = 'true';
    } catch (e) {
      el.textContent = tex + ' (公式渲染错误)';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(SysuTOC.highlight, 500);
});
