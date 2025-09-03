-- COMPLETE DATABASE MIGRATION SCRIPT
-- Execute this entire script in Supabase SQL Editor
-- This will update schema and populate ALL tables with 12 records each

BEGIN;

-- STEP 1: CREATE MISSING TABLES AND UPDATE SCHEMA

-- Create community_hubs table first (required for foreign keys)
CREATE TABLE IF NOT EXISTS public.community_hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to venues table
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS max_capacity INTEGER;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS contact_email VARCHAR(320);

-- Add missing columns to events table  
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue_id UUID;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Fix performers table - add stage_name column
ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS stage_name VARCHAR(255);

-- Create additional tables for complete coverage
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id),
    venue_id UUID REFERENCES public.venues(id),
    performer_id UUID REFERENCES public.performers(id),
    status VARCHAR(50) DEFAULT 'pending',
    guest_count INTEGER,
    total_amount DECIMAL(10,2),
    client_name VARCHAR(255),
    client_email VARCHAR(320),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50), -- 'event', 'venue', 'performer'
    entity_id UUID,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    reviewer_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID,
    recipient_id UUID,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    entity_type VARCHAR(50), -- 'event', 'venue', 'performer'
    entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);


-- STEP 2: INSERT DEFAULT COMMUNITY AND BASE DATA

-- Insert default community
INSERT INTO public.community_hubs (id, name, description, slug) VALUES 
('00000000-0000-0000-0000-000000000001', 'Default Community', 'Default community for testing', 'default-community')
ON CONFLICT (id) DO NOTHING;

-- Create default test user accounts if they don't exist
INSERT INTO public.accounts (id, email, full_name) VALUES 
('00000000-0000-0000-0000-000000000002', 'organizer@test.com', 'Test Organizer'),
('00000000-0000-0000-0000-000000000003', 'user1@test.com', 'Test User 1'),
('00000000-0000-0000-0000-000000000004', 'user2@test.com', 'Test User 2')
ON CONFLICT (id) DO NOTHING;


-- STEP 3: INSERT 12 VENUES WITH ALL REQUIRED FIELDS

