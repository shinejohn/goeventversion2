/*
 * -------------------------------------------------------
 * Section: Shared Calendars System
 * Schema for calendar sharing and subscription functionality
 * Based on Magic Patterns CalendarMarketplacePage and CalendarSlugPage
 * -------------------------------------------------------
 */

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- SHARED CALENDARS SYSTEM
-- =============================================================================

-- Shared calendars table
-- Represents calendars that users can share and subscribe to
CREATE TABLE IF NOT EXISTS public.shared_calendars (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic calendar info
  title varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  tagline text,
  description text,
  
  -- Visual assets
  banner_image varchar(1000),
  logo varchar(1000),
  
  -- Creator info
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creator_name varchar(255) NOT NULL,
  creator_avatar varchar(1000),
  creator_verified boolean DEFAULT false,
  
  -- Calendar settings
  visibility varchar(50) DEFAULT 'public', -- public, private, unlisted
  is_paid boolean DEFAULT false,
  price decimal(10,2) DEFAULT 0,
  currency varchar(3) DEFAULT 'USD',
  
  -- Categories and tags
  categories text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  
  -- Stats (denormalized for performance)
  followers_count integer DEFAULT 0,
  events_count integer DEFAULT 0,
  active_members_count integer DEFAULT 0,
  growth_rate decimal(5,2) DEFAULT 0,
  
  -- Settings
  update_frequency varchar(50) DEFAULT 'weekly', -- daily, weekly, monthly, custom
  auto_approve_subscribers boolean DEFAULT true,
  allow_comments boolean DEFAULT true,
  allow_sharing boolean DEFAULT true,
  
  -- Location (optional)
  location_name varchar(255),
  location_address text,
  location_city varchar(100),
  location_state varchar(100),
  location_country varchar(100),
  location_radius integer, -- in miles
  
  -- Status
  status varchar(50) DEFAULT 'active', -- active, paused, archived, deleted
  is_featured boolean DEFAULT false,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_event_added timestamptz,
  
  -- Constraints
  CONSTRAINT valid_visibility CHECK (visibility IN ('public', 'private', 'unlisted')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'paused', 'archived', 'deleted')),
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_followers CHECK (followers_count >= 0),
  CONSTRAINT valid_events CHECK (events_count >= 0)
);

-- Calendar subscriptions table
-- Tracks which users are subscribed to which calendars
CREATE TABLE IF NOT EXISTS public.calendar_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User and calendar
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  calendar_id uuid REFERENCES public.shared_calendars(id) ON DELETE CASCADE NOT NULL,
  
  -- Subscription details
  subscription_type varchar(50) DEFAULT 'free', -- free, paid, premium
  status varchar(50) DEFAULT 'active', -- active, paused, cancelled, expired
  
  -- Payment info (for paid subscriptions)
  payment_status varchar(50) DEFAULT 'none', -- none, pending, paid, failed, refunded
  payment_intent_id varchar(255),
  subscription_price decimal(10,2),
  subscription_currency varchar(3),
  subscription_period varchar(50), -- monthly, yearly, lifetime
  
  -- Subscription settings
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  digest_frequency varchar(50) DEFAULT 'weekly', -- daily, weekly, monthly, none
  
  -- Meta
  subscribed_at timestamptz DEFAULT now(),
  last_accessed timestamptz,
  expires_at timestamptz,
  
  -- Constraints
  UNIQUE(user_id, calendar_id),
  CONSTRAINT valid_subscription_type CHECK (subscription_type IN ('free', 'paid', 'premium')),
  CONSTRAINT valid_subscription_status CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('none', 'pending', 'paid', 'failed', 'refunded'))
);

-- Calendar events table
-- Links events to shared calendars
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Calendar and event
  calendar_id uuid REFERENCES public.shared_calendars(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  
  -- Event details (denormalized for performance)
  event_title varchar(255) NOT NULL,
  event_description text,
  event_image varchar(1000),
  event_date timestamptz NOT NULL,
  event_venue_name varchar(255),
  event_venue_address text,
  event_price_min decimal(10,2),
  event_price_max decimal(10,2),
  event_is_free boolean DEFAULT false,
  
  -- Curator info
  curator_note text,
  highlight_reason varchar(100), -- staff_pick, rising_star, trending, etc.
  is_pinned boolean DEFAULT false,
  
  -- Weather info (if available)
  weather_condition varchar(50),
  temperature integer,
  weather_icon varchar(50),
  
  -- Distance info (if location-based)
  distance_miles decimal(8,2),
  distance_minutes integer,
  distance_mode varchar(20), -- drive, walk, transit
  
  -- Meta
  added_at timestamptz DEFAULT now(),
  added_by uuid REFERENCES auth.users(id),
  
  -- Constraints
  UNIQUE(calendar_id, event_id),
  CONSTRAINT valid_distance_mode CHECK (distance_mode IN ('drive', 'walk', 'transit'))
);

