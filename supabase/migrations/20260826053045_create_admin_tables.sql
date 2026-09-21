/*
# Base Schema Migration: TS Mango Farming Core Tables
# Timestamp: 20260826053045_create_admin_tables.sql
#
# Creates core tables required by TS Mango Farming:
# 1. products (authoritative product catalog with stable product_code, price, unit)
# 2. mango_varieties (7 varieties with variety_code, price, stock_status)
# 3. enquiries (customer enquiries)
# 4. orders (orders placed by customers with unique order_code)
# 5. Seeds baseline farm catalog data
*/

-- 1. Products Table (Authoritative Catalog)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'mango',
  price numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'Per KG',
  description text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  stock_status text NOT NULL DEFAULT 'in_stock',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Mango Varieties Table
CREATE TABLE IF NOT EXISTS mango_varieties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variety_code text UNIQUE NOT NULL,
  name text NOT NULL,
  tamil_name text,
  tagline text,
  description text,
  taste_profile text[] DEFAULT '{}',
  season text,
  unit text DEFAULT 'Per KG',
  price numeric NOT NULL DEFAULT 0,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  stock_status text NOT NULL DEFAULT 'in_stock',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mango_varieties_code ON mango_varieties(variety_code);
ALTER TABLE mango_varieties ENABLE ROW LEVEL SECURITY;

-- 3. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text,
  phone text,
  product_interest text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code text UNIQUE,
  customer_name text,
  phone text,
  product text,
  quantity_kg numeric,
  order_type text DEFAULT 'retail',
  status text NOT NULL DEFAULT 'pending',
  items_json jsonb DEFAULT '[]'::jsonb,
  delivery_address text,
  town_city text,
  district text,
  pincode text,
  total_amount numeric DEFAULT 0,
  mango_total_kg numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 5. Seed Authoritative Catalog (Products & Varieties)
INSERT INTO products (product_code, name, category, price, unit, description, is_active, stock_status)
VALUES
  ('alphonsa', 'Alphonsa Mango', 'mango', 190, 'Per KG', 'The king of mangoes. Deep saffron flesh with rich, aromatic sweetness.', true, 'in_stock'),
  ('himampasanth', 'Himampasanth Mango', 'mango', 240, 'Per KG', 'The jewel of South India. Fleshy, fiberless, regal aroma.', true, 'in_stock'),
  ('mallika', 'Mallika Mango', 'mango', 160, 'Per KG', 'Golden-hued and fiber-free. Sweet with pleasant citrus notes.', true, 'in_stock'),
  ('sendhuram', 'Sendhuram Mango', 'mango', 140, 'Per KG', 'Vermilion blush on sun-kissed skin. Generously sweet traditional favorite.', true, 'low_stock'),
  ('kallamanga', 'Kallamanga (Totapuri) Mango', 'mango', 110, 'Per KG', 'Crisp bite with beak curve. Quintessential Tamil country variety.', true, 'in_stock'),
  ('grapes-mango', 'Grapes Mango', 'mango', 210, 'Per KG', 'Bountiful cluster growth. Intensely sweet rare heirloom variety.', true, 'low_stock'),
  ('neelam', 'Neelam Mango', 'mango', 130, 'Per KG', 'Late season mango with rich perfume and enduring flavor.', true, 'out_of_stock'),
  ('farm-honey-500g', 'Raw Farm Honey (500g)', 'honey', 380, '500g Glass Jar', 'Cold-extracted raw floral honey from farm apiaries.', true, 'in_stock'),
  ('farm-honey-1kg', 'Raw Farm Honey (1 KG)', 'honey', 720, '1 KG Jar', 'Pure raw honey rich in natural floral pollen and enzymes.', true, 'in_stock'),
  ('fresh-jackfruit-bulb', 'Sweet Honey Jackfruit (Palaapazham)', 'jackfruit', 260, '1 KG Box', 'Tree-ripened Then-Varikkai jackfruit with crunchy honey bulbs.', true, 'low_stock')
ON CONFLICT (product_code) DO UPDATE
SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  unit = EXCLUDED.unit,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  stock_status = EXCLUDED.stock_status,
  updated_at = now();

INSERT INTO mango_varieties (variety_code, name, tamil_name, tagline, season, unit, price, is_available, stock_status, display_order)
VALUES
  ('alphonsa', 'Alphonsa', 'அல்போன்சா', 'Rich • Aromatic • Naturally Sweet', 'April – June', 'Per KG', 190, true, 'in_stock', 1),
  ('himampasanth', 'Himampasanth', 'இமாம்பசந்த்', 'Large • Fleshy • Mildly Sweet', 'May – July', 'Per KG', 240, true, 'in_stock', 2),
  ('mallika', 'Mallika', 'மல்லிகா', 'Juicy • Fibre-free • Golden', 'June – August', 'Per KG', 160, true, 'in_stock', 3),
  ('sendhuram', 'Sendhuram', 'செந்தூரம்', 'Bright Blush • Sweet • Seasonal Favourite', 'April – June', 'Per KG', 140, true, 'low_stock', 4),
  ('kallamanga', 'Kallamanga (Totapuri)', 'கல்லாமாங்காய் / கிளிமூக்கு', 'Traditional • Tangy-Sweet • Deep Flavour', 'May – July', 'Per KG', 110, true, 'in_stock', 5),
  ('grapes-mango', 'Grapes Mango', 'திராட்சை மாம்பழம்', 'Rare Cluster • Intensely Sweet • Unique', 'May – June', 'Per KG', 210, true, 'low_stock', 6),
  ('neelam', 'Neelam', 'நீலம்', 'Late Season • Rich Perfume • Enduring', 'July – September', 'Per KG', 130, false, 'out_of_stock', 7)
ON CONFLICT (variety_code) DO UPDATE
SET
  name = EXCLUDED.name,
  tamil_name = EXCLUDED.tamil_name,
  tagline = EXCLUDED.tagline,
  season = EXCLUDED.season,
  unit = EXCLUDED.unit,
  price = EXCLUDED.price,
  is_available = EXCLUDED.is_available,
  stock_status = EXCLUDED.stock_status,
  display_order = EXCLUDED.display_order,
  updated_at = now();
