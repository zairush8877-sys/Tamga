// ===== Меню: рендер из data/menu.js и карусель фотографий блюд =====
// Данные лежат в window.TAMGA_MENU (файл data/menu.js правится телеграм-ботом).
// Скрипт подключён до js/main.js, поэтому вкладки и панели к его запуску уже в DOM.

(function renderMenu() {
  const root = document.getElementById('menuRoot');
  const data = window.TAMGA_MENU;
  if (!root || !data || !Array.isArray(data.sections)) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // --- Карусель: несколько ракурсов одного блюда, листается стрелками и свайпом.
  // Чтобы не грузить лишнего, src получает только первый кадр; остальные
  // подгружаются при первом взаимодействии с каруселью.
  function buildCarousel(photoBox, item) {
    const track = el('div', 'carousel__track');
    item.photos.forEach((src, i) => {
      const img = document.createElement('img');
      if (i === 0) img.src = src; else img.dataset.src = src;
      img.alt = item.alt || item.name;
      img.loading = 'lazy';
      track.appendChild(img);
    });
    photoBox.appendChild(track);

    const dots = el('div', 'carousel__dots');
    item.photos.forEach((_, i) => {
      dots.appendChild(el('span', i === 0 ? 'is-active' : ''));
    });

    const prev = el('button', 'carousel__arrow carousel__arrow--prev', '❮');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Предыдущее фото');
    const next = el('button', 'carousel__arrow carousel__arrow--next', '❯');
    next.type = 'button';
    next.setAttribute('aria-label', 'Следующее фото');
    photoBox.append(prev, next, dots);
    photoBox.classList.add('carousel');

    let index = 0;
    const count = item.photos.length;
    const imgs = track.children;

    function load(i) {
      const img = imgs[i];
      if (img && img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
    }

    function go(i) {
      index = (i + count) % count;
      load(index);
      load((index + 1) % count); // следующий кадр готовим заранее
      track.style.transform = `translateX(${-index * 100}%)`;
      Array.from(dots.children).forEach((d, n) => d.classList.toggle('is-active', n === index));
    }

    prev.addEventListener('click', (e) => { e.stopPropagation(); go(index - 1); });
    next.addEventListener('click', (e) => { e.stopPropagation(); go(index + 1); });

    // Свайп: горизонтальный жест листает, вертикальный оставляем странице
    let startX = 0, startY = 0, swiping = false;
    photoBox.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      swiping = true;
    }, { passive: true });
    photoBox.addEventListener('touchend', (e) => {
      if (!swiping) return;
      swiping = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    if (reduce) track.style.transition = 'none';
  }

  function buildCards(block) {
    const grid = el('div', 'menu__cards');
    block.items.forEach((item) => {
      if (item.hidden) return;
      const card = el('article', 'dish-card');
      const photoBox = el('div', 'dish-card__photo');
      if (Array.isArray(item.photos) && item.photos.length > 1) {
        buildCarousel(photoBox, item);
      } else {
        const img = document.createElement('img');
        img.src = item.photos[0];
        img.alt = item.alt || item.name;
        img.loading = 'lazy';
        photoBox.appendChild(img);
      }
      const body = el('div', 'dish-card__body');
      const head = el('div', 'dish-card__head');
      head.append(el('h3', '', item.name), el('span', 'dish-card__price', item.price));
      body.appendChild(head);
      if (item.desc) body.appendChild(el('p', 'dish-card__desc', item.desc));
      card.append(photoBox, body);
      grid.appendChild(card);
    });
    return grid;
  }

  function buildList(block) {
    const list = el('div', 'menu-list' + (block.cols ? ' menu-list--cols' : ''));
    block.items.forEach((item) => {
      if (item.hidden) return;
      const row = el('div', 'mitem');
      const head = el('div', 'mitem__head');
      head.append(el('h4', '', item.name), el('span', 'mitem__dots'), el('span', 'mitem__price', item.price));
      row.appendChild(head);
      if (item.desc) row.appendChild(el('p', 'mitem__desc', item.desc));
      list.appendChild(row);
    });
    return list;
  }

  function buildBlock(block) {
    if (block.type === 'note') return el('p', 'menu__note', block.text);
    if (block.type === 'subhead') {
      const h = el('h3', 'menu__subhead', block.text);
      if (block.note) {
        h.appendChild(document.createTextNode(' '));
        h.appendChild(el('span', 'menu__subnote', block.note));
      }
      return h;
    }
    if (block.type === 'cards') return buildCards(block);
    if (block.type === 'list') return buildList(block);
    return null;
  }

  // --- Вкладки и панели
  const tabs = el('div', 'menu__tabs');
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Разделы меню');
  root.appendChild(tabs);

  data.sections.forEach((section, s) => {
    const active = s === 0;
    const tab = el('button', 'menu__tab' + (active ? ' is-active' : ''), section.title);
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(active));
    tab.dataset.tab = section.id;
    tabs.appendChild(tab);

    const panel = el('div', 'menu__panel' + (active ? ' is-active' : ''));
    panel.dataset.panel = section.id;
    panel.setAttribute('role', 'tabpanel');
    if (!active) panel.hidden = true;

    if (section.columns) {
      const wrap = el('div', 'menu__drinks');
      section.columns.forEach((col) => {
        const box = document.createElement('div');
        col.forEach((block) => {
          const node = buildBlock(block);
          if (node) box.appendChild(node);
        });
        wrap.appendChild(box);
      });
      panel.appendChild(wrap);
    } else {
      (section.blocks || []).forEach((block) => {
        const node = buildBlock(block);
        if (node) panel.appendChild(node);
      });
    }
    root.appendChild(panel);
  });
})();