INSERT INTO public.venues (community_id, name, description, slug, venue_type, address, city, state, country, max_capacity, image_url, contact_email, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'Madison Square Garden', 'Famous arena in New York City', 'madison-square-garden', 1, '4 Pennsylvania Plaza, New York, NY 10001', 'New York', 'NY', 'USA', 20000, 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 'info@msg.com', true),
('00000000-0000-0000-0000-000000000001', 'Hollywood Bowl', 'Iconic outdoor amphitheater', 'hollywood-bowl', 2, '2301 N Highland Ave, Los Angeles, CA 90068', 'Los Angeles', 'CA', 'USA', 17500, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'info@hollywoodbowl.com', true),
('00000000-0000-0000-0000-000000000001', 'The Beacon Theatre', 'Historic Upper West Side theater', 'beacon-theatre', 1, '2124 Broadway, New York, NY 10023', 'New York', 'NY', 'USA', 2894, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'info@beacontheatre.com', true),
('00000000-0000-0000-0000-000000000001', 'Red Rocks Amphitheatre', 'Natural rock formation venue', 'red-rocks-amphitheatre', 2, '18300 W Alameda Pkwy, Morrison, CO 80465', 'Morrison', 'CO', 'USA', 9525, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'info@redrocks.com', true),
('00000000-0000-0000-0000-000000000001', 'The Fillmore', 'Historic music venue in San Francisco', 'the-fillmore', 1, '1805 Geary Blvd, San Francisco, CA 94115', 'San Francisco', 'CA', 'USA', 1150, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', 'info@thefillmore.com', true),
('00000000-0000-0000-0000-000000000001', 'Austin City Limits Live', 'Premier music venue in Austin', 'austin-city-limits-live', 1, '310 Willie Nelson Blvd, Austin, TX 78701', 'Austin', 'TX', 'USA', 2750, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'info@acllive.com', true),
('00000000-0000-0000-0000-000000000001', 'Chicago Theatre', 'Historic landmark theater', 'chicago-theatre', 1, '175 N State St, Chicago, IL 60601', 'Chicago', 'IL', 'USA', 3600, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'info@thechicagotheatre.com', true),
('00000000-0000-0000-0000-000000000001', 'The Gorge Amphitheatre', 'Scenic outdoor venue', 'the-gorge-amphitheatre', 2, '754 Silica Rd NW, Quincy, WA 98848', 'Quincy', 'WA', 'USA', 27500, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 'info@thegorge.com', true),
('00000000-0000-0000-0000-000000000001', 'The Ryman Auditorium', 'Mother Church of Country Music', 'ryman-auditorium', 1, '116 Rep John Lewis Way N, Nashville, TN 37219', 'Nashville', 'TN', 'USA', 2362, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', 'info@ryman.com', true),
('00000000-0000-0000-0000-000000000001', 'House of Blues Houston', 'Intimate music venue', 'house-of-blues-houston', 1, '1204 Caroline St, Houston, TX 77002', 'Houston', 'TX', 'USA', 1150, 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', 'info@hob.com', true),
('00000000-0000-0000-0000-000000000001', 'The Greek Theatre Berkeley', 'Historic outdoor amphitheater', 'the-greek-theatre-berkeley', 2, '2001 Gayley Rd, Berkeley, CA 94720', 'Berkeley', 'CA', 'USA', 8500, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'info@thegreektheatre.com', true),
('00000000-0000-0000-0000-000000000001', 'Warehouse Live Houston', 'Multi-room concert venue', 'warehouse-live-houston', 1, '813 St Emanuel St, Houston, TX 77003', 'Houston', 'TX', 'USA', 3000, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', 'info@warehouselive.com', true);


-- STEP 4: INSERT 12 EVENTS WITH ALL REQUIRED FIELDS

INSERT INTO public.events (community_id, organizer_id, title, description, slug, category, image_url, start_date, end_date, status, is_public) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Summer Music Festival', 'Multi-day outdoor music festival featuring top artists', 'summer-music-festival', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '2024-07-15 18:00:00+00', '2024-07-17 23:00:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Jazz Night at the Blue Moon', 'Intimate jazz performance with local artists', 'jazz-night-blue-moon', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '2024-06-20 20:00:00+00', '2024-06-20 23:30:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Comedy Showcase', 'Stand-up comedy night featuring rising comedians', 'comedy-showcase', 'entertainment', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', '2024-06-25 19:30:00+00', '2024-06-25 22:00:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Rock Concert Series', 'Monthly rock concert series with different bands', 'rock-concert-series', 'music', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', '2024-07-05 19:00:00+00', '2024-07-05 23:00:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Classical Orchestra Performance', 'Symphony orchestra performing classical masterpieces', 'classical-orchestra-performance', 'music', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', '2024-06-30 19:30:00+00', '2024-06-30 22:00:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Electronic Dance Festival', 'All-night electronic music festival', 'electronic-dance-festival', 'music', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', '2024-08-10 21:00:00+00', '2024-08-11 06:00:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Folk Music Gathering', 'Acoustic folk music with storytelling', 'folk-music-gathering', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '2024-07-12 18:00:00+00', '2024-07-12 21:00:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hip Hop Showcase', 'Underground hip hop artists showcase', 'hip-hop-showcase', 'music', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', '2024-07-18 20:00:00+00', '2024-07-18 23:30:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Country Music Night', 'Country music celebration with line dancing', 'country-music-night', 'music', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', '2024-07-22 19:00:00+00', '2024-07-22 23:00:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Opera Performance', 'Classic opera performance with full orchestra', 'opera-performance', 'music', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', '2024-08-05 19:00:00+00', '2024-08-05 22:30:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Indie Rock Festival', 'Independent rock artists festival', 'indie-rock-festival', 'music', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', '2024-08-15 17:00:00+00', '2024-08-15 23:00:00+00', 'published', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'World Music Celebration', 'Music from around the world celebration', 'world-music-celebration', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '2024-08-20 18:00:00+00', '2024-08-20 22:00:00+00', 'published', true);


-- STEP 5: INSERT 12 PERFORMERS WITH ALL REQUIRED FIELDS

INSERT INTO public.performers (name, stage_name, slug, bio, category, profile_image_url, is_available, average_rating) VALUES
('The Midnight Express', 'The Midnight Express', 'the-midnight-express', 'High-energy rock band from Austin, Texas', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', true, 4.8),
('Sarah Jazz Quintet', 'Sarah Jazz Quintet', 'sarah-jazz-quintet', 'Smooth jazz ensemble led by Sarah Williams', 'music', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', true, 4.6),
('Comedy Central Mike', 'Comedy Central Mike', 'comedy-central-mike', 'Stand-up comedian with 15 years of experience', 'comedy', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400', true, 4.7),
('Electric Pulse DJ', 'DJ Electric Pulse', 'electric-pulse-dj', 'Electronic music producer and DJ', 'music', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400', true, 4.9),
('Classical Strings Quartet', 'Classical Strings Quartet', 'classical-strings-quartet', 'Professional classical music quartet', 'music', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', true, 4.5),
('Folk Stories Trio', 'Folk Stories Trio', 'folk-stories-trio', 'Acoustic folk music with storytelling', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', true, 4.4),
('Hip Hop Collective', 'Hip Hop Collective', 'hip-hop-collective', 'Underground hip hop group', 'music', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400', true, 4.6),
('Country Roads Band', 'Country Roads Band', 'country-roads-band', 'Traditional country music band', 'music', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', true, 4.3),
('Opera Prima Donna', 'Opera Prima Donna', 'opera-prima-donna', 'Classically trained opera singer', 'music', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', true, 4.9),
('Indie Rock Revival', 'Indie Rock Revival', 'indie-rock-revival', 'Independent rock band with original songs', 'music', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400', true, 4.2),
('World Beat Ensemble', 'World Beat Ensemble', 'world-beat-ensemble', 'World music fusion group', 'music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', true, 4.7),
('Magic Mike Magician', 'Magic Mike', 'magic-mike-magician', 'Professional magician and entertainer', 'entertainment', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', true, 4.8);


-- STEP 6: INSERT 12 BOOKINGS

INSERT INTO public.bookings (event_id, venue_id, performer_id, status, guest_count, total_amount, client_name, client_email) 
SELECT 
    e.id as event_id,
    v.id as venue_id, 
    p.id as performer_id,
    'confirmed' as status,
    (RANDOM() * 100 + 50)::INTEGER as guest_count,
    (RANDOM() * 5000 + 1000)::DECIMAL(10,2) as total_amount,
    'Client ' || ROW_NUMBER() OVER() as client_name,
    'client' || ROW_NUMBER() OVER() || '@test.com' as client_email
FROM 
    (SELECT id FROM public.events LIMIT 12) e,
    (SELECT id FROM public.venues LIMIT 12) v,
    (SELECT id FROM public.performers LIMIT 12) p
WHERE 
    ROW_NUMBER() OVER() <= 12;


-- STEP 7: INSERT 12 REVIEWS

INSERT INTO public.reviews (entity_type, entity_id, rating, title, content, reviewer_name) VALUES
('venue', (SELECT id FROM public.venues LIMIT 1), 5, 'Amazing venue!', 'Great acoustics and atmosphere', 'John Smith'),
('venue', (SELECT id FROM public.venues LIMIT 1 OFFSET 1), 4, 'Good experience', 'Nice location but parking was difficult', 'Jane Doe'),
('event', (SELECT id FROM public.events LIMIT 1), 5, 'Best concert ever!', 'Incredible performance and great crowd', 'Music Lover'),
('event', (SELECT id FROM public.events LIMIT 1 OFFSET 1), 4, 'Really enjoyed it', 'Good music but sound could be better', 'Concert Goer'),
('performer', (SELECT id FROM public.performers LIMIT 1), 5, 'Outstanding performance', 'Absolutely brilliant show', 'Fan123'),
('performer', (SELECT id FROM public.performers LIMIT 1 OFFSET 1), 4, 'Great show', 'Enjoyed the music and energy', 'Music Fan'),
('venue', (SELECT id FROM public.venues LIMIT 1 OFFSET 2), 3, 'Average venue', 'Nothing special but adequate', 'Regular User'),
('event', (SELECT id FROM public.events LIMIT 1 OFFSET 2), 5, 'Fantastic event', 'Everything was perfect', 'Event Attendee'),
('performer', (SELECT id FROM public.performers LIMIT 1 OFFSET 2), 4, 'Good performer', 'Entertaining and professional', 'Audience Member'),
('venue', (SELECT id FROM public.venues LIMIT 1 OFFSET 3), 5, 'Perfect venue', 'Everything exceeded expectations', 'Venue Visitor'),
('event', (SELECT id FROM public.events LIMIT 1 OFFSET 3), 3, 'Okay event', 'It was fine but not spectacular', 'Casual Attendee'),
('performer', (SELECT id FROM public.performers LIMIT 1 OFFSET 3), 5, 'Incredible talent', 'One of the best performances I have seen', 'Performance Critic');


-- STEP 8: INSERT 12 MESSAGES

INSERT INTO public.messages (sender_id, recipient_id, subject, content, is_read) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Event Booking Confirmation', 'Your booking has been confirmed for the Summer Music Festival', false),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Thank you!', 'Thanks for organizing such a great event', true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Venue Availability', 'The venue you requested is available for your event', false),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Booking Request', 'I would like to book your venue for next month', true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Concert Recommendations', 'You might enjoy the upcoming jazz performance', false),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Thanks for the tip!', 'I will definitely check out that jazz show', true),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Event Update', 'The start time for tomorrows event has changed', false),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Got it', 'Thanks for letting me know about the time change', true),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Performer Inquiry', 'Do you have contact info for the jazz quintet?', false),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'Performer Contact', 'Here is the contact information you requested', true),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Event Feedback', 'What did you think of last nights concert?', false),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Concert Review', 'It was amazing! The sound quality was perfect', true);


-- STEP 9: INSERT 12 FAVORITES

INSERT INTO public.favorites (user_id, entity_type, entity_id) 
SELECT 
    '00000000-0000-0000-0000-000000000003' as user_id,
    'venue' as entity_type,
    v.id as entity_id
FROM (SELECT id FROM public.venues LIMIT 4) v

UNION ALL

SELECT 
    '00000000-0000-0000-0000-000000000004' as user_id,
    'event' as entity_type,
    e.id as entity_id
FROM (SELECT id FROM public.events LIMIT 4) e

UNION ALL

SELECT 
    '00000000-0000-0000-0000-000000000003' as user_id,
    'performer' as entity_type,
    p.id as entity_id
FROM (SELECT id FROM public.performers LIMIT 4) p;

COMMIT;

-- VERIFICATION QUERIES (Run these to confirm data was inserted)
SELECT 'venues' as table_name, count(*) as record_count FROM public.venues
UNION ALL
SELECT 'events' as table_name, count(*) as record_count FROM public.events  
UNION ALL
SELECT 'performers' as table_name, count(*) as record_count FROM public.performers
UNION ALL
SELECT 'community_hubs' as table_name, count(*) as record_count FROM public.community_hubs
UNION ALL
SELECT 'bookings' as table_name, count(*) as record_count FROM public.bookings
UNION ALL
SELECT 'reviews' as table_name, count(*) as record_count FROM public.reviews
UNION ALL
SELECT 'messages' as table_name, count(*) as record_count FROM public.messages
UNION ALL
SELECT 'favorites' as table_name, count(*) as record_count FROM public.favorites;