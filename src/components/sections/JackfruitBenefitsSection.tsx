import { type FC } from 'react';
import StickyBenefitsParallax, { type BenefitImageItem } from './StickyBenefitsParallax';
import { jackfruitImage, productImages } from '../../data/siteData';

const JACKFRUIT_IMAGES: BenefitImageItem[] = [
  {
    src: jackfruitImage,
    alt: 'Tree-ripened jackfruit in village grove',
    badge: 'Sacred Mukkani Fruit',
  },
  {
    src: productImages.jackfruit,
    alt: 'Crisp sweet honey Then-Varikkai bulbs',
    badge: 'Crunchy Then-Varikkai Bulbs',
  },
  {
    src: 'https://images.pexels.com/photos/6871015/pexels-photo-6871015.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Freshly harvested jackfruit in grove',
    badge: 'Natural Dietary Fiber & Potassium',
  },
];

const JackfruitBenefitsSection: FC = () => {
  return (
    <StickyBenefitsParallax
      id="jackfruit-benefits"
      title="Jackfruit Benefits"
      subtitle="Village Grove Harvest"
      images={JACKFRUIT_IMAGES}
      bgColor="#F2F6ED"
      accentColor="#2E6930"
    />
  );
};

export default JackfruitBenefitsSection;
