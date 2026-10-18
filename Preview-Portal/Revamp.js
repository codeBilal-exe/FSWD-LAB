/* revamp.js — motion layer. Runs after portal.js; adds classes/vars only. */
(() => {
  const $ = s => document.querySelector(s), root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('rv');
  window.__rvClock = 1;

  /* scroll: progress bar, stack explode (--p), marquee skew from scroll
   * velocity */
  const bar = $('#progress'), mq = $('.rv-marquee');
  let ly = scrollY, sk = 0, vel = 0;
  addEventListener('scroll', () => {
    const y = scrollY, max = root.scrollHeight - innerHeight;
    root.style.setProperty('--p', Math.min(1, y / innerHeight).toFixed(3));
    if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    vel = y - ly;
    ly = y;
  }, {passive: true});

  /* mouse parallax on the 3D stack */
  $('.hero')?.addEventListener('pointermove', e => {
    root.style.setProperty('--mx', (e.clientX / innerWidth * 2 - 1).toFixed(2));
    root.style.setProperty(
        '--my', (e.clientY / innerHeight * 2 - 1).toFixed(2));
  });

  /* one frame loop: marquee skew + smooth clock (same transform format as
   * portal.js) */
  const hh = $('#hour-hand'), mh = $('#minute-hand'), sh = $('#second-hand');
  (function tick() {
    sk += (Math.max(-10, Math.min(10, vel * .35)) - sk) * .12;
    vel *= .85;
    if (mq && !reduce) mq.style.setProperty('--sk', sk.toFixed(2) + 'deg');
    const d = new Date(), s = d.getSeconds() + d.getMilliseconds() / 1000,
          m = d.getMinutes() + s / 60, h = d.getHours() % 12 + m / 60;
    hh.style.transform = `translateX(-50%) rotate(${h * 30}deg)`;
    mh.style.transform = `translateX(-50%) rotate(${m * 6}deg)`;
    sh.style.transform = `translateX(-50%) rotate(${s * 6}deg)`;
    requestAnimationFrame(tick);
  })();

  /* reveal on scroll */
  const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
        setTimeout(() => {
          e.target.style.removeProperty('--d');
          e.target.style.removeProperty('--rd');
        }, 1600);
      }),
      {threshold: .12, rootMargin: '0px 0px -6% 0px'});
  const watch = el => reduce ? el.classList.add('in') : io.observe(el);
  document.querySelectorAll('[data-reveal]').forEach(watch);

  /* gallery is re-rendered by portal.js on every route change: stagger + reveal
   * each new card */
  const g = $('#gallery');
  const scan = () => {
    g.querySelectorAll('.grp:not([data-reveal])').forEach(el => {
      el.dataset.reveal = '';
      watch(el);
    });
    g.querySelectorAll('.grid').forEach(
        grid =>
            grid.querySelectorAll('.card:not([data-fx])').forEach((c, i) => {
              c.dataset.fx = '';
              c.style.setProperty('--d', (i % 4) * 90 + 'ms');
              watch(c);
            }));
    g.querySelectorAll('.thumb:not([data-ld])').forEach(t => {
      t.dataset.ld = '';
      const fr = t.querySelector('iframe');
      if (!fr) return;
      t.classList.add('loading');
      const done = () => t.classList.remove('loading');
      fr.addEventListener('load', done, {once: true});
      setTimeout(done, 5000);
    });
  };
  let q = 0;
  new MutationObserver(() => {
    cancelAnimationFrame(q);
    q = requestAnimationFrame(scan);
  }).observe(g, {childList: true});
  scan();

  /* 3D tilt toward the cursor */
  if (!reduce) {
    g.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const t = e.target.closest('.thumb');
      if (t) {
        const tr = t.getBoundingClientRect(), y = e.clientY - tr.top;
        t.style.setProperty('--cx', (e.clientX - tr.left) + 'px');
        t.style.setProperty('--cy', y + 'px');
        t.style.setProperty('--sy', y + 'px');
      }
      const c = e.target.closest('.card');
      if (!c) return;
      const r = c.getBoundingClientRect(),
            x = (e.clientX - r.left) / r.width - .5,
            y = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
      c.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg');
    });
    g.addEventListener('pointerout', e => {
      const c = e.target.closest('.card');
      if (c && !c.contains(e.relatedTarget)) {
        c.style.removeProperty('--rx');
        c.style.removeProperty('--ry');
      }
    });
  }

  /* preview window: replay the 3D entrance whenever a lab loads */
  const f = $('#frame');
  f.addEventListener('load', () => {
    if (f.src.endsWith('about:blank')) return;
    f.classList.remove('fx-in');
    void f.offsetWidth;
    f.classList.add('fx-in');
  });
})();