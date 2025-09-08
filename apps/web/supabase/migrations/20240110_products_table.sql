-- Products table for the shop
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  images TEXT[], -- Array of image URLs
  brand VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  in_stock BOOLEAN DEFAULT true,
  stock_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  tags TEXT[],
  features TEXT[],
  is_new BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products
CREATE POLICY "Public read access" ON products 
  FOR SELECT USING (status = 'active');

-- Vendors can manage their own products
CREATE POLICY "Vendors manage own products" ON products
  FOR ALL USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Create indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_vendor_id ON products(vendor_id);

-- Insert some sample products
INSERT INTO products (name, description, category, subcategory, price, compare_at_price, images, brand, sku, in_stock, stock_count, rating, review_count, tags, features, is_new, is_sale, is_featured) VALUES
  ('Professional PA System', 'High-quality portable PA system for events', 'audio', 'speakers', 1299.99, 1599.99, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'], 'SoundPro', 'SP-PA-500', true, 15, 4.5, 124, ARRAY['professional', 'outdoor', 'indoor'], ARRAY['500W RMS', 'Bluetooth 5.0', 'Weather resistant'], false, true, true),
  ('LED Stage Lighting Kit', 'Complete lighting solution for stages and venues', 'lighting', 'stage-lights', 899.99, null, ARRAY['https://images.unsplash.com/photo-1565724481-5d17448e5d5f?w=800&q=80'], 'BrightStage', 'BS-LED-KIT', true, 8, 4.8, 89, ARRAY['led', 'dmx', 'programmable'], ARRAY['DMX compatible', 'RGB+W', 'App control'], true, false, true),
  ('DJ Controller Pro', '4-channel DJ controller with built-in effects', 'dj-equipment', 'controllers', 599.99, 699.99, ARRAY['https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80'], 'MixMaster', 'MM-DJ-4CH', true, 12, 4.6, 156, ARRAY['serato', 'rekordbox', 'professional'], ARRAY['4 channels', 'Touch-sensitive jogs', 'Built-in sound card'], false, true, false),
  ('Wireless Microphone Set', 'Professional wireless mic system', 'audio', 'microphones', 349.99, null, ARRAY['https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80'], 'AudioTech', 'AT-WM-PRO', true, 25, 4.7, 203, ARRAY['wireless', 'professional', 'uhf'], ARRAY['UHF frequency', 'Rechargeable', '100m range'], false, false, false),
  ('Portable Stage Platform', 'Modular stage system for events', 'stage', 'platforms', 2499.99, 2999.99, ARRAY['https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80'], 'StageBuilder', 'SB-MOD-24', true, 5, 4.4, 67, ARRAY['modular', 'portable', 'outdoor'], ARRAY['4x8ft sections', 'Weather resistant', 'Quick setup'], false, true, true),
  ('Event Tent 20x20', 'Professional grade event tent', 'decorations', 'tents', 799.99, null, ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'], 'EventPro', 'EP-TENT-20', true, 10, 4.5, 145, ARRAY['outdoor', 'waterproof', 'commercial'], ARRAY['Heavy duty frame', 'UV resistant', 'Sidewalls included'], true, false, false)
ON CONFLICT DO NOTHING;