-- Calendar comments table
-- User comments on calendars
CREATE TABLE IF NOT EXISTS public.calendar_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Calendar and user
  calendar_id uuid REFERENCES public.shared_calendars(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Comment content
  content text NOT NULL,
  parent_id uuid REFERENCES public.calendar_comments(id) ON DELETE CASCADE, -- for replies
  
  -- Status
  is_approved boolean DEFAULT true,
  is_pinned boolean DEFAULT false,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Shared calendars indexes
CREATE INDEX IF NOT EXISTS idx_shared_calendars_slug ON public.shared_calendars(slug);
CREATE INDEX IF NOT EXISTS idx_shared_calendars_creator ON public.shared_calendars(creator_id);
CREATE INDEX IF NOT EXISTS idx_shared_calendars_visibility ON public.shared_calendars(visibility);
CREATE INDEX IF NOT EXISTS idx_shared_calendars_status ON public.shared_calendars(status);
CREATE INDEX IF NOT EXISTS idx_shared_calendars_featured ON public.shared_calendars(is_featured);
CREATE INDEX IF NOT EXISTS idx_shared_calendars_followers ON public.shared_calendars(followers_count DESC);
CREATE INDEX IF NOT EXISTS idx_shared_calendars_updated ON public.shared_calendars(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_calendars_categories ON public.shared_calendars USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_shared_calendars_tags ON public.shared_calendars USING GIN(tags);

-- Calendar subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_calendar_subscriptions_user ON public.calendar_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_subscriptions_calendar ON public.calendar_subscriptions(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_subscriptions_status ON public.calendar_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_calendar_subscriptions_type ON public.calendar_subscriptions(subscription_type);

-- Calendar events indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_calendar ON public.calendar_events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event ON public.calendar_events(event_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON public.calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_pinned ON public.calendar_events(is_pinned);

-- Calendar comments indexes
CREATE INDEX IF NOT EXISTS idx_calendar_comments_calendar ON public.calendar_comments(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_comments_user ON public.calendar_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_comments_parent ON public.calendar_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_calendar_comments_created ON public.calendar_comments(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS
ALTER TABLE public.shared_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_comments ENABLE ROW LEVEL SECURITY;

-- Shared calendars policies
-- Anyone can read public calendars
CREATE POLICY "shared_calendars_read_public" ON public.shared_calendars
  FOR SELECT TO authenticated, anon
  USING (visibility = 'public' AND status = 'active');

-- Creators can manage their own calendars
CREATE POLICY "shared_calendars_manage_own" ON public.shared_calendars
  FOR ALL TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Calendar subscriptions policies
-- Users can view their own subscriptions
CREATE POLICY "calendar_subscriptions_read_own" ON public.calendar_subscriptions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can manage their own subscriptions
CREATE POLICY "calendar_subscriptions_manage_own" ON public.calendar_subscriptions
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Calendar events policies
-- Anyone can read events from public calendars
CREATE POLICY "calendar_events_read_public" ON public.calendar_events
  FOR SELECT TO authenticated, anon
  USING (
    calendar_id IN (
      SELECT id FROM public.shared_calendars 
      WHERE visibility = 'public' AND status = 'active'
    )
  );

-- Calendar creators can manage events
CREATE POLICY "calendar_events_manage_creator" ON public.calendar_events
  FOR ALL TO authenticated
  USING (
    calendar_id IN (
      SELECT id FROM public.shared_calendars 
      WHERE creator_id = auth.uid()
    )
  )
  WITH CHECK (
    calendar_id IN (
      SELECT id FROM public.shared_calendars 
      WHERE creator_id = auth.uid()
    )
  );

-- Calendar comments policies
-- Anyone can read approved comments on public calendars
CREATE POLICY "calendar_comments_read_public" ON public.calendar_comments
  FOR SELECT TO authenticated, anon
  USING (
    is_approved = true AND
    calendar_id IN (
      SELECT id FROM public.shared_calendars 
      WHERE visibility = 'public' AND status = 'active'
    )
  );

-- Users can manage their own comments
CREATE POLICY "calendar_comments_manage_own" ON public.calendar_comments
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to update calendar stats
CREATE OR REPLACE FUNCTION public.update_calendar_stats(calendar_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.shared_calendars
  SET 
    followers_count = (
      SELECT COUNT(*) FROM public.calendar_subscriptions 
      WHERE calendar_id = calendar_id AND status = 'active'
    ),
    events_count = (
      SELECT COUNT(*) FROM public.calendar_events 
      WHERE calendar_id = calendar_id
    ),
    updated_at = now()
  WHERE id = calendar_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is subscribed to calendar
CREATE OR REPLACE FUNCTION public.is_subscribed_to_calendar(user_id uuid, calendar_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.calendar_subscriptions 
    WHERE user_id = user_id 
    AND calendar_id = calendar_id 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to update calendar stats when subscriptions change
CREATE OR REPLACE FUNCTION public.trigger_update_calendar_stats()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM public.update_calendar_stats(NEW.calendar_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.update_calendar_stats(OLD.calendar_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calendar_subscriptions_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.calendar_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.trigger_update_calendar_stats();

-- Trigger to update calendar stats when events change
CREATE TRIGGER trigger_calendar_events_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.trigger_update_calendar_stats();

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert sample shared calendars
INSERT INTO public.shared_calendars (
  title, slug, tagline, description, banner_image, logo,
  creator_id, creator_name, creator_avatar, creator_verified,
  visibility, is_paid, price, categories, tags,
  followers_count, events_count, active_members_count, growth_rate,
  update_frequency, location_city, location_state, status, is_featured
) VALUES
  (
    'Downtown Jazz Nights',
    'downtown-jazz-nights',
    'The best jazz performances in downtown venues',
    'A curated collection of the finest jazz performances happening in downtown Clearwater. From smooth jazz to bebop, this calendar covers it all. Perfect for jazz enthusiasts looking to discover new artists and venues.',
    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    (SELECT id FROM auth.users LIMIT 1), -- Use first user as creator
    'Jazz Association',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    true,
    'public',
    true,
    4.99,
    ARRAY['Music', 'Jazz', 'Nightlife', 'Arts & Culture'],
    ARRAY['Live Music', 'Jazz', 'Downtown', 'Evening Events', 'Performances'],
    2547,
    87,
    843,
    12.5,
    'weekly',
    'Clearwater',
    'FL',
    'active',
    true
  ),
  (
    'Family Fun Events',
    'family-fun-events',
    'Kid-friendly activities and family events',
    'Discover the best family-friendly events in your area. From outdoor activities to educational workshops, we curate events that bring families together.',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    (SELECT id FROM auth.users LIMIT 1),
    'Family Events Co',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    false,
    'public',
    false,
    0.00,
    ARRAY['Kids & Family', 'Education', 'Outdoor', 'Community'],
    ARRAY['Family', 'Kids', 'Education', 'Outdoor', 'Community'],
    1892,
    156,
    1204,
    8.3,
    'daily',
    'Clearwater',
    'FL',
    'active',
    true
  ),
  (
    'Fitness & Wellness',
    'fitness-wellness',
    'Stay active and healthy with our curated fitness events',
    'From yoga classes to running groups, find the perfect fitness activities to keep you motivated and healthy.',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    (SELECT id FROM auth.users LIMIT 1),
    'Wellness Community',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    false,
    'public',
    false,
    0.00,
    ARRAY['Fitness', 'Wellness', 'Health', 'Sports'],
    ARRAY['Fitness', 'Yoga', 'Running', 'Health', 'Wellness'],
    3241,
    203,
    2156,
    15.2,
    'daily',
    'Clearwater',
    'FL',
    'active',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- GRANTS
-- =============================================================================

-- Grant permissions
GRANT SELECT ON public.shared_calendars TO authenticated, anon;
GRANT ALL ON public.shared_calendars TO authenticated;

GRANT SELECT ON public.calendar_subscriptions TO authenticated;
GRANT ALL ON public.calendar_subscriptions TO authenticated;

GRANT SELECT ON public.calendar_events TO authenticated, anon;
GRANT ALL ON public.calendar_events TO authenticated;

GRANT SELECT ON public.calendar_comments TO authenticated, anon;
GRANT ALL ON public.calendar_comments TO authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION public.update_calendar_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_subscribed_to_calendar(uuid, uuid) TO authenticated;
