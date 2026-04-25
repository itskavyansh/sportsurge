import Navbar from '../components/Navbar';
import HeroCanvas from '../components/HeroCanvas';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import StatsSection from '../components/StatsSection';
import CoachesSection from '../components/CoachesSection';
import EventsSection from '../components/EventsSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
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
