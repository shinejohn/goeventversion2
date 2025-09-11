/*
 * -------------------------------------------------------
 * Section: User Types and Subscription System
 * This creates the specific user types and subscription system for the event platform
 * -------------------------------------------------------
 */

-- First, update the user_profiles table to include our specific user types
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_user_type_check 
CHECK (user_type IN (
  'fan',              -- Regular event-goers and users
  'influencer',       -- Creates hubs and curated calendars
  'performer',        -- Artists, bands, entertainers (includes organizers)
  'venue_manager',    -- Manages venues (includes sponsors)
  'admin'             -- Platform admin
));

-- Update existing users to 'fan' type if they're currently 'music_fan'
UPDATE public.user_profiles 
SET user_type = 'fan' 
WHERE user_type = 'music_fan';

-- Create subscription types table
CREATE TABLE IF NOT EXISTS public.subscription_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN (
    'fan', 'influencer', 'performer', 'venue_manager'
  )),
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscription_types ENABLE ROW LEVEL SECURITY;

-- Create policy for subscription types (public read)
CREATE POLICY "subscription_types_read" ON public.subscription_types
  FOR SELECT USING (true);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type_id UUID NOT NULL REFERENCES public.subscription_types(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'paused'
  )),
  billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subscription_type_id)
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user subscriptions
CREATE POLICY "user_subscriptions_read_own" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_insert_own" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_update_own" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create user roles linking table for performers and venues
CREATE TABLE IF NOT EXISTS public.user_role_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_type VARCHAR(50) NOT NULL CHECK (role_type IN (
    'performer', 'venue_manager', 'influencer'
  )),
  linked_entity_id UUID, -- References performers.id or venues.id
  linked_entity_type VARCHAR(50) CHECK (linked_entity_type IN ('performer', 'venue')),
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_type, linked_entity_id)
);

-- Enable RLS
ALTER TABLE public.user_role_links ENABLE ROW LEVEL SECURITY;

-- Create policies for user role links
CREATE POLICY "user_role_links_read_own" ON public.user_role_links
  FOR SELECT USING (auth.uid() = user_id OR is_verified = true);

CREATE POLICY "user_role_links_insert_own" ON public.user_role_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_role_links_update_own" ON public.user_role_links
  FOR UPDATE USING (auth.uid() = user_id);

-- Create communities/hubs table for influencers
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  category VARCHAR(100),
  location VARCHAR(255),
  is_public BOOLEAN DEFAULT true,
  member_count INTEGER DEFAULT 0,
  event_count INTEGER DEFAULT 0,
  image_url TEXT,
  cover_image_url TEXT,
  settings JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Create policies for communities
CREATE POLICY "communities_read_public" ON public.communities
  FOR SELECT USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "communities_insert_own" ON public.communities
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "communities_update_own" ON public.communities
  FOR UPDATE USING (auth.uid() = creator_id);

-- Create community members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Enable RLS
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Create policies for community members
CREATE POLICY "community_members_read" ON public.community_members
  FOR SELECT USING (true);

CREATE POLICY "community_members_insert_own" ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create curated calendars table for influencers
CREATE TABLE IF NOT EXISTS public.curated_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  community_id UUID REFERENCES public.communities(id),
  is_public BOOLEAN DEFAULT true,
  event_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.curated_calendars ENABLE ROW LEVEL SECURITY;

-- Create policies for curated calendars
CREATE POLICY "curated_calendars_read_public" ON public.curated_calendars
  FOR SELECT USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "curated_calendars_insert_own" ON public.curated_calendars
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "curated_calendars_update_own" ON public.curated_calendars
  FOR UPDATE USING (auth.uid() = creator_id);

-- Create calendar events table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES public.curated_calendars(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES auth.users(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(calendar_id, event_id)
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies for calendar events
CREATE POLICY "calendar_events_read" ON public.calendar_events
  FOR SELECT USING (true);

CREATE POLICY "calendar_events_insert_own" ON public.calendar_events
  FOR INSERT WITH CHECK (auth.uid() = added_by);

-- Add user_id column to performers table if it doesn't exist
ALTER TABLE public.performers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id column to venues table if it doesn't exist  
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES auth.users(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_role_links_user_id ON public.user_role_links(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_links_role_type ON public.user_role_links(role_type);
CREATE INDEX IF NOT EXISTS idx_communities_creator_id ON public.communities(creator_id);
CREATE INDEX IF NOT EXISTS idx_curated_calendars_creator_id ON public.curated_calendars(creator_id);
CREATE INDEX IF NOT EXISTS idx_performers_user_id ON public.performers(user_id);
CREATE INDEX IF NOT EXISTS idx_venues_manager_id ON public.venues(manager_id);

-- Create functions to check user permissions
CREATE OR REPLACE FUNCTION public.is_influencer(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_role_links 
    WHERE user_id = $1 AND role_type = 'influencer' AND is_verified = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_performer(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_role_links 
    WHERE user_id = $1 AND role_type = 'performer' AND is_verified = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_venue_manager(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_role_links 
    WHERE user_id = $1 AND role_type = 'venue_manager' AND is_verified = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_premium_subscription(user_id UUID, subscription_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_subscriptions us
    JOIN public.subscription_types st ON us.subscription_type_id = st.id
    WHERE us.user_id = $1 
    AND st.name = $2 
    AND us.status = 'active'
    AND us.current_period_end > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT ON public.subscription_types TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_role_links TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.communities TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.community_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.curated_calendars TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.calendar_events TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_influencer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_performer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_venue_manager(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_premium_subscription(UUID, VARCHAR) TO authenticated;
