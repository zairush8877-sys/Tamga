// ===== Погружение: сцены «пути вглубь» =====
// Каждая сцена [data-scene] — обёртка выше экрана, внутри липкий .jstage.
// Пока обёртка проматывается, доля пройденного пути пишется в CSS-переменную
// --p (0..1) на .jstage — все движения слоёв заданы в CSS через calc(var(--p)).

(function initDepth() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = Array.from(document.querySelectorAll('[data-scene]')).map((el) => ({
    el,
    stage: el.querySelector('.jstage'),
    top: 0,
    span: 1,
    p: -1,
  })).filter((s) => s.stage);
  if (!scenes.length) return;

  function measure() {
    for (const s of scenes) {
      const rect = s.el.getBoundingClientRect();
      s.top = rect.top + window.scrollY;
      s.span = Math.max(1, s.el.offsetHeight - window.innerHeight);
    }
  }

  function update() {
    const y = window.scrollY;
    for (const s of scenes) {
      const p = Math.min(1, Math.max(0, (y - s.top) / s.span));
      if (p !== s.p) {
        s.p = p;
        s.stage.style.setProperty('--p', p.toFixed(4));
        s.el.classList.toggle('is-live', p > 0.001 && p < 0.999);
      }
    }
    ticking = false;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); });
  // после загрузки шрифтов и картинок высоты могут поменяться
  window.addEventListener('load', () => { measure(); update(); });
  measure();
  update();

  // --- Видео сцен: играют только на экране и только если движение разрешено
  const videos = document.querySelectorAll('.jstage video');
  if (reduce) {
    videos.forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
  } else {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause();
      });
    }, { rootMargin: '25% 0px' });
    videos.forEach((v) => vio.observe(v));
  }
})();
