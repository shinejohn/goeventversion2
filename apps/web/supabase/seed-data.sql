-- =============================================================================
-- MAGIC PATTERNS SEED DATA
-- 12 records for each main table to populate the database
-- =============================================================================

-- First, let's ensure we have some test accounts to work with
-- We'll use the system user account as the owner for all seed data
-- Get the first account ID to use as our test account
DO $$
DECLARE
  test_account_id uuid;
BEGIN
  SELECT id INTO test_account_id FROM public.accounts LIMIT 1;
  
  IF test_account_id IS NULL THEN
    -- Create a test account if none exists
    INSERT INTO public.accounts (id, name, email, is_personal_account) 
    VALUES (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Test Account',
      'test@example.com',
      true
    );
    test_account_id := '00000000-0000-0000-0000-000000000001'::uuid;
  END IF;
END $$;

-- =============================================================================
-- VENUES DATA (12 records)
-- =============================================================================

INSERT INTO public.venues (
  id, account_id, name, description, venue_type, address, city, state, country, 
  postal_code, max_capacity, image_url, gallery_images, base_hourly_rate, contact_email, 
  contact_phone, slug, is_verified, is_active
) VALUES
-- Indoor Venues
('10000000-0000-0000-0000-000000000001'::uuid, (SELECT id FROM public.accounts LIMIT 1), 
 'The Grand Theatre', 'Historic theatre with ornate architecture and excellent acoustics', 'indoor',
 '123 Main St', 'New York', 'NY', 'USA', '10001', 850,
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 
 '["https://images.unsplash.com/photo-1503095396549-807759245b35", "https://images.unsplash.com/photo-1481627834876-b7833e8f5570", "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"]'::jsonb,
 500.00, 'bookings@grandtheatre.com', '+1-555-0101', 'grand-theatre', true, true),

('10000000-0000-0000-0000-000000000002'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Blue Note Jazz Club', 'Intimate jazz venue with world-class sound system', 'indoor',
 '456 Jazz Ave', 'Chicago', 'IL', 'USA', '60601', 200,
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f', 300.00,
 'info@bluenote.com', '+1-555-0102', 'blue-note-jazz', true, true),

('10000000-0000-0000-0000-000000000003'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Crystal Ballroom', 'Elegant ballroom perfect for galas and corporate events', 'indoor',
 '789 Elegant Dr', 'San Francisco', 'CA', 'USA', '94102', 400,
 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3', 750.00,
 'events@crystalballroom.com', '+1-555-0103', 'crystal-ballroom', true, true),

-- Outdoor Venues  
('10000000-0000-0000-0000-000000000004'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Sunset Amphitheater', 'Open-air amphitheater with stunning sunset views', 'outdoor',
 '321 Hillside Rd', 'Austin', 'TX', 'USA', '73301', 2500,
 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3', 1200.00,
 'booking@sunsetamphitheater.com', '+1-555-0104', 'sunset-amphitheater', true, true),

('10000000-0000-0000-0000-000000000005'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Riverside Gardens', 'Beautiful garden venue perfect for weddings and festivals', 'outdoor',
 '654 River Walk', 'Portland', 'OR', 'USA', '97201', 600,
 'https://images.unsplash.com/photo-1519225421980-715cb0215aed', 400.00,
 'rentals@riversidegardens.com', '+1-555-0105', 'riverside-gardens', true, true),

('10000000-0000-0000-0000-000000000006'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Mountain View Stadium', 'Large outdoor stadium with mountain backdrop', 'outdoor',
 '987 Stadium Way', 'Denver', 'CO', 'USA', '80201', 15000,
 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256', 2000.00,
 'events@mountainviewstadium.com', '+1-555-0106', 'mountain-view-stadium', true, true),

-- Hybrid & Unique Venues
('10000000-0000-0000-0000-000000000007'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'The Warehouse District', 'Industrial venue with retractable roof and modern amenities', 'hybrid',
 '147 Industrial Blvd', 'Detroit', 'MI', 'USA', '48201', 1200,
 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14', 800.00,
 'book@warehousedistrict.com', '+1-555-0107', 'warehouse-district', true, true),

('10000000-0000-0000-0000-000000000008'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Rooftop Sky Lounge', 'Upscale rooftop venue with city skyline views', 'outdoor',
 '258 High Rise Ave', 'Miami', 'FL', 'USA', '33101', 300,
 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67', 600.00,
 'reservations@rooftopskylounge.com', '+1-555-0108', 'rooftop-sky-lounge', true, true),

('10000000-0000-0000-0000-000000000009'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Historic Library Hall', 'Beautifully restored library with reading rooms and grand hall', 'indoor',
 '369 Knowledge St', 'Boston', 'MA', 'USA', '02101', 250,
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', 350.00,
 'events@libraryhall.com', '+1-555-0109', 'historic-library-hall', true, true),

('10000000-0000-0000-0000-000000000010'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Beachside Pavilion', 'Ocean-front pavilion with sandy beaches and palm trees', 'outdoor',
 '741 Ocean Drive', 'San Diego', 'CA', 'USA', '92101', 800,
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 900.00,
 'info@beachsidepavilion.com', '+1-555-0110', 'beachside-pavilion', true, true),

('10000000-0000-0000-0000-000000000011'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Art Gallery Loft', 'Contemporary art gallery with flexible exhibition spaces', 'indoor',
 '852 Creative Way', 'Seattle', 'WA', 'USA', '98101', 150,
 'https://images.unsplash.com/photo-1531058020387-3be344556be6', 275.00,
 'gallery@artloft.com', '+1-555-0111', 'art-gallery-loft', true, true),

('10000000-0000-0000-0000-000000000012'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Convention Center Main Hall', 'Large convention center with multiple breakout rooms', 'indoor',
 '963 Convention Dr', 'Las Vegas', 'NV', 'USA', '89101', 3000,
 'https://images.unsplash.com/photo-1505236858219-8359eb29e329', 1500.00,
 'booking@conventioncenter.com', '+1-555-0112', 'convention-center-main', true, true);

