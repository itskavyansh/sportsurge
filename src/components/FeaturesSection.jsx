import { Building2, Route, Briefcase, ShieldCheck, CalendarDays, Tag } from 'lucide-react';
import useReveal from '../hooks/useReveal';

const FEATURES = [
  { icon: Building2, title: 'Virtual HQ on Roam', desc: 'Your central hub for live events, networking, and collaboration. Stay connected with the sport community 24/7 from anywhere in India.' },
  { icon: Route, title: 'Virtual Pathways & Programming', desc: "Curated education in business, performance, leadership, and personal development tailored for the modern athlete's journey." },
  { icon: Briefcase, title: 'Career & Business Resources', desc: 'Opportunities, accelerators, job placement partners, and practical tools designed specifically for growth in the sports ecosystem.' },
  { icon: ShieldCheck, title: 'Professional Services', desc: 'Trusted providers in branding, finance, mental performance, leadership coaching, and much more to fuel your career.' },
  { icon: CalendarDays, title: 'In-Person & Virtual Events', desc: 'From business summits to local meetups, we bring the sports community together year-round with purpose-driven events.' },
  { icon: Tag, title: 'Exclusive Product Discounts', desc: 'Access exclusive deals on premium sports gear, health products, nutrition supplements, and custom athlete services.' },
];

export default function FeaturesSection() {
  const headerRef = useReveal();

  return (
    <section id="features" className="bg-black text-center">
      <div className="max-w-[700px] mx-auto mb-14 reveal" ref={headerRef}>
        <div className="section-label justify-center before:hidden">What We Offer</div>
        <h2 className="section-title">Everything an <span>Athlete Needs</span></h2>
        <p className="text-[--text-secondary] text-[0.95rem] leading-[1.8]">
          From networking and education to career resources and exclusive deals — Sport Surge is your complete sports ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature, delay }) {
  const ref = useReveal();
  const Icon = feature.icon;
  return (
    <div className="feature-card reveal" ref={ref} style={{ transitionDelay: `${delay}s` }}>
      <div className="feature-icon">
        <Icon size={24} strokeWidth={1.8} color="var(--accent)" />
      </div>
      <h3 className="font-[var(--font-display)] text-base font-bold text-white mb-2.5 tracking-tight">{feature.title}</h3>
      <p className="text-[0.85rem] text-[--text-secondary] leading-relaxed">{feature.desc}</p>
    </div>
  );
}
