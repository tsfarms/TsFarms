export interface MangoVariety {
  id: string;
  name: string;
  tagline: string;
  description: string;
  taste: string[];
  season: string;
  unit: string;
  image: string;
}

export const WHATSAPP_PRIMARY = '9843823047';
export const WHATSAPP_SECONDARY = '9344904430';
export const PHONE = '9442523556';
export const INSTAGRAM_1 = 'prasanna_6847';
export const INSTAGRAM_2 = '_gobi_7';

export const whatsappLink = (message: string, number: string = WHATSAPP_PRIMARY) =>
  `https://wa.me/91${number}?text=${encodeURIComponent(message)}`;

const px = (url: string, w = 1200) =>
  url.replace('?auto=compress&cs=tinysrgb&h=650&w=940', `?auto=compress&cs=tinysrgb&w=${w}`);

export const heroImage = px('https://images.pexels.com/photos/28903096/pexels-photo-28903096.jpeg', 1920);
export const farmImage = px('https://images.pexels.com/photos/16563022/pexels-photo-16563022.jpeg', 1200);
export const farmStoryImage = px('https://images.pexels.com/photos/4418674/pexels-photo-4418674.jpeg', 1600);

export const productImages = {
  mangoes: px('https://images.pexels.com/photos/7543169/pexels-photo-7543169.jpeg', 800),
  honey: px('https://images.pexels.com/photos/33166864/pexels-photo-33166864.jpeg', 800),
  jackfruit: px('https://images.pexels.com/photos/11669555/pexels-photo-11669555.jpeg', 800),
};

export const benefitsImage = px('https://images.pexels.com/photos/10036897/pexels-photo-10036897.jpeg', 800);

export const mangoVarieties: MangoVariety[] = [
  {
    id: 'alphonsa',
    name: 'Alphonsa',
    tagline: 'Rich • Aromatic • Naturally Sweet',
    description:
      'The king of mangoes. Deep saffron flesh with a rich, aromatic sweetness that defines the mango season.',
    taste: ['Rich', 'Aromatic', 'Naturally Sweet'],
    season: 'April – June',
    unit: 'Per KG',
    image: px('https://images.pexels.com/photos/38348330/pexels-photo-38348330.jpeg', 800),
  },
  {
    id: 'himampasanth',
    name: 'Himampasanth',
    tagline: 'Large • Fleshy • Mildly Sweet',
    description:
      'A large, fleshy variety with thin skin and a mild, delicate sweetness. Perfect for slicing and enjoying fresh.',
    taste: ['Large', 'Fleshy', 'Mildly Sweet'],
    season: 'May – July',
    unit: 'Per KG',
    image: px('https://images.pexels.com/photos/30741699/pexels-photo-30741699.jpeg', 800),
  },
  {
    id: 'mallika',
    name: 'Mallika',
    tagline: 'Juicy • Fibre-free • Golden',
    description:
      'Golden-hued and fibre-free, the Mallika is juicy with a citrus-like brightness. A favourite for desserts.',
    taste: ['Juicy', 'Fibre-free', 'Golden'],
    season: 'June – August',
    unit: 'Per KG',
    image: px('https://images.pexels.com/photos/17546507/pexels-photo-17546507.jpeg', 800),
  },
  {
    id: 'kallamanga',
    name: 'Kallamanga',
    tagline: 'Traditional • Rich • Deep Flavour',
    description:
      'A traditional Tamil variety with a deep, complex flavour. The kind of mango that tastes like home.',
    taste: ['Traditional', 'Rich', 'Deep Flavour'],
    season: 'May – July',
    unit: 'Per KG',
    image: px('https://images.pexels.com/photos/38793235/pexels-photo-38793235.jpeg', 800),
  },
  {
    id: 'sendhuram',
    name: 'Sendhuram',
    tagline: 'Bright • Sweet • Seasonal Favourite',
    description:
      'Bright-skinned and generously sweet. The Sendhuram arrives in peak season and never disappoints.',
    taste: ['Bright', 'Sweet', 'Seasonal Favourite'],
    season: 'April – June',
    unit: 'Per KG',
    image: px('https://images.pexels.com/photos/7543212/pexels-photo-7543212.jpeg', 800),
  },
  {
    id: 'neelam',
    name: 'Neelam',
    tagline: 'Late Season • Aromatic • Mild',
    description:
      'The late-season mango. Aromatic and mild, the Neelam extends the mango season well beyond its peak.',
    taste: ['Late Season', 'Aromatic', 'Mild'],
    season: 'July – September',
    unit: 'Per KG',
    image: px('https://images.pexels.com/photos/5629821/pexels-photo-5629821.jpeg', 800),
  },
  {
    id: 'grapes-mango',
    name: 'Grapes Mango',
    tagline: 'Small • Intensely Sweet • Rare',
    description:
      'Small in size, intense in sweetness. A rare variety that is hard to find and impossible to forget.',
    taste: ['Small', 'Intensely Sweet', 'Rare'],
    season: 'May – June',
    unit: 'Per KG',
    image: px('https://images.pexels.com/photos/12303101/pexels-photo-12303101.jpeg', 800),
  },
];