-- =============================================================================
-- PERFORMERS DATA (12 records)
-- =============================================================================

INSERT INTO public.performers (
  id, account_id, stage_name, real_name, bio, category, genres, base_rate,
  profile_image_url, booking_email, booking_phone, slug, is_verified, is_available
) VALUES
-- Musicians
('20000000-0000-0000-0000-000000000001'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Jazz Fusion Collective', 'Marcus Johnson & The Collective', 
 'Award-winning jazz fusion ensemble with 15 years of experience performing at premier venues worldwide.',
 'band', ARRAY['Jazz', 'Fusion', 'Contemporary'], 2500.00,
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
 'booking@jazzfusion.com', '+1-555-1001', 'jazz-fusion-collective', true, true),

('20000000-0000-0000-0000-000000000002'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Sarah Martinez', 'Sarah Elena Martinez',
 'Soulful acoustic singer-songwriter with folk and indie influences. Perfect for intimate venues.',
 'musician', ARRAY['Folk', 'Indie', 'Acoustic'], 800.00,
 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
 'sarah@sarahmartinezmusic.com', '+1-555-1002', 'sarah-martinez', true, true),

('20000000-0000-0000-0000-000000000003'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Electric Storm', 'Tommy Chen, Lisa Rodriguez, Jake Williams',
 'High-energy rock band specializing in classic rock covers and original compositions.',
 'band', ARRAY['Rock', 'Classic Rock', 'Alternative'], 1800.00,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
 'management@electricstormband.com', '+1-555-1003', 'electric-storm', true, true),

-- DJs
('20000000-0000-0000-0000-000000000004'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'DJ Nightshade', 'Alex Thompson',
 'Premier electronic music DJ specializing in house, techno, and progressive beats.',
 'dj', ARRAY['House', 'Techno', 'Progressive', 'Electronic'], 1200.00,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
 'bookings@djnightshade.com', '+1-555-1004', 'dj-nightshade', true, true),

('20000000-0000-0000-0000-000000000005'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'DJ Sunset Vibes', 'Maria Gonzalez',
 'Versatile DJ perfect for weddings, corporate events, and private parties.',
 'dj', ARRAY['Top 40', 'Wedding', 'Corporate', 'Latin'], 900.00,
 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
 'maria@sunsetvibesmusic.com', '+1-555-1005', 'dj-sunset-vibes', true, true),

-- Comedians
('20000000-0000-0000-0000-000000000006'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Mike Laughs', 'Michael Rodriguez',
 'Stand-up comedian with sharp wit and observational humor. Clean comedy specialist.',
 'comedian', ARRAY['Stand-up', 'Clean Comedy', 'Observational'], 600.00,
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b',
 'bookings@mikelaughscomedy.com', '+1-555-1006', 'mike-laughs', true, true),

('20000000-0000-0000-0000-000000000007'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Comedy Duo Plus One', 'Janet Kim & David Park',
 'Dynamic comedy duo known for improvisation and audience interaction.',
 'comedian', ARRAY['Improv', 'Interactive', 'Sketch Comedy'], 1100.00,
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b',
 'hello@comedyduoplusone.com', '+1-555-1007', 'comedy-duo-plus-one', true, true),

-- Speakers & Variety
('20000000-0000-0000-0000-000000000008'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Dr. Patricia Wilson', 'Patricia Jane Wilson, Ph.D.',
 'Motivational speaker and business consultant specializing in leadership and innovation.',
 'speaker', ARRAY['Motivational', 'Business', 'Leadership'], 1500.00,
 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b',
 'speaking@patriciawilson.com', '+1-555-1008', 'dr-patricia-wilson', true, true),

('20000000-0000-0000-0000-000000000009'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Amazing Marco', 'Marco Antonelli',
 'Professional magician specializing in close-up magic and stage illusions.',
 'magician', ARRAY['Close-up Magic', 'Stage Magic', 'Illusions'], 750.00,
 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937',
 'bookings@amazingmarco.com', '+1-555-1009', 'amazing-marco', true, true),

-- Dancers
('20000000-0000-0000-0000-000000000010'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Rhythm & Soul Dance Troupe', 'Elena Rodriguez & Company',
 'Professional dance company specializing in contemporary, hip-hop, and cultural dances.',
 'dancer', ARRAY['Contemporary', 'Hip-Hop', 'Cultural', 'Ballet'], 1300.00,
 'https://images.unsplash.com/photo-1547153760-18fc86324498',
 'bookings@rhythmsoul.com', '+1-555-1010', 'rhythm-soul-dance', true, true),

-- Variety Acts
('20000000-0000-0000-0000-000000000011'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'The Versatile Violinist', 'Anna Kowalski',
 'Classical and contemporary violinist available for solo performances and collaborations.',
 'musician', ARRAY['Classical', 'Contemporary', 'Film Scores'], 650.00,
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
 'anna@versatileviolinist.com', '+1-555-1011', 'versatile-violinist', true, true),

('20000000-0000-0000-0000-000000000012'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Corporate Comedy Solutions', 'Robert Sterling',
 'Corporate entertainment specialist combining comedy with team-building activities.',
 'variety', ARRAY['Corporate', 'Team Building', 'Interactive'], 1800.00,
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b',
 'robert@corporatecomedy.com', '+1-555-1012', 'corporate-comedy-solutions', true, true);

-- =============================================================================
-- EVENTS DATA (12 records)
-- =============================================================================

