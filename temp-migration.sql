-- Create community hubs first
CREATE TABLE IF NOT EXISTS public.community_hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default community
INSERT INTO public.community_hubs (id, name, description, slug) VALUES 
('00000000-0000-0000-0000-000000000001', 'Default Community', 'Default community for testing', 'default-community')
ON CONFLICT (id) DO NOTHING;

-- Insert venues with correct community_id
INSERT INTO public.venues (community_id, name, description, slug, venue_type, address) VALUES
('00000000-0000-0000-0000-000000000001', 'Madison Square Garden', 'Famous arena in New York City', 'madison-square-garden', 1, '4 Pennsylvania Plaza, New York, NY'),
('00000000-0000-0000-0000-000000000001', 'Hollywood Bowl', 'Iconic outdoor amphitheater', 'hollywood-bowl', 2, '2301 N Highland Ave, Los Angeles, CA'),
('00000000-0000-0000-0000-000000000001', 'The Beacon Theatre', 'Historic Upper West Side theater', 'beacon-theatre', 1, '2124 Broadway, New York, NY'),
('00000000-0000-0000-0000-000000000001', 'Red Rocks Amphitheatre', 'Natural rock formation venue', 'red-rocks-amphitheatre', 2, '18300 W Alameda Pkwy, Morrison, CO'),
('00000000-0000-0000-0000-000000000001', 'The Fillmore', 'Historic music venue in San Francisco', 'the-fillmore', 1, '1805 Geary Blvd, San Francisco, CA'),
('00000000-0000-0000-0000-000000000001', 'Austin City Limits Live', 'Premier music venue in Austin', 'austin-city-limits-live', 1, '310 Willie Nelson Blvd, Austin, TX'),
('00000000-0000-0000-0000-000000000001', 'Chicago Theatre', 'Historic landmark theater', 'chicago-theatre', 1, '175 N State St, Chicago, IL'),
('00000000-0000-0000-0000-000000000001', 'The Gorge Amphitheatre', 'Scenic outdoor venue', 'the-gorge-amphitheatre', 2, '754 Silica Rd NW, Quincy, WA'),
('00000000-0000-0000-0000-000000000001', 'The Ryman Auditorium', 'Mother Church of Country Music', 'ryman-auditorium', 1, '116 Rep John Lewis Way N, Nashville, TN'),
('00000000-0000-0000-0000-000000000001', 'House of Blues Houston', 'Intimate music venue', 'house-of-blues-houston', 1, '1204 Caroline St, Houston, TX'),
('00000000-0000-0000-0000-000000000001', 'The Greek Theatre Berkeley', 'Historic outdoor amphitheater', 'the-greek-theatre-berkeley', 2, '2001 Gayley Rd, Berkeley, CA'),
('00000000-0000-0000-0000-000000000001', 'Warehouse Live Houston', 'Multi-room concert venue', 'warehouse-live-houston', 1, '813 St Emanuel St, Houston, TX');

-- Insert events with required category field
INSERT INTO public.events (community_id, organizer_id, title, description, slug, category) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Summer Music Festival', 'Multi-day outdoor music festival', 'summer-music-festival', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Jazz Night at the Blue Moon', 'Intimate jazz performance', 'jazz-night-blue-moon', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Comedy Showcase', 'Stand-up comedy night', 'comedy-showcase', 'entertainment'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Rock Concert Series', 'Monthly rock concert series', 'rock-concert-series', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Classical Orchestra Performance', 'Symphony orchestra performing', 'classical-orchestra-performance', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Electronic Dance Festival', 'All-night electronic music', 'electronic-dance-festival', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Folk Music Gathering', 'Acoustic folk music', 'folk-music-gathering', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hip Hop Showcase', 'Underground hip hop artists', 'hip-hop-showcase', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Country Music Night', 'Country music celebration', 'country-music-night', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Opera Performance', 'Classic opera performance', 'opera-performance', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Indie Rock Festival', 'Independent rock artists', 'indie-rock-festival', 'music'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'World Music Celebration', 'Music from around the world', 'world-music-celebration', 'music');