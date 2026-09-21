import { useEffect, useState, type FC } from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import CartDrawer from '../components/CartDrawer';
import Hero from '../components/sections/Hero';
import MangoVarietiesShowcase from '../components/sections/MangoVarietiesShowcase';
import HoneyWorldSection from '../components/sections/HoneyWorldSection';
import JackfruitWorldSection from '../components/sections/JackfruitWorldSection';
import FarmParallaxSection from '../components/sections/FarmParallaxSection';
import OurPromiseStage from '../components/sections/OurPromiseStage';
import Footer from '../components/sections/Footer';

const HomePage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const skipKey = 'ts_mango_preloader_seen';
    if (localStorage.getItem(skipKey)) {
      setLoading(false);
    } else {
      localStorage.setItem(skipKey, '1');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (target: string) => {
    if (target === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const resolvedId =
      target === 'mangoes' || target === 'products'
        ? 'mangoes'
        : target === 'honey'
        ? 'honey'
        : target === 'jackfruit'
        ? 'jackfruit'
        : target === 'gallery'
        ? 'farm'
        : target;

    const el = document.getElementById(resolvedId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Navbar scrolled={scrolled} onNavigate={handleNavigate} />
      <Hero onNavigate={handleNavigate} />
      <MangoVarietiesShowcase onNavigate={handleNavigate} />
      <HoneyWorldSection />
      <JackfruitWorldSection />
      <FarmParallaxSection />
      <OurPromiseStage />
      <Footer onNavigate={handleNavigate} />
      <FloatingWhatsApp />
      <CartDrawer />
    </>
  );
};

export default HomePage;
