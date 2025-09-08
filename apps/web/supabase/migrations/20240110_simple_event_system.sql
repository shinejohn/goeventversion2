-- Simple Event System without account dependencies
-- This creates the core tables needed for the event platform to work

-- =====================================================
-- PERFORMERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS performers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stage_name VARCHAR(255),
  bio TEXT,
  genre VARCHAR(100),
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VENUES TABLE  
-- =====================================================
CREATE TABLE IF NOT EXISTS venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  capacity INT,
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  category VARCHAR(100),
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  performer_id UUID REFERENCES performers(id) ON DELETE SET NULL,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'published',
  price DECIMAL(10,2),
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  city VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create computed column for UI compatibility
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE 
  GENERATED ALWAYS AS (start_datetime) STORED;

-- =====================================================
-- Enable RLS with public read access
-- =====================================================
ALTER TABLE performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read published data
CREATE POLICY "Public read access" ON performers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON venues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (status = 'published');

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_events_start_datetime ON events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues(slug);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);