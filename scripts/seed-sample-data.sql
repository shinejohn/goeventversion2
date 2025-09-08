-- Seed Sample Data for When The Fun
-- This script populates the database with sample data for testing

-- First, let's create some test performers
INSERT INTO performers (id, name, stage_name, bio, genre, image_url, rating, status, website_url, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'John Doe', 'DJ Johnny', 'Electronic music producer and DJ from Los Angeles', 'electronic', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 4.5, 'active', 'https://djjohnny.com', NOW()),
  ('a0000000-0000-0000-0000-000000000002', 'Sarah Smith', 'The Blues Queen', 'Award-winning blues singer with a powerful voice', 'blues', 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=800&q=80', 4.8, 'active', 'https://sarahsmithblues.com', NOW()),
  ('a0000000-0000-0000-0000-000000000003', 'The Night Owls', NULL, 'Rock band known for their energetic live performances', 'rock', 'https://images.unsplash.com/photo-1506091403742-e3aa39518db5?w=800&q=80', 4.7, 'active', NULL, NOW()),
  ('a0000000-0000-0000-0000-000000000004', 'Comedy Central Stars', NULL, 'Stand-up comedy troupe featuring the best comedians', 'comedy', 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80', 4.6, 'active', NULL, NOW()),
  ('a0000000-0000-0000-0000-000000000005', 'Classical Ensemble', NULL, 'Professional orchestra performing classical masterpieces', 'classical', 'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=800&q=80', 4.9, 'active', NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- Create some test venues
INSERT INTO venues (id, name, slug, description, address, city, state, zip_code, country, capacity, image_url, rating, category, amenities, status, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'The Grand Theater', 'grand-theater', 'Historic theater in downtown with stunning architecture', '123 Main St', 'Los Angeles', 'CA', '90001', 'USA', 1500, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', 4.6, 'theater', '{"parking", "wifi", "bar", "accessible"}', 'active', NOW()),
  ('b0000000-0000-0000-0000-000000000002', 'Blue Note Jazz Club', 'blue-note-jazz', 'Intimate jazz club with world-class acoustics', '456 Jazz Ave', 'New York', 'NY', '10001', 'USA', 300, 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80', 4.8, 'club', '{"bar", "vip_area", "coat_check"}', 'active', NOW()),
  ('b0000000-0000-0000-0000-000000000003', 'Sunset Arena', 'sunset-arena', 'Large outdoor venue perfect for festivals', '789 Sunset Blvd', 'Miami', 'FL', '33101', 'USA', 5000, 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80', 4.5, 'arena', '{"parking", "food_vendors", "merchandise", "accessible"}', 'active', NOW()),
  ('b0000000-0000-0000-0000-000000000004', 'The Comedy Cellar', 'comedy-cellar', 'Premier comedy club featuring top comedians', '321 Laugh St', 'Chicago', 'IL', '60601', 'USA', 200, 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80', 4.7, 'club', '{"bar", "food_service"}', 'active', NOW()),
  ('b0000000-0000-0000-0000-000000000005', 'Symphony Hall', 'symphony-hall', 'World-renowned concert hall with perfect acoustics', '555 Classical Way', 'Boston', 'MA', '02101', 'USA', 2500, 'https://images.unsplash.com/photo-1503863937795-62954a3c0f05?w=800&q=80', 4.9, 'concert_hall', '{"parking", "coat_check", "accessible", "gift_shop"}', 'active', NOW())
ON CONFLICT (id) DO NOTHING;

-- First ensure the events table has a status column (if not already)
ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

-- Create events happening in the next 30 days
INSERT INTO events (id, title, slug, description, category, start_datetime, end_datetime, venue_id, performer_id, image_url, status, price_min, price_max, city, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Electronic Dance Night', 'electronic-dance-night', 'Get ready for an unforgettable night of electronic music!', 'music', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', 'published', 25, 50, 'Los Angeles', NOW()),
  ('c0000000-0000-0000-0000-000000000002', 'Blues & Soul Evening', 'blues-soul-evening', 'An intimate evening with the Blues Queen', 'music', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 3 hours', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'published', 35, 75, 'New York', NOW()),
  ('c0000000-0000-0000-0000-000000000003', 'Rock Festival 2024', 'rock-festival-2024', 'The biggest rock festival of the year!', 'music', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 8 hours', 'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80', 'published', 50, 150, 'Miami', NOW()),
  ('c0000000-0000-0000-0000-000000000004', 'Comedy Night Live', 'comedy-night-live', 'Laugh your heart out with the best comedians', 'entertainment', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 2 hours', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80', 'published', 20, 40, 'Chicago', NOW()),
  ('c0000000-0000-0000-0000-000000000005', 'Classical Music Gala', 'classical-music-gala', 'Experience the beauty of classical music', 'arts', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 3 hours', 'b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80', 'published', 40, 120, 'Boston', NOW()),
  ('c0000000-0000-0000-0000-000000000006', 'Summer Jazz Festival', 'summer-jazz-festival', 'Three days of amazing jazz performances', 'music', NOW() + INTERVAL '14 days', NOW() + INTERVAL '16 days', 'b0000000-0000-0000-0000-000000000003', NULL, 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80', 'published', 75, 200, 'Miami', NOW()),
  ('c0000000-0000-0000-0000-000000000007', 'Underground House Party', 'underground-house-party', 'Deep house all night long', 'music', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 6 hours', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80', 'published', 15, 30, 'New York', NOW()),
  ('c0000000-0000-0000-0000-000000000008', 'Stand-up Spectacular', 'standup-spectacular', 'Five comedians, one amazing night', 'entertainment', NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days 3 hours', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80', 'published', 25, 45, 'Los Angeles', NOW()),
  ('c0000000-0000-0000-0000-000000000009', 'Beethoven Symphony Night', 'beethoven-symphony', 'Complete performance of Beethoven\'s 9th Symphony', 'arts', NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days 2 hours', 'b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=800&q=80', 'published', 50, 150, 'Boston', NOW()),
  ('c0000000-0000-0000-0000-000000000010', 'Indie Rock Showcase', 'indie-rock-showcase', 'Discover the next big indie bands', 'music', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 5 hours', 'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80', 'published', 20, 35, 'Miami', NOW())
ON CONFLICT (id) DO NOTHING;

-- Add some past events for history
INSERT INTO events (id, title, slug, description, category, start_datetime, end_datetime, venue_id, performer_id, image_url, status, price_min, price_max, city, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000011', 'New Year\'s Eve Party', 'nye-party-2024', 'Ring in the new year with style', 'entertainment', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days 5 hours', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1482329833197-916d32bdae74?w=800&q=80', 'published', 50, 100, 'Los Angeles', NOW() - INTERVAL '30 days'),
  ('c0000000-0000-0000-0000-000000000012', 'Winter Blues Festival', 'winter-blues-fest', 'Warm up with hot blues music', 'music', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days 4 hours', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80', 'published', 30, 60, 'New York', NOW() - INTERVAL '45 days')
ON CONFLICT (id) DO NOTHING;

-- Create some venue availability
INSERT INTO venue_availability (venue_id, date, is_available, start_time, end_time) 
SELECT 
  v.id,
  generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day')::date,
  true,
  '09:00:00'::time,
  '23:00:00'::time
FROM venues v
ON CONFLICT (venue_id, date) DO NOTHING;

-- Create some reviews
INSERT INTO reviews (entity_type, entity_id, reviewer_id, rating, comment, created_at) VALUES
  ('venue', 'b0000000-0000-0000-0000-000000000001', (SELECT id FROM auth.users LIMIT 1), 5, 'Amazing venue! Great acoustics and comfortable seating.', NOW() - INTERVAL '5 days'),
  ('venue', 'b0000000-0000-0000-0000-000000000002', (SELECT id FROM auth.users LIMIT 1), 4, 'Intimate setting perfect for jazz. The bar is excellent.', NOW() - INTERVAL '10 days'),
  ('performer', 'a0000000-0000-0000-0000-000000000001', (SELECT id FROM auth.users LIMIT 1), 5, 'DJ Johnny knows how to get the crowd moving!', NOW() - INTERVAL '3 days'),
  ('performer', 'a0000000-0000-0000-0000-000000000002', (SELECT id FROM auth.users LIMIT 1), 5, 'The Blues Queen lives up to her name. Incredible voice!', NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Log completion
SELECT 'Sample data seeding completed!' as message;