import { Mail, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';

// Marquee ticker items
const TICKER = ['CRICKET', 'FOOTBALL', 'BASKETBALL', 'BADMINTON', 'KABADDI', 'VOLLEYBALL', 'HOCKEY', 'ATHLETICS', 'SWIMMING', 'BOXING', 'TENNIS', 'WRESTLING'];

export default function EventsSection() {
  const headerRef = useReveal();
  const bodyRef   = useReveal();
  const ctaRef    = useReveal();

  return (
    <section id="events" className="relative overflow-hidden" style={{ background: '#13131a', padding: 0 }}>
      <div className="section-wordmark events-wordmark" aria-hidden="true">News</div>
      {/* Animated lime scan line */}
      <div className="stats-scanline" />

      {/* Marquee ticker */}
      <div className="events-ticker">
        <div className="events-ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="events-ticker-item">
              <span className="events-ticker-dot" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: '6rem 5%' }}>
        <div className="max-w-[600px] mx-auto mb-12 reveal text-center" ref={headerRef}>
          <div className="section-label justify-center before:hidden">What's On</div>
          <h2 className="section-title">Upcoming <span>Events</span></h2>
        </div>

        <div className="events-card reveal" ref={bodyRef}>
          <div className="events-card-inner">
            <div className="events-icon-wrap">
              <Mail size={32} strokeWidth={1.5} color="#000" />
            </div>
            <div className="events-text">
              <h3 className="events-heading">Stay in the Loop</h3>
              <p className="events-sub">We're curating an incredible lineup of sports events, summits, and meetups. Drop your email and be first to know.</p>
            </div>
            <NotifyForm />
          </div>
          <div className="events-card-accent" />
        </div>

        <div className="events-register-wrap reveal" ref={ctaRef}>
          <div className="events-register-cta">
            <div>
              <h4 className="events-register-title">Register to Become a Member</h4>
              <p className="events-register-sub">Join Sport Surge and unlock events, coaching access, and verified athlete opportunities.</p>
            </div>
            <Link to="/register" className="btn-register">Register Now</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotifyForm() {
  const inputRef  = useRef(null);
  const [done, setDone] = useState(false);
  const [err,  setErr]  = useState(false);

  const submit = () => {
    const v = inputRef.current?.value.trim();
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(true); setTimeout(() => setErr(false), 2000); return; }
    setDone(true);
  };

  if (done) return (
    <div className="events-success">
      <span className="events-success-dot" />
      You're on the list!
    </div>
  );

  return (
    <div className="events-form">
      <input
        ref={inputRef}
        type="email"
        placeholder="your@email.com"
        className={`events-input${err ? ' events-input-err' : ''}`}
      />
      <button className="events-btn" onClick={submit}>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