INSERT INTO public.events (
  id, account_id, title, description, category, status, start_date, end_date,
  venue_id, image_url, base_price, max_capacity, slug, is_featured, is_public
) VALUES
('30000000-0000-0000-0000-000000000001'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Summer Jazz Festival 2024', 
 'Annual three-day jazz festival featuring world-renowned artists and emerging talents. Experience the best of jazz, blues, and fusion music in a beautiful outdoor setting.',
 'music', 'published', 
 NOW() + INTERVAL '30 days', NOW() + INTERVAL '33 days',
 '10000000-0000-0000-0000-000000000004'::uuid,
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
 45.00, 2500, 'summer-jazz-festival-2024', true, true),

('30000000-0000-0000-0000-000000000002'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Corporate Innovation Summit',
 'Leading minds in technology and business come together to discuss the future of innovation. Network with industry leaders and discover cutting-edge solutions.',
 'business', 'published',
 NOW() + INTERVAL '45 days', NOW() + INTERVAL '46 days',
 '10000000-0000-0000-0000-000000000012'::uuid,
 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
 150.00, 800, 'corporate-innovation-summit', true, true),

('30000000-0000-0000-0000-000000000003'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Acoustic Nights: Sarah Martinez',
 'Intimate acoustic performance by indie folk artist Sarah Martinez. Limited seating for an unforgettable evening of original songs and covers.',
 'music', 'published',
 NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '3 hours',
 '10000000-0000-0000-0000-000000000002'::uuid,
 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
 25.00, 150, 'acoustic-nights-sarah-martinez', true, true),

('30000000-0000-0000-0000-000000000004'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Comedy Night Spectacular',
 'Laugh until your sides hurt with our monthly comedy showcase featuring local and touring comedians. Perfect for date night or group outings.',
 'entertainment', 'published',
 NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days' + INTERVAL '3 hours',
 '10000000-0000-0000-0000-000000000001'::uuid,
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b',
 20.00, 400, 'comedy-night-spectacular', true, true),

('30000000-0000-0000-0000-000000000005'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Electric Storm Rock Concert',
 'High-energy rock concert featuring Electric Storm and special guests. Get ready for an unforgettable night of classic and modern rock hits.',
 'music', 'published',
 NOW() + INTERVAL '25 days', NOW() + INTERVAL '25 days' + INTERVAL '4 hours',
 '10000000-0000-0000-0000-000000000006'::uuid,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
 55.00, 5000, 'electric-storm-rock-concert', true, true),

('30000000-0000-0000-0000-000000000006'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Art Gallery Opening: Modern Expressions',
 'Exclusive opening of our new contemporary art exhibition featuring emerging artists from across the region. Wine and hors doeuvres included.',
 'arts', 'published',
 NOW() + INTERVAL '12 days', NOW() + INTERVAL '12 days' + INTERVAL '4 hours',
 '10000000-0000-0000-0000-000000000011'::uuid,
 'https://images.unsplash.com/photo-1531058020387-3be344556be6',
 0.00, 100, 'art-gallery-opening-modern-expressions', true, true),

('30000000-0000-0000-0000-000000000007'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Beachside Music Festival',
 'Multi-day music festival right on the beach! Featuring multiple genres, food trucks, and beach activities. Camping packages available.',
 'music', 'published',
 NOW() + INTERVAL '60 days', NOW() + INTERVAL '63 days',
 '10000000-0000-0000-0000-000000000010'::uuid,
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
 85.00, 800, 'beachside-music-festival', true, true),

('30000000-0000-0000-0000-000000000008'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Leadership Workshop with Dr. Wilson',
 'Transform your leadership skills in this intensive workshop. Learn proven strategies for managing teams, driving innovation, and achieving results.',
 'education', 'published',
 NOW() + INTERVAL '18 days', NOW() + INTERVAL '18 days' + INTERVAL '6 hours',
 '10000000-0000-0000-0000-000000000009'::uuid,
 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b',
 199.00, 50, 'leadership-workshop-dr-wilson', false, true),

('30000000-0000-0000-0000-000000000009'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Rooftop Dance Party',
 'Dance under the stars at our monthly rooftop party featuring DJ Nightshade. Dress code: smart casual. Amazing city views guaranteed!',
 'entertainment', 'published',
 NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days' + INTERVAL '5 hours',
 '10000000-0000-0000-0000-000000000008'::uuid,
 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67',
 30.00, 200, 'rooftop-dance-party', false, true),

('30000000-0000-0000-0000-000000000010'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Magic & Wonder Show',
 'Family-friendly magic show featuring Amazing Marco. Perfect entertainment for all ages with mind-bending illusions and interactive magic.',
 'entertainment', 'published',
 NOW() + INTERVAL '22 days', NOW() + INTERVAL '22 days' + INTERVAL '2 hours',
 '10000000-0000-0000-0000-000000000003'::uuid,
 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937',
 15.00, 300, 'magic-wonder-show', false, true),

('30000000-0000-0000-0000-000000000011'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Community Food & Music Fair',
 'Annual community celebration featuring local food vendors, live music, and family activities. Free admission with optional food and drink purchases.',
 'community', 'published',
 NOW() + INTERVAL '40 days', NOW() + INTERVAL '40 days' + INTERVAL '8 hours',
 '10000000-0000-0000-0000-000000000005'::uuid,
 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
 0.00, 600, 'community-food-music-fair', false, true),

('30000000-0000-0000-0000-000000000012'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Tech Innovation Showcase',
 'Discover the latest in technology innovation with demonstrations, networking, and keynote presentations from industry leaders.',
 'technology', 'published',
 NOW() + INTERVAL '35 days', NOW() + INTERVAL '35 days' + INTERVAL '8 hours',
 '10000000-0000-0000-0000-000000000007'::uuid,
 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
 75.00, 500, 'tech-innovation-showcase', false, true);

-- =============================================================================
-- COMMUNITY HUBS DATA (12 records)
-- =============================================================================

