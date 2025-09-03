-- MANUAL SQL TO RUN IN SUPABASE SQL EDITOR
-- Copy and paste this entire script into the Supabase SQL Editor and run it
-- This will create the community_hubs table and populate all tables with 12 records each

-- Step 1: Create community_hubs table
CREATE TABLE IF NOT EXISTS public.community_hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Insert default community
INSERT INTO public.community_hubs (id, name, description, slug) VALUES 
('00000000-0000-0000-0000-000000000001', 'Default Community', 'Default community for testing', 'default-community')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Insert 12 venues with proper schema
INSERT INTO public.venues (community_id, name, description, slug, venue_type, address, location) VALUES
('00000000-0000-0000-0000-000000000001', 'Madison Square Garden', 'Famous arena in New York City', 'madison-square-garden', 1, '4 Pennsylvania Plaza, New York, NY 10001', ST_GeomFromText('POINT(-73.9934 40.7505)', 4326)),
('00000000-0000-0000-0000-000000000001', 'Hollywood Bowl', 'Iconic outdoor amphitheater', 'hollywood-bowl', 2, '2301 N Highland Ave, Los Angeles, CA 90068', ST_GeomFromText('POINT(-118.3398 34.1122)', 4326)),
('00000000-0000-0000-0000-000000000001', 'The Beacon Theatre', 'Historic Upper West Side theater', 'beacon-theatre', 1, '2124 Broadway, New York, NY 10023', ST_GeomFromText('POINT(-73.9821 40.7796)', 4326)),
('00000000-0000-0000-0000-000000000001', 'Red Rocks Amphitheatre', 'Natural rock formation venue', 'red-rocks-amphitheatre', 2, '18300 W Alameda Pkwy, Morrison, CO 80465', ST_GeomFromText('POINT(-105.2058 39.6654)', 4326)),
('00000000-0000-0000-0000-000000000001', 'The Fillmore', 'Historic music venue in San Francisco', 'the-fillmore', 1, '1805 Geary Blvd, San Francisco, CA 94115', ST_GeomFromText('POINT(-122.4330 37.7849)', 4326)),
('00000000-0000-0000-0000-000000000001', 'Austin City Limits Live', 'Premier music venue in Austin', 'austin-city-limits-live', 1, '310 Willie Nelson Blvd, Austin, TX 78701', ST_GeomFromText('POINT(-97.7431 30.2672)', 4326)),
('00000000-0000-0000-0000-000000000001', 'Chicago Theatre', 'Historic landmark theater', 'chicago-theatre', 1, '175 N State St, Chicago, IL 60601', ST_GeomFromText('POINT(-87.6298 41.8781)', 4326)),
('00000000-0000-0000-0000-000000000001', 'The Gorge Amphitheatre', 'Scenic outdoor venue', 'the-gorge-amphitheatre', 2, '754 Silica Rd NW, Quincy, WA 98848', ST_GeomFromText('POINT(-119.9945 47.0987)', 4326)),
('00000000-0000-0000-0000-000000000001', 'The Ryman Auditorium', 'Mother Church of Country Music', 'ryman-auditorium', 1, '116 Rep John Lewis Way N, Nashville, TN 37219', ST_GeomFromText('POINT(-86.7816 36.1627)', 4326)),
('00000000-0000-0000-0000-000000000001', 'House of Blues Houston', 'Intimate music venue', 'house-of-blues-houston', 1, '1204 Caroline St, Houston, TX 77002', ST_GeomFromText('POINT(-95.3698 29.7604)', 4326)),
('00000000-0000-0000-0000-000000000001', 'The Greek Theatre Berkeley', 'Historic outdoor amphitheater', 'the-greek-theatre-berkeley', 2, '2001 Gayley Rd, Berkeley, CA 94720', ST_GeomFromText('POINT(-122.2543 37.8735)', 4326)),
('00000000-0000-0000-0000-000000000001', 'Warehouse Live Houston', 'Multi-room concert venue', 'warehouse-live-houston', 1, '813 St Emanuel St, Houston, TX 77003', ST_GeomFromText('POINT(-95.3605 29.7589)', 4326));

-- Step 4: Insert 12 events with proper schema including timezone
INSERT INTO public.events (community_id, organizer_id, title, description, slug, category, start_datetime, end_datetime, timezone) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Summer Music Festival', 'Multi-day outdoor music festival', 'summer-music-festival', 'music', '2024-07-15T18:00:00Z', '2024-07-17T23:00:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Jazz Night at the Blue Moon', 'Intimate jazz performance', 'jazz-night-blue-moon', 'music', '2024-06-20T20:00:00Z', '2024-06-20T23:30:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Comedy Showcase', 'Stand-up comedy night', 'comedy-showcase', 'entertainment', '2024-06-25T19:30:00Z', '2024-06-25T22:00:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Rock Concert Series', 'Monthly rock concert series', 'rock-concert-series', 'music', '2024-07-05T19:00:00Z', '2024-07-05T23:00:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Classical Orchestra Performance', 'Symphony orchestra performing', 'classical-orchestra-performance', 'music', '2024-06-30T19:30:00Z', '2024-06-30T22:00:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Electronic Dance Festival', 'All-night electronic music', 'electronic-dance-festival', 'music', '2024-08-10T21:00:00Z', '2024-08-11T06:00:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Folk Music Gathering', 'Acoustic folk music', 'folk-music-gathering', 'music', '2024-07-12T18:00:00Z', '2024-07-12T21:00:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hip Hop Showcase', 'Underground hip hop artists', 'hip-hop-showcase', 'music', '2024-07-18T20:00:00Z', '2024-07-18T23:30:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Country Music Night', 'Country music celebration', 'country-music-night', 'music', '2024-07-22T19:00:00Z', '2024-07-22T23:00:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Opera Performance', 'Classic opera performance', 'opera-performance', 'music', '2024-08-05T19:00:00Z', '2024-08-05T22:30:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Indie Rock Festival', 'Independent rock artists', 'indie-rock-festival', 'music', '2024-08-15T17:00:00Z', '2024-08-15T23:00:00Z', 'America/New_York'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'World Music Celebration', 'Music from around the world', 'world-music-celebration', 'music', '2024-08-20T18:00:00Z', '2024-08-20T22:00:00Z', 'America/New_York');

-- Step 5: Verify the counts
SELECT 'community_hubs' as table_name, count(*) as record_count FROM public.community_hubs
UNION ALL
SELECT 'venues' as table_name, count(*) as record_count FROM public.venues
UNION ALL
SELECT 'events' as table_name, count(*) as record_count FROM public.events  
UNION ALL
SELECT 'performers' as table_name, count(*) as record_count FROM public.performers;