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

  /* tech badges: floating 3D constellation — depth parallax, cursor tilt +
   * repel, flowing data links, scroll burst */
  const sc = $('#scene'), orbs = [...document.querySelectorAll('.orb')],
        orbitEl = $('.rv-orbit'), box = $('.rv-orbiters');
  const ANCH = [
    [-.9, -.72, .8], [.82, -.84, .3], [.98, -.04, .9], [.8, .66, .55],
    [.12, 1, .2], [-.84, .6, .65], [-.02, -1, .1], [-1, -.06, .4]
  ];
  const ORDER = [0, 6, 1, 2, 3, 4, 5, 7],
        clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const NS = 'http://www.w3.org/2000/svg',
        lsvg = document.createElementNS(NS, 'svg'),
        lg = document.createElementNS(NS, 'g');
  const mkLine = cls => {
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('class', cls);
    lg.appendChild(l);
    return l;
  };
  lsvg.setAttribute('class', 'rv-links');
  lsvg.appendChild(lg);
  const chain = ORDER.map(() => mkLine('chain')),
        spokes = orbs.map(() => mkLine('spoke'));
  if (box) box.prepend(lsvg);
  const pos = orbs.map(() => [0, 0]), tgx = orbs.map(() => 0),
        tgy = orbs.map(() => 0), tilX = orbs.map(() => 0),
        tilY = orbs.map(() => 0);
  let pmx = 0, pmy = 0, sx = 0, sy = 0, pcx = 0, pcy = 0, hasPtr = false,
      t0 = 0;
  addEventListener('pointermove', e => {
    pcx = e.clientX;
    pcy = e.clientY;
    hasPtr = e.pointerType !== 'touch';
    pmx = pcx / innerWidth * 2 - 1;
    pmy = pcy / innerHeight * 2 - 1;
  }, {passive: true});
  root.addEventListener('mouseleave', () => hasPtr = false);
  function orbit(now) {
    if (!sc || !orbs.length) return;
    if (!t0) t0 = now;
    const e = reduce ? 1 : 1 - Math.pow(1 - Math.min(1, (now - t0) / 1600), 3),
          t = reduce ? 0 : now / 1000, w = sc.clientWidth, h = sc.clientHeight,
          edge = innerWidth < 561 ? 30 : 42,
          Wx = Math.min(
              w / 2 - edge + 20, (orbitEl ? orbitEl.clientWidth : 300) * .82),
          Wy = h / 2 - 36, r = sc.getBoundingClientRect(), cx = r.left + w / 2,
          cy = r.top + h / 2,
          burst = 1 + Math.min(1, scrollY / innerHeight) * .5;
    sx += (pmx - sx) * .06;
    sy += (pmy - sy) * .06;
    lg.setAttribute('transform', `translate(${w / 2},${h / 2})`);
    orbs.forEach((el, i) => {
      const [ax, ay, z] = ANCH[i % ANCH.length],
                     bx = ax * Wx * burst * e +
          (reduce ? 0 : Math.sin(t * (.5 + i * .07) + i * 1.7) * 14) +
          sx * 30 * z,
                     by = ay * Wy * burst * e +
          (reduce ? 0 : Math.cos(t * (.42 + i * .05) + i * 2.3) * 18) +
          sy * 24 * z,
                     ddx = pcx - (cx + bx), ddy = pcy - (cy + by),
                     dist = Math.hypot(ddx, ddy) || 1,
                     push = hasPtr && dist < 150 ? (150 - dist) / 150 * 40 : 0;
      tgx[i] += (-ddx / dist * push - tgx[i]) * .14;
      tgy[i] += (-ddy / dist * push - tgy[i]) * .14;
      const x = bx + tgx[i], y = by + tgy[i],
            ry = (hasPtr ? clamp(ddx / 9, -28, 28) : 0) +
          Math.sin(t * .9 + i) * 8,
            rx = (hasPtr ? clamp(-ddy / 9, -28, 28) : 0) +
          Math.cos(t * .8 + i * 1.3) * 6;
      tilX[i] += (rx - tilX[i]) * .12;
      tilY[i] += (ry - tilY[i]) * .12;
      el.style.transform =
          `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${
              ((.7 + .42 * z) * (.6 + .4 * e)).toFixed(3)})`;
      el.style.zIndex = z > .5 ? 10 : 1;
      el.style.opacity = ((.8 + .2 * z) * Math.min(1, e * 1.4)).toFixed(2);
      const ic = el.firstElementChild && el.firstElementChild.firstElementChild;
      if (ic) {
        ic.style.setProperty('--rx', tilX[i].toFixed(1) + 'deg');
        ic.style.setProperty('--ry', tilY[i].toFixed(1) + 'deg');
        ic.style.setProperty('--gx', (50 - tilY[i] * 1.6).toFixed(0) + '%');
        ic.style.setProperty('--gy', (50 + tilX[i] * 1.6).toFixed(0) + '%');
      }
      pos[i] = [x, y];
      spokes[i].setAttribute('x1', x.toFixed(1));
      spokes[i].setAttribute('y1', y.toFixed(1));
      spokes[i].setAttribute('x2', 0);
      spokes[i].setAttribute('y2', 0);
    });
    chain.forEach((l, k) => {
      const A = pos[ORDER[k]], B = pos[ORDER[(k + 1) % ORDER.length]];
      l.setAttribute('x1', A[0].toFixed(1));
      l.setAttribute('y1', A[1].toFixed(1));
      l.setAttribute('x2', B[0].toFixed(1));
      l.setAttribute('y2', B[1].toFixed(1));
    });
  }

  /* one frame loop: marquee skew + smooth clock (same transform format as
   * portal.js) */
  const hh = $('#hour-hand'), mh = $('#minute-hand'), sh = $('#second-hand');
  (function tick(now = 0) {
    sk += (Math.max(-10, Math.min(10, vel * .35)) - sk) * .12;
    vel *= .85;
    if (mq && !reduce) mq.style.setProperty('--sk', sk.toFixed(2) + 'deg');
    const d = new Date(), s = d.getSeconds() + d.getMilliseconds() / 1000,
          m = d.getMinutes() + s / 60, h = d.getHours() % 12 + m / 60;
    hh.style.transform = `translateX(-50%) rotate(${h * 30}deg)`;
    mh.style.transform = `translateX(-50%) rotate(${m * 6}deg)`;
    sh.style.transform = `translateX(-50%) rotate(${s * 6}deg)`;
    orbit(now);
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
        let x, y;
        if (e.target === t) {
          x = e.offsetX;
          y = e.offsetY;
        } else {
          const tr = t.getBoundingClientRect();
          x = e.clientX - tr.left;
          y = e.clientY - tr.top;
        }
        t.style.setProperty('--cx', x + 'px');
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