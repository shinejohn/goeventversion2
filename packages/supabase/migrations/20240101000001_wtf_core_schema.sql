-- packages/supabase/migrations/20240101000001_wtf_core_schema.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- For geographic features

-- Communities table (extends MakerKit organizations concept)
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  
  -- Geographic data
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  default_radius_miles INTEGER DEFAULT 10,
  
  -- Community metadata
  population INTEGER,
  description TEXT,
  featured_image_url TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Stats (updated via triggers)
  total_events INTEGER DEFAULT 0,
  active_venues INTEGER DEFAULT 0,
  active_organizers INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link MakerKit organizations to communities
ALTER TABLE public.organizations 
  ADD COLUMN community_id UUID REFERENCES public.communities(id),
  ADD COLUMN organization_type TEXT DEFAULT 'basic' 
    CHECK (organization_type IN ('basic', 'venue', 'organizer', 'sponsor'));

-- User profiles extension
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  -- User preferences
  home_community_id UUID REFERENCES public.communities(id),
  favorite_communities UUID[] DEFAULT '{}',
  preferred_radius_miles INTEGER DEFAULT 10,
  
  -- User type and status
  user_type TEXT DEFAULT 'basic' 
    CHECK (user_type IN ('basic', 'premium', 'performer', 'venue_manager', 'organizer', 'admin')),
  verification_status TEXT DEFAULT 'unverified',
  
  -- Preferences
  notification_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  
  -- Stats
  events_attended INTEGER DEFAULT 0,
  events_organized INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) NOT NULL,
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  venue_type TEXT NOT NULL,
  
  -- Location
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  
  -- Capacity and features
  capacity INTEGER,
  amenities JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  
  -- Operating info
  operating_hours JSONB DEFAULT '{}',
  booking_email TEXT,
  booking_phone TEXT,
  website_url TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Stats
  total_events INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(community_id, slug)
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationships
  community_id UUID REFERENCES public.communities(id) NOT NULL,
  venue_id UUID REFERENCES public.venues(id),
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  organization_id UUID REFERENCES public.organizations(id),
  
  -- Basic info
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Scheduling
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL,
  recurrence_rule TEXT, -- iCal RRULE format
  
  -- Location (can differ from venue)
  location_name TEXT,
  location_address TEXT,
  location GEOGRAPHY(POINT, 4326),
  is_virtual BOOLEAN DEFAULT false,
  virtual_url TEXT,
  
  -- Ticketing
  requires_ticket BOOLEAN DEFAULT false,
  ticket_url TEXT,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  capacity INTEGER,
  tickets_sold INTEGER DEFAULT 0,
  
  -- Media
  featured_image_url TEXT,
  images JSONB DEFAULT '[]',
  
  -- Status
  status TEXT DEFAULT 'draft' 
    CHECK (status IN ('draft', 'published', 'cancelled', 'postponed', 'sold_out')),
  visibility TEXT DEFAULT 'public'
    CHECK (visibility IN ('public', 'private', 'community', 'unlisted')),
  
  -- SEO and discovery
  meta_description TEXT,
  external_url TEXT,
  source TEXT DEFAULT 'platform', -- platform, import, syndicated
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  interested_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  UNIQUE(community_id, slug)
);

-- Create indexes for performance
CREATE INDEX idx_events_community_date ON public.events (community_id, start_datetime);
CREATE INDEX idx_events_venue ON public.events (venue_id);
CREATE INDEX idx_events_category ON public.events (category);
CREATE INDEX idx_events_status ON public.events (status);

-- Enable Row Level Security
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (examples - expand based on requirements)
CREATE POLICY "Communities are viewable by everyone" 
  ON public.communities FOR SELECT 
  USING (true);

CREATE POLICY "Events are viewable based on visibility" 
  ON public.events FOR SELECT 
  USING (
    visibility = 'public' 
    OR (visibility = 'community' AND auth.uid() IS NOT NULL)
    OR organizer_id = auth.uid()
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();