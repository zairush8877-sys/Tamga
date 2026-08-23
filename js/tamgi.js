// ===== Родовые тамги: тайные знаки на заглавном экране =====
// Знаки перерисованы с рельефной стены в зале ресторана. Они не летают —
// они проявляются из глубины, как тиснение на старой стене, недолго живут
// и растворяются, уступая место другим. Курсор — свет факела: знак рядом
// с ним разгорается тёплым золотом, как резьба, выхваченная из темноты.

const TAMGI_PATHS = [
  // трискелион — три луча с загнутыми концами
  'M50 50 C56 45 63 40 61 31 C59 23 49 21 45 28 M50 50 C51.3 57.7 52.2 66.3 61 69 C68.9 71.3 75.6 63.6 71.6 56.7 M50 50 C42.7 47.3 34.8 43.7 28 50 C22.1 55.7 25.4 65.4 33.4 65.3',
  // дуга с перекладиной и двумя завитками
  'M24 48 A26 22 0 0 1 76 48 M30 44 H70 M24 48 L24 60 C24 70 36 70 36 60 M76 48 L76 60 C76 70 64 70 64 60',
  // арка с крючками на концах
  'M26 66 C26 36 74 36 74 66 M26 66 C26 73 19 73 19 67 M74 66 C74 73 81 73 81 67',
  // розетка: круг с четырьмя завитками
  'M50 24 A26 26 0 1 1 49.9 24 M50 50 C56 47 62 49 61 55 C60 60 53 60 51 55 M50 50 C53 56 51 62 45 61 C40 60 40 53 45 51 M50 50 C44 53 38 51 39 45 C40 40 47 40 49 45 M50 50 C47 44 49 38 55 39 C60 40 60 47 55 49',
  // восьмёрка
  'M50 18 A15 15 0 1 1 49.9 18 M50 52 A15 15 0 1 1 49.9 52',
  // «ᴨ» с завитками на ножках
  'M30 68 L30 40 C30 30 70 30 70 40 L70 68 M30 68 C30 75 22 75 22 69 M70 68 C70 75 78 75 78 69',
  // парные крюки с точкой посередине
  'M30 68 C30 40 44 40 44 60 C44 68 36 68 36 62 M70 68 C70 40 56 40 56 60 C56 68 64 68 64 62 M50 46 A3 3 0 1 1 49.9 46',
  // «Т» с изогнутым основанием
  'M50 24 L50 60 M31 70 C31 60 69 60 69 70',
  // крюк на подставке
  'M34 34 C34 24 46 24 46 34 L46 62 M46 62 H66 M66 62 L66 74 M34 74 H66 M34 74 L34 62',
  // овал с двумя штрихами
  'M50 28 A18 22 0 1 1 49.9 28 M44 36 L44 64 M56 36 L56 64',
  // круг между скобок
  'M50 38 A12 12 0 1 1 49.9 38 M28 32 C18 42 18 58 28 68 M72 32 C82 42 82 58 72 68',
  // трезубец с загнутыми концами
  'M28 28 L28 58 C28 68 40 68 40 58 M50 22 L50 62 C50 70 58 70 58 64 M72 28 L72 58 C72 68 60 68 60 58',
  // подкова с хордой
  'M26 34 C26 72 74 72 74 34 M30 56 C42 62 58 62 70 56',
  // песочные часы с перекрестием
  'M30 26 L70 26 L50 50 L70 74 L30 74 L50 50 Z M43 43 L57 57 M57 43 L43 57',
  // дуга на завитых ножках
  'M25 58 C25 32 75 32 75 58 M25 58 C25 67 34 67 34 60 M75 58 C75 67 66 67 66 60',
  // пара встречных спиралей
  'M40 72 C24 72 20 50 36 46 C48 43 52 58 42 60 C36 61 34 54 39 52 M60 72 C76 72 80 50 64 46 C52 43 48 58 58 60 C64 61 66 54 61 52',
];

