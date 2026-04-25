import { Trophy, ClipboardCheck, Crosshair, TrendingUp } from 'lucide-react';
import useReveal from '../hooks/useReveal';

const FEATURES = [
  { icon: Trophy, title: 'Elite Network', desc: 'Connect with top coaches and academies nationwide' },
  { icon: ClipboardCheck, title: 'Easy Registration', desc: 'Streamlined process verified and secure' },
  { icon: Crosshair, title: 'Talent Scouting', desc: 'Get discovered by national-level selectors' },
  { icon: TrendingUp, title: 'Growth Tracking', desc: 'Analytics and progress reports for every athlete' },
];

export default function AboutSection() {
  const textRef = useReveal();
  const imgRef = useReveal();

  return (
    <section id="about" className="bg-[#0a0a0a]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-[1200px] mx-auto">
        <div className="reveal" ref={textRef}>
          <div className="section-label">Join Sport Surge</div>
          <h2 className="section-title">About <span>Sport Surge</span></h2>
          <p className="text-[--text-secondary] text-[0.95rem] leading-[1.85] mb-6">
            At Sport Surge, we believe every athlete deserves a platform to showcase their talent, regardless of location, background, or sport. Our mission is to bridge the gap between aspiring sportspersons and the opportunities they need to grow — from local training camps to national-level selections.
          </p>
          <p className="text-[--text-secondary] text-[0.95rem] leading-[1.85] mb-8">
            We are India's first comprehensive sportsperson registration portal, designed to support athletes from the grassroots to elite levels. Whether you're a student just starting out or a seasoned player aiming for national and international recognition, Sport Surge offers a streamlined registration process, verified player database, and direct connections to academies, coaches, and governing bodies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="about-feat">
                <div className="about-feat-icon">
                  <f.icon size={18} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-[0.8rem] font-semibold text-white mb-0.5">{f.title}</h4>
                  <p className="text-[0.75rem] text-[--text-muted] m-0 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-image-wrap reveal" ref={imgRef} style={{ transitionDelay: '0.2s' }}>
          <img src="/images/about.png" alt="Athletes training at Sport Surge" loading="lazy" />
          <div className="about-badge">
            <div className="about-badge-icon">
              <span className="text-xl leading-none">IN</span>
            </div>
            <div>
              <h4 className="text-[0.85rem] font-bold text-white">India's First Portal</h4>
              <p className="text-[0.72rem] text-[--text-secondary] m-0">Grassroots to Elite Level</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
