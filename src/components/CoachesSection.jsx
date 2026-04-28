import { useRef } from 'react';
import useReveal from '../hooks/useReveal';

const COACHES = [
  { img: '/images/coach_danish.png',  name: 'Danish',         role: 'Physiotherapist', desc: 'Sports physio specialist with 3+ years treating elite athletes across disciplines.' },
  { img: '/images/coach_pooja.png',   name: 'Pooja Bansal',   role: 'Fitness Coach',   desc: 'Mobility, power, and injury prevention programs for peak performance.' },
  { img: '/images/coach_carlos.png',  name: 'Carlos Ben Silva',role: 'Sports Analyst',  desc: 'Film study and performance metrics to sharpen tactical awareness.' },
  { img: '/images/coach_james.png',   name: 'James Smith',    role: 'Skills Coach',    desc: 'Biomechanical precision in footwork, handles, and shooting mechanics.' },
];

export default function CoachesSection() {
  const headerRef = useReveal();

  return (
    <section id="coaches" className="relative overflow-hidden" style={{ background: '#0e0e12' }}>
      <div className="text-center max-w-[600px] mx-auto mb-14 reveal relative z-10" ref={headerRef}>
        <div className="section-label justify-center before:hidden">Expert Mentors</div>
        <h2 className="section-title">Meet Our <span>Coaches</span></h2>
        <p className="text-[--text-secondary] text-[0.95rem] leading-[1.8]">
          World-class professionals dedicated to unlocking your full athletic potential.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1100px] mx-auto relative z-10">
        {COACHES.map((c, i) => (
          <CoachCard key={c.name} coach={c} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function CoachCard({ coach, delay }) {
  const ref = useReveal();
  const cardRef = useRef(null);

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / 20;
    const y = (e.clientY - r.top  - r.height / 2) / 20;
    el.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
  };

  const handleLeave = (e) => {
    const el = cardRef.current;
    if (el) el.style.transform = '';
  };

  return (
    <div
      className="coach-card reveal"
      ref={(el) => { ref.current = el; cardRef.current = el; }}
      style={{ transitionDelay: `${delay}s` }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="coach-img-wrap">
        <img src={coach.img} alt={`${coach.name} — ${coach.role}`} loading="lazy" />
        <div className="coach-img-overlay" />
        {/* Lime corner accent */}
        <div className="coach-corner" />
      </div>
      <div className="p-5">
        <h3 className="font-[var(--font-display)] text-[1.1rem] text-[--text-primary] mb-0.5 tracking-wide uppercase">{coach.name}</h3>
        <span className="coach-role-tag">{coach.role}</span>
        <p className="text-[0.8rem] text-[--text-secondary] leading-relaxed mt-2">{coach.desc}</p>
      </div>
    </div>
  );
}
