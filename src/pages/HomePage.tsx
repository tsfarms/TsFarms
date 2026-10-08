import { useEffect, useState, type FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Preloader from '@/components/layout/Preloader';
import Navbar from '@/components/layout/Navbar';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import ProduceBenefits from '@/components/sections/ProduceBenefits';
import FarmStory from '@/components/sections/FarmStory';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import OrderSection from '@/components/sections/OrderSection';
import OrderSheet from '@/features/cart/OrderSheet';
import { dispatchOrderFilter, scrollToTarget, useSmoothNavigate } from '@/hooks/useSmoothNavigate';

const PRELOADER_SEEN_KEY = 'ts_mango_preloader_seen';

const HomePage: FC = () => {
  const [loading, setLoading] = useState(() => !localStorage.getItem(PRELOADER_SEEN_KEY));
  const [scrolled, setScrolled] = useState(false);
  const handleNavigate = useSmoothNavigate();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(PRELOADER_SEEN_KEY, '1');
  }, []);

  useEffect(() => {
    const state = location.state as { scrollTo?: string; filter?: string } | null;
    if (!state?.scrollTo && !state?.filter) return;
    const timer = window.setTimeout(() => {
      if (state.filter) dispatchOrderFilter(state.filter);
      if (state.scrollTo) scrollToTarget(state.scrollTo);
      navigate(location.pathname, { replace: true, state: null });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 8;
        setScrolled((prev) => (prev === next ? prev : next));
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Navbar scrolled={scrolled} onNavigate={handleNavigate} />
      <Hero onNavigate={handleNavigate} />
      <OrderSection />
      <ProduceBenefits onNavigate={handleNavigate} />
      <FarmStory onNavigate={handleNavigate} />
      <Testimonials />
      <Contact />
      <Footer onNavigate={handleNavigate} />
      <FloatingWhatsApp />
      <OrderSheet />
    </>
  );
};

export default HomePage;
