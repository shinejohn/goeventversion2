-- Test data for vendor management system
-- This script creates realistic test data for all vendor-related functionality

-- =====================================================
-- CREATE TEST USERS (if they don't exist)
-- =====================================================
-- Note: In a real environment, users would be created via auth signup
-- This is placeholder data for the user_id references

-- Vendor user (performer/venue type)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'vendor1@example.com', '$2a$10$dummy', NOW(), NOW(), NOW(), '{"name": "DJ Mike Electronic", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'vendor2@example.com', '$2a$10$dummy', NOW(), NOW(), NOW(), '{"name": "Sarah Sound Productions", "avatar_url": "https://images.unsplash.com/photo-1494790108755-2616b68d5ea7?w=150&q=80"}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'customer1@example.com', '$2a$10$dummy', NOW(), NOW(), NOW(), '{"name": "John Customer", "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80"}')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- USER PROFILES
-- =====================================================
INSERT INTO user_profiles (user_id, display_name, phone_number, location, bio, profile_image_url, theme, language) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'DJ Mike Electronic', '+1-555-0101', 'Los Angeles, CA', 'Professional DJ specializing in electronic dance music and event entertainment.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', 'dark', 'en'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Sound Productions', '+1-555-0102', 'Nashville, TN', 'Full-service audio production company for events, concerts, and corporate functions.', 'https://images.unsplash.com/photo-1494790108755-2616b68d5ea7?w=300&q=80', 'light', 'en'),
  ('550e8400-e29b-41d4-a716-446655440003', 'John Customer', '+1-555-0103', 'New York, NY', 'Event enthusiast and frequent attendee.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80', 'auto', 'en')
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- USER NOTIFICATION SETTINGS
-- =====================================================
INSERT INTO user_notification_settings (user_id, email_notifications, push_notifications, marketing_emails, event_reminders, weekly_digest) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', true, true, true, true, true),
  ('550e8400-e29b-41d4-a716-446655440002', true, false, false, true, true),
  ('550e8400-e29b-41d4-a716-446655440003', true, true, false, true, false)
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- VENDOR PROFILES
-- =====================================================
INSERT INTO vendor_profiles (
  id, user_id, vendor_type, business_name, business_email, business_phone, 
  tax_id, commission_rate, is_verified, verification_date, total_sales, 
  total_revenue, rating, review_count, status, policies
) VALUES 
  (
    gen_random_uuid(), 
    '550e8400-e29b-41d4-a716-446655440001', 
    'performer', 
    'DJ Mike Electronic Services', 
    'business@djmike.com', 
    '+1-555-DJ-MIKE',
    'XX-XXXXXXX1',
    10.00,
    true,
    NOW() - INTERVAL '30 days',
    15420.50,
    13878.45,
    4.8,
    24,
    'active',
    '{"return_policy": "7 days", "shipping_policy": "2-3 business days", "payouts": {"minimumPayout": 25, "frequency": "weekly"}}'
  ),
  (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440002',
    'supplier',
    'Sarah Sound Productions',
    'info@sarahsound.com',
    '+1-555-SOUND-1',
    'XX-XXXXXXX2',
    10.00,
    true,
    NOW() - INTERVAL '45 days',
    32150.75,
    28935.68,
    4.9,
    41,
    'active',
    '{"return_policy": "14 days", "shipping_policy": "1-2 business days", "payouts": {"minimumPayout": 50, "frequency": "biweekly"}}'
  )
ON CONFLICT DO NOTHING;

-- Get vendor IDs for use in other tables
-- Note: In a real application, these would be obtained dynamically

-- =====================================================
-- PRODUCTS (Enhanced with more variety)
-- =====================================================
INSERT INTO products (
  vendor_id, name, slug, description, category, subcategory, price, compare_at_price, 
  images, brand, sku, track_inventory, inventory_count, tags, features, 
  is_active, is_featured, is_new, is_sale, view_count, purchase_count, rating, review_count, status
) 
SELECT 
  vp.id as vendor_id,
  product_data.name,
  product_data.slug,
  product_data.description,
  product_data.category,
  product_data.subcategory,
  product_data.price,
  product_data.compare_at_price,
  product_data.images,
  product_data.brand,
  product_data.sku,
  product_data.track_inventory,
  product_data.inventory_count,
  product_data.tags,
  product_data.features,
  product_data.is_active,
  product_data.is_featured,
  product_data.is_new,
  product_data.is_sale,
  product_data.view_count,
  product_data.purchase_count,
  product_data.rating,
  product_data.review_count,
  'active'
