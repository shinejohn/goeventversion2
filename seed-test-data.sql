-- Seed test data for GoEventCity

-- First, insert a community (venues need a community_id)
INSERT INTO community_hub (name, slug, location, city, state, country, timezone)
VALUES ('Clearwater', 'clearwater', ST_MakePoint(-82.8001, 27.9658), 'Clearwater', 'FL', 'USA', 'America/New_York')
ON CONFLICT (slug) DO NOTHING;

-- Insert test organizers (events need an organizer_id)
INSERT INTO organizers (community_id, name, slug, email, organization_type)
SELECT 
  ch.id,
  'GoEventCity Organizers',
  'goeventcity-organizers',
  'organizers@goeventcity.com',
  'company'
FROM community_hub ch
WHERE ch.slug = 'clearwater'
ON CONFLICT (slug) DO NOTHING;

-- Insert test venues
INSERT INTO venues (
  community_id, 
  name, 
  slug, 
  address, 
  venueType, 
  capacity, 
  description, 
  verified, 
  rating, 
  reviewCount,
  location,
  amenities,
  images,
  operating_hours,
  is_active
)
SELECT 
  ch.id,
  venue.name,
  venue.slug,
  venue.address,
  venue.venueType,
  venue.capacity,
  venue.description,
  venue.verified,
  venue.rating,
  venue.reviewCount,
  ST_MakePoint(-82.8001, 27.9658),
  '{"parking": true, "wifi": true, "catering": true}'::jsonb,
  '[]'::jsonb,
  '{"monday": "9am-10pm", "tuesday": "9am-10pm", "wednesday": "9am-10pm", "thursday": "9am-10pm", "friday": "9am-11pm", "saturday": "9am-11pm", "sunday": "10am-8pm"}'::jsonb,
  true
FROM community_hub ch,
(VALUES 
  ('The Grand Theater', 'the-grand-theater', '123 Main St', 'theater', 1500, 'Historic theater venue', true, 4.5, 127),
  ('Sunset Beach Pavilion', 'sunset-beach-pavilion', '456 Beach Rd', 'outdoor', 500, 'Beachfront event space', true, 4.8, 89),
  ('Downtown Music Hall', 'downtown-music-hall', '789 Central Ave', 'music_venue', 2000, 'Premier music venue', true, 4.6, 215)
) AS venue(name, slug, address, venueType, capacity, description, verified, rating, reviewCount)
WHERE ch.slug = 'clearwater'
ON CONFLICT (slug) DO NOTHING;

-- Insert test performers
INSERT INTO performers (
  name, 
  slug,
  genres, 
  bio, 
  rating, 
  reviews, 
  available_for_booking, 
  is_verified,
  available_for_private_events,
  is_family_friendly,
  category,
  base_price
)
VALUES 
  ('The Beach Boys Tribute', 'beach-boys-tribute', ARRAY['Rock', 'Classic Rock'], 'Amazing tribute band', 4.7, 45, true, true, true, true, 'Band', 500),
  ('Jazz Quartet Supreme', 'jazz-quartet-supreme', ARRAY['Jazz', 'Blues'], 'Smooth jazz ensemble', 4.9, 67, true, true, true, false, 'Band', 750),
  ('DJ Sunset', 'dj-sunset', ARRAY['Electronic', 'House'], 'Top rated local DJ', 4.5, 123, true, true, true, true, 'DJ', 300)
ON CONFLICT (slug) DO NOTHING;

-- Insert test events (happening in the future)
INSERT INTO events (
  community_id,
  venue_id,
  organizer_id,
  title, 
  slug,
  description, 
  start_datetime, 
  end_datetime, 
  location_name,
  category,
  status,
  price_min,
  price_max,
  capacity,
  timezone,
  requires_ticket,
  visibility,
  image
)
SELECT 
  ch.id,
  v.id,
  o.id,
  event.title,
  event.slug,
  event.description,
  event.start_datetime::timestamp with time zone,
  event.end_datetime::timestamp with time zone,
  v.name,
  event.category,
  'published',
  event.price_min,
  event.price_max,
  event.capacity,
  'America/New_York',
  true,
  'public',
  event.image
FROM community_hub ch
JOIN organizers o ON o.community_id = ch.id
JOIN venues v ON v.community_id = ch.id
JOIN (VALUES 
  ('Summer Beach Concert', 'summer-beach-concert', 'Live music on the beach', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 3 hours', 'Sunset Beach Pavilion', 'Music', 25, 45, 500, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'),
  ('Jazz Night Downtown', 'jazz-night-downtown', 'An evening of smooth jazz', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 4 hours', 'Downtown Music Hall', 'Music', 15, 30, 200, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'),
  ('Food & Wine Festival', 'food-wine-festival', 'Taste the best of local cuisine', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 6 hours', 'The Grand Theater', 'Food & Drink', 50, 75, 1000, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'),
  ('Art Gallery Opening', 'art-gallery-opening', 'Contemporary art exhibition', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 2 hours', 'Downtown Music Hall', 'Arts', 0, 0, 300, 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5')
) AS event(title, slug, description, start_datetime, end_datetime, venue_name, category, price_min, price_max, capacity, image)
ON v.name = event.venue_name
WHERE ch.slug = 'clearwater' AND o.slug = 'goeventcity-organizers'
ON CONFLICT (slug) DO NOTHING;

-- Add a few more events without specific venue
INSERT INTO events (
  community_id,
  organizer_id,
  title, 
  slug,
  description, 
  start_datetime, 
  end_datetime, 
  location_name,
  location_address,
  category,
  status,
  price_min,
  capacity,
  timezone,
  requires_ticket,
  visibility,
  image
)
SELECT 
  ch.id,
  o.id,
  event.title,
  event.slug,
  event.description,
  event.start_datetime::timestamp with time zone,
  event.end_datetime::timestamp with time zone,
  event.location_name,
  event.location_address,
  event.category,
  'published',
  event.price_min,
  event.capacity,
  'America/New_York',
  true,
  'public',
  event.image
FROM community_hub ch
JOIN organizers o ON o.community_id = ch.id,
(VALUES 
  ('Morning Yoga on the Beach', 'morning-yoga-beach', 'Start your day with beach yoga', NOW() + INTERVAL '1 day 6 hours', NOW() + INTERVAL '1 day 7 hours', 'Clearwater Beach', 'Clearwater Beach, FL', 'Sports', 20, 50, 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a'),
  ('Comedy Night', 'comedy-night', 'Stand-up comedy showcase', NOW() + INTERVAL '3 days 19 hours', NOW() + INTERVAL '3 days 22 hours', 'The Laugh Track', '123 Comedy Lane, Clearwater, FL', 'Comedy', 25, 150, 'https://images.unsplash.com/photo-1541876176131-3f5e84a7331a'),
  ('Tech Meetup', 'tech-meetup', 'Networking for tech professionals', NOW() + INTERVAL '4 days 18 hours', NOW() + INTERVAL '4 days 20 hours', 'Innovation Hub', '456 Tech Dr, Clearwater, FL', 'Business', 0, 100, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87')
) AS event(title, slug, description, start_datetime, end_datetime, location_name, location_address, category, price_min, capacity, image)
WHERE ch.slug = 'clearwater' AND o.slug = 'goeventcity-organizers'
ON CONFLICT (slug) DO NOTHING;