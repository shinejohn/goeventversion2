-- Seed data for event system
-- Only seeds data for tables created by migrations

-- Test performers
INSERT INTO performers (id, name, stage_name, bio, genre, image_url, rating, status, website_url) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'John Doe', 'DJ Johnny', 'Electronic music producer and DJ from Los Angeles', 'electronic', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 4.5, 'active', 'https://djjohnny.com'),
  ('a1000000-0000-0000-0000-000000000002', 'Sarah Smith', 'The Blues Queen', 'Award-winning blues singer with a powerful voice', 'blues', 'https://images.unsplash.com/photo-1549834125-82d3c48159a3?w=800&q=80', 4.8, 'active', 'https://sarahsmithblues.com'),
  ('a1000000-0000-0000-0000-000000000003', 'The Night Owls', NULL, 'Rock band known for their energetic live performances', 'rock', 'https://images.unsplash.com/photo-1506091403742-e3aa39518db5?w=800&q=80', 4.7, 'active', NULL)
ON CONFLICT DO NOTHING;

-- Test venues  
INSERT INTO venues (id, name, slug, description, address, city, state, zip_code, country, capacity, image_url, rating, category, status) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'The Grand Theater', 'grand-theater', 'Historic theater in downtown with stunning architecture', '123 Main St', 'Los Angeles', 'CA', '90001', 'USA', 1500, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', 4.6, 'theater', 'active'),
  ('b1000000-0000-0000-0000-000000000002', 'Blue Note Jazz Club', 'blue-note-jazz', 'Intimate jazz club with world-class acoustics', '456 Jazz Ave', 'New York', 'NY', '10001', 'USA', 300, 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80', 4.8, 'club', 'active'),
  ('b1000000-0000-0000-0000-000000000003', 'Sunset Arena', 'sunset-arena', 'Large outdoor venue perfect for festivals', '789 Sunset Blvd', 'Miami', 'FL', '33101', 'USA', 5000, 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80', 4.5, 'arena', 'active')
ON CONFLICT DO NOTHING;

-- Test events
INSERT INTO events (id, title, slug, description, category, start_datetime, end_datetime, venue_id, performer_id, image_url, status, price_min, price_max, city) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Electronic Dance Night', 'electronic-dance-night-2025', 'Get ready for an unforgettable night of electronic music!', 'music', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 4 hours', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', 'published', 25, 50, 'Los Angeles'),
  ('c1000000-0000-0000-0000-000000000002', 'Blues & Soul Evening', 'blues-soul-evening-2025', 'An intimate evening with the Blues Queen', 'music', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 3 hours', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', 'published', 35, 75, 'New York'),
  ('c1000000-0000-0000-0000-000000000003', 'Rock Festival 2025', 'rock-festival-2025', 'The biggest rock festival of the year!', 'music', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 8 hours', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80', 'published', 50, 150, 'Miami'),
  ('c1000000-0000-0000-0000-000000000004', 'Summer Jazz Festival', 'summer-jazz-festival-2025', 'Three days of amazing jazz performances', 'music', NOW() + INTERVAL '14 days', NOW() + INTERVAL '16 days', 'b1000000-0000-0000-0000-000000000003', NULL, 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80', 'published', 75, 200, 'Miami'),
  ('c1000000-0000-0000-0000-000000000005', 'Underground House Party', 'underground-house-party-2025', 'Deep house all night long', 'music', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 6 hours', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80', 'published', 15, 30, 'New York')
ON CONFLICT DO NOTHING;