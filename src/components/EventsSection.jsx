import { CalendarClock } from 'lucide-react';
import { useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';

export default function EventsSection() {
  const headerRef = useReveal();
  const bodyRef = useReveal();

  return (
    <section id="events" className="bg-[#0a0a0a] text-center">
      <div className="max-w-[600px] mx-auto mb-12 reveal" ref={headerRef}>
        <div className="section-label justify-center before:hidden">What's On</div>
        <h2 className="section-title">Upcoming <span>Events</span></h2>
      </div>

      <div className="events-empty reveal" ref={bodyRef}>
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[rgba(255,107,0,0.08)] border border-[rgba(255,107,0,0.15)] flex items-center justify-center">
          <CalendarClock size={30} strokeWidth={1.5} color="var(--accent)" />
        </div>
        <h3 className="font-[var(--font-display)] text-[1.4rem] font-bold text-white mb-2.5">Stay Tuned!</h3>
        <p className="text-[--text-secondary] text-[0.9rem] leading-[1.7] mb-6">
          We're curating an incredible lineup of sports events, summits, and meetups. Be the first to know when they go live.
        </p>
        <NotifyForm />
      </div>
    </section>
  );
}

function NotifyForm() {
  const inputRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = () => {
    const email = inputRef.current.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      inputRef.current.style.borderColor = '#ff4444';
      inputRef.current.placeholder = 'Enter a valid email';
      setTimeout(() => { inputRef.current.style.borderColor = ''; inputRef.current.placeholder = 'Your email address'; }, 2000);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-[--accent] font-semibold text-[0.9rem]">✓ You're on the list!</p>;
  }

  return (
    <div className="notify-form">
      <input ref={inputRef} type="email" placeholder="Your email address" />
      <button type="button" onClick={handleNotify}>Notify Me</button>
    </div>
  );
}
