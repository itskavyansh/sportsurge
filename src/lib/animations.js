/**
 * Sport Surge — Anime.js v4 Animation System
 * Clean, seamless, no jitter.
 */
import { animate, createTimeline, onScroll, stagger, utils } from 'animejs';

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
// Safe querySelector — returns null if not found
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Shared scroll trigger: fires once when element enters viewport
const scrollOnce = (target, offset = 80) => onScroll({
  target,
  enter: `bottom-=${offset} bottom`,
  once:  true,
});

/* ─────────────────────────────────────────────
   1. NAVBAR — staggered letter drop on load
   ───────────────────────────────────────────── */
export function initNavbarAnim() {
  const logo = $('[data-logo]') || $('.nav-logo');
  if (!logo) return;

  // Only wrap if not already wrapped
  if (!logo.querySelector('.nav-char')) {
    const raw = logo.innerHTML;
    logo.innerHTML = raw.replace(/([A-Z])/g, '<span class="nav-char">$1</span>');
  }

  const chars = $$('.nav-char');
  if (!chars.length) return;

  // Set initial state via JS, not CSS — avoids double-hidden flash
  chars.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(-16px)'; });

  animate('.nav-char', {
    opacity:    [0, 1],
    translateY: [-16, 0],
    delay:      stagger(45, { start: 200 }),
    duration:   500,
    ease:       'outCubic',
  });
}

/* ─────────────────────────────────────────────
   2. HERO — gentle scroll parallax (no sync mode)
      Uses native scroll listener for smoothness
   ───────────────────────────────────────────── */
export function initHeroParallax() {
  const hero = $('#hero');
  if (!hero) return;

  let ticking = false;

  const update = () => {
    const heroH = hero.offsetHeight;
    const winH  = window.innerHeight;
    const maxScroll = heroH - winH;
    if (maxScroll <= 0) return;

    const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

    const title    = $('.hero-title');
    const label    = $('.hero-label');
    const subtitle = $('.hero-subtitle');
    const desc     = $('.hero-desc');
    const ctas     = $('.hero-ctas');

    if (title)    { title.style.transform    = `translateY(${progress * -50}px)`;  title.style.opacity    = String(1 - progress * 0.8); }
    if (label)    { label.style.transform    = `translateY(${progress * -25}px)`;  label.style.opacity    = String(1 - progress * 0.9); }
    if (subtitle) { subtitle.style.transform = `translateY(${progress * -20}px)`;  subtitle.style.opacity = String(1 - progress * 0.9); }
    if (desc)     { desc.style.transform     = `translateY(${progress * -15}px)`;  desc.style.opacity     = String(1 - progress * 0.9); }
    if (ctas)     { ctas.style.transform     = `translateY(${progress * -10}px)`;  ctas.style.opacity     = String(1 - progress * 0.9); }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   3. ABOUT — one-shot timeline on scroll enter
   ───────────────────────────────────────────── */
export function initAboutAnim() {
  const section = $('#about');
  if (!section) return;

  // Set initial states via JS
  const label   = section.querySelector('.section-label');
  const title   = section.querySelector('.section-title');
  const paras   = section.querySelectorAll('p');
  const feats   = section.querySelectorAll('.about-feat');
  const imgWrap = section.querySelector('.about-image-wrap');

  [label, title, imgWrap].forEach(el => { if (el) { el.style.opacity = '0'; } });
  paras.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; });
  feats.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateX(-20px)'; });
  if (imgWrap) imgWrap.style.transform = 'translateX(40px)';
  if (label)   label.style.transform   = 'translateX(-30px)';
  if (title)   title.style.transform   = 'translateX(-40px)';

  let fired = false;
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || fired) return;
    fired = true;
    obs.disconnect();

    createTimeline({ defaults: { ease: 'outCubic' } })
      .add(label,   { opacity: [0,1], translateX: [-30,0], duration: 550 }, 0)
      .add(title,   { opacity: [0,1], translateX: [-40,0], duration: 650 }, 80)
      .add(paras,   { opacity: [0,1], translateY: [16,0],  duration: 450, delay: stagger(60) }, 250)
      .add(feats,   { opacity: [0,1], translateX: [-20,0], duration: 400, delay: stagger(70) }, 400)
      .add(imgWrap, { opacity: [0,1], translateX: [40,0],  duration: 700 }, 150);

  }, { threshold: 0.15 });

  obs.observe(section);
}

/* ─────────────────────────────────────────────
   4. FEATURES — staggered cards on scroll
   ───────────────────────────────────────────── */
export function initFeaturesAnim() {
  const section = $('#features');
  if (!section) return;

  const cards = section.querySelectorAll('.feature-card-new');
  const nums  = section.querySelectorAll('.feature-num');

  cards.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(36px)'; });
  nums.forEach(el  => { el.style.opacity = '0'; el.style.transform = 'scale(0.6)'; });

  let fired = false;
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || fired) return;
    fired = true;
    obs.disconnect();

    animate(cards, {
      opacity:    [0, 1],
      translateY: [36, 0],
      delay:      stagger(70),
      duration:   600,
      ease:       'outCubic',
    });

    animate(nums, {
      opacity:  [0, 1],
      scale:    [0.6, 1],
      delay:    stagger(70, { start: 100 }),
      duration: 500,
      ease:     'outCubic',
    });

  }, { threshold: 0.1 });

  obs.observe(section);
}

/* ─────────────────────────────────────────────
   5. STATS — cards + numbers on scroll
   ───────────────────────────────────────────── */
