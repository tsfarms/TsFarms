/*
# Create TS Mango Farming admin tables

1. New Tables
- `products` — all farm products (mangoes, honey, jackfruit)
  - id (uuid, PK), name (text), category (text), description (text),
    image_url (text), is_active (boolean), stock_status (text),
    created_at, updated_at
- `mango_varieties` — the 7 mango varieties with details
  - id (uuid, PK), name (text), tagline (text), description (text),
    taste_profile (text[]), season (text), unit (text), image_url (text),
    is_available (boolean), display_order (int), created_at, updated_at
- `enquiries` — customer enquiries submitted from the website
  - id (uuid, PK), customer_name (text), phone (text), product_interest (text),
    message (text), status (text default 'new'), created_at
- `orders` — orders placed by customers
  - id (uuid, PK), customer_name (text), phone (text), product (text),
    quantity_kg (numeric), order_type (text), status (text default 'pending'),
    created_at, updated_at

2. Security
- Enable RLS on all tables.
- SELECT: allow anon + authenticated (public site reads product data;
  enquiries/orders visible to authenticated admin only via separate policies).
- For products & mango_varieties: anon can SELECT (public catalog).
- For enquiries & orders: anon can INSERT (website form submits);
  only authenticated can SELECT/UPDATE (admin manages them).
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'mango',
  description text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  stock_status text NOT NULL DEFAULT 'in_stock',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Mango varieties table
CREATE TABLE IF NOT EXISTS mango_varieties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  description text,
  taste_profile text[] DEFAULT '{}',
  season text,
  unit text DEFAULT 'Per KG',
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mango_varieties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_varieties" ON mango_varieties;
CREATE POLICY "anon_select_varieties" ON mango_varieties FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_varieties" ON mango_varieties;
CREATE POLICY "auth_insert_varieties" ON mango_varieties FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_varieties" ON mango_varieties;
CREATE POLICY "auth_update_varieties" ON mango_varieties FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_varieties" ON mango_varieties;
CREATE POLICY "auth_delete_varieties" ON mango_varieties FOR DELETE
  TO authenticated USING (true);

-- Enquiries table
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

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries" ON enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_enquiries" ON enquiries;
CREATE POLICY "auth_select_enquiries" ON enquiries FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_enquiries" ON enquiries;
CREATE POLICY "auth_update_enquiries" ON enquiries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_enquiries" ON enquiries;
CREATE POLICY "auth_delete_enquiries" ON enquiries FOR DELETE
  TO authenticated USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text,
  phone text,
  product text,
  quantity_kg numeric,
  order_type text DEFAULT 'retail',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_orders" ON orders;
CREATE POLICY "auth_select_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);
