export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

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

export const WHATSAPP_PRIMARY = '9965053956';
export const WHATSAPP_SECONDARY = '9344904430';
export const PHONE = '9442523556';
export const INSTAGRAM_1 = 'prasanna_6847';
export const INSTAGRAM_2 = '_gobi_7';
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

export const productImages = {
  mangoes: px('https://images.pexels.com/photos/7543169/pexels-photo-7543169.jpeg', 800),
  honey: px('https://images.pexels.com/photos/33166864/pexels-photo-33166864.jpeg', 800),
  jackfruit: px('https://images.pexels.com/photos/11669555/pexels-photo-11669555.jpeg', 800),
};

export const mangoVarieties: MangoVariety[] = [
  {
    id: 'alphonsa',
    name: 'Alphonsa',
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
    image: px('https://images.pexels.com/photos/38348330/pexels-photo-38348330.jpeg', 800),
  },
  {
    id: 'himampasanth',
    name: 'Himampasanth',
    tamilName: 'இமாம்பசந்த்',
    tagline: 'Large • Fleshy • Mildly Sweet',
    description:
      'The jewel of South India. Thin skin, melt-in-mouth juicy fibreless pulp, and a regal aroma prized by connoisseurs.',
    taste: ['Regal', 'Fleshy Pulp', 'Delicate Sweet'],
    season: 'May – July',
    unit: 'Per KG',
    pricePerKg: 240,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: px('https://images.pexels.com/photos/30741699/pexels-photo-30741699.jpeg', 800),
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
    image: px('https://images.pexels.com/photos/17546507/pexels-photo-17546507.jpeg', 800),
  },
  {
    id: 'sendhuram',
    name: 'Sendhuram',
    tamilName: 'செந்தூரம்',
    tagline: 'Bright Blush • Sweet • Seasonal Favourite',
    description:
      'Bright vermilion blush on sun-kissed skin. Generously sweet with a traditional South Indian fragrance that never disappoints.',
    taste: ['Bright Blush', 'Generously Sweet', 'Aromatic'],
    season: 'April – June',
    unit: 'Per KG',
    pricePerKg: 140,
    stockStatus: 'low_stock',
    minOrderKg: 5,
    image: px('https://images.pexels.com/photos/7543212/pexels-photo-7543212.jpeg', 800),
  },
  {
    id: 'kallamanga',
    name: 'Kallamanga (Totapuri)',
    tamilName: 'கல்லாமாங்காய் / கிளிமூக்கு',
    tagline: 'Traditional • Tangy-Sweet • Deep Flavour',
    description:
      'A quintessential Tamil country variety with a crisp bite and distinct beak-shaped curve. Perfect for salads, pickles, and ripe eating.',
    taste: ['Traditional', 'Crisp', 'Rich Flavour'],
    season: 'May – July',
    unit: 'Per KG',
    pricePerKg: 110,
    stockStatus: 'in_stock',
    minOrderKg: 5,
    image: px('https://images.pexels.com/photos/38793235/pexels-photo-38793235.jpeg', 800),
  },
  {
    id: 'grapes-mango',
    name: 'Grapes Mango',
    tamilName: 'திராட்சை மாம்பழம்',
    tagline: 'Rare Cluster • Intensely Sweet • Unique',
    description:
      'Grows in tight bountiful bunches like grapes. Small in size with intense concentrated sweetness. A rare heirloom variety.',
    taste: ['Small Clusters', 'Intense Sweet', 'Rare Heirloom'],
    season: 'May – June',
    unit: 'Per KG',
    pricePerKg: 210,
    stockStatus: 'low_stock',
    minOrderKg: 5,
    image: px('https://images.pexels.com/photos/12303101/pexels-photo-12303101.jpeg', 800),
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
    stockStatus: 'out_of_stock',
    minOrderKg: 5,
    image: px('https://images.pexels.com/photos/5629821/pexels-photo-5629821.jpeg', 800),
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
  category: 'mango' | 'honey' | 'jackfruit';
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
    id: 'farm-honey-500g',
    name: 'Raw Farm Honey (500g)',
    tamilName: 'இயற்கை தேன் (500 கிராம்)',
    category: 'honey',
    tagline: '100% Pure • Unheated • Single-Origin',
    description:
      'Cold-extracted raw honey collected directly from bee colonies situated in our mango blossoms and flora. Free of artificial sugar syrups.',
    unit: '500g Glass Jar',
    price: 380,
    stockStatus: 'in_stock',
    image: px('https://images.pexels.com/photos/9106164/pexels-photo-9106164.jpeg', 800),
  },
  {
    id: 'farm-honey-1kg',
    name: 'Raw Farm Honey (1 KG)',
    tamilName: 'இயற்கை தேன் (1 கிலோ)',
    category: 'honey',
    tagline: 'Pure Blossom Honey • Rich in Pollen',
    description:
      'Full 1 KG bottle of thick, golden nectar straight from the farm apiary. Retains all natural pollen, enzymes, and medicinal vitality.',
    unit: '1 KG Jar',
    price: 720,
    stockStatus: 'in_stock',
    image: px('https://images.pexels.com/photos/33166864/pexels-photo-33166864.jpeg', 800),
  },
  {
    id: 'fresh-jackfruit-bulb',
    name: 'Sweet Honey Jackfruit (Palaapazham)',
    tamilName: 'தேன் பலாப்பழம் (சுளைகள்)',
    category: 'jackfruit',
    tagline: 'Tree-Ripened • Crisp Honey Bulbs',
    description:
      'Naturally tree-ripened Then-Varikkai jackfruit with crunchy, golden bulbs that drip with natural sweetness. Freshly deseeded and packed.',
    unit: '1 KG Fresh Bulbs Box',
    price: 260,
    stockStatus: 'low_stock',
    image: px('https://images.pexels.com/photos/6871015/pexels-photo-6871015.jpeg', 800),
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
    unit: product.category === 'honey' ? 'jar' : 'KG',
    minQty: 1,
    price: product.price,
    image: product.image,
    stockStatus: product.stockStatus,
  })),
];

