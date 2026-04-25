import { Target, ClipboardList, Users, Rocket } from 'lucide-react';
import useReveal from '../hooks/useReveal';

const STATS = [
  { icon: Target, title: 'Our Goal', desc: 'Train harder, play smarter, perform stronger — the Sport Surge philosophy in action.' },
  { icon: ClipboardList, title: 'Complete Programs', desc: 'End-to-end conditioning, drills, and analytics designed for measurable performance gains.' },
  { icon: Users, title: 'Coaches & Sessions', desc: 'Elite mentors with personalized sessions crafted to your sport and skill level.' },
  { icon: Rocket, title: 'Start Confident', desc: 'Clear plans, measurable gains, and real results from your very first session.' },
];

export default function StatsSection() {
  const topRef = useReveal();

  return (
    <section id="stats" className="bg-[#0a0a0a] border-t border-b border-[--border]">
      <div className="text-center max-w-[800px] mx-auto mb-16 reveal" ref={topRef}>
        <div className="section-label justify-center">Our Pillars</div>
        <h2 className="section-title text-center">Train Harder. Play <span>Smarter</span>.</h2>
        <p className="text-[--text-secondary] text-base leading-[1.8] mt-4">
          Our dedicated team blends data-driven plans with real-world experience to elevate your strength, strategy, and confidence on and off the field.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1100px] mx-auto">
        {STATS.map((s, i) => (
          <StatCard key={s.title} stat={s} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ stat, delay }) {
  const ref = useReveal();
  const Icon = stat.icon;
  return (
    <div className="stat-card reveal" ref={ref} style={{ transitionDelay: `${delay}s` }}>
      <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-[rgba(255,107,0,0.1)] flex items-center justify-center">
        <Icon size={22} strokeWidth={1.8} color="var(--accent)" />
      </div>
      <h3 className="font-[var(--font-display)] text-[0.9rem] font-bold text-[--accent] mb-2.5 uppercase tracking-wider">{stat.title}</h3>
      <p className="text-[0.82rem] text-[--text-secondary] leading-relaxed">{stat.desc}</p>
    </div>
  );
}
