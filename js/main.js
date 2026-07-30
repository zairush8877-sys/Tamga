// ===== Ресторан «Тамга» — интерактив =====

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.getElementById('header');
const progressBar = document.getElementById('scrollProgress');
const toTop = document.getElementById('toTop');
const heroPhoto = document.querySelector('.hero__photo');
const heroContent = document.querySelector('.hero__content');

// Всё, что зависит от прокрутки, — в одном обработчике через requestAnimationFrame
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 40);
  toTop.classList.toggle('is-visible', y > 600);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = scrollable > 0 ? `${(y / scrollable) * 100}%` : '0';

  // Параллакс героя: фон уезжает медленнее страницы, текст — быстрее и тает.
  // Через `translate`, а не `transform`, чтобы не спорить с анимацией Ken Burns.
  if (!reduceMotion && y < window.innerHeight) {
    heroPhoto.style.translate = `0 ${y * 0.35}px`;
    heroContent.style.translate = `0 ${y * 0.18}px`;
    heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)));
  }
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
onScroll();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav__link')) {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Вкладки меню
const tabs = document.querySelectorAll('.menu__tab');
const panels = document.querySelectorAll('.menu__panel');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach((p) => {
      p.classList.remove('is-active');
      p.hidden = true;
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.querySelector(`.menu__panel[data-panel="${tab.dataset.tab}"]`);
    panel.classList.add('is-active');
    panel.hidden = false;
  });
});

// Галерея: лайтбокс
const galleryItems = Array.from(document.querySelectorAll('#galleryGrid .gallery__item img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxIndex = 0;

function openLightbox(i) {
  lightboxIndex = (i + galleryItems.length) % galleryItems.length;
  const img = galleryItems[lightboxIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

galleryItems.forEach((img, i) => {
  img.closest('.gallery__item').addEventListener('click', () => openLightbox(i));
});
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => openLightbox(lightboxIndex - 1));
document.getElementById('lightboxNext').addEventListener('click', () => openLightbox(lightboxIndex + 1));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') openLightbox(lightboxIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(lightboxIndex + 1);
});

// Форма бронирования: минимальная дата — сегодня
const dateInput = document.getElementById('date');
dateInput.min = new Date().toISOString().split('T')[0];

// Валидация и отправка (демо: без бэкенда заявка просто подтверждается на странице)
const form = document.getElementById('bookingForm');
const status = document.getElementById('bookingStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach((field) => {
    const ok = field.value.trim() !== '' && field.checkValidity();
    field.classList.toggle('is-invalid', !ok);
    if (!ok) valid = false;
  });

  const phone = form.phone.value.replace(/[^\d+]/g, '');
  if (phone.length < 10) {
    form.phone.classList.add('is-invalid');
    valid = false;
  }

  status.classList.remove('is-ok', 'is-error');
  if (!valid) {
    status.textContent = 'Пожалуйста, заполните выделенные поля.';
    status.classList.add('is-error');
    return;
  }

  const name = form.name.value.trim();
  status.textContent = `Спасибо, ${name}! Заявка принята — мы перезвоним в течение 15 минут.`;
  status.classList.add('is-ok');
  form.reset();
  dateInput.min = new Date().toISOString().split('T')[0];
});

// ===== Анимации появления =====

// Элементы, которые проявляются при прокрутке. Для сеток задаём каскад:
// каждый следующий элемент стартует чуть позже соседа.
const revealGroups = [
  { selector: '.section__eyebrow, .section__title, .menu__tabs, .menu__note', stagger: 0 },
  { selector: '.about__text p, .about__features', stagger: 90 },
  { selector: '.about__card', stagger: 120, extra: 'reveal--zoom' },
  { selector: '.gallery__item', stagger: 70, extra: 'reveal--zoom' },
  { selector: '.booking__text p, .booking__perks', stagger: 100, extra: 'reveal--left' },
  { selector: '.booking__form', stagger: 0, extra: 'reveal--right' },
  { selector: '.contacts__card', stagger: 130 },
];

revealGroups.forEach(({ selector, stagger, extra }) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (extra) el.classList.add(extra);
    if (stagger) el.style.transitionDelay = `${(i % 6) * stagger}ms`;
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Заголовки секций дополнительно помечаем, чтобы прорисовался орнамент
document.querySelectorAll('.section__title').forEach((el) => revealObserver.observe(el));

// Счётчики в блоке «О нас» — числа набегают при появлении
const counters = document.querySelectorAll('.about__num[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    counterObserver.unobserve(entry.target);
    const el = entry.target;
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
counters.forEach((el) => counterObserver.observe(el));

// Подсветка текущего раздела в навигации
const navLinks = Array.from(document.querySelectorAll('.nav__link'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

// Полоса-«прицел» на середине экрана: активна та секция, что её пересекает.
// Порог держим нулевым — иначе длинные секции (меню) никогда не дают нужную долю.
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((l) => l.classList.remove('is-current'));
    const link = navLinks.find((l) => l.getAttribute('href') === `#${entry.target.id}`);
    if (link) link.classList.add('is-current');
  });
}, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => navObserver.observe(s));

// Год в подвале
document.getElementById('year').textContent = new Date().getFullYear();
