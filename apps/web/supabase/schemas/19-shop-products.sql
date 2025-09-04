/*
 * -------------------------------------------------------
 * Section: Shop/Marketplace Products
 * Schema for shop products and categories to support GearPage functionality
 * Data structure driven by UI requirements in GearPage.tsx
 * -------------------------------------------------------
 */

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PRODUCT CATEGORIES SYSTEM
-- =============================================================================

-- Product categories table
-- Matches UI requirement: shopCategories array in GearPage.tsx
CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- UI required fields
  title varchar(255) NOT NULL,                    -- "Event Merch"
  description text,                               -- "Official merchandise from your favorite local events"
  path varchar(255) NOT NULL,                     -- "/shop/merch" 
  image varchar(1000),                            -- Full image URL
  
  -- Additional management fields
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- PRODUCTS SYSTEM
-- =============================================================================

-- Products table
-- Matches UI requirement: featuredProducts array in GearPage.tsx
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- UI required fields
  name varchar(255) NOT NULL,                     -- "Clearwater Jazz Holiday 2024 T-Shirt"
  image varchar(1000),                            -- Full image URL
  price decimal(10,2) NOT NULL,                   -- 24.99 (will be formatted as "$24.99" in UI)
  category varchar(255),                          -- "Event Merch"
  
  -- UI optional metadata fields (varies by product type)
  -- These match the optional fields in featuredProducts mock data
  event varchar(255),                             -- "Clearwater Jazz Holiday"
  artist varchar(255),                            -- "Sarah's Ceramics"
  era varchar(255),                               -- "1960s-1970s"
  includes text,                                  -- "3 concerts + exclusive t-shirt"
  featured text,                                  -- "3 albums from local artists"
  
  -- Additional management fields
  description text,
  category_id uuid REFERENCES public.product_categories(id),
  stock_quantity integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  
  -- Relations to existing tables
  event_id uuid REFERENCES public.events(id),
  performer_id uuid REFERENCES public.performers(id), 
  venue_id uuid REFERENCES public.venues(id),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Product categories indexes
