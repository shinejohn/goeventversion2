-- =====================================================
-- CALENDAR TABLES CREATION SCRIPT
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create curated_calendars table
CREATE TABLE IF NOT EXISTS public.curated_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  creator_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  event_count INTEGER DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  image_url TEXT,
  website TEXT,
  social_media TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create calendars table (personal calendars)
CREATE TABLE IF NOT EXISTS public.calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  event_count INTEGER DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for calendar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create calendar_events table (junction table for calendar-event relationships)
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID REFERENCES public.curated_calendars(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  added_by UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calendar_id, event_id)
);

-- 4. Create calendar_subscriptions table (users subscribing to calendars)
CREATE TABLE IF NOT EXISTS public.calendar_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID REFERENCES public.curated_calendars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calendar_id, user_id)
);

-- 5. Insert curated calendars based on existing community hubs
INSERT INTO public.curated_calendars (name, description, slug, creator_id, event_count, subscriber_count, is_public, tags)
SELECT 
  CONCAT(ch.name, ' Events') as name,
  CONCAT('Curated events from ', ch.name, ' - ', ch.description) as description,
  CONCAT(ch.slug, '-events') as slug,
  (SELECT id FROM public.accounts LIMIT 1) as creator_id,
  FLOOR(RANDOM() * 10) + 5 as event_count,
  FLOOR(RANDOM() * 500) + 100 as subscriber_count,
  true as is_public,
  ARRAY['community', 'events', 'local'] as tags
FROM public.community_hubs ch
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert additional curated calendars
INSERT INTO public.curated_calendars (name, description, slug, creator_id, event_count, subscriber_count, is_public, tags, website, social_media)
VALUES 
  (
    'Summer Music Festival', 
    'The ultimate summer music experience featuring top artists and emerging talent from around the world', 
    'summer-music-festival', 
    (SELECT id FROM public.accounts LIMIT 1), 
    12, 
    1250, 
    true,
    ARRAY['music', 'festival', 'summer', 'live-music'],
    'https://summermusicfest.com',
    'https://instagram.com/summermusicfest'
  ),
  (
    'Food & Wine Events', 
    'Culinary adventures and wine tastings for food enthusiasts and connoisseurs', 
    'food-wine-events', 
    (SELECT id FROM public.accounts LIMIT 1), 
    8, 
    890, 
    true,
    ARRAY['food', 'wine', 'culinary', 'tasting'],
    'https://foodwineevents.com',
    'https://facebook.com/foodwineevents'
  ),
  (
    'Tech Conference Series', 
    'Cutting-edge technology conferences, workshops, and networking events', 
    'tech-conference-series', 
    (SELECT id FROM public.accounts LIMIT 1), 
    15, 
    2100, 
    true,
    ARRAY['tech', 'conference', 'networking', 'innovation'],
    'https://techconferenceseries.com',
    'https://twitter.com/techconfseries'
  ),
  (
    'Art & Culture Calendar', 
    'Exhibitions, galleries, cultural events, and artistic experiences in the city', 
    'art-culture-calendar', 
    (SELECT id FROM public.accounts LIMIT 1), 
    20, 
    750, 
    true,
    ARRAY['art', 'culture', 'exhibition', 'gallery'],
    'https://artculturecity.com',
    'https://instagram.com/artculturecity'
  ),
  (
    'Sports & Fitness', 
    'Marathons, tournaments, fitness events, and athletic competitions', 
    'sports-fitness', 
    (SELECT id FROM public.accounts LIMIT 1), 
    10, 
    1100, 
    true,
    ARRAY['sports', 'fitness', 'marathon', 'athletics'],
    'https://sportsfitnessevents.com',
    'https://facebook.com/sportsfitnessevents'
  ),
  (
    'Business Networking', 
    'Professional networking events, workshops, and business development opportunities', 
    'business-networking', 
    (SELECT id FROM public.accounts LIMIT 1), 
    6, 
    650, 
    true,
    ARRAY['business', 'networking', 'professional', 'career'],
    'https://businessnetworking.com',
    'https://linkedin.com/company/businessnetworking'
  )
ON CONFLICT (slug) DO NOTHING;

-- 7. Insert personal calendars
INSERT INTO public.calendars (name, description, slug, user_id, event_count, subscriber_count, is_public, color)
VALUES 
  (
    'My Personal Events', 
    'Personal events, reminders, and important dates', 
    'my-personal-events', 
    (SELECT id FROM public.accounts LIMIT 1), 
    5, 
    0, 
    false,
    '#10B981'
  ),
  (
    'Work Schedule', 
    'Work meetings, deadlines, and professional events', 
    'work-schedule', 
    (SELECT id FROM public.accounts LIMIT 1), 
    8, 
    0, 
    false,
    '#3B82F6'
  ),
  (
    'Family Events', 
    'Family gatherings, birthdays, and celebrations', 
    'family-events', 
    (SELECT id FROM public.accounts LIMIT 1), 
    3, 
    0, 
    false,
    '#F59E0B'
  ),
  (
    'Health & Wellness', 
    'Doctor appointments, gym sessions, and wellness activities', 
    'health-wellness', 
    (SELECT id FROM public.accounts LIMIT 1), 
    4, 
    0, 
    false,
    '#EF4444'
  )
