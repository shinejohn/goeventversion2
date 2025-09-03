-- INSERT 1 COMMUNITY RECORD (Correct WTF Schema)
INSERT INTO public.communities (id, name, slug, location, city, state, country, timezone, description) VALUES 
('00000000-0000-0000-0000-000000000001', 'Default Community', 'default-community', ST_GeomFromText('POINT(-74.0059 40.7128)', 4326), 'New York', 'NY', 'US', 'America/New_York', 'Default community for testing')
ON CONFLICT (id) DO NOTHING;