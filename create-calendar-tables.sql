-- Create calendar tables using existing data
-- This will be run directly in Supabase

-- Create curated_calendars table
CREATE TABLE IF NOT EXISTS public.curated_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  creator_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  event_count INTEGER DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendars table
CREATE TABLE IF NOT EXISTS public.calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  event_count INTEGER DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert curated calendars based on existing community hubs
INSERT INTO public.curated_calendars (name, description, slug, creator_id, event_count, subscriber_count, is_public)
SELECT 
  CONCAT(ch.name, ' Events') as name,
  CONCAT('Curated events from ', ch.name, ' - ', ch.description) as description,
  CONCAT(ch.slug, '-events') as slug,
  (SELECT id FROM public.accounts LIMIT 1) as creator_id,
  FLOOR(RANDOM() * 10) + 5 as event_count,
  FLOOR(RANDOM() * 500) + 100 as subscriber_count,
  true as is_public
FROM public.community_hubs ch
ON CONFLICT (slug) DO NOTHING;

-- Insert additional curated calendars
INSERT INTO public.curated_calendars (name, description, slug, creator_id, event_count, subscriber_count, is_public)
VALUES 
  ('Summer Music Festival', 'The ultimate summer music experience featuring top artists and emerging talent', 'summer-music-festival', (SELECT id FROM public.accounts LIMIT 1), 12, 1250, true),
  ('Food & Wine Events', 'Culinary adventures and wine tastings for food enthusiasts', 'food-wine-events', (SELECT id FROM public.accounts LIMIT 1), 8, 890, true),
  ('Tech Conference Series', 'Cutting-edge technology conferences and workshops', 'tech-conference-series', (SELECT id FROM public.accounts LIMIT 1), 15, 2100, true),
  ('Art & Culture Calendar', 'Exhibitions, galleries, and cultural events in the city', 'art-culture-calendar', (SELECT id FROM public.accounts LIMIT 1), 20, 750, true),
  ('Sports & Fitness', 'Marathons, tournaments, and fitness events', 'sports-fitness', (SELECT id FROM public.accounts LIMIT 1), 10, 1100, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert personal calendars
INSERT INTO public.calendars (name, description, slug, user_id, event_count, subscriber_count, is_public)
VALUES 
  ('My Personal Events', 'Personal events and reminders', 'my-personal-events', (SELECT id FROM public.accounts LIMIT 1), 5, 0, false),
  ('Work Schedule', 'Work meetings and professional events', 'work-schedule', (SELECT id FROM public.accounts LIMIT 1), 8, 0, false),
  ('Family Events', 'Family gatherings and celebrations', 'family-events', (SELECT id FROM public.accounts LIMIT 1), 3, 0, false)
ON CONFLICT (slug) DO NOTHING;