CREATE INDEX IF NOT EXISTS idx_product_categories_active ON public.product_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_product_categories_order ON public.product_categories(display_order);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_event ON public.products(event_id);
CREATE INDEX IF NOT EXISTS idx_products_performer ON public.products(performer_id);
CREATE INDEX IF NOT EXISTS idx_products_venue ON public.products(venue_id);
CREATE INDEX IF NOT EXISTS idx_products_account ON public.products(account_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product categories policies
-- Anyone can read active categories
CREATE POLICY "product_categories_read" ON public.product_categories 
  FOR SELECT TO authenticated, anon 
  USING (is_active = true);

-- Products policies  
-- Anyone can read active products
CREATE POLICY "products_read" ON public.products
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

-- Account owners can manage their products
CREATE POLICY "products_manage" ON public.products
  FOR ALL TO authenticated
  USING (account_id = (SELECT auth.uid()))
  WITH CHECK (account_id = (SELECT auth.uid()));

-- =============================================================================
-- SEED DATA
-- Exact data from GearPage.tsx mock data to ensure UI compatibility
-- =============================================================================

-- Insert product categories (matches shopCategories mock data)
INSERT INTO public.product_categories (title, description, path, image, display_order, is_active) VALUES
  ('Event Merch', 'Official merchandise from your favorite local events', '/shop/merch', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', 1, true),
  ('Local Artist Goods', 'Unique items created by talented local artists', '/shop/artist-goods', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', 2, true),
  ('Vintage Finds', 'One-of-a-kind vintage items from local collectors', '/shop/vintage', 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', 3, true),
  ('Ticket Packages', 'Special bundles including tickets and merchandise', '/shop/tickets', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', 4, true),
  ('Gift Ideas', 'Perfect presents for the event lovers in your life', '/shop/gifts', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', 5, true)
ON CONFLICT DO NOTHING;

-- Insert featured products (matches featuredProducts mock data)
INSERT INTO public.products (name, image, price, category, event, artist, era, includes, featured, is_featured, is_active) VALUES
  ('Clearwater Jazz Holiday 2024 T-Shirt', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 24.99, 'Event Merch', 'Clearwater Jazz Holiday', NULL, NULL, NULL, NULL, true, true),
  ('Handcrafted Beach Pottery', 'https://images.unsplash.com/photo-1565193298357-c304f6b19a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 35.00, 'Local Artist Goods', NULL, 'Sarah''s Ceramics', NULL, NULL, NULL, true, true),
  ('Vintage Clearwater Postcard Set', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 12.50, 'Vintage Finds', NULL, NULL, '1960s-1970s', NULL, NULL, true, true),
  ('Summer Concert Series Package', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 89.99, 'Ticket Packages', NULL, NULL, NULL, '3 concerts + exclusive t-shirt', NULL, true, true),
  ('Local Music Vinyl Collection', 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 45.00, 'Gift Ideas', NULL, NULL, NULL, NULL, '3 albums from local artists', true, true),
  ('Beach Festival Essentials Kit', 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 29.99, 'Event Merch', NULL, NULL, NULL, 'Sunglasses, water bottle, tote bag', NULL, true, true)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SHOPPING CART SYSTEM
-- =============================================================================

-- Shopping cart table
-- Stores user's cart items before checkout
CREATE TABLE IF NOT EXISTS public.shopping_cart (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id varchar(255), -- For anonymous users
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  selected_size varchar(10), -- For apparel
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure user has either user_id or session_id
  CONSTRAINT cart_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  ),
  
  -- Unique constraint to prevent duplicate items
  UNIQUE(user_id, product_id, selected_size),
  UNIQUE(session_id, product_id, selected_size)
);

-- Shop orders table  
-- Extends the existing orders system for shop purchases
CREATE TABLE IF NOT EXISTS public.shop_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id text REFERENCES public.orders(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Customer info
  customer_name varchar(255) NOT NULL,
  customer_email varchar(255) NOT NULL,
  customer_phone varchar(50),
  
  -- Shipping address
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  
  -- Order details
  subtotal decimal(10,2) NOT NULL,
  shipping_cost decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  
  -- Status
  order_status varchar(50) DEFAULT 'pending',
  payment_status varchar(50) DEFAULT 'pending',
  shipping_status varchar(50) DEFAULT 'pending',
  
  -- Tracking
  tracking_number varchar(255),
  shipped_at timestamptz,
  delivered_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shop order items table
-- Individual products in shop orders
CREATE TABLE IF NOT EXISTS public.shop_order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_order_id uuid REFERENCES public.shop_orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  
  -- Product snapshot (in case product changes after order)
  product_name varchar(255) NOT NULL,
  product_image varchar(1000),
  product_category varchar(255),
  
  -- Order item details
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  selected_size varchar(10),
  
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- CART INDEXES
-- =============================================================================

-- Shopping cart indexes
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session_id ON public.shopping_cart(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON public.shopping_cart(product_id);

-- Shop orders indexes
CREATE INDEX IF NOT EXISTS idx_shop_orders_account_id ON public.shop_orders(account_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_email ON public.shop_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_shop_orders_status ON public.shop_orders(order_status);

-- Shop order items indexes
CREATE INDEX IF NOT EXISTS idx_shop_order_items_order ON public.shop_order_items(shop_order_id);
CREATE INDEX IF NOT EXISTS idx_shop_order_items_product ON public.shop_order_items(product_id);

-- =============================================================================
-- CART RLS
-- =============================================================================

-- Enable RLS
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_order_items ENABLE ROW LEVEL SECURITY;

-- Shopping cart policies
-- Users can manage their own cart items
CREATE POLICY "cart_user_access" ON public.shopping_cart
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Anonymous users can manage cart via session
CREATE POLICY "cart_session_access" ON public.shopping_cart  
  FOR ALL TO anon
  USING (true) -- Session validation handled by application
  WITH CHECK (true);

-- Shop orders policies
-- Users can view their own orders
CREATE POLICY "shop_orders_user_access" ON public.shop_orders
  FOR SELECT TO authenticated
  USING (account_id = auth.uid());

-- Shop order items policies  
-- Users can view items from their orders
CREATE POLICY "shop_order_items_access" ON public.shop_order_items
  FOR SELECT TO authenticated
  USING (
    shop_order_id IN (
      SELECT id FROM public.shop_orders WHERE account_id = auth.uid()
    )
  );

-- =============================================================================
-- GRANTS
-- =============================================================================

-- Grant permissions
GRANT SELECT ON public.product_categories TO authenticated, anon;
GRANT SELECT ON public.products TO authenticated, anon;
GRANT ALL ON public.products TO authenticated;

-- Cart permissions
GRANT ALL ON public.shopping_cart TO authenticated, anon;
GRANT SELECT ON public.shop_orders TO authenticated;
GRANT SELECT ON public.shop_order_items TO authenticated;