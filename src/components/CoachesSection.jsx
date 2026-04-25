import useReveal from '../hooks/useReveal';

const COACHES = [
  { img: '/images/coach_danish.png', name: 'Danish', role: 'Physiotherapist', desc: 'Sports physiotherapy specialist with 3+ years treating and optimizing performance for elite athletes across disciplines.' },
  { img: '/images/coach_pooja.png', name: 'Pooja Bansal', role: 'Fitness Coach', desc: 'Personalized programs focused on mobility, power, and injury prevention — helping athletes perform at their peak.' },
  { img: '/images/coach_carlos.png', name: 'Carlos Ben Silva', role: 'Sports Analyst', desc: 'Film study and performance metrics specialist who sharpens decision-making and tactical awareness on the court.' },
  { img: '/images/coach_james.png', name: 'James Smith', role: 'Skills Coach', desc: 'Handles, footwork, and shooting mechanics perfected through structured repetition and biomechanical precision.' },
];

export default function CoachesSection() {
  const headerRef = useReveal();

  return (
    <section id="coaches" className="bg-black">
      <div className="text-center max-w-[600px] mx-auto mb-14 reveal" ref={headerRef}>
        <div className="section-label justify-center before:hidden">Expert Mentors</div>
        <h2 className="section-title">Meet Our <span>Coaches</span></h2>
        <p className="text-[--text-secondary] text-[0.95rem] leading-[1.8]">
          World-class professionals dedicated to unlocking your full athletic potential.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1100px] mx-auto">
        {COACHES.map((c, i) => (
          <CoachCard key={c.name} coach={c} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function CoachCard({ coach, delay }) {
  const ref = useReveal();
  return (
    <div className="coach-card reveal" ref={ref} style={{ transitionDelay: `${delay}s` }}>
      <div className="coach-img-wrap">
        <img src={coach.img} alt={`${coach.name} — ${coach.role}`} loading="lazy" />
        <div className="coach-img-overlay"></div>
      </div>
      <div className="p-5">
        <h3 className="font-[var(--font-display)] text-base font-bold text-white mb-0.5">{coach.name}</h3>
        <span className="text-[0.7rem] text-[--accent] font-semibold tracking-widest uppercase mb-2.5 block">{coach.role}</span>
        <p className="text-[0.8rem] text-[--text-secondary] leading-relaxed">{coach.desc}</p>
      </div>
    </div>
  );
}
