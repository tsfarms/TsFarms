export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

import mangoBenefitImage from '@/assets/benefits/mango.png';
import honeyBenefitImage from '@/assets/benefits/honey.jpg';
import jackfruitBenefitImage from '@/assets/benefits/jackfruit.jpg';
import stinglessBeeImage from '@/assets/honey/stingless-bee-honey.jpg';
import mountainBeeImage from '@/assets/honey/mountain-bee-honey.jpg';
import palurImage from '@/assets/jackfruit/palur.jpg';
import galleryBeekeepersImage from '@/assets/gallery/beekeepers.jpg';
import alphonsaImage from '@/assets/mango/alphonsa.png';
import bangnapaliImage from '@/assets/mango/bangnapali.png';
import himprashadImage from '@/assets/mango/himprashad.png';
import mallikaImage from '@/assets/mango/mallika.png';
import neelamImage from '@/assets/mango/neelam.png';
import sendhuramImage from '@/assets/mango/sendhuram.png';
import thothaImage from '@/assets/mango/Thotha.png';

export interface MangoVariety {
  id: string;
  name: string;
  tamilName: string;
  tagline: string;
  description: string;
  taste: string[];
  season: string;
  unit: string;
  pricePerKg: number;
  stockStatus: StockStatus;
  minOrderKg: number;
  image: string;
}

export const WHATSAPP_PRIMARY = '9344904430';
export const PHONE = '9843823047';
export const PHONE_SECONDARY = '9600336404';
export const INSTAGRAM_HANDLE = 'ts.farming';
export const INSTAGRAM_URL = 'https://www.instagram.com/ts.farming';
export const EMAIL = 'ts.farmingts@gmail.com';
export const UPI_ID = '9965053956@upi';

const readSetting = (keys: string[], fallback: string): string => {
  try {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('ts_farm_site_settings') : null;
    if (cached) {
      const parsed = JSON.parse(cached) as Record<string, string | undefined>;
      for (const key of keys) {
        if (parsed[key]) return parsed[key];
      }
    }
  } catch {
    return fallback;
  }
  return fallback;
};

export const getPrimaryWhatsApp = (): string => readSetting(['whatsapp1'], WHATSAPP_PRIMARY);

export const getUpiId = (): string => readSetting(['upiId', 'upi_id'], UPI_ID);

export const whatsappLink = (message: string, number: string = getPrimaryWhatsApp()) =>
  `https://api.whatsapp.com/send?phone=91${number}&text=${encodeURIComponent(message)}`;

const px = (url: string, w = 1200) => `${url.split('?')[0]}?auto=compress&cs=tinysrgb&w=${w}`;

export const heroImage = px('https://images.pexels.com/photos/28903096/pexels-photo-28903096.jpeg', 1920);
export const farmImage = px('https://images.pexels.com/photos/16563022/pexels-photo-16563022.jpeg', 1200);
export const farmStoryImage = px('https://images.pexels.com/photos/4418674/pexels-photo-4418674.jpeg', 1600);

