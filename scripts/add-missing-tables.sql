-- Add Missing Tables for Event Series, Sponsors, and Tickets
-- Run this in Supabase SQL Editor

-- =====================================================
-- SPONSORS & ORGANIZERS TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns to events
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES sponsors(id),
  ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES organizers(id);

-- Enable RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access" ON sponsors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON organizers FOR SELECT TO authenticated USING (true);

-- =====================================================
-- EVENT SERIES TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS event_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  series_type VARCHAR(100),
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(100),
  logo_url TEXT,
  banner_image_url TEXT,
  website_url TEXT,
  sponsor_id UUID REFERENCES sponsors(id),
  organizer_id UUID REFERENCES organizers(id),
  primary_venue_id UUID REFERENCES venues(id),
  total_events INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add series relationship to events
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES event_series(id),
  ADD COLUMN IF NOT EXISTS series_order INTEGER,
  ADD COLUMN IF NOT EXISTS series_day INTEGER;

-- Enable RLS
ALTER TABLE event_series ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Public read access" ON event_series FOR SELECT TO authenticated USING (is_active = true);

-- =====================================================
-- TICKET TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  series_id UUID REFERENCES event_series(id),
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  early_bird_price DECIMAL(10, 2),
  early_bird_deadline TIMESTAMP WITH TIME ZONE,
  max_quantity INTEGER,
  available_quantity INTEGER,
  min_purchase INTEGER DEFAULT 1,
  max_purchase INTEGER,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  benefits TEXT[],
  restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT ticket_type_scope CHECK (
    (event_id IS NOT NULL AND series_id IS NULL) OR 
    (event_id IS NULL AND series_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Public read ticket types" ON ticket_types 
  FOR SELECT TO authenticated USING (is_active = true);

-- =====================================================
-- MEETING TABLES
-- =====================================================

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_meeting BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS meeting_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS requires_rsvp BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rsvp_deadline TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- EVENT ACTIVITIES
-- =====================================================

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS has_multiple_stages BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_activities BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS event_layout_url TEXT,
  ADD COLUMN IF NOT EXISTS parking_info TEXT,
  ADD COLUMN IF NOT EXISTS admission_info TEXT;

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_events_sponsor_id ON events(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_series_id ON events(series_id);
CREATE INDEX IF NOT EXISTS idx_event_series_type ON event_series(series_type);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_series ON ticket_types(series_id);