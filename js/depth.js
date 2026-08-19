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

  // --- Угли над очагом: лёгкий канвас на сцене огня
  const canvas = document.getElementById('emberCanvas');
  if (!canvas || reduce) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let embers = [];

  function resizeEmbers() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = w < 720 ? 26 : 44;
    embers = Array.from({ length: n }, () => spawn(true));
  }

  function spawn(anywhere) {
    return {
      x: w * (0.5 + (Math.random() - 0.5) * 0.7),
      y: anywhere ? Math.random() * h : h + 10,
      r: 0.8 + Math.random() * 2.1,
      vy: 0.35 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.55,
    };
  }

  let t = 0;
  function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];
      e.y -= e.vy;
      e.x += e.drift + Math.sin(t * 2 + e.phase) * 0.3;
      const flicker = 0.75 + Math.sin(t * 6 + e.phase) * 0.25;
      if (e.y < -12) embers[i] = spawn(false);
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3.2);
      g.addColorStop(0, `rgba(255, 190, 110, ${e.alpha * flicker})`);
      g.addColorStop(1, 'rgba(255, 120, 40, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  let raf = null;
  let running = false;
  const eio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !running) {
        running = true;
        resizeEmbers();
        frame();
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
  }, { threshold: 0 });
  eio.observe(canvas);
  window.addEventListener('resize', () => { if (running) resizeEmbers(); });
})();
