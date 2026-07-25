// ===== Ресторан «Тамга» — интерактив =====

// Шапка: фон при прокрутке
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

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

// Год в подвале
document.getElementById('year').textContent = new Date().getFullYear();