INSERT INTO public.community_hubs (
  id, account_id, name, description, slug, visibility, member_limit,
  logo_url, banner_url, is_verified, is_active
) VALUES
('40000000-0000-0000-0000-000000000001'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'NYC Music Scene', 
 'The ultimate community for musicians, music lovers, and industry professionals in the New York City area. Discover local events, connect with artists, and stay updated on the vibrant NYC music scene.',
 'nyc-music-scene', 'public', 5000,
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', true, true),

('40000000-0000-0000-0000-000000000002'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Chicago Comedy Collective',
 'Chicago''s premier comedy community bringing together comedians, venues, and fans. Find open mic nights, showcases, and networking opportunities.',
 'chicago-comedy-collective', 'public', 2000,
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b',
 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b', true, true),

('40000000-0000-0000-0000-000000000003'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Bay Area Tech Events',
 'Stay connected with the San Francisco Bay Area tech community. Discover conferences, meetups, hackathons, and networking events.',
 'bay-area-tech-events', 'public', 10000,
 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
 'https://images.unsplash.com/photo-1549924231-f129b911e442', true, true),

('40000000-0000-0000-0000-000000000004'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Austin Live Music Lovers',
 'Celebrating Austin''s incredible live music culture! Join fellow music enthusiasts to discover new venues, artists, and unforgettable performances.',
 'austin-live-music-lovers', 'public', 3000,
 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3',
 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3', true, true),

('40000000-0000-0000-0000-000000000005'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Portland Arts & Culture',
 'Discover Portland''s thriving arts scene including galleries, theaters, festivals, and cultural events. Connect with artists and art lovers.',
 'portland-arts-culture', 'public', 1500,
 'https://images.unsplash.com/photo-1531058020387-3be344556be6',
 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0', true, true),

('40000000-0000-0000-0000-000000000006'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Miami Nightlife Network',
 'Your guide to Miami''s hottest nightlife scene. Find the best clubs, rooftop parties, and late-night events in the Magic City.',
 'miami-nightlife-network', 'public', 4000,
 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67',
 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67', true, true),

('40000000-0000-0000-0000-000000000007'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Denver Outdoor Events',
 'Celebrating Colorado''s outdoor event culture! Mountain concerts, festivals, and adventure-based gatherings throughout the Denver metro area.',
 'denver-outdoor-events', 'public', 2500,
 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256',
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', true, true),

('40000000-0000-0000-0000-000000000008'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Detroit Underground Music',
 'Explore Detroit''s rich musical heritage and cutting-edge underground scene. From techno to hip-hop, discover the sounds that define the city.',
 'detroit-underground-music', 'public', 1200,
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14', true, true),

('40000000-0000-0000-0000-000000000009'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Boston Cultural Events',
 'Discover Boston''s rich cultural landscape including historical events, educational programs, and community celebrations.',
 'boston-cultural-events', 'public', 1800,
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', true, true),

('40000000-0000-0000-0000-000000000010'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'San Diego Beach Events',
 'Sun, sand, and spectacular events! Connect with San Diego''s beach community for concerts, festivals, and oceanfront celebrations.',
 'san-diego-beach-events', 'public', 3500,
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', true, true),

('40000000-0000-0000-0000-000000000011'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Seattle Independent Artists',
 'Supporting Seattle''s vibrant independent arts community. Gallery openings, artist showcases, and creative collaborations.',
 'seattle-independent-artists', 'public', 1000,
 'https://images.unsplash.com/photo-1531058020387-3be344556be6',
 'https://images.unsplash.com/photo-1440613905118-99b921706b5c', true, true),

('40000000-0000-0000-0000-000000000012'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'Vegas Entertainment Industry',
 'The professional network for Las Vegas entertainment industry insiders. Connect with bookers, agents, performers, and venue managers.',
 'vegas-entertainment-industry', 'invite_only', 500,
 'https://images.unsplash.com/photo-1505236858219-8359eb29e329',
 'https://images.unsplash.com/photo-1505236858219-8359eb29e329', true, true);

-- =============================================================================
-- BOOKINGS DATA (12 records)
-- =============================================================================

INSERT INTO public.bookings (
  id, account_id, event_id, venue_id, performer_id, status, event_date, 
  start_time, end_time, guest_count, base_price, total_amount, payment_status,
  client_name, client_email, client_phone
) VALUES
('50000000-0000-0000-0000-000000000001'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 '30000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000004'::uuid, '20000000-0000-0000-0000-000000000001'::uuid,
 'confirmed', NOW() + INTERVAL '30 days', '17:00'::time, '22:00'::time, 150,
 2500.00, 2750.00, 'deposit_paid', 'Sarah Johnson', 'sarah.johnson@email.com', '+1-555-2001'),

('50000000-0000-0000-0000-000000000002'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 '30000000-0000-0000-0000-000000000003'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, '20000000-0000-0000-0000-000000000002'::uuid,
 'confirmed', NOW() + INTERVAL '15 days', '20:00'::time, '23:00'::time, 2,
 800.00, 880.00, 'paid_in_full', 'Mike Davis', 'mike.davis@email.com', '+1-555-2002'),

('50000000-0000-0000-0000-000000000003'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 '30000000-0000-0000-0000-000000000005'::uuid, '10000000-0000-0000-0000-000000000006'::uuid, '20000000-0000-0000-0000-000000000003'::uuid,
 'confirmed', NOW() + INTERVAL '25 days', '19:00'::time, '23:00'::time, 8,
 1800.00, 1980.00, 'deposit_paid', 'Emily Chen', 'emily.chen@email.com', '+1-555-2003'),

('50000000-0000-0000-0000-000000000004'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 '30000000-0000-0000-0000-000000000009'::uuid, '10000000-0000-0000-0000-000000000008'::uuid, '20000000-0000-0000-0000-000000000004'::uuid,
 'confirmed', NOW() + INTERVAL '8 days', '21:00'::time, '02:00'::time, 4,
 1200.00, 1320.00, 'paid_in_full', 'Alex Rodriguez', 'alex.rodriguez@email.com', '+1-555-2004'),

('50000000-0000-0000-0000-000000000005'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 '30000000-0000-0000-0000-000000000010'::uuid, '10000000-0000-0000-0000-000000000003'::uuid, '20000000-0000-0000-0000-000000000009'::uuid,
 'pending', NOW() + INTERVAL '22 days', '15:00'::time, '17:00'::time, 25,
 750.00, 825.00, 'unpaid', 'Jennifer Wilson', 'jennifer.wilson@email.com', '+1-555-2005'),

('50000000-0000-0000-0000-000000000006'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 NULL, '10000000-0000-0000-0000-000000000003'::uuid, '20000000-0000-0000-0000-000000000005'::uuid,
 'confirmed', NOW() + INTERVAL '35 days', '18:00'::time, '24:00'::time, 75,
 900.00, 990.00, 'deposit_paid', 'David Thompson', 'david.thompson@email.com', '+1-555-2006'),

('50000000-0000-0000-0000-000000000007'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 '30000000-0000-0000-0000-000000000008'::uuid, '10000000-0000-0000-0000-000000000009'::uuid, '20000000-0000-0000-0000-000000000008'::uuid,
 'confirmed', NOW() + INTERVAL '18 days', '09:00'::time, '15:00'::time, 1,
 1500.00, 1650.00, 'paid_in_full', 'Lisa Garcia', 'lisa.garcia@email.com', '+1-555-2007'),

('50000000-0000-0000-0000-000000000008'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 NULL, '10000000-0000-0000-0000-000000000005'::uuid, '20000000-0000-0000-0000-000000000010'::uuid,
 'pending', NOW() + INTERVAL '50 days', '16:00'::time, '19:00'::time, 12,
 1300.00, 1430.00, 'unpaid', 'Robert Kim', 'robert.kim@email.com', '+1-555-2008'),

('50000000-0000-0000-0000-000000000009'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 '30000000-0000-0000-0000-000000000004'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, '20000000-0000-0000-0000-000000000006'::uuid,
 'confirmed', NOW() + INTERVAL '20 days', '20:00'::time, '23:00'::time, 6,
 600.00, 660.00, 'paid_in_full', 'Amanda Foster', 'amanda.foster@email.com', '+1-555-2009'),

('50000000-0000-0000-0000-000000000010'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 NULL, '10000000-0000-0000-0000-000000000007'::uuid, '20000000-0000-0000-0000-000000000012'::uuid,
 'confirmed', NOW() + INTERVAL '28 days', '10:00'::time, '16:00'::time, 50,
 1800.00, 1980.00, 'deposit_paid', 'Corporate Solutions Inc', 'events@corpsolutions.com', '+1-555-2010'),

('50000000-0000-0000-0000-000000000011'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 NULL, '10000000-0000-0000-0000-000000000011'::uuid, '20000000-0000-0000-0000-000000000011'::uuid,
 'pending', NOW() + INTERVAL '42 days', '19:30'::time, '21:30'::time, 3,
 650.00, 715.00, 'unpaid', 'Maria Santos', 'maria.santos@email.com', '+1-555-2011'),

('50000000-0000-0000-0000-000000000012'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 '30000000-0000-0000-0000-000000000007'::uuid, '10000000-0000-0000-0000-000000000010'::uuid, '20000000-0000-0000-0000-000000000001'::uuid,
 'pending', NOW() + INTERVAL '60 days', '14:00'::time, '18:00'::time, 20,
 2500.00, 2750.00, 'unpaid', 'Beach Festival Org', 'bookings@beachfest.org', '+1-555-2012');

-- =============================================================================
-- REVIEWS DATA (12 records)  
-- =============================================================================

INSERT INTO public.reviews (
  id, account_id, entity_type, entity_id, rating, title, content, is_verified
) VALUES
('60000000-0000-0000-0000-000000000001'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000001'::uuid, 5,
 'Absolutely stunning venue!', 
 'The Grand Theatre exceeded all expectations. The acoustics are incredible and the staff was professional throughout. Perfect for our corporate event.', true),

('60000000-0000-0000-0000-000000000002'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'performer', '20000000-0000-0000-0000-000000000001'::uuid, 5,
 'Jazz Fusion Collective was phenomenal!',
 'These musicians are absolutely top-tier. Their performance at our festival was the highlight of the weekend. Professional, talented, and engaging with the audience.', true),

('60000000-0000-0000-0000-000000000003'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'event', '30000000-0000-0000-0000-000000000001'::uuid, 4,
 'Great event, could use better organization',
 'The music was fantastic and the venue was beautiful. Food options were good too. Only complaint is the entry process was a bit slow, but overall a wonderful experience.', true),

('60000000-0000-0000-0000-000000000004'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000002'::uuid, 5,
 'Perfect intimate venue',
 'Blue Note Jazz Club is exactly what you want for an intimate performance. Great atmosphere, excellent sound system, and the staff knows their jazz!', true),

('60000000-0000-0000-0000-000000000005'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'performer', '20000000-0000-0000-0000-000000000002'::uuid, 4,
 'Beautiful voice and great stage presence',
 'Sarah Martinez delivered a heartfelt performance. Her original songs were beautiful and she had great interaction with the audience. Would definitely book again.', true),

('60000000-0000-0000-0000-000000000006'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000004'::uuid, 5,
 'Amazing outdoor venue!',
 'Sunset Amphitheater is breathtaking. The sunset views during the performance were incredible. Well-organized event with great facilities.', true),

('60000000-0000-0000-0000-000000000007'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'performer', '20000000-0000-0000-0000-000000000006'::uuid, 5,
 'Hilarious and professional',
 'Mike Laughs had our corporate event in stitches. Clean comedy that was appropriate for all ages. Very professional and easy to work with.', true),

('60000000-0000-0000-0000-000000000008'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'event', '30000000-0000-0000-0000-000000000003'::uuid, 5,
 'Magical intimate evening',
 'This acoustic night was perfect. Small venue, great artist, amazing atmosphere. Sarah''s performance was captivating from start to finish.', true),

('60000000-0000-0000-0000-000000000009'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000008'::uuid, 4,
 'Great rooftop experience',
 'Rooftop Sky Lounge has amazing views and a great setup for parties. The only downside was it got a bit crowded, but that''s expected for popular events.', true),

('60000000-0000-0000-0000-000000000010'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'performer', '20000000-0000-0000-0000-000000000004'::uuid, 4,
 'DJ Nightshade knows how to move a crowd',
 'Great music selection and excellent crowd reading skills. The energy was high all night. Would definitely have him back for future events.', true),

('60000000-0000-0000-0000-000000000011'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000011'::uuid, 5,
 'Unique and beautiful space',
 'Art Gallery Loft provided the perfect setting for our art exhibition opening. The space is flexible and the lighting is perfect for showcasing artwork.', true),

('60000000-0000-0000-0000-000000000012'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'performer', '20000000-0000-0000-0000-000000000009'::uuid, 5,
 'Amazing Marco lived up to his name!',
 'The magic show was incredible. Amazing Marco kept both kids and adults entertained throughout. Professional setup and truly impressive illusions.', true);

-- =============================================================================
-- MESSAGES DATA (12 records)
-- =============================================================================

INSERT INTO public.messages (
  id, sender_id, recipient_id, message_type, subject, content, booking_id, is_read
) VALUES
('70000000-0000-0000-0000-000000000001'::uuid, 
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'booking_inquiry', 'Jazz Festival Booking Inquiry',
 'Hi! I''m interested in booking Jazz Fusion Collective for our summer festival. Could you please send me your availability and pricing for a 3-hour performance?',
 NULL, false),

('70000000-0000-0000-0000-000000000002'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'booking_update', 'Venue Booking Confirmation',
 'Your booking for The Grand Theatre has been confirmed for June 15th. Please find the contract attached and let us know if you have any questions.',
 '50000000-0000-0000-0000-000000000001'::uuid, true),

('70000000-0000-0000-0000-000000000003'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'direct', 'Question about upcoming event',
 'Hello! I noticed your Summer Jazz Festival event and wanted to know if there will be food vendors on site. Also, is parking included in the ticket price?',
 NULL, false),

('70000000-0000-0000-0000-000000000004'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'booking_inquiry', 'Wedding Reception Performance',
 'We''re looking for acoustic music for our wedding reception in September. Would Sarah Martinez be available for a 2-hour performance? We''re expecting about 75 guests.',
 NULL, true),

('70000000-0000-0000-0000-000000000005'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'booking_update', 'Payment Reminder',
 'This is a friendly reminder that the final payment for your booking is due in 7 days. Please let us know if you need any assistance with the payment process.',
 '50000000-0000-0000-0000-000000000003'::uuid, false),

('70000000-0000-0000-0000-000000000006'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'direct', 'Collaboration Opportunity',
 'Hi! I represent the Chicago Comedy Collective and we''d love to feature your venue for our monthly showcase. Would you be interested in discussing a partnership?',
 NULL, true),

('70000000-0000-0000-0000-000000000007'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'booking_inquiry', 'Corporate Event Entertainment',
 'We''re planning a corporate innovation summit and need a keynote speaker. Is Dr. Patricia Wilson available for March 20th? We''re expecting 800 attendees.',
 NULL, false),

('70000000-0000-0000-0000-000000000008'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'system', 'Event Reminder',
 'Just a reminder that your event "Acoustic Nights: Sarah Martinez" is coming up in 3 days. Make sure to arrive 30 minutes early for sound check.',
 NULL, true),

('70000000-0000-0000-0000-000000000009'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'booking_update', 'Booking Cancellation',
 'Unfortunately, we need to cancel our booking for Electric Storm due to unforeseen circumstances. Please process the refund according to your cancellation policy.',
 NULL, false),

('70000000-0000-0000-0000-000000000010'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'direct', 'Venue Availability Question',
 'Hello! I''m planning a birthday party for 50 people in July. Is Crystal Ballroom available for weekend bookings? What are your catering options?',
 NULL, true),

('70000000-0000-0000-0000-000000000011'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'booking_inquiry', 'Magic Show for Kids Party',
 'Hi Amazing Marco! We''re planning our son''s 8th birthday party and would love to have you perform. It would be for about 20 kids and 15 adults. Are you available on May 10th?',
 NULL, false),

('70000000-0000-0000-0000-000000000012'::uuid,
 (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1),
 'notification', 'New Review Posted',
 'You have received a new 5-star review for your recent performance at The Grand Theatre! Check your dashboard to read the full review.',
 NULL, false);

-- =============================================================================
-- FAVORITES DATA (12 records)
-- =============================================================================

INSERT INTO public.favorites (
  id, account_id, entity_type, entity_id
) VALUES
('80000000-0000-0000-0000-000000000001'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000001'::uuid),

('80000000-0000-0000-0000-000000000002'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'performer', '20000000-0000-0000-0000-000000000001'::uuid),

('80000000-0000-0000-0000-000000000003'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'event', '30000000-0000-0000-0000-000000000001'::uuid),

('80000000-0000-0000-0000-000000000004'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000004'::uuid),

('80000000-0000-0000-0000-000000000005'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'performer', '20000000-0000-0000-0000-000000000002'::uuid),

('80000000-0000-0000-0000-000000000006'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'hub', '40000000-0000-0000-0000-000000000001'::uuid),

('80000000-0000-0000-0000-000000000007'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000008'::uuid),

('80000000-0000-0000-0000-000000000008'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'event', '30000000-0000-0000-0000-000000000007'::uuid),

('80000000-0000-0000-0000-000000000009'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'performer', '20000000-0000-0000-0000-000000000009'::uuid),

('80000000-0000-0000-0000-000000000010'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'venue', '10000000-0000-0000-0000-000000000011'::uuid),

('80000000-0000-0000-0000-000000000011'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'hub', '40000000-0000-0000-0000-000000000003'::uuid),

('80000000-0000-0000-0000-000000000012'::uuid, (SELECT id FROM public.accounts LIMIT 1),
 'event', '30000000-0000-0000-0000-000000000012'::uuid);

-- =============================================================================
-- HUB MEMBERSHIPS (12 records)
-- =============================================================================

INSERT INTO public.hub_memberships (
  id, hub_id, user_id, role, is_active
) VALUES
('90000000-0000-0000-0000-000000000001'::uuid, '40000000-0000-0000-0000-000000000001'::uuid, (SELECT id FROM auth.users LIMIT 1), 'admin', true),
('90000000-0000-0000-0000-000000000002'::uuid, '40000000-0000-0000-0000-000000000002'::uuid, (SELECT id FROM auth.users LIMIT 1), 'moderator', true),
('90000000-0000-0000-0000-000000000003'::uuid, '40000000-0000-0000-0000-000000000003'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000004'::uuid, '40000000-0000-0000-0000-000000000004'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000005'::uuid, '40000000-0000-0000-0000-000000000005'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000006'::uuid, '40000000-0000-0000-0000-000000000006'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000007'::uuid, '40000000-0000-0000-0000-000000000007'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000008'::uuid, '40000000-0000-0000-0000-000000000008'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000009'::uuid, '40000000-0000-0000-0000-000000000009'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000010'::uuid, '40000000-0000-0000-0000-000000000010'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000011'::uuid, '40000000-0000-0000-0000-000000000011'::uuid, (SELECT id FROM auth.users LIMIT 1), 'member', true),
('90000000-0000-0000-0000-000000000012'::uuid, '40000000-0000-0000-0000-000000000012'::uuid, (SELECT id FROM auth.users LIMIT 1), 'admin', true);

-- =============================================================================
-- USER PREFERENCES (12 records)
-- =============================================================================

-- Note: We'll create these for the first user that exists, or create dummy user IDs
INSERT INTO public.user_preferences (
  id, user_id, email_notifications, push_notifications, profile_visibility,
  preferred_categories, preferred_locations, price_range_min, price_range_max
) VALUES
('A0000000-0000-0000-0000-000000000001'::uuid, COALESCE((SELECT id FROM auth.users LIMIT 1), 'A1000000-0000-0000-0000-000000000001'::uuid),
 '{"bookings": true, "messages": true, "events": true, "marketing": false}'::jsonb,
 '{"bookings": true, "messages": true, "events": true}'::jsonb,
 'public', ARRAY['music', 'arts', 'entertainment'], ARRAY['New York', 'Chicago'], 0.00, 500.00),

('A0000000-0000-0000-0000-000000000002'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'A1000000-0000-0000-0000-000000000002'::uuid),
 '{"bookings": true, "messages": false, "events": true, "marketing": true}'::jsonb,
 '{"bookings": true, "messages": false, "events": true}'::jsonb,
 'private', ARRAY['business', 'technology'], ARRAY['San Francisco', 'Austin'], 50.00, 1000.00),

('A0000000-0000-0000-0000-000000000003'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 2 LIMIT 1), 'A1000000-0000-0000-0000-000000000003'::uuid),
 '{"bookings": false, "messages": true, "events": false, "marketing": false}'::jsonb,
 '{"bookings": false, "messages": true, "events": false}'::jsonb,
 'public', ARRAY['sports', 'community'], ARRAY['Denver', 'Portland'], 25.00, 200.00),

('A0000000-0000-0000-0000-000000000004'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 3 LIMIT 1), 'A1000000-0000-0000-0000-000000000004'::uuid),
 '{"bookings": true, "messages": true, "events": true, "marketing": true}'::jsonb,
 '{"bookings": true, "messages": true, "events": true}'::jsonb,
 'public', ARRAY['food_drink', 'entertainment'], ARRAY['Miami', 'Los Angeles'], 0.00, 300.00),

('A0000000-0000-0000-0000-000000000005'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 4 LIMIT 1), 'A1000000-0000-0000-0000-000000000005'::uuid),
 '{"bookings": true, "messages": true, "events": false, "marketing": false}'::jsonb,
 '{"bookings": true, "messages": true, "events": false}'::jsonb,
 'private', ARRAY['arts', 'music'], ARRAY['Boston', 'Seattle'], 100.00, 750.00),

('A0000000-0000-0000-0000-000000000006'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 5 LIMIT 1), 'A1000000-0000-0000-0000-000000000006'::uuid),
 '{"bookings": false, "messages": false, "events": true, "marketing": true}'::jsonb,
 '{"bookings": false, "messages": false, "events": true}'::jsonb,
 'public', ARRAY['health', 'education'], ARRAY['Phoenix', 'Dallas'], 20.00, 150.00),

('A0000000-0000-0000-0000-000000000007'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 6 LIMIT 1), 'A1000000-0000-0000-0000-000000000007'::uuid),
 '{"bookings": true, "messages": false, "events": true, "marketing": false}'::jsonb,
 '{"bookings": true, "messages": false, "events": true}'::jsonb,
 'private', ARRAY['technology', 'business'], ARRAY['Atlanta', 'Nashville'], 75.00, 600.00),

('A0000000-0000-0000-0000-000000000008'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 7 LIMIT 1), 'A1000000-0000-0000-0000-000000000008'::uuid),
 '{"bookings": true, "messages": true, "events": true, "marketing": false}'::jsonb,
 '{"bookings": true, "messages": true, "events": true}'::jsonb,
 'public', ARRAY['community', 'other'], ARRAY['Minneapolis', 'Milwaukee'], 15.00, 400.00),

