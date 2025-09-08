-- Complete Marketplace System for GoEventCity
-- Venues and Performers can sell products, GoEventCity gets 10% commission + 5% buyer fee

-- =====================================================
-- VENDOR PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  vendor_type VARCHAR(50) NOT NULL CHECK (vendor_type IN ('venue', 'performer', 'organizer', 'supplier')),
  business_name VARCHAR(255) NOT NULL,
  business_email VARCHAR(255),
  business_phone VARCHAR(50),
  tax_id VARCHAR(100),
  stripe_account_id VARCHAR(255), -- For Stripe Connect
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Platform commission percentage
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  policies JSONB DEFAULT '{}', -- Return policy, shipping policy, etc.
  bank_account JSONB DEFAULT '{}', -- Encrypted bank details
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, suspended
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENHANCED PRODUCTS TABLE
-- =====================================================
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  compare_at_price DECIMAL(10,2),
  cost DECIMAL(10,2), -- Vendor's cost (for profit calculation)
  currency VARCHAR(3) DEFAULT 'USD',
  images TEXT[], -- Array of image URLs
  thumbnail_url TEXT, -- Main product image
  brand VARCHAR(100),
  sku VARCHAR(100),
  barcode VARCHAR(100),
  weight DECIMAL(10,2), -- In pounds
  dimensions JSONB, -- {length, width, height}
  
  -- Inventory
  track_inventory BOOLEAN DEFAULT true,
  inventory_count INT DEFAULT 0,
  allow_backorder BOOLEAN DEFAULT false,
  low_stock_threshold INT DEFAULT 5,
  
  -- Shipping
  requires_shipping BOOLEAN DEFAULT true,
  shipping_weight DECIMAL(10,2),
  shipping_class VARCHAR(50), -- standard, fragile, oversized
  
  -- Product details
  tags TEXT[],
  features TEXT[],
  specifications JSONB DEFAULT '{}',
  
  -- Status flags
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  
  -- Analytics
  view_count INT DEFAULT 0,
  purchase_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PRODUCT VARIANTS (for size, color, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- e.g., "Large Red", "XL Blue"
  sku VARCHAR(100) UNIQUE,
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  inventory_count INT DEFAULT 0,
  options JSONB DEFAULT '{}', -- {size: "XL", color: "Blue"}
  image_url TEXT,
  position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SHOPPING CART
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- For guest carts
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL, -- Price at time of adding to cart
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id),
  UNIQUE(session_id, product_id, variant_id)
);

-- =====================================================
-- ORDERS
-- =====================================================
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled, refunded
  
  -- Totals
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  marketplace_fee DECIMAL(10,2) DEFAULT 0, -- 5% buyer fee
  platform_commission DECIMAL(10,2) DEFAULT 0, -- 10% to platform
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Addresses
  billing_address JSONB NOT NULL,
  shipping_address JSONB,
  
  -- Payment
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_intent_id VARCHAR(255), -- Stripe payment intent
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Shipping
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(255),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional info
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ORDER ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendor_profiles(id),
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  vendor_commission DECIMAL(10,2) NOT NULL, -- Amount vendor receives after commission
  platform_commission DECIMAL(10,2) NOT NULL, -- Platform's commission
  fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled', -- unfulfilled, fulfilled, partial
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VENDOR PAYOUTS
-- =====================================================
CREATE TABLE IF NOT EXISTS vendor_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  payout_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  method VARCHAR(50), -- bank_transfer, stripe
  stripe_transfer_id VARCHAR(255),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  order_count INT DEFAULT 0,
  notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PAYOUT ITEMS (links payouts to orders)
