/*
# Upgrade Orders Table for Multi-Product Cart & Authoritative Database Catalog
# Final Production Security Hardened Migration
#
# 1. Base Table Guarantees & Extensions:
#    - Guarantees orders, enquiries, products, mango_varieties exist
#    - Adds UNIQUE constraint on orders(order_code)
#    - Adds product_code, price, unit to products
#    - Adds variety_code, price, stock_status, tamil_name to mango_varieties
#    - Seeds baseline catalog items if not present
#
# 2. Dynamic Synchronization:
#    - sync_mango_variety_to_products trigger synchronizes mango variety price & stock changes
#
# 3. Direct Public Insert Revocation:
#    - REVOKE INSERT ON orders FROM anon, authenticated
#    - REVOKE INSERT ON enquiries FROM anon, authenticated
#    - Orders and enquiries can ONLY be created through SECURITY DEFINER RPCs
#
# 4. Admin Authorization:
#    - admin_users table & locked down privileges
#    - is_admin() & check_is_admin() with SET search_path = public, pg_temp
#
# 5. Row Level Security:
#    - Public SELECT on active products & site_settings
#    - Admin-only SELECT, UPDATE, DELETE on orders, enquiries, products, mango_varieties, settings
#
# 6. Secure Authoritative Server-Side RPC Functions:
#    - create_farm_order with dynamic database catalog lookup, stock checks, 5 KG mango rule,
#      rate limit, collision-safe unique order code, search_path
#    - submit_customer_enquiry with validation, rate limit, search_path
*/

-- 0. Ensure base tables exist before applying extensions
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text UNIQUE,
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

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS mango_varieties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variety_code text UNIQUE,
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

ALTER TABLE mango_varieties ENABLE ROW LEVEL SECURITY;

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

-- 1. Schema Extensions for products & mango_varieties
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_code text,
  ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unit text NOT NULL DEFAULT 'Per KG';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_products_product_code'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT uq_products_product_code UNIQUE (product_code);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

ALTER TABLE mango_varieties
  ADD COLUMN IF NOT EXISTS variety_code text,
  ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stock_status text DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS tamil_name text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_mango_varieties_code'
  ) THEN
    ALTER TABLE mango_varieties ADD CONSTRAINT uq_mango_varieties_code UNIQUE (variety_code);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- 2. Schema Extensions for orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS order_code text,
  ADD COLUMN IF NOT EXISTS items_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS delivery_address text,
  ADD COLUMN IF NOT EXISTS town_city text,
  ADD COLUMN IF NOT EXISTS district text,
  ADD COLUMN IF NOT EXISTS pincode text,
  ADD COLUMN IF NOT EXISTS total_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mango_total_kg numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes text;

-- Enforce UNIQUE constraint on order_code
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_orders_order_code'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT uq_orders_order_code UNIQUE (order_code);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);

-- 3. Seed baseline products if table is missing them
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
ON CONFLICT (product_code) DO NOTHING;

-- 4. Dynamic Catalog Synchronization Triggers (Bidirectional, Recursion-Safe)
CREATE OR REPLACE FUNCTION sync_mango_variety_to_products()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF pg_trigger_depth() = 1 THEN
    UPDATE products
    SET
      name = NEW.name || ' Mango',
      price = CASE WHEN NEW.price > 0 THEN NEW.price ELSE price END,
      stock_status = NEW.stock_status,
      is_active = NEW.is_available,
      updated_at = now()
    WHERE product_code = NEW.variety_code;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_mango_variety ON mango_varieties;
CREATE TRIGGER trg_sync_mango_variety
AFTER UPDATE OF price, stock_status, is_available, name ON mango_varieties
FOR EACH ROW
EXECUTE FUNCTION sync_mango_variety_to_products();

CREATE OR REPLACE FUNCTION sync_product_to_mango_variety()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.category = 'mango' AND pg_trigger_depth() = 1 THEN
    UPDATE mango_varieties
    SET
      price = CASE WHEN NEW.price > 0 THEN NEW.price ELSE price END,
      stock_status = NEW.stock_status,
      is_available = NEW.is_active,
      updated_at = now()
    WHERE variety_code = NEW.product_code;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_product_to_variety ON products;
