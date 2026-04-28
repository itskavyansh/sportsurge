import { Building2, Route, Briefcase, ShieldCheck, CalendarDays, Tag } from 'lucide-react';
import useReveal from '../hooks/useReveal';

const FEATURES = [
  { icon: Building2,    title: 'Virtual HQ',         desc: 'Your central hub for live events, networking, and collaboration 24/7.' },
  { icon: Route,        title: 'Pathways',           desc: 'Curated education in business, performance, and leadership.' },
  { icon: Briefcase,    title: 'Career Resources',   desc: 'Opportunities, accelerators, and job placement partners.' },
  { icon: ShieldCheck,  title: 'Pro Services',       desc: 'Trusted providers in branding, finance, and mental performance.' },
  { icon: CalendarDays, title: 'Events',             desc: 'Business summits to local meetups — year-round community.' },
  { icon: Tag,          title: 'Product Discounts',  desc: 'Exclusive deals on premium sports gear and nutrition.' },
];

export default function FeaturesSection() {
  const headerRef = useReveal();

  return (
    <section id="features" className="relative overflow-hidden" style={{ background: '#0e0e12' }}>
      <div className="section-wordmark features-wordmark" aria-hidden="true">Plans</div>
      
      {/* Animated grid lines */}
      <div className="features-grid" />
    
      <div className="max-w-[700px] mx-auto mb-14 reveal text-center relative z-10" ref={headerRef}>
        <div className="section-label justify-center before:hidden">Training Programs</div>
        <h2 className="section-title">Performance <span>Plans</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px max-w-[1100px] mx-auto relative z-10" style={{ background: 'rgba(255,255,255,0.05)' }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  const ref = useReveal();
  const Icon = feature.icon;
  return (
    <div className="feature-card-new reveal" ref={ref} style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="feature-num ">{String(index + 1).padStart(2, '0')}</div>
      <div className="feature-icon-new">
        <Icon size={26} strokeWidth={1.6} color="var(--accent)" />
      </div>
      <h3 className="feature-title-new">{feature.title}</h3>
      <p className="feature-desc-new">{feature.desc}</p>
      <div className="feature-hover-bar" />
    </div>
  );
}
