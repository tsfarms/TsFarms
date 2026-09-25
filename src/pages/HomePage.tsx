import { useEffect, useState, type FC } from 'react';
import Preloader from '@/components/layout/Preloader';
import Navbar from '@/components/layout/Navbar';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import OurFarm from '@/components/sections/OurFarm';
import WhatWeGrow from '@/components/sections/WhatWeGrow';
import EveryPart from '@/components/sections/EveryPart';
import JackfruitParts from '@/components/sections/JackfruitParts';
import Honey from '@/components/sections/Honey';
import FarmStory from '@/components/sections/FarmStory';
import TamilNadu from '@/components/sections/TamilNadu';
import Gallery from '@/components/sections/Gallery';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import OrderSection from '@/components/sections/OrderSection';
import OrderSheet from '@/features/cart/OrderSheet';
import { useSmoothNavigate } from '@/hooks/useSmoothNavigate';

const PRELOADER_SEEN_KEY = 'ts_mango_preloader_seen';

const HomePage: FC = () => {
  const [loading, setLoading] = useState(() => !localStorage.getItem(PRELOADER_SEEN_KEY));
  const [scrolled, setScrolled] = useState(false);
  const handleNavigate = useSmoothNavigate();

  useEffect(() => {
    localStorage.setItem(PRELOADER_SEEN_KEY, '1');
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 80;
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
      <OurFarm />
      <WhatWeGrow />
      <EveryPart />
      <JackfruitParts />
      <Honey />
      <FarmStory />
      <TamilNadu />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer onNavigate={handleNavigate} />
      <FloatingWhatsApp />
      <OrderSheet />
    </>
  );
};

export default HomePage;