('A0000000-0000-0000-0000-000000000009'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 8 LIMIT 1), 'A1000000-0000-0000-0000-000000000009'::uuid),
 '{"bookings": false, "messages": true, "events": false, "marketing": true}'::jsonb,
 '{"bookings": false, "messages": true, "events": false}'::jsonb,
 'public', ARRAY['entertainment', 'arts'], ARRAY['Las Vegas', 'Reno'], 30.00, 800.00),

('A0000000-0000-0000-0000-000000000010'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 9 LIMIT 1), 'A1000000-0000-0000-0000-000000000010'::uuid),
 '{"bookings": true, "messages": false, "events": true, "marketing": true}'::jsonb,
 '{"bookings": true, "messages": false, "events": true}'::jsonb,
 'private', ARRAY['music', 'food_drink'], ARRAY['San Diego', 'Sacramento'], 40.00, 350.00),

('A0000000-0000-0000-0000-000000000011'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 10 LIMIT 1), 'A1000000-0000-0000-0000-000000000011'::uuid),
 '{"bookings": true, "messages": true, "events": false, "marketing": false}'::jsonb,
 '{"bookings": true, "messages": true, "events": false}'::jsonb,
 'public', ARRAY['sports', 'health'], ARRAY['Tampa', 'Orlando'], 25.00, 275.00),