ON CONFLICT (slug) DO NOTHING;

-- 8. Add some sample calendar-event relationships
INSERT INTO public.calendar_events (calendar_id, event_id, added_by)
SELECT 
  cc.id as calendar_id,
  e.id as event_id,
  (SELECT id FROM public.accounts LIMIT 1) as added_by
FROM public.curated_calendars cc
CROSS JOIN public.events e
WHERE cc.slug LIKE '%-events' 
  AND e.id IS NOT NULL
  AND RANDOM() < 0.3  -- 30% chance of each event being in each calendar
ON CONFLICT (calendar_id, event_id) DO NOTHING;

-- 9. Add some sample calendar subscriptions
INSERT INTO public.calendar_subscriptions (calendar_id, user_id)
SELECT 
  cc.id as calendar_id,
  (SELECT id FROM public.accounts LIMIT 1) as user_id
FROM public.curated_calendars cc
WHERE cc.is_public = true
  AND RANDOM() < 0.7  -- 70% chance of subscribing to each public calendar
ON CONFLICT (calendar_id, user_id) DO NOTHING;

-- 10. Update event counts based on actual relationships
UPDATE public.curated_calendars 
SET event_count = (
  SELECT COUNT(*) 
  FROM public.calendar_events ce 
  WHERE ce.calendar_id = curated_calendars.id
);

-- 11. Update subscriber counts based on actual subscriptions
UPDATE public.curated_calendars 
SET subscriber_count = (
  SELECT COUNT(*) 
  FROM public.calendar_subscriptions cs 
  WHERE cs.calendar_id = curated_calendars.id
);

-- 12. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_curated_calendars_slug ON public.curated_calendars(slug);
CREATE INDEX IF NOT EXISTS idx_curated_calendars_creator ON public.curated_calendars(creator_id);
CREATE INDEX IF NOT EXISTS idx_curated_calendars_public ON public.curated_calendars(is_public);

CREATE INDEX IF NOT EXISTS idx_calendars_slug ON public.calendars(slug);
CREATE INDEX IF NOT EXISTS idx_calendars_user ON public.calendars(user_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_calendar ON public.calendar_events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event ON public.calendar_events(event_id);

CREATE INDEX IF NOT EXISTS idx_calendar_subscriptions_calendar ON public.calendar_subscriptions(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_subscriptions_user ON public.calendar_subscriptions(user_id);

-- 13. Enable RLS (Row Level Security)
ALTER TABLE public.curated_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_subscriptions ENABLE ROW LEVEL SECURITY;

-- 14. Create RLS policies for curated_calendars
CREATE POLICY "curated_calendars_read" ON public.curated_calendars
  FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "curated_calendars_insert" ON public.curated_calendars
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "curated_calendars_update" ON public.curated_calendars
  FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "curated_calendars_delete" ON public.curated_calendars
  FOR DELETE USING (creator_id = auth.uid());

-- 15. Create RLS policies for calendars
CREATE POLICY "calendars_read" ON public.calendars
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "calendars_insert" ON public.calendars
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "calendars_update" ON public.calendars
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "calendars_delete" ON public.calendars
  FOR DELETE USING (user_id = auth.uid());

-- 16. Create RLS policies for calendar_events
CREATE POLICY "calendar_events_read" ON public.calendar_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.curated_calendars cc 
      WHERE cc.id = calendar_events.calendar_id 
      AND (cc.is_public = true OR cc.creator_id = auth.uid())
    )
  );

CREATE POLICY "calendar_events_insert" ON public.calendar_events
  FOR INSERT WITH CHECK (
    added_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.curated_calendars cc 
      WHERE cc.id = calendar_events.calendar_id 
      AND cc.creator_id = auth.uid()
    )
  );

CREATE POLICY "calendar_events_delete" ON public.calendar_events
  FOR DELETE USING (
    added_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.curated_calendars cc 
      WHERE cc.id = calendar_events.calendar_id 
      AND cc.creator_id = auth.uid()
    )
  );

-- 17. Create RLS policies for calendar_subscriptions
CREATE POLICY "calendar_subscriptions_read" ON public.calendar_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "calendar_subscriptions_insert" ON public.calendar_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "calendar_subscriptions_delete" ON public.calendar_subscriptions
  FOR DELETE USING (user_id = auth.uid());

-- 18. Grant necessary permissions
GRANT ALL ON public.curated_calendars TO authenticated;
GRANT ALL ON public.calendars TO authenticated;
GRANT ALL ON public.calendar_events TO authenticated;
GRANT ALL ON public.calendar_subscriptions TO authenticated;

-- 19. Verify the tables were created successfully
SELECT 
  'curated_calendars' as table_name,
  COUNT(*) as record_count
FROM public.curated_calendars
UNION ALL
SELECT 
  'calendars' as table_name,
  COUNT(*) as record_count
FROM public.calendars
UNION ALL
SELECT 
  'calendar_events' as table_name,
  COUNT(*) as record_count
FROM public.calendar_events
UNION ALL
SELECT 
  'calendar_subscriptions' as table_name,
  COUNT(*) as record_count
FROM public.calendar_subscriptions;
