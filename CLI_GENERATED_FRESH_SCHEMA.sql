-- CLI GENERATED FRESH SCHEMA
-- Generated using Claude Code CLI commands
-- Fresh database schema for WTF (When The Fun) platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Clean slate - Basic WTF platform schema
-- Generated fresh without relying on existing files

-- Communities table (core geographic entity)
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES public.communities(id) NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  venue_type TEXT NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  capacity INTEGER,
  amenities JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  operating_hours JSONB DEFAULT '{}',
  booking_email TEXT,
  booking_phone TEXT,
  website_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, slug)
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID REFERENCES public.communities(id) NOT NULL,
  venue_id UUID REFERENCES public.venues(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL,
  location_name TEXT,
  location_address TEXT,
  location GEOGRAPHY(POINT, 4326),
  featured_image_url TEXT,
  images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'published',
  visibility TEXT DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, slug)
);

-- Performers table
CREATE TABLE IF NOT EXISTS public.performers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_name TEXT NOT NULL,
  real_name TEXT,
  bio TEXT,
  category TEXT DEFAULT 'other',
  genres TEXT[],
  profile_image_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  base_rate DECIMAL(10,2) DEFAULT 0,
  booking_email TEXT,
  booking_phone TEXT,
  website_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_venues_community ON public.venues (community_id);
CREATE INDEX idx_events_community ON public.events (community_id);
CREATE INDEX idx_events_venue ON public.events (venue_id);
CREATE INDEX idx_events_datetime ON public.events (start_datetime);

-- Enable Row Level Security
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (public read access)
CREATE POLICY "communities_public_read" ON public.communities FOR SELECT USING (true);
CREATE POLICY "venues_public_read" ON public.venues FOR SELECT USING (true);
CREATE POLICY "events_public_read" ON public.events FOR SELECT USING (true);
CREATE POLICY "performers_public_read" ON public.performers FOR SELECT USING (true);

-- Insert sample community for testing
INSERT INTO public.communities (id, name, slug, location, city, state, country, timezone, description) VALUES 
('00000000-0000-0000-0000-000000000001', 'NYC Default', 'nyc-default', ST_GeomFromText('POINT(-74.0059 40.7128)', 4326), 'New York', 'NY', 'US', 'America/New_York', 'Default NYC community for testing')
ON CONFLICT (id) DO NOTHING;

COMMENT ON SCHEMA public IS 'CLI Generated Fresh Schema for WTF Platform';