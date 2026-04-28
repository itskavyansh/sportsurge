import { useEffect, useRef } from 'react';
import { Trophy, ClipboardCheck, Crosshair, TrendingUp } from 'lucide-react';
import useReveal from '../hooks/useReveal';

const FEATURES = [
  { icon: Trophy,        title: 'Elite Network',    desc: 'Connect with top coaches and academies nationwide' },
  { icon: ClipboardCheck,title: 'Easy Registration',desc: 'Streamlined process, verified and secure' },
  { icon: Crosshair,     title: 'Talent Scouting',  desc: 'Get discovered by national-level selectors' },
  { icon: TrendingUp,    title: 'Growth Tracking',  desc: 'Analytics and progress reports for every athlete' },
];

export default function AboutSection() {
  const textRef  = useReveal();
  const imgRef   = useReveal();
  const cardRef  = useRef(null);

  // Mouse-tracking spotlight on the image
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width)  * 100;
      const y = ((e.clientY - r.top)  / r.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);

  return (
    <section id="about" className="about-section relative overflow-hidden">
      {/* Animated lime scan line */}
      <div className="stats-scanline" />

      <div className="section-wordmark about-wordmark" aria-hidden="true">About</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-[1200px] mx-auto relative z-10">

        {/* Text side */}
        <div className="reveal" ref={textRef}>
          <div className="section-label">Who We Are</div>
          <h2 className="section-title">Who <span>We Are</span></h2>
          <p className="text-[--text-secondary] text-[0.95rem] leading-[1.9] mb-6">
            India's first comprehensive sportsperson registration portal — built to bridge the gap between raw talent and real opportunity. From grassroots to national glory.
          </p>
          <p className="text-[--text-secondary] text-[0.95rem] leading-[1.9] mb-8">
            Whether you're a student just starting out or a seasoned player aiming for national recognition, Sport Surge gives you a verified profile, direct connections to academies, and a path to elite-level selection.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="about-feat" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="about-feat-icon">
                  <f.icon size={18} strokeWidth={2} color="#000" />
                </div>
                <div>
                  <h4 className="text-[0.82rem] font-bold text-[--text-primary] mb-0.5 uppercase tracking-wide">{f.title}</h4>
                  <p className="text-[0.75rem] text-[--text-muted] m-0 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image side with spotlight */}
        <div className="about-image-wrap reveal" ref={(el) => { imgRef.current = el; cardRef.current = el; }} style={{ transitionDelay: '0.15s' }}>
          <div className="about-spotlight" />
          <img src="/images/about.png" alt="Athletes training at Sport Surge" loading="lazy" />
          <div className="about-badge">
            <div className="about-badge-icon"><span className="text-xl leading-none font-black">IN</span></div>
            <div>
              <h4 className="text-[0.85rem] font-bold text-[--text-primary]">Dark. Fast. Athlete-first.</h4>
              <p className="text-[0.72rem] text-[--text-secondary] m-0">Built for measurable performance</p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
