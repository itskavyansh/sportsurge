import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HOTSPOTS = [
  { id: 'hs-nape',      x: 52, y: 16, frames: [80, 120], label: 'Nape',       sub: 'Cervical Spine',       joint: 'nape',      side: 'right' },
  { id: 'hs-shoulder',  x: [55,81], y: [80,25], frames: [50, 70], label: 'Shoulder', sub: 'Glenohumeral Joint', joint: 'shoulder',  side: 'right' },
  { id: 'hs-elbow',     x: 60, y: 15, frames: [185, 220], label: 'Elbow',     sub: 'Humeroulnar Joint',    joint: 'elbow',     side: 'right' },
  { id: 'hs-wrist',     x: 55, y: 65, frames: [185, 220], label: 'Wrist',     sub: 'Radiocarpal Joint',    joint: 'wrist',     side: 'right' },
  { id: 'hs-lowerback', x: 50, y: 58, frames: [155, 188], label: 'Lower Back',sub: 'Lumbar Spine',         joint: 'lowerback', side: 'left'  },
  { id: 'hs-knee',      x: 59, y: 73, frames: [188, 218], label: 'Knee',      sub: 'Tibiofemoral Joint',   joint: 'knee',      side: 'right' },
  { id: 'hs-ankle',     x: 57, y: 88, frames: [218, 239], label: 'Ankle',     sub: 'Talocrural Joint',     joint: 'ankle',     side: 'right' },
];

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const heroContentRef = useRef(null);
  const hsRefs = useRef({});
  const stateRef = useRef({ current: 0, target: 0 });
  const framesRef = useRef(new Array(240));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const TOTAL = 240;
    const ZOOM = 1.0;
    const LERP = 0.08;
    const frames = framesRef.current;
    const state = stateRef.current;
    let rafId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawBlended(fi) {
      const lo = Math.floor(fi);
      const hi = Math.min(lo + 1, TOTAL - 1);
      const alpha = fi - lo;
      const imgLo = frames[lo], imgHi = frames[hi];
      if (!imgLo || !imgLo.naturalWidth) return;
      const cw = canvas.width, ch = canvas.height;
      const iw = imgLo.naturalWidth, ih = imgLo.naturalHeight;
      const base = Math.max(cw / iw, ch / ih) * ZOOM;
      const sw = iw * base, sh = ih * base;
      const dx = (cw - sw) / 2, dy = (ch - sh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalAlpha = 1;
      ctx.drawImage(imgLo, dx, dy, sw, sh);
      if (imgHi && imgHi.naturalWidth && alpha > 0) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(imgHi, dx, dy, sw, sh);
        ctx.globalAlpha = 1;
      }
    }

    function positionHotspot(hs, fi) {
      const el = hsRefs.current[hs.id];
      if (!el) return;
      let cx = hs.x, cy = hs.y;
      if (Array.isArray(hs.x) || Array.isArray(hs.y)) {
        const [show, hide] = hs.frames;
        const progress = Math.max(0, Math.min(1, (fi - show) / (hide - show)));
        if (Array.isArray(hs.x)) cx = hs.x[0] + (hs.x[1] - hs.x[0]) * progress;
        if (Array.isArray(hs.y)) cy = hs.y[0] + (hs.y[1] - hs.y[0]) * progress;
      }
      el.style.left = cx + '%';
      el.style.top = cy + '%';
    }

    function updateHotspots(fi) {
      HOTSPOTS.forEach((hs) => {
        const el = hsRefs.current[hs.id];
        if (!el) return;
        const [show, hide] = hs.frames;
        if (fi >= show && fi <= hide) {
          el.classList.add('visible');
          positionHotspot(hs, fi);
        } else {
          el.classList.remove('visible');
        }
      });
    }

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function updateTextAnim(fi) {
      const el = heroContentRef.current;
      if (!el) return;
      const progress = Math.min(fi / 20, 1);
      const eased = easeOutCubic(progress);
      el.style.transform = `translateY(${(1 - eased) * -55}px)`;
      el.style.opacity = 0.3 + eased * 0.7;
    }

    function onScroll() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const progress = Math.min(Math.max(window.scrollY / (hero.offsetHeight - window.innerHeight), 0), 1);
      state.target = progress * (TOTAL - 1);
    }

    function loop() {
      const diff = state.target - state.current;
      if (Math.abs(diff) > 0.05) {
        state.current += diff * LERP;
        drawBlended(state.current);
        updateHotspots(state.current);
        updateTextAnim(state.current);
      }
      rafId = requestAnimationFrame(loop);
    }

    // Load frames
    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.src = `/athlete_frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
      img.onload = () => { if (i === 0) { drawBlended(0); updateTextAnim(0); } };
      frames[i] = img;
    }

    // Initial positions
    HOTSPOTS.forEach((hs) => positionHotspot(hs, 0));

    resize();
    window.addEventListener('resize', () => { resize(); drawBlended(state.current); HOTSPOTS.forEach((hs) => positionHotspot(hs, state.current)); });
    window.addEventListener('scroll', onScroll, { passive: true });
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section id="hero">
      <div className="hero-sticky">
        <canvas id="hero-canvas" ref={canvasRef}></canvas>
        <div className="hero-overlay"></div>

        <div className="hero-content" ref={heroContentRef}>
          <div className="hero-label">India's #1 Sports Portal</div>
          <p className="hero-subtitle">The Lifestyle That Keeps You</p>
          <h1 className="hero-title">ENERGIZED</h1>
          <p className="hero-desc">
            Sport Surge blends form, focus, and fire — made to move with you, keep you cool under pressure, and elevate every session from grassroots to national glory.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="btn-primary">Register Now →</Link>
            <a href="#about" className="btn-secondary" onClick={(e) => { e.preventDefault(); document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }}>Read More</a>
          </div>
        </div>

        <div className="scroll-hint">Scroll</div>

        {HOTSPOTS.map((hs) => (
          <div
            key={hs.id}
            id={hs.id}
            className={`hotspot side-${hs.side}`}
            ref={(el) => { hsRefs.current[hs.id] = el; }}
          >
            <div className="hotspot-dot"></div>
            <div className="hotspot-line"></div>
            <Link className="hotspot-card" to={`/joint/${hs.joint}`}>
              <h4>{hs.label}</h4>
              <span>{hs.sub}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
