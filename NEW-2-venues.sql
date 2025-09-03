-- INSERT 12 VENUE RECORDS (Correct WTF Schema)
INSERT INTO public.venues (
  id, 
  community_id,
  name,
  slug,
  description,
  venue_type,
  address,
  location,
  capacity,
  amenities,
  images,
  operating_hours,
  booking_email,
  booking_phone,
  website_url,
  is_verified
) VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Madison Square Garden', 'madison-square-garden', 'The World''s Most Famous Arena', 'indoor', '4 Pennsylvania Plaza, New York, NY 10001', ST_GeomFromText('POINT(-73.9934 40.7505)', 4326), 20000, '{"parking": true, "wifi": true, "bar": true, "restaurant": true, "accessibility": true}', '[{"url": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14", "alt": "Madison Square Garden exterior"}]', '{"monday": "6:00-23:00", "tuesday": "6:00-23:00", "wednesday": "6:00-23:00", "thursday": "6:00-23:00", "friday": "6:00-23:00", "saturday": "6:00-23:00", "sunday": "6:00-23:00"}', 'bookings@msg.com', '212-465-6741', 'https://www.msg.com', true),

('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Brooklyn Bowl', 'brooklyn-bowl', 'Live music venue and bowling alley', 'indoor', '61 Wythe Ave, Brooklyn, NY 11249', ST_GeomFromText('POINT(-73.9634 40.7214)', 4326), 600, '{"bowling": true, "restaurant": true, "bar": true, "wifi": true, "parking": false}', '[{"url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7", "alt": "Brooklyn Bowl interior"}]', '{"monday": "17:00-02:00", "tuesday": "17:00-02:00", "wednesday": "17:00-02:00", "thursday": "17:00-02:00", "friday": "17:00-04:00", "saturday": "17:00-04:00", "sunday": "17:00-02:00"}', 'events@brooklynbowl.com', '718-963-3369', 'https://www.brooklynbowl.com', true),

('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Central Park SummerStage', 'central-park-summerstage', 'Outdoor concert venue in Central Park', 'outdoor', 'Rumsey Playfield, Central Park, New York, NY 10024', ST_GeomFromText('POINT(-73.9712 40.7711)', 4326), 5000, '{"outdoor_seating": true, "food_vendors": true, "restrooms": true, "accessibility": true}', '[{"url": "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec", "alt": "SummerStage outdoor concert"}]', '{"seasonal": "May-October, event dependent"}', 'info@summerstage.org', '212-360-2777', 'https://www.summerstage.org', true),

('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'The Apollo Theater', 'apollo-theater', 'Historic music hall in Harlem', 'indoor', '253 W 125th St, New York, NY 10027', ST_GeomFromText('POINT(-73.9496 40.8106)', 4326), 1500, '{"historic": true, "bar": true, "merchandise": true, "accessibility": true}', '[{"url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f", "alt": "Apollo Theater marquee"}]', '{"varies": "Event dependent"}', 'boxoffice@apollotheater.org', '212-531-5300', 'https://www.apollotheater.org', true),

('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Webster Hall', 'webster-hall', 'Multi-level nightclub and concert venue', 'indoor', '125 E 11th St, New York, NY 10003', ST_GeomFromText('POINT(-73.9889 40.7322)', 4326), 1400, '{"multiple_floors": true, "bars": true, "vip_areas": true, "sound_system": true}', '[{"url": "https://images.unsplash.com/photo-1571974599782-87624638275d", "alt": "Webster Hall concert"}]', '{"event_dependent": "Check calendar"}', 'booking@websterhall.com', '212-353-1600', 'https://www.websterhall.com', true),

('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Brooklyn Bridge Park', 'brooklyn-bridge-park', 'Waterfront park with event spaces', 'outdoor', '334 Furman St, Brooklyn, NY 11201', ST_GeomFromText('POINT(-73.9969 40.7024)', 4326), 3000, '{"waterfront": true, "playground": true, "sports_courts": true, "food_vendors": true, "restrooms": true}', '[{"url": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25", "alt": "Brooklyn Bridge Park view"}]', '{"daily": "6:00-01:00"}', 'events@brooklynbridgepark.org', '718-222-9939', 'https://www.brooklynbridgepark.org', true),

('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Gotham Comedy Club', 'gotham-comedy-club', 'Premier comedy venue in Chelsea', 'indoor', '208 W 23rd St, New York, NY 10011', ST_GeomFromText('POINT(-73.9925 40.7440)', 4326), 300, '{"full_bar": true, "restaurant": true, "intimate_setting": true, "professional_sound": true}', '[{"url": "https://images.unsplash.com/photo-1541009072594-8ddc585a0e3b", "alt": "Comedy club stage"}]', '{"tuesday": "19:00-23:00", "wednesday": "19:00-23:00", "thursday": "19:00-23:00", "friday": "19:00-01:00", "saturday": "19:00-01:00", "sunday": "19:00-23:00"}', 'info@gothamcomedyclub.com', '212-367-9000', 'https://www.gothamcomedyclub.com', true),

('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'The High Line', 'the-high-line', 'Elevated park and event space', 'outdoor', 'Access at Gansevoort St, New York, NY 10014', ST_GeomFromText('POINT(-74.0048 40.7411)', 4326), 1000, '{"elevated_views": true, "art_installations": true, "gardens": true, "accessibility": true}', '[{"url": "https://images.unsplash.com/photo-1577622643278-6d0b7be7b3bb", "alt": "High Line elevated park"}]', '{"daily": "7:00-19:00"}', 'events@thehighline.org', '212-500-6035', 'https://www.thehighline.org', true),

('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'Blue Note', 'blue-note', 'Legendary jazz club in Greenwich Village', 'indoor', '131 W 3rd St, New York, NY 10012', ST_GeomFromText('POINT(-74.0014 40.7308)', 4326), 200, '{"jazz_venue": true, "fine_dining": true, "intimate": true, "professional_sound": true}', '[{"url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f", "alt": "Jazz club interior"}]', '{"daily": "18:00-02:00"}', 'reservations@bluenotejazz.com', '212-475-8592', 'https://www.bluenotejazz.com', true),

('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Pier 97', 'pier-97', 'Hudson River waterfront event space', 'outdoor', 'W 57th St & 12th Ave, New York, NY 10019', ST_GeomFromText('POINT(-74.0015 40.7706)', 4326), 2500, '{"waterfront": true, "views": true, "flexible_space": true, "parking": true}', '[{"url": "https://images.unsplash.com/photo-1514905552197-0610a4d8fd73", "alt": "Hudson River pier"}]', '{"seasonal": "April-November"}', 'events@hudsonriverpark.org', '212-627-2020', 'https://www.hudsonriverpark.org', false),

('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Elsewhere', 'elsewhere-brooklyn', 'Multi-room venue and nightclub', 'indoor', '599 Johnson Ave, Brooklyn, NY 11237', ST_GeomFromText('POINT(-73.9239 40.7076)', 4326), 800, '{"multiple_rooms": true, "rooftop": true, "art_gallery": true, "full_bar": true}', '[{"url": "https://images.unsplash.com/photo-1571974599782-87624638275d", "alt": "Elsewhere venue interior"}]', '{"thursday": "20:00-04:00", "friday": "20:00-04:00", "saturday": "20:00-04:00"}', 'bookings@elsewhere.space', '929-234-2344', 'https://www.elsewhere.space', false),

('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Stone Street Historic District', 'stone-street-historic', 'Historic cobblestone street for events', 'outdoor', 'Stone St, New York, NY 10004', ST_GeomFromText('POINT(-74.0118 40.7041)', 4326), 1500, '{"historic": true, "cobblestone": true, "restaurants": true, "bars": true}', '[{"url": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0", "alt": "Stone Street cobblestone"}]', '{"varies": "Event and permit dependent"}', 'permits@nyc.gov', '311', 'https://www.nyc.gov', false)

ON CONFLICT (id) DO NOTHING;