export function initStatsAnim() {
  const section = $('#stats');
  if (!section) return;

  const cards = section.querySelectorAll('.stat-card-new');
  const nums  = section.querySelectorAll('.stat-num');

  cards.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; });
  nums.forEach(el  => { el.style.opacity = '0'; });

  let fired = false;
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || fired) return;
    fired = true;
    obs.disconnect();

    animate(cards, {
      opacity:    [0, 1],
      translateY: [30, 0],
      delay:      stagger(90),
      duration:   600,
      ease:       'outCubic',
    });

    animate(nums, {
      opacity: [0, 1],
      delay:   stagger(90, { start: 150 }),
      duration: 500,
      ease:    'outCubic',
    });

  }, { threshold: 0.2 });

  obs.observe(section);
}

/* ─────────────────────────────────────────────
   6. COACHES — slide-up stagger on scroll
   ───────────────────────────────────────────── */
export function initCoachesAnim() {
  const section = $('#coaches');
  if (!section) return;

  const cards = section.querySelectorAll('.coach-card');
  cards.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(40px)'; });

  let fired = false;
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || fired) return;
    fired = true;
    obs.disconnect();

    animate(cards, {
      opacity:    [0, 1],
      translateY: [40, 0],
      delay:      stagger(100),
      duration:   650,
      ease:       'outCubic',
    });

  }, { threshold: 0.1 });

  obs.observe(section);
}

/* ─────────────────────────────────────────────
   7. EVENTS — card slide-up on scroll
   ───────────────────────────────────────────── */
export function initEventsAnim() {
  const section = $('#events');
  if (!section) return;

  const card = section.querySelector('.events-card');
  if (!card) return;

  card.style.opacity   = '0';
  card.style.transform = 'translateY(30px)';

  let fired = false;
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || fired) return;
    fired = true;
    obs.disconnect();

    animate(card, {
      opacity:    [0, 1],
      translateY: [30, 0],
      duration:   600,
      ease:       'outCubic',
    });

  }, { threshold: 0.2 });

  obs.observe(section);
}

/* ─────────────────────────────────────────────
   8. FOOTER — wordmark + links on scroll
   ───────────────────────────────────────────── */
export function initFooterAnim() {
  const footer = $('#footer');
  if (!footer) return;

  const wordmark = footer.querySelector('.footer-wordmark');
  const links    = footer.querySelectorAll('.footer-link');

  if (wordmark) { wordmark.style.opacity = '0'; wordmark.style.transform = 'translateX(60px)'; }
  links.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateX(-16px)'; });

  let fired = false;
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || fired) return;
    fired = true;
    obs.disconnect();

    if (wordmark) {
      animate(wordmark, {
        opacity:    [0, 1],
        translateX: [60, 0],
        duration:   900,
        ease:       'outCubic',
      });
    }

    animate(links, {
      opacity:    [0, 1],
      translateX: [-16, 0],
      delay:      stagger(40),
      duration:   400,
      ease:       'outCubic',
    });

  }, { threshold: 0.1 });

  obs.observe(footer);
}

/* ─────────────────────────────────────────────
   9. SECTION LABELS — slide-in on scroll
      (replaced clip-path wipe — more reliable)
   ───────────────────────────────────────────── */
export function initSectionLabels() {
  $$('.section-label').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(12px)';

    let fired = false;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired) return;
      fired = true;
      obs.disconnect();
      animate(el, {
        opacity:    [0, 1],
        translateY: [12, 0],
        duration:   500,
        ease:       'outCubic',
      });
    }, { threshold: 0.5 });

    obs.observe(el);
  });
}

/* ─────────────────────────────────────────────
   10. FLOATING PARTICLES — ambient lime dots
   ───────────────────────────────────────────── */
export function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const DOTS = Array.from({ length: 22 }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.2 + 0.4,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    a:  Math.random() * 0.25 + 0.06,
  }));

  let rafId;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    DOTS.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,240,0,${d.a})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }
  draw();

  const onResize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', onResize, { passive: true });
}

/* ─────────────────────────────────────────────
   11. MAGNETIC BUTTONS — throttled cursor pull
   ───────────────────────────────────────────── */
export function initMagneticButtons() {
  $$('.btn-primary, .btn-register, .reg-btn-primary').forEach(btn => {
    let anim = null;

    btn.addEventListener('mousemove', (e) => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;

      // Cancel previous and start fresh — prevents stacking
      if (anim) anim.cancel();
      anim = animate(btn, {
        translateX: dx,
        translateY: dy,
        duration:   250,
        ease:       'outQuad',
      });
    });

    btn.addEventListener('mouseleave', () => {
      if (anim) anim.cancel();
      anim = animate(btn, {
        translateX: 0,
        translateY: 0,
        duration:   500,
        ease:       'outCubic',
      });
    });
  });
}

/* ─────────────────────────────────────────────
   12. SCROLL PROGRESS BAR — native, no anime
   ───────────────────────────────────────────── */
export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${pct})`;
      ticking = false;
    });
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   INIT ALL
   ───────────────────────────────────────────── */
export function initAllAnimations() {
  // Use requestAnimationFrame to ensure DOM is fully painted
  requestAnimationFrame(() => {
    initNavbarAnim();
    initHeroParallax();
    initAboutAnim();
    initFeaturesAnim();
    initStatsAnim();
    initCoachesAnim();
    initEventsAnim();
    initFooterAnim();
    initSectionLabels();
    initParticles();
    initMagneticButtons();
    initScrollProgress();
  });
}