('A0000000-0000-0000-0000-000000000012'::uuid, COALESCE((SELECT id FROM auth.users OFFSET 11 LIMIT 1), 'A1000000-0000-0000-0000-000000000012'::uuid),
 '{"bookings": false, "messages": true, "events": true, "marketing": true}'::jsonb,
 '{"bookings": false, "messages": true, "events": true}'::jsonb,
 'public', ARRAY['education', 'technology'], ARRAY['Houston', 'New Orleans'], 60.00, 900.00);

-- =============================================================================
-- ANALYTICS DATA (12 records)
-- =============================================================================

INSERT INTO public.event_analytics (
  id, event_id, page_views, unique_visitors, bookings_count, favorites_count,
  total_revenue, average_booking_value, date
) VALUES
('B0000000-0000-0000-0000-000000000001'::uuid, '30000000-0000-0000-0000-000000000001'::uuid, 1250, 890, 45, 123, 11250.00, 250.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000002'::uuid, '30000000-0000-0000-0000-000000000002'::uuid, 2100, 1680, 78, 234, 31200.00, 400.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000003'::uuid, '30000000-0000-0000-0000-000000000003'::uuid, 456, 312, 18, 67, 1350.00, 75.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000004'::uuid, '30000000-0000-0000-0000-000000000004'::uuid, 789, 623, 34, 89, 2040.00, 60.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000005'::uuid, '30000000-0000-0000-0000-000000000005'::uuid, 3400, 2100, 120, 456, 26400.00, 220.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000006'::uuid, '30000000-0000-0000-0000-000000000006'::uuid, 567, 445, 0, 78, 0.00, 0.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000007'::uuid, '30000000-0000-0000-0000-000000000007'::uuid, 2890, 1890, 89, 234, 42330.00, 475.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000008'::uuid, '30000000-0000-0000-0000-000000000008'::uuid, 234, 189, 12, 23, 2388.00, 199.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000009'::uuid, '30000000-0000-0000-0000-000000000009'::uuid, 678, 534, 28, 67, 2520.00, 90.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000010'::uuid, '30000000-0000-0000-0000-000000000010'::uuid, 445, 334, 67, 123, 3015.00, 45.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000011'::uuid, '30000000-0000-0000-0000-000000000011'::uuid, 1890, 1234, 0, 145, 0.00, 0.00, CURRENT_DATE - INTERVAL '1 day'),
('B0000000-0000-0000-0000-000000000012'::uuid, '30000000-0000-0000-0000-000000000012'::uuid, 1123, 890, 23, 89, 5175.00, 225.00, CURRENT_DATE - INTERVAL '1 day');

