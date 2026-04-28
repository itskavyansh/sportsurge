import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroCanvas from '../components/HeroCanvas';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import StatsSection from '../components/StatsSection';
import CoachesSection from '../components/CoachesSection';
import EventsSection from '../components/EventsSection';
import Footer from '../components/Footer';
import { initAllAnimations } from '../lib/animations';

export default function HomePage() {
  useEffect(() => {
    // Small delay so DOM is fully painted
    const t = setTimeout(() => initAllAnimations(), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div id="scroll-progress" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
        background: '#C8F000', transformOrigin: 'left', transform: 'scaleX(0)',
        zIndex: 9999, pointerEvents: 'none',
      }} />
      {/* Ambient floating particles */}
      <canvas id="particles-canvas" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.6,
      }} />
      <Navbar />
      <HeroCanvas />
      <AboutSection />
      <FeaturesSection />
      <StatsSection />
      <CoachesSection />
      <EventsSection />
      <Footer />
    </>
  );
}
