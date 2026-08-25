// ===== Мерцание по всему сайту =====
// Тёплые пылинки-угольки плывут поверх страницы от начала до конца.
// На светлых разделах это едва заметная бронзовая пыль в солнечном
// луче, на тёмных сценах — искры от огня. Слой сам подстраивается
// под то, над чем сейчас находится экран.

(function initMotes() {
  const canvas = document.getElementById('motesCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let motes = [];
  let t = 0;

  // Насколько тёмен фон под экраном: 0 — пергамент, 1 — ночь у огня
  let darkness = 0;
  let darknessTarget = 0;
  const DARK = '.jscene--hero, .jscene--fire, .jscene--wall, .section--night, .footer';

  const rand = (a, b) => a + Math.random() * (b - a);

  function spawn(anywhere) {
    return {
      x: rand(0, w),
      y: anywhere ? rand(0, h) : h + rand(4, 40),
      r: rand(0.6, 2.2),
      vy: rand(0.08, 0.42),
      drift: rand(-0.12, 0.12),
      phase: rand(0, Math.PI * 2),
      swing: rand(0.4, 1.4),
      alpha: rand(0.25, 1),
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = w < 640 ? 26 : w < 1200 ? 42 : 60;
    motes = Array.from({ length: n }, () => spawn(true));
  }

  // Раз в четверть секунды смотрим, тёмная ли секция сейчас на экране
  function senseBackground() {
    let dark = 0;
    const mid = h * 0.5;
    document.querySelectorAll(DARK).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < mid && r.bottom > mid) dark = 1;
    });
    darknessTarget = dark;
  }

  function step(dt) {
    t += dt;
    darkness += (darknessTarget - darkness) * Math.min(1, dt * 2.2);
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      m.y -= m.vy;
      m.x += m.drift + Math.sin(t * m.swing + m.phase) * 0.22;
      if (m.y < -12 || m.x < -20 || m.x > w + 20) motes[i] = spawn(false);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Светлый фон — бронзовая пыль; тёмный — живая искра
    const r = Math.round(169 + darkness * 86);
    const g = Math.round(136 + darkness * 60);
    const b = Math.round(79 + darkness * 37);
    const base = 0.24 + darkness * 0.34;
    for (const m of motes) {
      const flick = 0.7 + 0.3 * Math.sin(t * (1.6 + m.swing) + m.phase);
      const a = m.alpha * base * flick;
      if (a <= 0.004) continue;
      const radius = m.r * (1.25 + darkness * 1.75);
      const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
      grad.addColorStop(1, `rgba(${r}, ${Math.round(g * 0.7)}, ${Math.round(b * 0.5)}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let raf = null, running = false, last = 0, sense = 0;

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    sense += dt;
    if (sense > 0.25) { sense = 0; senseBackground(); }
    step(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    senseBackground();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  resize();
  window.addEventListener('resize', () => { stop(); resize(); start(); });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
})();
