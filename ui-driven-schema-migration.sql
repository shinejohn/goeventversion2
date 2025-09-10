-- UI-Driven Database Schema Migration
-- Add all missing fields that Magic Patterns UI components expect

-- =============================================================================
-- EVENTS TABLE - Add missing UI-required fields
-- =============================================================================

-- Add missing columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_min DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS price_max DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS current_attendees INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS location_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS highlights TEXT[],
ADD COLUMN IF NOT EXISTS location JSONB DEFAULT '{}'::jsonb;

-- =============================================================================
-- VENUES TABLE - Add missing UI-required fields
-- =============================================================================

-- Add missing columns to venues table
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS venue_type VARCHAR(50) DEFAULT 'indoor',
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS total_events INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
ADD COLUMN IF NOT EXISTS pricePerHour DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS operating_hours JSONB DEFAULT '{}'::jsonb;

-- =============================================================================
-- PERFORMERS TABLE - Add missing UI-required fields
-- =============================================================================

-- Add missing columns to performers table
ALTER TABLE public.performers 
ADD COLUMN IF NOT EXISTS stage_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS genres TEXT[],
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS home_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shows_played INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS years_active INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]'::jsonb;

-- =============================================================================
-- EVENT_PERFORMERS TABLE - Create if not exists
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.event_performers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  performer_id UUID REFERENCES public.performers(id) ON DELETE CASCADE,
  role VARCHAR(100),
  performance_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, performer_id)
);

-- =============================================================================
-- BOOKINGS TABLE - Add missing UI-required fields
-- =============================================================================

-- Add missing columns to bookings table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
    ALTER TABLE public.bookings 
    ADD COLUMN IF NOT EXISTS event_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS event_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS event_time VARCHAR(10),
    ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS venue_address TEXT,
    ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS notes TEXT;
  END IF;
END $$;

-- =============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON public.events(venue_id);

-- Venues indexes
CREATE INDEX IF NOT EXISTS idx_venues_city ON public.venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_venue_type ON public.venues(venue_type);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON public.venues(rating);

-- Performers indexes
CREATE INDEX IF NOT EXISTS idx_performers_category ON public.performers(category);
CREATE INDEX IF NOT EXISTS idx_performers_rating ON public.performers(rating);
CREATE INDEX IF NOT EXISTS idx_performers_verified ON public.performers(verified);

-- Event performers indexes
CREATE INDEX IF NOT EXISTS idx_event_performers_event_id ON public.event_performers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_performers_performer_id ON public.event_performers(performer_id);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE public.event_performers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event_performers
CREATE POLICY "event_performers_read" ON public.event_performers FOR SELECT
  TO authenticated USING (
    event_id IN (
      SELECT id FROM public.events 
      WHERE account_id = (SELECT auth.uid()) 
      OR account_id IN (
        SELECT account_id FROM public.accounts_memberships 
        WHERE user_id = (SELECT auth.uid())
      )
    )
  );

-- =============================================================================
-- UPDATE EXISTING DATA WITH DEFAULTS
-- =============================================================================

-- Update events with default values for new columns
UPDATE public.events SET
  ticket_price = COALESCE(ticket_price, 25.00),
  price_min = COALESCE(price_min, 10.00),
  price_max = COALESCE(price_max, 100.00),
  current_attendees = COALESCE(current_attendees, 0),
  is_free = COALESCE(is_free, false),
  location_name = COALESCE(location_name, 'TBA'),
  address = COALESCE(address, 'Address TBA'),
  state = COALESCE(state, 'NY'),
  postal_code = COALESCE(postal_code, '10001'),
  requirements = COALESCE(requirements, 'Valid ID required'),
  highlights = COALESCE(highlights, ARRAY['Live Performance', 'Food & Drinks', 'Networking'])
WHERE ticket_price IS NULL;

-- Update venues with default values for new columns
UPDATE public.venues SET
  description = COALESCE(description, 'Beautiful venue perfect for your event'),
  venue_type = COALESCE(venue_type, 'indoor'),
  state = COALESCE(state, 'NY'),
  country = COALESCE(country, 'USA'),
  postal_code = COALESCE(postal_code, '10001'),
  rating = COALESCE(rating, 4.5),
  total_events = COALESCE(total_events, 0),
  is_verified = COALESCE(is_verified, false),
  is_active = COALESCE(is_active, true),
  contact_email = COALESCE(contact_email, 'info@venue.com'),
  contact_phone = COALESCE(contact_phone, '+1-555-0000'),
  slug = COALESCE(slug, LOWER(REPLACE(name, ' ', '-'))),
  pricePerHour = COALESCE(pricePerHour, 200.00)
WHERE description IS NULL;

-- Update performers with default values for new columns
UPDATE public.performers SET
  stage_name = COALESCE(stage_name, name),
  category = COALESCE(category, 'Musician'),
  genres = COALESCE(genres, ARRAY['Music']),
  bio = COALESCE(bio, 'Professional performer with years of experience'),
  rating = COALESCE(rating, 4.0),
  total_reviews = COALESCE(total_reviews, 0),
  base_price = COALESCE(base_price, 300.00),
  home_city = COALESCE(home_city, 'New York'),
  location = COALESCE(location, 'New York, NY'),
  verified = COALESCE(verified, false),
  shows_played = COALESCE(shows_played, 0),
  years_active = COALESCE(years_active, 0),
  response_time = COALESCE(response_time, '24 hours')
WHERE stage_name IS NULL;

COMMIT;
