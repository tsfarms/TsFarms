import { useEffect, useState, type FC } from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import Hero from '../components/sections/Hero';
import OurFarm from '../components/sections/OurFarm';
import WhatWeGrow from '../components/sections/WhatWeGrow';
import BenefitsOfMango from '../components/sections/BenefitsOfMango';
import Mangoes from '../components/sections/Mangoes';
import EveryPart from '../components/sections/EveryPart';
import StickyTransition from '../components/sections/StickyTransition';
import RetailWholesale from '../components/sections/RetailWholesale';
import FarmStory from '../components/sections/FarmStory';
import TamilNadu from '../components/sections/TamilNadu';
import Gallery from '../components/sections/Gallery';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';
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
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <Navbar scrolled={scrolled} onNavigate={handleNavigate} />
      <Hero onNavigate={handleNavigate} />
      <OurFarm />
      <WhatWeGrow />
      <BenefitsOfMango />
      <Mangoes onNavigate={handleNavigate} />
      <EveryPart />
      <StickyTransition onNavigate={handleNavigate} />
      <RetailWholesale />
      <FarmStory />
      <TamilNadu />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer onNavigate={handleNavigate} />
      <FloatingWhatsApp />
    </>
  );
};

export default HomePage;