(function initTamgi() {
  const canvas = document.getElementById('tamgiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paths = TAMGI_PATHS.map((d) => new Path2D(d));

  let w = 0, h = 0, dpr = 1;
  let marks = [];
  const pointer = { x: -9999, y: -9999, active: false };

  function countForWidth(px) {
    if (px < 640) return 7;
    if (px < 1100) return 10;
    return 14;
  }

  // Жизнь знака: тихое проявление -> присутствие с «дыханием» -> растворение.
  // Времена в секундах; каждый знак живёт в своём ритме.
  function spawn(startMidLife) {
    const depth = 0.35 + Math.random() * 0.65;       // глубина: дальние — меньше и тусклее
    const size = 40 + depth * 78;
    const mark = {
      path: paths[Math.floor(Math.random() * paths.length)],
      size,
      x: size * 0.7 + Math.random() * Math.max(1, w - size * 1.4),
      y: size * 0.7 + Math.random() * Math.max(1, h - size * 1.4),
      rot: (Math.random() - 0.5) * 0.28,             // лёгкий наклон, без вращения
      driftX: (Math.random() - 0.5) * 0.045,         // едва заметный дрейф
      driftY: -0.02 - Math.random() * 0.035,         // чуть всплывают, как дым
      depth,
      breathPhase: Math.random() * Math.PI * 2,
      breathSpeed: 0.25 + Math.random() * 0.3,
      fadeIn: 2.6 + Math.random() * 2.2,
      hold: 5 + Math.random() * 7,
      fadeOut: 3 + Math.random() * 2.5,
      age: 0,
      lit: 0,
    };
    if (startMidLife) mark.age = Math.random() * (mark.fadeIn + mark.hold);
    return mark;
  }

  function build() {
    marks = Array.from({ length: countForWidth(w) }, () => spawn(true));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  // Огибающая жизни: 0 -> 1 -> 0
  function envelope(m) {
    if (m.age < m.fadeIn) {
      const t = m.age / m.fadeIn;
      return t * t;                                  // проявление ускоряется к концу
    }
    if (m.age < m.fadeIn + m.hold) return 1;
    const t = (m.age - m.fadeIn - m.hold) / m.fadeOut;
    return Math.max(0, 1 - t * t);
  }

  let time = 0;
  function step(dt) {
    time += dt;
    for (let i = 0; i < marks.length; i++) {
      const m = marks[i];
      m.age += dt;
      m.x += m.driftX;
      m.y += m.driftY;

      // Свет «факела»: чем ближе курсор, тем ярче разгорается знак
      let target = 0;
      if (pointer.active) {
        const dist = Math.hypot(m.x - pointer.x, m.y - pointer.y);
        const reach = 230;
        if (dist < reach) {
          const k = 1 - dist / reach;
          target = k * k;
        }
      }
      m.lit += (target - m.lit) * Math.min(1, dt * 4);   // разгорается и гаснет плавно

      if (m.age > m.fadeIn + m.hold + m.fadeOut || m.y < -m.size) {
        marks[i] = spawn(false);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const m of marks) {
      const env = reduce ? 1 : envelope(m);
      if (env <= 0.004) continue;
      const breath = 0.78 + 0.22 * Math.sin(time * m.breathSpeed + m.breathPhase);
      // Базовое присутствие — почти неразличимое, как тиснение на стене
      const base = (0.07 + m.depth * 0.12) * env * breath;
      const alpha = Math.min(0.9, base + m.lit * 0.6);

      // Знак «выходит из глубины»: за жизнь едва заметно приближается
      const grow = 0.94 + 0.1 * Math.min(1, m.age / (m.fadeIn + m.hold));
      const s = (m.size / 100) * grow;

      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rot);
      ctx.scale(s, s);
      ctx.translate(-50, -50);
      // Тёплое свечение появляется только рядом со «светом факела»
      if (m.lit > 0.02) {
        ctx.shadowColor = `rgba(255, 196, 110, ${m.lit * 0.85})`;
        ctx.shadowBlur = (10 + 26 * m.lit) / s;
      }
      const warm = m.lit;
      ctx.lineWidth = 2.7 / s;
      ctx.strokeStyle = `rgba(${224 + warm * 31}, ${206 + warm * 6}, ${172 - warm * 30}, ${alpha})`;
      ctx.stroke(m.path);
      ctx.restore();
    }
  }

  let raf = null;
  let running = false;
  let last = 0;

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    step(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reduce) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  resize();
  window.addEventListener('resize', () => {
    stop();
    resize();
    reduce ? draw() : start();
  });

  const hero = canvas.closest('.hero') || canvas.parentElement;
  hero.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });

  // Считаем только пока герой на экране и вкладка активна
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
  }, { threshold: 0 });
  io.observe(canvas);

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  if (reduce) draw();
})();