-- =============================================================================
-- UPDATE STATS & COMPLETION MESSAGE
-- =============================================================================

-- Update venue stats based on bookings
UPDATE public.venues SET current_bookings = (
  SELECT COUNT(*) FROM public.bookings 
  WHERE venue_id = venues.id AND status IN ('pending', 'confirmed')
);

-- Update event stats based on bookings  
UPDATE public.events SET current_bookings = (
  SELECT COALESCE(SUM(guest_count), 0) FROM public.bookings 
  WHERE event_id = events.id AND status IN ('pending', 'confirmed')
);

-- Update performer stats
UPDATE public.performers SET 
  total_performances = (
    SELECT COUNT(*) FROM public.bookings 
    WHERE performer_id = performers.id AND status = 'completed'
  ),
  average_rating = (
    SELECT COALESCE(AVG(rating::decimal), 0) FROM public.reviews 
    WHERE entity_type = 'performer' AND entity_id = performers.id
  );

-- Update community hub member counts
UPDATE public.community_hubs SET current_members = (
  SELECT COUNT(*) FROM public.hub_memberships 
  WHERE hub_id = community_hubs.id AND is_active = true
);

COMMENT ON SCHEMA public IS 'Magic Patterns database populated with comprehensive seed data - 12 records per table for development and testing';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'SUCCESS: Magic Patterns database has been populated with seed data!';
  RAISE NOTICE '- 12 Venues across different types and locations';
  RAISE NOTICE '- 12 Performers in various categories (musicians, DJs, comedians, etc.)';
  RAISE NOTICE '- 12 Events with diverse categories and dates';
  RAISE NOTICE '- 12 Community Hubs for different cities and interests';
  RAISE NOTICE '- 12 Bookings with various statuses and details';
  RAISE NOTICE '- 12 Reviews for venues, performers, and events';
  RAISE NOTICE '- 12 Messages of different types';
  RAISE NOTICE '- 12 Favorites across different entity types';
  RAISE NOTICE '- 12 Hub memberships with different roles';
  RAISE NOTICE '- User preferences and event analytics data';
  RAISE NOTICE '- All stats have been updated based on the seed data';
END $$;