-- =====================================================
CREATE TABLE IF NOT EXISTS payout_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_id UUID REFERENCES vendor_payouts(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PRODUCT REVIEWS
-- =====================================================
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_item_id UUID REFERENCES order_items(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INT DEFAULT 0,
  images TEXT[],
  vendor_response TEXT,
  vendor_responded_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'published', -- published, hidden, flagged
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WISHLISTS
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- =====================================================
-- SHIPPING RATES
-- =====================================================
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  min_weight DECIMAL(10,2) DEFAULT 0,
  max_weight DECIMAL(10,2),
  base_rate DECIMAL(10,2) NOT NULL,
  per_pound_rate DECIMAL(10,2) DEFAULT 0,
  delivery_days_min INT,
  delivery_days_max INT,
  regions TEXT[] DEFAULT ARRAY['US'], -- List of supported regions/countries
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- DISCOUNT CODES
-- =====================================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(10,2),
  usage_limit INT,
  usage_count INT DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE RLS
-- =====================================================
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Vendor profiles: Users can read all active vendors, manage their own
CREATE POLICY "Public read active vendors" ON vendor_profiles 
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users manage own vendor profile" ON vendor_profiles
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Products: Public read for active products, vendors manage their own
CREATE POLICY "Public read active products" ON products 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors manage own products" ON products
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (vendor_id IN (
    SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
  ));

-- Product variants: Same as products
CREATE POLICY "Public read product variants" ON product_variants 
  FOR SELECT USING (product_id IN (
    SELECT id FROM products WHERE is_active = true
  ));

CREATE POLICY "Vendors manage own variants" ON product_variants
  FOR ALL USING (product_id IN (
    SELECT p.id FROM products p 
    JOIN vendor_profiles v ON p.vendor_id = v.id 
    WHERE v.user_id = auth.uid()
  ));

-- Cart items: Users manage their own cart
CREATE POLICY "Users manage own cart" ON cart_items
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Orders: Users can read their own orders, vendors can see orders with their products
CREATE POLICY "Users read own orders" ON marketplace_orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Vendors read orders with their products" ON marketplace_orders
  FOR SELECT USING (id IN (
    SELECT DISTINCT order_id FROM order_items 
    WHERE vendor_id IN (
      SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
    )
  ));

-- Order items: Same as orders
CREATE POLICY "Users read own order items" ON order_items
  FOR SELECT USING (order_id IN (
    SELECT id FROM marketplace_orders WHERE user_id = auth.uid()
  ));

CREATE POLICY "Vendors read their order items" ON order_items
  FOR SELECT USING (vendor_id IN (
    SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
  ));

-- Reviews: Public read, users can write for verified purchases
CREATE POLICY "Public read reviews" ON product_reviews
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users write own reviews" ON product_reviews
  FOR INSERT WITH CHECK (user_id = auth.uid() AND order_item_id IN (
    SELECT oi.id FROM order_items oi
    JOIN marketplace_orders o ON oi.order_id = o.id
    WHERE o.user_id = auth.uid() AND o.status = 'delivered'
  ));

-- Wishlists: Users manage their own
CREATE POLICY "Users manage own wishlist" ON wishlists
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Shipping rates: Public read active rates, vendors manage their own
CREATE POLICY "Public read active shipping rates" ON shipping_rates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors manage own shipping rates" ON shipping_rates
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
  ));

-- Discount codes: Public can check validity, vendors manage their own
CREATE POLICY "Public read active discount codes" ON discount_codes
  FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Vendors manage own discount codes" ON discount_codes
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendor_profiles WHERE user_id = auth.uid()
  ));

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX idx_orders_user_id ON marketplace_orders(user_id);
CREATE INDEX idx_orders_status ON marketplace_orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_vendor_id ON order_items(vendor_id);
CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate order totals with fees
CREATE OR REPLACE FUNCTION calculate_order_totals(
  subtotal DECIMAL,
  tax_rate DECIMAL DEFAULT 0.0875, -- 8.75% default tax
  shipping DECIMAL DEFAULT 0
) RETURNS TABLE (
  subtotal DECIMAL,
  tax_amount DECIMAL,
  shipping_amount DECIMAL,
  marketplace_fee DECIMAL,
  total_amount DECIMAL
) AS $$
DECLARE
  buyer_fee_rate CONSTANT DECIMAL := 0.05; -- 5% buyer fee
BEGIN
  RETURN QUERY
  SELECT 
    subtotal,
    ROUND(subtotal * tax_rate, 2) as tax_amount,
    shipping as shipping_amount,
    ROUND(subtotal * buyer_fee_rate, 2) as marketplace_fee,
    ROUND(subtotal + (subtotal * tax_rate) + shipping + (subtotal * buyer_fee_rate), 2) as total_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate vendor commission
CREATE OR REPLACE FUNCTION calculate_vendor_commission(
  item_subtotal DECIMAL,
  commission_rate DECIMAL DEFAULT 10.0
) RETURNS TABLE (
  platform_commission DECIMAL,
  vendor_commission DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(item_subtotal * (commission_rate / 100), 2) as platform_commission,
    ROUND(item_subtotal * (1 - commission_rate / 100), 2) as vendor_commission;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product ratings when review is added
CREATE OR REPLACE FUNCTION update_product_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM product_reviews 
      WHERE product_id = NEW.product_id AND status = 'published'
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM product_reviews 
      WHERE product_id = NEW.product_id AND status = 'published'
    )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_on_review
AFTER INSERT OR UPDATE ON product_reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Trigger to update vendor ratings
CREATE OR REPLACE FUNCTION update_vendor_rating() RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendor_profiles
  SET 
    rating = (
      SELECT AVG(pr.rating)::DECIMAL(3,2) 
      FROM product_reviews pr
      JOIN products p ON pr.product_id = p.id
      WHERE p.vendor_id = NEW.vendor_id AND pr.status = 'published'
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM product_reviews pr
      JOIN products p ON pr.product_id = p.id
      WHERE p.vendor_id = NEW.vendor_id AND pr.status = 'published'
    )
  WHERE id = NEW.vendor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS VARCHAR AS $$
DECLARE
  new_number VARCHAR;
BEGIN
  -- Generate order number like: ORD-20240111-0001
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
    LPAD((SELECT COUNT(*) + 1 FROM marketplace_orders WHERE DATE(created_at) = CURRENT_DATE)::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set order number
CREATE OR REPLACE FUNCTION set_order_number() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_on_insert
BEFORE INSERT ON marketplace_orders
FOR EACH ROW EXECUTE FUNCTION set_order_number();