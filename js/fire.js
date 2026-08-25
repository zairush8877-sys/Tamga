// ===== Живой огонь в печи =====
// Пламя рисуется целиком в canvas: языки поднимаются из углей, дрожат
// и гаснут, над устьем взлетают искры. Ничего не повторяется по кругу,
// как в видео, и не весит ни байта трафика.

(function initFire() {
  const flames = document.getElementById('fireCanvas');
  const sparks = document.getElementById('emberCanvas');
  if (!flames) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fx = flames.getContext('2d');
  const sx = sparks ? sparks.getContext('2d') : null;

  let fw = 0, fh = 0, sw = 0, sh = 0, dpr = 1;
  let tongues = [];   // языки пламени
  let embers = [];    // искры над печью
  let t = 0;

  const rand = (a, b) => a + Math.random() * (b - a);

  function sizeCanvas(canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return [rect.width, rect.height];
  }

  function spawnTongue(midLife) {
    const life = rand(0.75, 1.7);
    return {
      x: fw * 0.5 + rand(-0.3, 0.3) * fw,
      y: fh * rand(0.86, 0.96),
      vx: rand(-0.18, 0.18),
      vy: -rand(0.9, 2.1),
      r: rand(0.06, 0.13) * fw,
      life: midLife ? rand(0, life) : life,
      maxLife: life,
      wobble: rand(0, Math.PI * 2),
      speed: rand(1.6, 3.4),
    };
  }

  function spawnEmber(fromBottom) {
    return {
      x: sw * (0.5 + rand(-0.16, 0.16)),
      y: fromBottom ? sh * rand(0.62, 0.72) : rand(0, sh),
      r: rand(0.7, 2.1),
      vy: rand(0.25, 0.85),
      drift: rand(-0.22, 0.22),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.25, 0.8),
      fade: rand(0.0012, 0.004),
    };
  }

  function build() {
    const n = fw < 220 ? 40 : 64;
    tongues = Array.from({ length: n }, () => spawnTongue(true));
    if (sx) {
      const m = sw < 720 ? 22 : 38;
      embers = Array.from({ length: m }, () => spawnEmber(false));
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    [fw, fh] = sizeCanvas(flames, fx);
    if (sx) [sw, sh] = sizeCanvas(sparks, sx);
    build();
  }

  // Цвет по возрасту языка: белое ядро → золото → оранжевый → багровый дым
  function flameColor(k) {
    if (k > 0.86) return [255, 236, 186];
    if (k > 0.62) return [255, 194, 92];
    if (k > 0.34) return [255, 146, 44];
    return [206, 62, 16];
  }

  function drawFlames(dt) {
    fx.clearRect(0, 0, fw, fh);

    // Раскалённые угли внизу устья
    const coalPulse = 0.72 + 0.28 * Math.sin(t * 2.1);
    const coals = fx.createRadialGradient(fw * 0.5, fh * 0.95, 0, fw * 0.5, fh * 0.95, fw * 0.62);
    coals.addColorStop(0, `rgba(255, 190, 96, ${0.85 * coalPulse})`);
    coals.addColorStop(0.42, `rgba(226, 96, 24, ${0.5 * coalPulse})`);
    coals.addColorStop(1, 'rgba(90, 20, 6, 0)');
    fx.fillStyle = coals;
    fx.fillRect(0, fh * 0.5, fw, fh * 0.5);

    fx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < tongues.length; i++) {
      const f = tongues[i];
      f.life -= dt * f.speed * 0.5;
      if (f.life <= 0) { tongues[i] = spawnTongue(false); continue; }

      const k = f.life / f.maxLife;                       // 1 — только родился
      f.wobble += dt * 3.2;
      f.x += (f.vx + Math.sin(f.wobble) * 0.5) * f.speed * dt * 60 * 0.3;
      f.y += f.vy * f.speed * dt * 60 * 0.35;

      const [r, g, b] = flameColor(k);
      const radius = f.r * (0.28 + Math.sin((1 - k) * Math.PI) * 0.85);
      const alpha = Math.min(1, k * 1.3) * 0.34;
      const grad = fx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      grad.addColorStop(1, `rgba(${r}, ${Math.round(g * 0.4)}, 0, 0)`);
      fx.fillStyle = grad;
      fx.beginPath();
      fx.arc(f.x, f.y, radius, 0, Math.PI * 2);
      fx.fill();
    }
    fx.globalCompositeOperation = 'source-over';

    // Поленья силуэтом на фоне пламени
    fx.fillStyle = 'rgba(24, 12, 5, .82)';
    fx.beginPath();
    fx.ellipse(fw * 0.38, fh * 0.965, fw * 0.3, fh * 0.045, -0.12, 0, Math.PI * 2);
    fx.fill();
    fx.beginPath();
    fx.ellipse(fw * 0.63, fh * 0.985, fw * 0.28, fh * 0.04, 0.1, 0, Math.PI * 2);
    fx.fill();
  }

  function drawSparks(dt) {
    if (!sx) return;
    sx.clearRect(0, 0, sw, sh);
    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];
      e.y -= e.vy;
      e.x += e.drift + Math.sin(t * 2 + e.phase) * 0.32;
      e.alpha -= e.fade;
      if (e.y < -10 || e.alpha <= 0.02) { embers[i] = spawnEmber(true); continue; }
      const flick = 0.72 + 0.28 * Math.sin(t * 7 + e.phase);
      const glow = sx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3.4);
      glow.addColorStop(0, `rgba(255, 196, 116, ${e.alpha * flick})`);
      glow.addColorStop(1, 'rgba(255, 110, 30, 0)');
      sx.fillStyle = glow;
      sx.beginPath();
      sx.arc(e.x, e.y, e.r * 3.4, 0, Math.PI * 2);
      sx.fill();
    }
  }

  let raf = null, running = false, last = 0;

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    t += dt;
    drawFlames(dt);
    drawSparks(dt);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  resize();
  window.addEventListener('resize', () => { stop(); resize(); reduce ? drawFlames(0.016) : start(); });

  const scene = flames.closest('.jscene') || flames.parentElement;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? start() : stop()));
  }, { rootMargin: '20% 0px' });
  io.observe(scene);

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  if (reduce) { drawFlames(0.016); drawSparks(0.016); }
})();
