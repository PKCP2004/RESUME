/* ================================================================
   PUSHPAK KUMAR — PORTFOLIO JS 2025
   Fixes: mobile menu, testimonial slider (no display:none),
          skill bars, counters, active nav, back-to-top
================================================================ */

/* ── PRELOADER ── */
(function () {
  const bar = document.getElementById('preBar');
  const cnt = document.getElementById('preCount');
  const pre = document.getElementById('preloader');
  let val = 0;
  const id = setInterval(() => {
    val += Math.random() * 10 + 3;
    if (val >= 100) {
      val = 100;
      clearInterval(id);
      setTimeout(() => {
        pre.style.transition = 'opacity 0.7s ease';
        pre.style.opacity = '0';
        setTimeout(() => { pre.style.display = 'none'; }, 720);
      }, 350);
    }
    if (bar) bar.style.width = val + '%';
    if (cnt) cnt.textContent = Math.floor(val) + '%';
  }, 75);
})();

/* ── BACKGROUND CANVAS — subtle drifting chart lines ── */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, lines;

  function buildLines() {
    lines = Array.from({ length: 4 }, (_, i) => {
      const pts = [];
      let y = H * (0.25 + i * 0.18);
      for (let x = 0; x <= W + 100; x += 70) {
        y += (Math.random() - 0.48) * 36;
        y = Math.max(H * 0.05, Math.min(H * 0.95, y));
        pts.push({ x, y });
      }
      return { pts, offset: 0, speed: 0.15 + i * 0.08, color: `rgba(201,168,76,${0.05 + i * 0.015})` };
    });
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildLines();
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    lines.forEach(line => {
      line.offset = (line.offset + line.speed) % W;
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1;
      line.pts.forEach((pt, i) => {
        const x = ((pt.x - line.offset) % W + W) % W;
        if (i === 0) ctx.moveTo(x, pt.y);
        else ctx.lineTo(x, pt.y);
      });
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── HEADER SCROLL ── */
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ── MOBILE MENU ── */
const mobBtn     = document.getElementById('mobileBtn');
const mobOverlay = document.getElementById('mobOverlay');
const mobClose   = document.getElementById('mobClose');

function openMob() {
  if (!mobOverlay || !mobBtn) return;
  mobOverlay.classList.add('open');
  mobBtn.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMob() {
  if (!mobOverlay || !mobBtn) return;
  mobOverlay.classList.remove('open');
  mobBtn.classList.remove('open');
  document.body.style.overflow = '';
}

if (mobBtn)     mobBtn.addEventListener('click', openMob);
if (mobClose)   mobClose.addEventListener('click', closeMob);
if (mobOverlay) {
  mobOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob));
  // close on overlay bg tap
  mobOverlay.addEventListener('click', function(e) {
    if (e.target === mobOverlay) closeMob();
  });
}

/* ── SCROLL ANIMATIONS ── */
const animEls = document.querySelectorAll('.fade_down, .zoom_in, .flip_up');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  animEls.forEach(el => obs.observe(el));
} else {
  // Fallback — show all immediately
  animEls.forEach(el => el.classList.add('show'));
}

/* ── SKILL BARS ── */
const fills = document.querySelectorAll('.sb-fill');
if (fills.length && 'IntersectionObserver' in window) {
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(el => skillObs.observe(el));
}

/* ── HERO STAT COUNTERS ── */
function animCount(el) {
  const target = parseFloat(el.dataset.count);
  const isFloat = String(target).includes('.');
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = target * ease;
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
if ('IntersectionObserver' in window) {
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); cObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('.hs-n').forEach(el => cObs.observe(el));
}

/* ── ACTIVE NAV ON SCROLL ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nl, .sn');

function updateNav() {
  const scrollY = window.scrollY + 140;
  let cur = '';
  sections.forEach(s => { if (s.offsetTop <= scrollY) cur = s.id; });
  navLinks.forEach(l => {
    const href = l.getAttribute('href');
    l.classList.toggle('active', href === '#' + cur);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── TESTIMONIALS SLIDER (overflow + transform approach) ── */
(function () {
  const wrap   = document.querySelector('.testi-wrap');
  const slider = document.getElementById('testiSlider');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  const dotsWrap = document.getElementById('tDots');
  if (!slider || !wrap) return;

  const cards = Array.from(slider.querySelectorAll('.testi-card'));
  const total = cards.length;
  let cur = 0;

  function perView() {
    if (window.innerWidth > 1000) return 3;
    if (window.innerWidth > 640)  return 2;
    return 1;
  }

  function pageCount() { return Math.ceil(total / perView()); }

  function render(page) {
    cur = ((page % pageCount()) + pageCount()) % pageCount();
    const pv  = perView();
    const gap = 16;
    const cardW = (slider.offsetWidth - gap * (pv - 1)) / pv;

    // Layout all cards side by side
    slider.style.position = 'relative';
    slider.style.overflow = 'hidden';
    slider.style.height   = '';          // auto height

    // Find tallest card in current page to set container height
    let maxH = 0;
    cards.forEach((c, i) => {
      const inPage = (i >= cur * pv && i < (cur + 1) * pv);
      c.style.position  = 'absolute';
      c.style.width     = cardW + 'px';
      c.style.top       = '0';
      c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      const col = i - cur * pv;
      if (inPage) {
        c.style.left    = (col * (cardW + gap)) + 'px';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
        c.style.pointerEvents = 'auto';
        c.style.visibility = 'visible';
        // Measure height
        c.style.display = 'block';
        if (c.offsetHeight > maxH) maxH = c.offsetHeight;
      } else {
        c.style.opacity = '0';
        c.style.transform = 'translateY(10px)';
        c.style.pointerEvents = 'none';
        c.style.visibility = 'hidden';
      }
    });
    // Give slider explicit height so it doesn't collapse
    if (maxH > 0) slider.style.height = maxH + 'px';

    // Dots
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.t-dot').forEach((d, i) =>
        d.classList.toggle('active', i === cur));
    }
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pageCount(); i++) {
      const d = document.createElement('div');
      d.className = 't-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => render(i));
      dotsWrap.appendChild(d);
    }
  }

  function init() { buildDots(); render(0); }

  if (prevBtn) prevBtn.addEventListener('click', () => render(cur - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => render(cur + 1));

  // Auto-advance
  let auto = setInterval(() => render(cur + 1), 5000);
  wrap.addEventListener('mouseenter', () => clearInterval(auto));
  wrap.addEventListener('mouseleave', () => { auto = setInterval(() => render(cur + 1), 5000); });

  // Swipe support for mobile
  let tX = 0;
  slider.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend',   e => {
    const diff = tX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? render(cur + 1) : render(cur - 1);
  }, { passive: true });

  init();
  window.addEventListener('resize', init);
})();

