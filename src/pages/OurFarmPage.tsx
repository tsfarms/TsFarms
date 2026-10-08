import { useEffect, type FC } from 'react';
import Navbar from '@/components/layout/Navbar';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import Footer from '@/components/layout/Footer';
import OurFarm from '@/components/sections/OurFarm';
import Gallery from '@/components/sections/Gallery';
import OrderSheet from '@/features/cart/OrderSheet';
import { useSmoothNavigate } from '@/hooks/useSmoothNavigate';

const OurFarmPage: FC = () => {
  const handleNavigate = useSmoothNavigate();

  useEffect(() => {
    document.title = 'Our Farm Story | TS Farms';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return () => {
      document.title = 'TS Farms | Farm-Fresh Mangoes, Honey & Jackfruit';
    };
  }, []);

  return (
    <>
      <Navbar scrolled={false} persist onNavigate={handleNavigate} />
      <OurFarm />
      <Gallery />
      <Footer onNavigate={handleNavigate} />
      <FloatingWhatsApp />
      <OrderSheet />
    </>
  );
};

export default OurFarmPage;
