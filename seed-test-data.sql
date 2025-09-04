-- Seed test data for GoEventCity

-- Insert test venues
INSERT INTO venues (name, address, city, state, zip, latitude, longitude, capacity, description, is_active, verified, rating, review_count)
VALUES 
  ('The Grand Theater', '123 Main St', 'Clearwater', 'FL', '33756', 27.9658, -82.8001, 1500, 'Historic theater venue', true, true, 4.5, 127),
  ('Sunset Beach Pavilion', '456 Beach Rd', 'Clearwater', 'FL', '33767', 27.9772, -82.8275, 500, 'Beachfront event space', true, true, 4.8, 89),
  ('Downtown Music Hall', '789 Central Ave', 'Clearwater', 'FL', '33756', 27.9706, -82.7301, 2000, 'Premier music venue', true, true, 4.6, 215);

-- Insert test performers
INSERT INTO performers (name, genres, bio, rating, review_count, available_for_booking, is_verified)
VALUES 
  ('The Beach Boys Tribute', ARRAY['Rock', 'Classic Rock'], 'Amazing tribute band', 4.7, 45, true, true),
  ('Jazz Quartet Supreme', ARRAY['Jazz', 'Blues'], 'Smooth jazz ensemble', 4.9, 67, true, true),
  ('DJ Sunset', ARRAY['Electronic', 'House'], 'Top rated local DJ', 4.5, 123, true, true);

-- Insert test events (happening in the future)
INSERT INTO events (
  title, 
  description, 
  start_datetime, 
  end_datetime, 
  venue_id, 
  location_name,
  category,
  status,
  price_min,
  price_max,
  capacity
)
SELECT 
  'Summer Beach Concert',
  'Live music on the beach',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days 3 hours',
  id,
  name,
  'Music',
  'published',
  25,
  45,
  500
FROM venues WHERE name = 'Sunset Beach Pavilion'
UNION ALL
SELECT 
  'Jazz Night Downtown',
  'An evening of smooth jazz',
  NOW() + INTERVAL '5 days',
  NOW() + INTERVAL '5 days 4 hours',
  id,
  name,
  'Music',
  'published',
  15,
  30,
  200
FROM venues WHERE name = 'Downtown Music Hall'
UNION ALL
SELECT 
  'Food & Wine Festival',
  'Taste the best of local cuisine',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '7 days 6 hours',
  id,
  name,
  'Food & Drink',
  'published',
  50,
  75,
  1000
FROM venues WHERE name = 'The Grand Theater'
UNION ALL
SELECT 
  'Art Gallery Opening',
  'Contemporary art exhibition',
  NOW() + INTERVAL '10 days',
  NOW() + INTERVAL '10 days 2 hours',
  id,
  name,
  'Arts',
  'published',
  0,
  0,
  300
FROM venues WHERE name = 'Downtown Music Hall';

-- Add a few more events for variety
INSERT INTO events (
  title, 
  description, 
  start_datetime, 
  end_datetime, 
  location_name,
  category,
  status,
  price_min,
  capacity
)
VALUES 
  ('Morning Yoga on the Beach', 'Start your day with beach yoga', NOW() + INTERVAL '1 day 6 hours', NOW() + INTERVAL '1 day 7 hours', 'Clearwater Beach', 'Sports', 'published', 20, 50),
  ('Comedy Night', 'Stand-up comedy showcase', NOW() + INTERVAL '3 days 19 hours', NOW() + INTERVAL '3 days 22 hours', 'The Laugh Track', 'Comedy', 'published', 25, 150),
  ('Tech Meetup', 'Networking for tech professionals', NOW() + INTERVAL '4 days 18 hours', NOW() + INTERVAL '4 days 20 hours', 'Innovation Hub', 'Business', 'published', 0, 100);