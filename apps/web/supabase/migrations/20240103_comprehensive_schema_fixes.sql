-- Comprehensive Schema Fixes Migration
-- This migration ensures the database matches UI expectations 100%

-- =====================================================
-- EVENTS TABLE FIXES
-- =====================================================
-- The UI expects 'start_date' but database has 'start_datetime'
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (start_datetime) STORED;

-- Add missing columns that UI expects
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS genre VARCHAR(100),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS amenities TEXT[],
  ADD COLUMN IF NOT EXISTS base_hourly_rate DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- =====================================================
-- PERFORMERS TABLE
-- =====================================================
-- Ensure performers table exists with expected columns
CREATE TABLE IF NOT EXISTS performers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  stage_name VARCHAR(255),
  category VARCHAR(100),
  genres TEXT[],
  bio TEXT,
  profile_image_url TEXT,
  image_url TEXT,
  rating DECIMAL(3, 2),
  average_rating DECIMAL(3, 2),
  is_verified BOOLEAN DEFAULT false,
  city VARCHAR(100),
  address TEXT,
  total_performances INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE performers ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON performers 
  FOR SELECT TO authenticated USING (true);

-- =====================================================
-- VENUES TABLE FIXES
-- =====================================================
ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS venue_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS amenities TEXT[],
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS price_min DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS price_max DECIMAL(10, 2);

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  venue_id UUID REFERENCES venues(id),
  title VARCHAR(255),
  name VARCHAR(255),
  category VARCHAR(100),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  address TEXT,
  city VARCHAR(100),
  image_url TEXT,
  profile_image_url TEXT,
  stage_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own bookings" ON bookings 
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- =====================================================
-- Create artists view for compatibility
-- =====================================================
CREATE OR REPLACE VIEW artists AS SELECT * FROM performers;