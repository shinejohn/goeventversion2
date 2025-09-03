-- CREATE DEFAULT COMMUNITY HUB
-- Run this second to add the default community

INSERT INTO public.community_hubs (id, name, description, slug) VALUES 
('00000000-0000-0000-0000-000000000001', 'Default Community', 'Default community for testing', 'default-community')
ON CONFLICT (id) DO NOTHING;