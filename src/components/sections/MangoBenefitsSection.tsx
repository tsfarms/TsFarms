import { type FC } from 'react';
import StickyBenefitsParallax, { type BenefitImageItem } from './StickyBenefitsParallax';
import { benefitsImage, productImages } from '../../data/siteData';

const MANGO_IMAGES: BenefitImageItem[] = [
  {
    src: benefitsImage,
    alt: 'Fresh sliced mangoes in natural sunlight',
    badge: 'Naturally Tree-Ripened',
  },
  {
    src: productImages.mangoes,
    alt: 'Sun-kissed mangoes ripening on branch',
    badge: 'Seasonal Orchard Harvest',
  },
  {
    src: 'https://images.pexels.com/photos/24029945/pexels-photo-24029945.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Golden yellow mangoes in harvest tray',
    badge: 'Pure Whole-Fruit Nourishment',
  },
];

const MangoBenefitsSection: FC = () => {
  return (
    <StickyBenefitsParallax
      id="mango-benefits"
      title="Mango Benefits"
      subtitle="Pure Orchard Harvest"
      images={MANGO_IMAGES}
      bgColor="#FAF6EE"
      accentColor="#D99419"
    />
  );
};

export default MangoBenefitsSection;