export const availableShopProducts = shopProducts.filter((product) => product.stockStatus !== 'out_of_stock');

export const mangoParts = [
  {
    name: 'Mango Flesh',
    description:
      'Eaten fresh, in juices, smoothies, desserts and traditional sweets.',
    image: px('https://images.pexels.com/photos/16724967/pexels-photo-16724967.jpeg', 800),
  },
  {
    name: 'Mango Peel',
    description:
      'Used in chutneys, pickles and traditional preparations.',
    image: px('https://images.pexels.com/photos/7812134/pexels-photo-7812134.jpeg', 800),
  },
  {
    name: 'Mango Seed',
    description:
      'The kernel is used in traditional cooking and natural remedies.',
    image: px('https://images.pexels.com/photos/5750474/pexels-photo-5750474.jpeg', 800),
  },
  {
    name: 'Mango Leaves',
    description:
      'Used for herbal tea and in traditional home remedies.',
    image: px('https://images.pexels.com/photos/4792183/pexels-photo-4792183.jpeg', 800),
  },
];

export const jackfruitParts = [
  {
    name: 'Jackfruit Flesh',
    description:
      'Sweet bulbs enjoyed fresh, in curries, desserts and seasonal farm dishes.',
    image: px('https://images.pexels.com/photos/5620868/pexels-photo-5620868.jpeg', 800),
  },
  {
    name: 'Jackfruit Seed',
    description:
      'Boiled or roasted, the seeds are a traditional snack and cooking staple.',
    image: px('https://images.pexels.com/photos/11669555/pexels-photo-11669555.jpeg', 800),
  },
  {
    name: 'Jackfruit Rind',
    description:
      'Used in pickles and rustic preparations so nothing from the fruit is wasted.',
    image: px('https://images.pexels.com/photos/6871015/pexels-photo-6871015.jpeg', 800),
  },
  {
    name: 'Jackfruit Leaves',
    description:
      'Used as natural wrappers and in traditional cooking around the farm.',
    image: px('https://images.pexels.com/photos/7529893/pexels-photo-7529893.jpeg', 800),
  },
];

export const honeyImage = px('https://images.pexels.com/photos/9106164/pexels-photo-9106164.jpeg', 1200);
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
  { label: 'Order', target: 'order' },
  { label: 'Our Farm', target: 'farm' },
  { label: 'Mangoes', target: 'mangoes' },
  { label: 'Honey', target: 'honey' },
  { label: 'Jackfruit', target: 'jackfruit' },
  { label: 'Gallery', target: 'gallery' },
  { label: 'Contact', target: 'contact' },
];