CREATE TRIGGER trg_sync_product_to_variety
AFTER UPDATE OF price, stock_status, is_active, name ON products
FOR EACH ROW
EXECUTE FUNCTION sync_product_to_mango_variety();

-- 5. Site settings table for admin settings persistence
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 6. Admin authorization allowlist table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY,
  email text UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_read_self" ON admin_users;
CREATE POLICY "admin_users_read_self" ON admin_users FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

REVOKE ALL ON admin_users FROM anon;
REVOKE INSERT, UPDATE, DELETE ON admin_users FROM authenticated;
GRANT SELECT ON admin_users TO authenticated;

-- 7. Admin check functions
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()) THEN
    RETURN true;
  END IF;
  IF (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' THEN
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION check_is_admin() RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN is_admin();
END;
$$;

REVOKE ALL ON FUNCTION is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION check_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION check_is_admin() TO authenticated;

-- 8. Strengthen RLS policies across farm tables
DROP POLICY IF EXISTS "anon_select_settings" ON site_settings;
CREATE POLICY "anon_select_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_all_settings" ON site_settings;
DROP POLICY IF EXISTS "admin_all_settings" ON site_settings;
CREATE POLICY "admin_all_settings" ON site_settings FOR ALL
  TO authenticated USING (is_admin() OR auth.role() = 'service_role')
  WITH CHECK (is_admin() OR auth.role() = 'service_role');

-- Catalog Public Read & Admin-Only Write
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_update_products" ON products;
DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products" ON products FOR UPDATE
  TO authenticated USING (is_admin() OR auth.role() = 'service_role')
  WITH CHECK (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_delete_products" ON products;
DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products" ON products FOR DELETE
  TO authenticated USING (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "anon_select_varieties" ON mango_varieties;
CREATE POLICY "anon_select_varieties" ON mango_varieties FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_varieties" ON mango_varieties;
DROP POLICY IF EXISTS "admin_insert_varieties" ON mango_varieties;
CREATE POLICY "admin_insert_varieties" ON mango_varieties FOR INSERT
  TO authenticated WITH CHECK (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_update_varieties" ON mango_varieties;
DROP POLICY IF EXISTS "admin_update_varieties" ON mango_varieties;
CREATE POLICY "admin_update_varieties" ON mango_varieties FOR UPDATE
  TO authenticated USING (is_admin() OR auth.role() = 'service_role')
  WITH CHECK (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_delete_varieties" ON mango_varieties;
DROP POLICY IF EXISTS "admin_delete_varieties" ON mango_varieties;
CREATE POLICY "admin_delete_varieties" ON mango_varieties FOR DELETE
  TO authenticated USING (is_admin() OR auth.role() = 'service_role');

-- 9. REVOKE DIRECT PUBLIC INSERT ON ORDERS & ENQUIRIES
-- RPCs are the SOLE entry point for public creation!
REVOKE INSERT ON orders FROM anon, authenticated;
REVOKE INSERT ON enquiries FROM anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;

-- Orders & Enquiries: Admin-only SELECT, UPDATE, DELETE
DROP POLICY IF EXISTS "auth_select_orders" ON orders;
DROP POLICY IF EXISTS "admin_select_orders" ON orders;
CREATE POLICY "admin_select_orders" ON orders FOR SELECT
  TO authenticated USING (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (is_admin() OR auth.role() = 'service_role')
  WITH CHECK (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
  TO authenticated USING (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_select_enquiries" ON enquiries;
DROP POLICY IF EXISTS "admin_select_enquiries" ON enquiries;
CREATE POLICY "admin_select_enquiries" ON enquiries FOR SELECT
  TO authenticated USING (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_update_enquiries" ON enquiries;
DROP POLICY IF EXISTS "admin_update_enquiries" ON enquiries;
CREATE POLICY "admin_update_enquiries" ON enquiries FOR UPDATE
  TO authenticated USING (is_admin() OR auth.role() = 'service_role')
  WITH CHECK (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "auth_delete_enquiries" ON enquiries;
DROP POLICY IF EXISTS "admin_delete_enquiries" ON enquiries;
CREATE POLICY "admin_delete_enquiries" ON enquiries FOR DELETE
  TO authenticated USING (is_admin() OR auth.role() = 'service_role');

-- ==========================================================
-- 10. SECURE SERVER-SIDE RPC: create_farm_order
-- Fully dynamic database catalog lookup, zero client price trust,
-- out-of-stock rejection, inactive rejection, 5 KG minimum,
-- collision-safe unique order code, phone rate limiting
-- ==========================================================
CREATE OR REPLACE FUNCTION create_farm_order(
  p_customer_name text,
  p_phone text,
  p_delivery_address text,
  p_town_city text,
  p_district text,
  p_pincode text,
  p_notes text,
  p_items jsonb
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean_phone text;
  v_item jsonb;
  v_product_id text;
  v_item_qty numeric;
  v_item_unit text;
  v_item_category text;
  v_item_price numeric;
  v_item_name text;
  v_is_active boolean;
  v_stock_status text;
  v_mango_total numeric := 0;
  v_total_qty numeric := 0;
  v_calculated_total numeric := 0;
  v_sanitized_items jsonb := '[]'::jsonb;
  v_order_code text;
  v_random_chars text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_code_suffix text;
  v_i int;
  v_order_id uuid;
BEGIN
  -- 1. Validate customer input
  IF p_customer_name IS NULL OR length(trim(p_customer_name)) = 0 THEN
    RAISE EXCEPTION 'Customer name is required';
  END IF;

  v_clean_phone := regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g');
  IF length(v_clean_phone) < 10 THEN
    RAISE EXCEPTION 'A valid 10-digit mobile phone number is required';
  END IF;

  IF p_delivery_address IS NULL OR length(trim(p_delivery_address)) = 0 THEN
    RAISE EXCEPTION 'Delivery address is required';
  END IF;

  IF p_town_city IS NULL OR length(trim(p_town_city)) = 0 THEN
    RAISE EXCEPTION 'Town / City is required';
  END IF;

  IF p_district IS NULL OR length(trim(p_district)) = 0 THEN
    RAISE EXCEPTION 'District is required';
  END IF;

  IF p_pincode IS NOT NULL AND length(trim(p_pincode)) > 0 AND NOT (trim(p_pincode) ~ '^\d{6}$') THEN
    RAISE EXCEPTION 'PIN code must be a valid 6-digit postal code';
  END IF;

  -- Anti-Abuse Rate Limit: Prevent automated spamming (max 5 orders per phone per hour)
  IF (SELECT count(*) FROM orders WHERE phone = v_clean_phone AND created_at > (now() - interval '1 hour')) >= 5 THEN
    RAISE EXCEPTION 'Order submission limit reached for this phone number. Please contact the farm directly on WhatsApp.';
  END IF;

  -- 2. Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := trim(v_item->>'id');
    v_item_qty := COALESCE((v_item->>'quantity')::numeric, 0);

    IF v_item_qty <= 0 THEN
      RAISE EXCEPTION 'Quantity for all items must be greater than zero';
    END IF;

    -- Dynamic Authoritative Database Catalog Lookup
    SELECT name, price, category, unit, is_active, stock_status
    INTO v_item_name, v_item_price, v_item_category, v_item_unit, v_is_active, v_stock_status
    FROM products
    WHERE product_code = v_product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product with ID "%" does not exist in the farm catalog', v_product_id;
    END IF;

    IF NOT v_is_active THEN
      RAISE EXCEPTION 'Product "%" is currently deactivated and unavailable for order', v_item_name;
    END IF;

    IF v_stock_status = 'out_of_stock' THEN
      RAISE EXCEPTION 'Product "%" is currently out of stock and cannot be ordered', v_item_name;
    END IF;

    IF v_item_category = 'mango' THEN
      v_mango_total := v_mango_total + v_item_qty;
    END IF;

    v_total_qty := v_total_qty + v_item_qty;
    v_calculated_total := v_calculated_total + (v_item_price * v_item_qty);

    v_sanitized_items := v_sanitized_items || jsonb_build_object(
      'id', v_product_id,
      'name', v_item_name,
      'quantity', v_item_qty,
      'unit', v_item_unit,
      'price', v_item_price,
      'category', v_item_category
    );
  END LOOP;

  -- 3. Strict Server-side Mango Minimum Validation
  IF v_mango_total > 0 AND v_mango_total < 5 THEN
    RAISE EXCEPTION 'Mango orders require a minimum box size of 5 KG for safe transit packing. Current total: % KG', v_mango_total;
  END IF;

  -- 4. Collision-safe unique order code generation loop (TS-2026-XXXX)
  LOOP
    v_code_suffix := '';
    FOR v_i IN 1..4 LOOP
      v_code_suffix := v_code_suffix || substr(v_random_chars, floor(random() * length(v_random_chars) + 1)::int, 1);
    END LOOP;
    v_order_code := 'TS-2026-' || v_code_suffix;

    EXIT WHEN NOT EXISTS (SELECT 1 FROM orders WHERE order_code = v_order_code);
  END LOOP;

  -- 5. Insert order with forced status = 'pending' (client cannot spoof status)
  INSERT INTO orders (
    order_code,
    customer_name,
    phone,
    delivery_address,
    town_city,
    district,
    pincode,
    notes,
    total_amount,
    mango_total_kg,
    quantity_kg,
    product,
    items_json,
    order_type,
    status
  ) VALUES (
    v_order_code,
    trim(p_customer_name),
    v_clean_phone,
    trim(p_delivery_address),
    trim(p_town_city),
    trim(p_district),
    COALESCE(trim(p_pincode), ''),
    COALESCE(trim(p_notes), ''),
    v_calculated_total,
    v_mango_total,
    v_mango_total,
    (SELECT string_agg(i->>'name' || ' (' || (i->>'quantity') || ' ' || (i->>'unit') || ')', ', ') FROM jsonb_array_elements(v_sanitized_items) i),
    v_sanitized_items,
    'retail',
    'pending'
  ) RETURNING id INTO v_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_code', v_order_code,
    'total_amount', v_calculated_total,
    'mango_total_kg', v_mango_total,
    'items', v_sanitized_items
  );
END;
$$;

REVOKE ALL ON FUNCTION create_farm_order(text, text, text, text, text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_farm_order(text, text, text, text, text, text, text, jsonb) TO anon, authenticated;

-- ==========================================================
-- 11. SECURE SERVER-SIDE RPC: submit_customer_enquiry
-- ==========================================================
CREATE OR REPLACE FUNCTION submit_customer_enquiry(
  p_customer_name text,
  p_phone text,
  p_product_interest text,
  p_message text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean_phone text;
  v_enquiry_id uuid;
BEGIN
  IF p_customer_name IS NULL OR length(trim(p_customer_name)) = 0 THEN
    RAISE EXCEPTION 'Customer name is required';
  END IF;

  v_clean_phone := regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g');
  IF length(v_clean_phone) < 10 THEN
    RAISE EXCEPTION 'Valid 10-digit phone number is required';
  END IF;

  -- Anti-Abuse Rate Limit: Prevent enquiry spamming (max 5 enquiries per phone per hour)
  IF (SELECT count(*) FROM enquiries WHERE phone = v_clean_phone AND created_at > (now() - interval '1 hour')) >= 5 THEN
    RAISE EXCEPTION 'Enquiry limit reached for this phone number. Please contact the farm directly on WhatsApp.';
  END IF;

  INSERT INTO enquiries (
    customer_name,
    phone,
    product_interest,
    message,
    status
  ) VALUES (
    trim(p_customer_name),
    v_clean_phone,
    COALESCE(trim(p_product_interest), 'Farm Produce'),
    COALESCE(trim(p_message), ''),
    'new'
  ) RETURNING id INTO v_enquiry_id;

  RETURN jsonb_build_object(
    'success', true,
    'enquiry_id', v_enquiry_id
  );
END;
$$;

REVOKE ALL ON FUNCTION submit_customer_enquiry(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION submit_customer_enquiry(text, text, text, text) TO anon, authenticated;
