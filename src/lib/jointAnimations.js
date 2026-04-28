import { animate, createTimeline, stagger } from 'animejs';

const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

export function initJointPageAnim() {
  requestAnimationFrame(() => {
    // ── Hero entrance timeline ──────────────────
    const tag   = document.querySelector('.jp-hero-tag');
    const title = document.querySelector('.jp-hero-title');
    const desc  = document.querySelector('.jp-hero-desc');
    const stats = document.querySelectorAll('.jp-stat');

    // Set initial states via JS only
    if (tag)   { tag.style.opacity   = '0'; tag.style.transform   = 'translateY(-12px)'; }
    if (title) { title.style.opacity = '0'; title.style.transform = 'translateY(20px)'; }
    if (desc)  { desc.style.opacity  = '0'; desc.style.transform  = 'translateY(16px)'; }
    stats.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px) scale(0.95)'; });

    createTimeline({ defaults: { ease: 'outCubic' } })
      .add(tag,   { opacity: [0,1], translateY: [-12,0], duration: 400 }, 0)
      .add(title, { opacity: [0,1], translateY: [20,0],  duration: 600 }, 100)
      .add(desc,  { opacity: [0,1], translateY: [16,0],  duration: 500 }, 300)
      .add(stats, { opacity: [0,1], translateY: [20,0], scale: [0.95,1], delay: stagger(80), duration: 450 }, 450);

    // ── Scroll-triggered sections ───────────────
    const makeObs = (elements, animFn, threshold = 0.15) => {
      if (!elements.length) return;
      let fired = false;
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || fired) return;
        fired = true;
        obs.disconnect();
        animFn(elements);
      }, { threshold });
      obs.observe(elements[0]);
    };

    // Anatomy rows
    const anats = $$('.jp-anat');
    anats.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateX(-24px)'; });
    makeObs(anats, (els) => animate(els, {
      opacity:    [0, 1],
      translateX: [-24, 0],
      delay:      stagger(70),
      duration:   500,
      ease:       'outCubic',
    }));

    // Injury cards
    const injs = $$('.jp-inj');
    injs.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateX(24px)'; });
    makeObs(injs, (els) => animate(els, {
      opacity:    [0, 1],
      translateX: [24, 0],
      delay:      stagger(70),
      duration:   500,
      ease:       'outCubic',
    }));

    // Recovery steps
    const fixes = $$('.jp-fix');
    fixes.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; });
    makeObs(fixes, (els) => animate(els, {
      opacity:    [0, 1],
      translateY: [20, 0],
      delay:      stagger(60),
      duration:   450,
      ease:       'outCubic',
    }));

    // Footer joint links
    const footLinks = $$('.jp-foot-link');
    footLinks.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; });
    makeObs(footLinks, (els) => animate(els, {
      opacity:    [0, 1],
      translateY: [12, 0],
      delay:      stagger(35),
      duration:   350,
      ease:       'outCubic',
    }), 0.05);

    // Bar nav links
    const barLinks = $$('.jp-bar-link');
    barLinks.forEach(el => { el.style.opacity = '0'; });
    animate(barLinks, {
      opacity: [0, 1],
      delay:   stagger(40, { start: 100 }),
      duration: 400,
      ease:    'outCubic',
    });
  });
}