FROM vendor_profiles vp
CROSS JOIN (
  VALUES
  -- DJ Mike's Products
  ('Professional DJ Controller Pro', 'professional-dj-controller-pro', 'State-of-the-art 4-channel DJ controller with touch-sensitive jog wheels and built-in effects', 'dj-equipment', 'controllers', 899.99, 1199.99, ARRAY['https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80'], 'MixMaster', 'MM-DJ-PRO-01', true, 8, ARRAY['professional', 'dj', 'serato', 'rekordbox'], ARRAY['4 channels', 'Touch jogs', 'Built-in soundcard', 'RGB backlighting'], true, true, false, true, 245, 12, 4.7, 8),
  
  ('Wireless Microphone System Deluxe', 'wireless-microphone-system-deluxe', 'Premium dual-channel wireless microphone system perfect for events and performances', 'audio', 'microphones', 459.99, 599.99, ARRAY['https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80'], 'AudioTech', 'AT-WM-DLX', true, 15, ARRAY['wireless', 'professional', 'uhf', 'dual-channel'], ARRAY['UHF frequency', '200m range', 'Rechargeable batteries', 'LCD display'], true, true, true, true, 186, 9, 4.6, 6),
  
  ('LED DJ Booth Lighting Kit', 'led-dj-booth-lighting-kit', 'Complete LED lighting solution for DJ setups and small venues', 'lighting', 'dj-lights', 299.99, NULL, ARRAY['https://images.unsplash.com/photo-1565724481-5d17448e5d5f?w=800&q=80'], 'BrightStage', 'BS-LED-DJ', true, 20, ARRAY['led', 'dmx', 'dj', 'booth'], ARRAY['DMX control', 'RGB+UV', 'Sound activation', 'Remote included'], true, false, false, false, 134, 7, 4.4, 4),
  
  ('Event Speaker Package', 'event-speaker-package', 'Portable PA system perfect for weddings, parties, and corporate events', 'audio', 'speakers', 1299.99, 1599.99, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'], 'SoundPro', 'SP-EVENT-PKG', true, 5, ARRAY['professional', 'outdoor', 'portable', 'bluetooth'], ARRAY['2000W total power', 'Bluetooth connectivity', 'Weather resistant', 'Wireless mics included'], true, true, false, true, 298, 4, 4.8, 3)
) AS product_data(name, slug, description, category, subcategory, price, compare_at_price, images, brand, sku, track_inventory, inventory_count, tags, features, is_active, is_featured, is_new, is_sale, view_count, purchase_count, rating, review_count)
WHERE vp.business_name = 'DJ Mike Electronic Services'

UNION ALL

SELECT 
  vp.id as vendor_id,
  product_data.name,
  product_data.slug,
  product_data.description,
  product_data.category,
  product_data.subcategory,
  product_data.price,
  product_data.compare_at_price,
  product_data.images,
  product_data.brand,
  product_data.sku,
  product_data.track_inventory,
  product_data.inventory_count,
  product_data.tags,
  product_data.features,
  product_data.is_active,
  product_data.is_featured,
  product_data.is_new,
  product_data.is_sale,
  product_data.view_count,
  product_data.purchase_count,
  product_data.rating,
  product_data.review_count,
  'active'
FROM vendor_profiles vp
CROSS JOIN (
  VALUES
  -- Sarah Sound's Products
  ('Professional Mixing Console', 'professional-mixing-console', '32-channel digital mixing console for live events and studio recording', 'audio', 'mixers', 2499.99, 2999.99, ARRAY['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80'], 'MixMaster', 'MM-MX-32CH', true, 3, ARRAY['professional', 'digital', '32-channel', 'live'], ARRAY['32 channels', 'Digital effects', 'USB recording', 'Scene memory'], true, true, false, true, 89, 2, 4.9, 2),
  
  ('Stage Monitor System', 'stage-monitor-system', 'Professional stage monitoring solution for performers and bands', 'audio', 'monitors', 899.99, NULL, ARRAY['https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80'], 'StageSound', 'SS-MON-PRO', true, 12, ARRAY['stage', 'monitor', 'professional', 'wedge'], ARRAY['15" woofer', 'Horn tweeter', 'Pole mount', 'XLR/TRS inputs'], true, false, true, false, 156, 8, 4.5, 5),
  
  ('Cable Management Kit Pro', 'cable-management-kit-pro', 'Professional cable management and organization system for events', 'accessories', 'cables', 149.99, 199.99, ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80'], 'EventPro', 'EP-CABLE-KIT', true, 45, ARRAY['cables', 'organization', 'professional', 'event'], ARRAY['50ft XLR cables', '25ft TRS cables', 'Cable ramps', 'Velcro ties'], true, false, false, true, 67, 18, 4.3, 12),
  
  ('Wireless In-Ear Monitor System', 'wireless-in-ear-monitor-system', 'Professional wireless IEM system for stage performers', 'audio', 'monitors', 649.99, 799.99, ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80'], 'AudioTech', 'AT-IEM-PRO', true, 8, ARRAY['wireless', 'in-ear', 'professional', 'uhf'], ARRAY['UHF transmission', 'Stereo/mono switch', 'Metal construction', '300ft range'], true, true, true, true, 203, 6, 4.7, 4),
  
  ('Event Lighting Truss System', 'event-lighting-truss-system', 'Modular truss system for hanging lights and equipment at events', 'stage', 'truss', 799.99, NULL, ARRAY['https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80'], 'StageBuilder', 'SB-TRUSS-20', true, 6, ARRAY['truss', 'lighting', 'modular', 'aluminum'], ARRAY['20ft span', 'Aluminum construction', '500lb capacity', 'Quick setup'], true, false, false, false, 94, 3, 4.2, 2)
) AS product_data(name, slug, description, category, subcategory, price, compare_at_price, images, brand, sku, track_inventory, inventory_count, tags, features, is_active, is_featured, is_new, is_sale, view_count, purchase_count, rating, review_count)
WHERE vp.business_name = 'Sarah Sound Productions';

-- =====================================================
-- MARKETPLACE ORDERS (Test Orders)
-- =====================================================
INSERT INTO marketplace_orders (
  id, order_number, user_id, email, phone, status, subtotal, tax_amount, shipping_amount, 
  marketplace_fee, platform_commission, total_amount, billing_address, shipping_address,
  payment_status, shipped_at, delivered_at
) VALUES
  (
    gen_random_uuid(),
    'ORD-20240112-0001',
    '550e8400-e29b-41d4-a716-446655440003',
    'customer1@example.com',
    '+1-555-0103',
    'delivered',
    459.99,
    40.24,
    15.00,
    22.99,
    45.99,
    583.22,
    '{"firstName": "John", "lastName": "Customer", "address1": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US"}',
    '{"firstName": "John", "lastName": "Customer", "address1": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US"}',
    'paid',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    'ORD-20240112-0002',
    '550e8400-e29b-41d4-a716-446655440003',
    'customer1@example.com',
    '+1-555-0103',
    'processing',
    899.99,
    78.74,
    15.00,
    44.99,
    89.99,
    1128.71,
    '{"firstName": "John", "lastName": "Customer", "address1": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US"}',
    '{"firstName": "John", "lastName": "Customer", "address1": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "US"}',
    'paid',
    NULL,
    NULL
  );

-- =====================================================
-- ORDER ITEMS
-- =====================================================
INSERT INTO order_items (
  order_id, vendor_id, product_id, product_name, product_sku, quantity, 
  price, subtotal, vendor_commission, platform_commission, fulfillment_status, fulfilled_at
)
SELECT 
  mo.id as order_id,
  p.vendor_id,
  p.id as product_id,
  p.name as product_name,
  p.sku as product_sku,
  order_data.quantity,
  order_data.price,
  order_data.price * order_data.quantity as subtotal,
  (order_data.price * order_data.quantity * 0.9) as vendor_commission,
  (order_data.price * order_data.quantity * 0.1) as platform_commission,
  order_data.fulfillment_status,
  order_data.fulfilled_at
FROM marketplace_orders mo
CROSS JOIN (
  VALUES
  ('ORD-20240112-0001', 'Wireless Microphone System Deluxe', 1, 459.99, 'fulfilled', NOW() - INTERVAL '4 days'),
  ('ORD-20240112-0002', 'Professional DJ Controller Pro', 1, 899.99, 'unfulfilled', NULL)
) AS order_data(order_number, product_name, quantity, price, fulfillment_status, fulfilled_at)
JOIN products p ON p.name = order_data.product_name
WHERE mo.order_number = order_data.order_number;

-- =====================================================
-- VENDOR PAYOUTS
-- =====================================================
INSERT INTO vendor_payouts (
  vendor_id, payout_number, amount, currency, status, method, period_start, 
  period_end, order_count, processed_at
)
SELECT 
  vp.id as vendor_id,
  payout_data.payout_number,
  payout_data.amount,
  'USD',
  payout_data.status,
  'stripe',
  payout_data.period_start,
  payout_data.period_end,
  payout_data.order_count,
  payout_data.processed_at
FROM vendor_profiles vp
CROSS JOIN (
  VALUES
  ('DJ Mike Electronic Services', 'PAY-20240101-001', 413.99, 'completed', '2024-01-01'::date, '2024-01-07'::date, 1, NOW() - INTERVAL '10 days'),
  ('Sarah Sound Productions', 'PAY-20240101-002', 1247.50, 'completed', '2024-01-01'::date, '2024-01-14'::date, 2, NOW() - INTERVAL '8 days')
) AS payout_data(business_name, payout_number, amount, status, period_start, period_end, order_count, processed_at)
WHERE vp.business_name = payout_data.business_name;

-- =====================================================
-- PRODUCT REVIEWS
-- =====================================================
INSERT INTO product_reviews (
  product_id, user_id, rating, title, comment, is_verified_purchase
)
SELECT 
  p.id as product_id,
  '550e8400-e29b-41d4-a716-446655440003',
  review_data.rating,
  review_data.title,
  review_data.comment,
  true
FROM products p
CROSS JOIN (
  VALUES
  ('Wireless Microphone System Deluxe', 5, 'Excellent Quality!', 'Amazing sound quality and range. Used it for my wedding and it worked flawlessly. Highly recommend!'),
  ('Professional DJ Controller Pro', 4, 'Great for professionals', 'Solid build quality and great features. The jog wheels are very responsive and the software integration is seamless.'),
  ('Cable Management Kit Pro', 5, 'Essential for events', 'This kit saved me so much time during setup. Everything is organized and professional looking.')
) AS review_data(product_name, rating, title, comment)
WHERE p.name = review_data.product_name;

-- =====================================================
-- USER ADDRESSES
-- =====================================================
INSERT INTO user_addresses (user_id, first_name, last_name, address1, city, state, zip_code, is_default) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', 'John', 'Customer', '123 Main St', 'New York', 'NY', '10001', true),
  ('550e8400-e29b-41d4-a716-446655440001', 'Mike', 'Electronic', '456 DJ Lane', 'Los Angeles', 'CA', '90210', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sarah', 'Sound', '789 Music Ave', 'Nashville', 'TN', '37201', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- PERFORMER-RELATED TEST DATA (if performers exist)
-- =====================================================
-- Note: This assumes performers table exists from previous migrations

-- Add performers if they don't exist
INSERT INTO performers (id, user_id, name, stage_name, bio, genres, price_range_min, price_range_max, rating, review_count) VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'Mike Electronic', 'DJ Mike', 'Professional DJ specializing in electronic dance music', ARRAY['Electronic', 'House', 'Techno', 'Pop'], 500.00, 2000.00, 4.8, 24)
ON CONFLICT DO NOTHING;

-- Performer portfolio
INSERT INTO performer_portfolio (performer_id, media_type, title, description, media_url, thumbnail_url, position)
SELECT 
  p.id as performer_id,
  portfolio_data.media_type,
  portfolio_data.title,
  portfolio_data.description,
  portfolio_data.media_url,
  portfolio_data.thumbnail_url,
  portfolio_data.position
FROM performers p
CROSS JOIN (
  VALUES
  ('photo', 'DJ Setup at Wedding', 'Professional DJ setup at luxury wedding venue', 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80', 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&q=80', 1),
  ('video', 'Live Performance Highlights', 'Compilation of live performance moments', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80', 2),
  ('audio', 'Summer Mix 2024', 'High energy summer mix featuring latest hits', 'https://soundcloud.com/example/summer-mix-2024', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', 3)
) AS portfolio_data(media_type, title, description, media_url, thumbnail_url, position)
WHERE p.stage_name = 'DJ Mike';

-- Performer availability
INSERT INTO performer_availability (performer_id, date, is_available)
SELECT 
  p.id as performer_id,
  availability_data.date,
  availability_data.is_available
FROM performers p
CROSS JOIN (
  VALUES
  (CURRENT_DATE + INTERVAL '1 day', true),
  (CURRENT_DATE + INTERVAL '2 days', true),
  (CURRENT_DATE + INTERVAL '3 days', false),
  (CURRENT_DATE + INTERVAL '7 days', true),
  (CURRENT_DATE + INTERVAL '14 days', false),
  (CURRENT_DATE + INTERVAL '21 days', true)
) AS availability_data(date, is_available)
WHERE p.stage_name = 'DJ Mike';

-- =====================================================
-- UPDATE VENDOR PROFILE TOTALS
-- =====================================================
-- Update vendor profiles with calculated totals
UPDATE vendor_profiles 
SET 
  total_sales = (
    SELECT COALESCE(SUM(oi.subtotal), 0)
    FROM order_items oi 
    WHERE oi.vendor_id = vendor_profiles.id
  ),
  total_revenue = (
    SELECT COALESCE(SUM(oi.vendor_commission), 0)
    FROM order_items oi 
    WHERE oi.vendor_id = vendor_profiles.id
  );

-- Update product purchase counts and ratings
UPDATE products 
SET 
  purchase_count = (
    SELECT COALESCE(SUM(oi.quantity), 0)
    FROM order_items oi 
    WHERE oi.product_id = products.id
  ),
  rating = (
    SELECT COALESCE(AVG(pr.rating), 0)
    FROM product_reviews pr 
    WHERE pr.product_id = products.id
  ),
  review_count = (
    SELECT COUNT(*)
    FROM product_reviews pr 
    WHERE pr.product_id = products.id
  );

-- =====================================================
-- COMMIT TRANSACTION
-- =====================================================
COMMIT;