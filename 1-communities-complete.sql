-- INSERT 1 COMMUNITY RECORD WITH ALL REQUIRED FIELDS
INSERT INTO public.communities (id, name, description, slug, city, state, location) VALUES 
('00000000-0000-0000-0000-000000000001', 'Default Community', 'Default community for testing', 'default-community', 'New York', 'NY', ST_GeomFromText('POINT(-74.0059 40.7128)', 4326))
ON CONFLICT (id) DO NOTHING;