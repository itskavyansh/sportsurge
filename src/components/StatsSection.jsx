import { useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';

const STATS = [
  { num: 500, suffix: '+', label: 'Athletes Registered', sub: 'and growing every week' },
  { num: 12,  suffix: '+', label: 'Sports Covered',      sub: 'from cricket to gymnastics' },
  { num: 8,   suffix: '',  label: 'Expert Coaches',       sub: 'certified professionals' },
  { num: 3,   suffix: 'x', label: 'Faster Scouting',     sub: 'vs traditional methods' },
];

function CountUp({ target, suffix, active }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const inc = target / (duration / step);
    const t = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(t);
  }, [active, target]);
  return <>{val}{suffix}</>;
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);
  const topRef = useReveal();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="relative overflow-hidden" style={{ background: '#13131a', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="section-wordmark stats-wordmark" aria-hidden="true">Services</div>
      {/* Animated lime scan line */}
      <div className="stats-scanline" />

      <div className="text-center max-w-[700px] mx-auto mb-16 reveal" ref={topRef}>
        <div className="section-label justify-center">By The Numbers</div>
        <h2 className="section-title">Our <span>Services</span></h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px max-w-[1100px] mx-auto" style={{ background: 'rgba(255,255,255,0.06)' }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="stat-card-new" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="stat-num">
              <CountUp target={s.num} suffix={s.suffix} active={active} />
            </div>
            <div className="stat-label-main">{s.label}</div>
            <div className="stat-label-sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