export const mangoVarieties: MangoVariety[] = [
  {
    id: 'alphonso',
    name: 'Alphonso',
    tamilName: 'அல்போன்சா',
    tagline: 'Rich • Aromatic • Naturally Sweet',
    description:
      'The king of mangoes. Deep saffron flesh with a rich, aromatic sweetness that defines the peak Tamil summer season.',
    taste: ['Rich', 'Aromatic', 'Naturally Sweet'],
    season: 'April – June',
    unit: 'Per KG',
    pricePerKg: 190,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: alphonsaImage,
  },
  {
    id: 'imam-pasand',
    name: 'Imam Pasand',
    tamilName: 'இமாம் பசந்த்',
    tagline: 'Large • Fleshy • Mildly Sweet',
    description:
      'The jewel of South India. Thin skin, melt-in-mouth juicy fibreless pulp, and a regal aroma prized by connoisseurs.',
    taste: ['Regal', 'Fleshy Pulp', 'Delicate Sweet'],
    season: 'May – July',
    unit: 'Per KG',
    pricePerKg: 240,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: himprashadImage,
  },
  {
    id: 'mallika',
    name: 'Mallika',
    tamilName: 'மல்லிகா',
    tagline: 'Juicy • Fibre-free • Golden',
    description:
      'Golden-hued and completely fibre-free. Sweet with pleasant citrus undertones, perfect for pure enjoyment and desserts.',
    taste: ['Juicy', 'Fibre-free', 'Golden Sweet'],
    season: 'June – August',
    unit: 'Per KG',
    pricePerKg: 160,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: mallikaImage,
  },
  {
    id: 'senduram',
    name: 'Senduram',
    tamilName: 'செந்தூரம்',
    tagline: 'Bright Blush • Sweet • Seasonal Favourite',
    description:
      'Bright vermilion blush on sun-kissed skin. Generously sweet with a traditional South Indian fragrance that never disappoints.',
    taste: ['Bright Blush', 'Generously Sweet', 'Aromatic'],
    season: 'April – June',
    unit: 'Per KG',
    pricePerKg: 140,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: sendhuramImage,
  },
  {
    id: 'banganapalli',
    name: 'Banganapalli',
    tamilName: 'பங்கனபள்ளி',
    tagline: 'Large • Fibre-free • Golden Sweet',
    description:
      'A large, golden Andhra favourite also grown in Tamil Nadu. Firm, fibre-free flesh with a mild sweetness that holds well for the table.',
    taste: ['Traditional', 'Crisp', 'Rich Flavour'],
    season: 'May – July',
    unit: 'Per KG',
    pricePerKg: 150,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: bangnapaliImage,
  },
  {
    id: 'thothapuri',
    name: 'Thothapuri',
    tamilName: 'தொத்தபுரி / கிளிமூக்கு',
    tagline: 'Tangy-Sweet • Firm • Classic Totapuri',
    description:
      'Also known as Totapuri. A classic beak-shaped mango with a crisp bite and a tangy-sweet flavour, eaten ripe or used in the kitchen.',
    taste: ['Tangy-Sweet', 'Firm', 'Classic'],
    season: 'May – July',
    unit: 'Per KG',
    pricePerKg: 110,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: thothaImage,
  },
  {
    id: 'neelam',
    name: 'Neelam',
    tamilName: 'நீலம்',
    tagline: 'Late Season • Rich Perfume • Enduring',
    description:
      'The venerable late-season mango. Compact, intensely fragrant, and extends the beloved season well into late monsoon.',
    taste: ['Late Season', 'Aromatic Perfume', 'Classic'],
    season: 'July – September',
    unit: 'Per KG',
    pricePerKg: 130,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: neelamImage,
  },
];

export interface OtherFarmProduct {
  id: string;
  name: string;
  tamilName: string;
  category: 'honey' | 'jackfruit';
  tagline: string;
  description: string;
  unit: string;
  price: number;
  stockStatus: StockStatus;
  image: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  category: string;
  tagline: string;
  unitLabel: string;
  unit: string;
  minQty: number;
  price: number;
  image: string;
  stockStatus: StockStatus;
}

export const formatINR = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

export const otherFarmProducts: OtherFarmProduct[] = [
  {
    id: 'stingless-bee-honey',
    name: 'Stingless Bee Honey',
    tamilName: 'சிறு தேனீ தேன்',
    category: 'honey',
    tagline: 'Rare • Unheated • Naturally Tangy',
    description:
      'Honey from stingless bees, collected without heating. Thick, slightly tangy, and sold by the kilogram. Minimum order is 1 KG.',
    unit: 'Per KG',
    price: 720,
    stockStatus: 'in_stock',
    image: stinglessBeeImage,
  },
  {
    id: 'mountain-honey',
    name: 'Mountain Honey',
    tamilName: 'மலை தேன்',
    category: 'honey',
    tagline: 'Wild Flora • Rich • Unprocessed',
    description:
      'Honey gathered from mountain flora. Deep in flavour and sold by the kilogram. Minimum order is 1 KG.',
    unit: 'Per KG',
    price: 720,
    stockStatus: 'in_stock',
    image: mountainBeeImage,
  },
  {
    id: 'palur-1',
    name: 'Palur-1',
    tamilName: 'பாலூர் 1 பலா',
    category: 'jackfruit',
    tagline: 'TNAU Variety • Sweet Bulbs • Seasonal',
    description:
      'Palur-1 jackfruit, a Tamil Nadu variety with sweet, firm bulbs. Sold fresh by the kilogram. Minimum order is 1 KG.',
    unit: 'Per KG',
    price: 260,
    stockStatus: 'in_stock',
    image: palurImage,
  },
];