export const mangoBenefits = [
  { label: 'Rich in Vitamin C', x: 15, y: 20 },
  { label: 'Boosts Immunity', x: 82, y: 18 },
  { label: 'Supports Eye Health', x: 88, y: 55 },
  { label: 'Aids Digestion', x: 78, y: 85 },
  { label: 'Promotes Healthy Skin', x: 12, y: 78 },
];

export const mangoParts = [
  {
    name: 'Mango Flesh',
    description:
      'Eaten fresh, in juices, smoothies, desserts and traditional sweets.',
    image: px('https://images.pexels.com/photos/16724967/pexels-photo-16724967.jpeg', 800),
    span: 'tall' as const,
  },
  {
    name: 'Mango Peel',
    description:
      'Used in chutneys, pickles and traditional preparations.',
    image: px('https://images.pexels.com/photos/7812134/pexels-photo-7812134.jpeg', 800),
    span: 'wide' as const,
  },
  {
    name: 'Mango Seed',
    description:
      'The kernel is used in traditional cooking and natural remedies.',
    image: px('https://images.pexels.com/photos/5750474/pexels-photo-5750474.jpeg', 800),
    span: 'normal' as const,
  },
  {
    name: 'Mango Leaves',
    description:
      'Used for herbal tea and in traditional home remedies.',
    image: px('https://images.pexels.com/photos/4792183/pexels-photo-4792183.jpeg', 800),
    span: 'normal' as const,
  },
];

export const honeyImage = px('https://images.pexels.com/photos/9106164/pexels-photo-9106164.jpeg', 1200);
export const honeyTextureImage = px('https://images.pexels.com/photos/32489540/pexels-photo-32489540.jpeg', 800);
export const jackfruitImage = px('https://images.pexels.com/photos/6871015/pexels-photo-6871015.jpeg', 1200);

export const galleryImages = [
  { src: px('https://images.pexels.com/photos/28903096/pexels-photo-28903096.jpeg', 800), alt: 'Mango orchard at golden hour', span: 'large' as const },
  { src: px('https://images.pexels.com/photos/11911951/pexels-photo-11911951.jpeg', 600), alt: 'Freshly harvested mangoes in a basket', span: 'tall' as const },
  { src: px('https://images.pexels.com/photos/4418675/pexels-photo-4418675.jpeg', 800), alt: 'Mango tree laden with fruit', span: 'wide' as const },
  { src: px('https://images.pexels.com/photos/12639142/pexels-photo-12639142.jpeg', 600), alt: 'Close-up of ripe mango on tree', span: 'normal' as const },
  { src: px('https://images.pexels.com/photos/9106164/pexels-photo-9106164.jpeg', 600), alt: 'Farm honey jar on wooden table', span: 'tall' as const },
  { src: px('https://images.pexels.com/photos/6871015/pexels-photo-6871015.jpeg', 800), alt: 'Jackfruit on the tree', span: 'wide' as const },
  { src: px('https://images.pexels.com/photos/7529893/pexels-photo-7529893.jpeg', 600), alt: 'Mango leaves in morning light', span: 'normal' as const },
  { src: px('https://images.pexels.com/photos/24029945/pexels-photo-24029945.jpeg', 800), alt: 'Bright yellow mangoes arranged in a tray', span: 'large' as const },
];

export const testimonials = [
  {
    quote:
      'The mangoes arrived perfectly ripe and fragrant. You can taste the care that goes into growing them.',
    name: 'Lakshmi Narayanan',
    location: 'Chennai',
  },
  {
    quote:
      'I ordered for my whole family. Every variety had its own character, and the honey was incredible.',
    name: 'Karthik Subramanian',
    location: 'Coimbatore',
  },
  {
    quote:
      'Fresh, sweet, and delivered right to my door. This is what real mango should taste like.',
    name: 'Priya Venkatesan',
    location: 'Madurai',
  },
];

export const navLinks = [
  { label: 'Our Farm', target: 'farm' },
  { label: 'Mangoes', target: 'mangoes' },
  { label: 'Honey', target: 'honey' },
  { label: 'Jackfruit', target: 'jackfruit' },
  { label: 'Gallery', target: 'gallery' },
  { label: 'Contact', target: 'contact' },
];
