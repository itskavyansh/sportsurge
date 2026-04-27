import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// All positions are % of the canvas (x = from left, y = from top)
// Frame windows chosen from direct inspection of the 240-frame sequence:
//   0–25   → full body front, face + all joints visible
//   25–65  → zooming into chest/upper body front
//   65–105 → rotating to back — shoulders dominant
//   105–155 → pure back view — upper back
//   155–185 → side view — hips, elbow, wrist at waist
//   185–215 → lower body side → knee rises into frame
//   215–239 → ankle/foot dominant
const HOTSPOTS = [
  // TMJ: jaw line, right side — visible in early full-body frames
  { id: 'hs-tmj',      x: 53, y: 10, frames: [5,  30],  label: 'TMJ',        sub: 'Temporomandibular Joint', joint: 'tmj',      side: 'right' },
  // Neck: nape/cervical spine — back-view frames, neck centered at top
  { id: 'hs-neck',     x: 51, y: 7,  frames: [80, 130], label: 'Neck',       sub: 'Cervical Spine',          joint: 'neck',     side: 'left'  },
  // Shoulder: top of left deltoid — front view zoom
  { id: 'hs-shoulder', x: 63, y: 25, frames: [30, 65],  label: 'Shoulder',   sub: 'Glenohumeral Joint',     joint: 'shoulder', side: 'right' },
  // Elbow: left elbow visible in side view
  { id: 'hs-elbow',    x: 30, y: 45, frames: [155,185], label: 'Elbow',      sub: 'Humeroulnar Joint',      joint: 'elbow',    side: 'left'  },
  // Wrist: hand/wrist at hip in side view
  { id: 'hs-wrist',    x: 68, y: 55, frames: [155,195], label: 'Wrist',      sub: 'Radiocarpal Joint',      joint: 'wrist',    side: 'right' },
  // Hip: hip joint visible in side/lower-body frames
  { id: 'hs-hip',      x: 62, y: 35, frames: [185,215], label: 'Hip',        sub: 'Acetabulofemoral Joint', joint: 'hip',      side: 'right' },
  // Knee: raised knee dominant in lower-body frames
  { id: 'hs-knee',     x: 40, y: 50, frames: [195,225], label: 'Knee',       sub: 'Tibiofemoral Joint',     joint: 'knee',     side: 'left'  },
  // Ankle: foot/ankle in final frames
  { id: 'hs-ankle',    x: 42, y: 78, frames: [215,239], label: 'Ankle',      sub: 'Talocrural Joint',       joint: 'ankle',    side: 'left'  },
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
            {/* 3D glass orb */}
            <div className="hotspot-orb">
              <div className="hotspot-orb-inner"></div>
              <div className="hotspot-orb-spec"></div>
            </div>
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
