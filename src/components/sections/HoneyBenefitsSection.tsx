import { type FC } from 'react';
import StickyBenefitsParallax, { type BenefitImageItem } from './StickyBenefitsParallax';
import { honeyTextureImage, productImages, honeyImage } from '../../data/siteData';

const HONEY_IMAGES: BenefitImageItem[] = [
  {
    src: honeyTextureImage,
    alt: 'Pure raw honeycomb texture and golden nectar',
    badge: 'Raw Unheated Apiary Nectar',
  },
  {
    src: productImages.honey,
    alt: 'Farm honey jar with pure honeycomb',
    badge: 'Active Blossom Pollen & Enzymes',
  },
  {
    src: honeyImage,
    alt: 'Natural honey bottle on rustic farm table',
    badge: 'Cold-Extracted Single-Origin',
  },
];

const HoneyBenefitsSection: FC = () => {
  return (
    <StickyBenefitsParallax
      id="honey-benefits"
      title="Honey Benefits"
      subtitle="Raw Apiary Nectar"
      images={HONEY_IMAGES}
      bgColor="#FAF4E8"
      accentColor="#B45309"
    />
  );
};

export default HoneyBenefitsSection;