/* ── BACK TO TOP ── */
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── COPY PROTECTION (desktop only) ── */
(function () {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
                  || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isTouch) {
    document.addEventListener('copy', e => {
      e.preventDefault();
      alert('Copying content is disabled. Please contact the site owner.');
    });
  }
})();

/* ── TYPING EFFECT ── */
(function() {
  const el = document.getElementById('typed-out');
  if (!el) return;
  const phrases = [
    'Pushpak Kumar Charan Pahari.',
    'a CA Finalist.',
    'a Finance Analyst.',
    'a Code Builder.',
    'an RBI Top Performer.'
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 55 : 95);
  }
  setTimeout(tick, 1800);
})();

/* ── 3D TILT on section cards (desktop only) ── */
(function() {
  if (window.innerWidth < 900) return;
  document.querySelectorAll('.svc-card, .aw-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      this.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
})();

/* ── CV DOWNLOAD — force download via fetch blob (works on all servers) ── */
function downloadCV() {
  const pdfPath = 'assets/pdf/PUSHPAK KUMAR _Resume.pdf';
  // Try fetch + blob first (works on server), fallback to direct link
  fetch(pdfPath)
    .then(function(response) {
      if (!response.ok) throw new Error('fetch failed');
      return response.blob();
    })
    .then(function(blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Pushpak_Kumar_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
    .catch(function() {
      // Fallback: open in new tab
      window.open(pdfPath, '_blank');
    });
}