export const shopProducts: ShopProduct[] = [
  ...mangoVarieties.map((variety) => ({
    id: variety.id,
    name: variety.name,
    category: 'mango' as const,
    tagline: variety.tagline,
    unitLabel: variety.unit,
    unit: 'KG',
    minQty: 5,
    price: variety.pricePerKg,
    image: variety.image,
    stockStatus: variety.stockStatus,
  })),
  ...otherFarmProducts.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    tagline: product.tagline,
    unitLabel: product.unit,
    unit: 'KG',
    minQty: 1,
    price: product.price,
    image: product.image,
    stockStatus: product.stockStatus,
  })),
];

export const availableShopProducts = shopProducts.filter((product) => product.stockStatus !== 'out_of_stock');

export type ProduceBenefit = {
  label: string;
  x: string;
  y: string;
  align: 'left' | 'right' | 'center';
  arrow: 'ne' | 'nw' | 'se' | 'sw' | 's';
};

export type ProduceBenefitCard = {
  id: string;
  product: string;
  kicker: string;
  image: string;
  imageAlt: string;
  benefits: ProduceBenefit[];
};

export const produceBenefits: ProduceBenefitCard[] = [
  {
    id: 'mangoes',
    product: 'Mango',
    kicker: 'For nutrition and health',
    image: mangoBenefitImage,
    imageAlt: 'Cubed ripe mango with leaves',
    benefits: [
      { label: 'rich in vitamin C', x: '4%', y: '18%', align: 'right', arrow: 'ne' },
      { label: 'boosts immunity', x: '96%', y: '16%', align: 'left', arrow: 'nw' },
      { label: 'supports eye health', x: '6%', y: '78%', align: 'right', arrow: 'se' },
      { label: 'aids digestion', x: '50%', y: '92%', align: 'center', arrow: 's' },
      { label: 'promotes glowing skin', x: '96%', y: '76%', align: 'left', arrow: 'sw' },
    ],
  },
  {
    id: 'honey',
    product: 'Honey',
    kicker: 'For nutrition and health',
    image: honeyBenefitImage,
    imageAlt: 'Honey jar with dipper and honeycomb',
    benefits: [
      { label: 'rich in antioxidants', x: '4%', y: '18%', align: 'right', arrow: 'ne' },
      { label: 'boosts immunity', x: '96%', y: '16%', align: 'left', arrow: 'nw' },
      { label: 'supports digestive health', x: '6%', y: '78%', align: 'right', arrow: 'se' },
      { label: 'provides natural energy', x: '50%', y: '92%', align: 'center', arrow: 's' },
      { label: 'promotes healthy skin', x: '96%', y: '76%', align: 'left', arrow: 'sw' },
    ],
  },
  {
    id: 'jackfruit',
    product: 'Jackfruit',
    kicker: 'For nutrition and health',
    image: jackfruitBenefitImage,
    imageAlt: 'Whole and cut jackfruit',
    benefits: [
      { label: 'rich in vitamins & minerals', x: '4%', y: '18%', align: 'right', arrow: 'ne' },
      { label: 'boosts immunity', x: '96%', y: '16%', align: 'left', arrow: 'nw' },
      { label: 'supports heart health', x: '6%', y: '78%', align: 'right', arrow: 'se' },
      { label: 'aids digestion', x: '50%', y: '92%', align: 'center', arrow: 's' },
      { label: 'promotes healthy skin', x: '96%', y: '76%', align: 'left', arrow: 'sw' },
    ],
  },
];

export const galleryImages = [
  { src: px('https://images.pexels.com/photos/28903096/pexels-photo-28903096.jpeg', 800), alt: 'Mango orchard at golden hour', span: 'large' as const },
  { src: galleryBeekeepersImage, alt: 'Beekeepers holding a honeycomb frame', span: 'tall' as const },
  { src: px('https://images.pexels.com/photos/11911951/pexels-photo-11911951.jpeg', 600), alt: 'Freshly harvested mangoes in a basket', span: 'tall' as const },
  { src: px('https://images.pexels.com/photos/4418675/pexels-photo-4418675.jpeg', 800), alt: 'Mango tree laden with fruit', span: 'wide' as const },
  { src: px('https://images.pexels.com/photos/12639142/pexels-photo-12639142.jpeg', 600), alt: 'Close-up of ripe mango on tree', span: 'normal' as const },
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
  { label: 'Order', target: 'order' },
  { label: 'Our Farm', target: 'farm' },
  { label: 'Mangoes', target: 'mangoes' },
  { label: 'Honey', target: 'honey' },
  { label: 'Jackfruit', target: 'jackfruit' },
  { label: 'Gallery', target: 'gallery' },
  { label: 'Contact', target: 'contact' },
];
