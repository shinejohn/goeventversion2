-- Database Schema Adjustments to Match UI Requirements
-- Run these migrations to align database with Magic Patterns UI components

-- =============================================================================
-- VENUES TABLE ADJUSTMENTS
-- =============================================================================

-- Rename columns to match UI expectations
ALTER TABLE public.venues 
  RENAME COLUMN max_capacity TO capacity;

ALTER TABLE public.venues 
  RENAME COLUMN base_hourly_rate TO price_per_hour;

ALTER TABLE public.venues 
  RENAME COLUMN venue_type TO venue_type_old;

ALTER TABLE public.venues 
  ADD COLUMN venue_type text;

UPDATE public.venues 
  SET venue_type = venue_type_old::text;

ALTER TABLE public.venues 
  DROP COLUMN venue_type_old;

ALTER TABLE public.venues 
  RENAME COLUMN is_verified TO verified;

ALTER TABLE public.venues 
  RENAME COLUMN average_rating TO rating;

ALTER TABLE public.venues 
  RENAME COLUMN total_reviews TO review_count;

ALTER TABLE public.venues 
  RENAME COLUMN gallery_images TO images;

-- Add missing columns that UI expects
ALTER TABLE public.venues 
  ADD COLUMN IF NOT EXISTS response_time_hours integer DEFAULT 24;

ALTER TABLE public.venues 
  ADD COLUMN IF NOT EXISTS distance numeric(10,2);

ALTER TABLE public.venues 
  ADD COLUMN IF NOT EXISTS listed_date date DEFAULT CURRENT_DATE;

ALTER TABLE public.venues 
  ADD COLUMN IF NOT EXISTS last_booked_days_ago integer;

ALTER TABLE public.venues 
  ADD COLUMN IF NOT EXISTS unavailable_dates text[];

-- Add location object structure (for easier querying)
ALTER TABLE public.venues 
  ADD COLUMN IF NOT EXISTS neighborhood text;

-- Create a function to calculate last booked days
CREATE OR REPLACE FUNCTION update_last_booked_days() RETURNS trigger AS $$
BEGIN
  UPDATE venues 
  SET last_booked_days_ago = (
    SELECT EXTRACT(DAY FROM (NOW() - MAX(created_at)))::integer
    FROM bookings 
    WHERE venue_id = NEW.venue_id
  )
  WHERE id = NEW.venue_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venue_last_booked
AFTER INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_last_booked_days();

-- =============================================================================
-- EVENTS TABLE ADJUSTMENTS
-- =============================================================================

-- Rename columns to match UI
ALTER TABLE public.events 
  RENAME COLUMN start_datetime TO start_date;

ALTER TABLE public.events 
  RENAME COLUMN end_datetime TO end_date;

ALTER TABLE public.events 
  RENAME COLUMN featured_image_url TO image;

-- Add missing columns
ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS time text;

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS price text;

ALTER TABLE public.events 
  ADD COLUMN IF NOT EXISTS attendees integer DEFAULT 0;

-- Update time from datetime
UPDATE public.events 
  SET time = TO_CHAR(start_date, 'HH12:MI AM');

-- Create price string from min/max
UPDATE public.events 
  SET price = CASE 
    WHEN price_min = 0 THEN 'Free'
    WHEN price_min = price_max THEN '$' || price_min::text
    ELSE '$' || price_min::text || '-' || price_max::text
  END;

-- =============================================================================
-- PERFORMERS TABLE ADJUSTMENTS
-- =============================================================================

-- Rename columns to match UI
ALTER TABLE public.performers 
  RENAME COLUMN profile_image_url TO image;

ALTER TABLE public.performers 
  RENAME COLUMN review_count TO reviews;

ALTER TABLE public.performers 
  RENAME COLUMN available_for_booking TO available_for_booking_old;

ALTER TABLE public.performers 
  ADD COLUMN available_for_booking boolean DEFAULT true;

UPDATE public.performers 
  SET available_for_booking = available_for_booking_old;

ALTER TABLE public.performers 
  DROP COLUMN available_for_booking_old;

-- Add missing columns
ALTER TABLE public.performers 
  ADD COLUMN IF NOT EXISTS category text;

ALTER TABLE public.performers 
  ADD COLUMN IF NOT EXISTS location text;

ALTER TABLE public.performers 
  ADD COLUMN IF NOT EXISTS last_active timestamp DEFAULT NOW();

ALTER TABLE public.performers 
  ADD COLUMN IF NOT EXISTS response_time text DEFAULT '< 24 hours';

ALTER TABLE public.performers 
  ADD COLUMN IF NOT EXISTS booking_count integer DEFAULT 0;

ALTER TABLE public.performers 
  ADD COLUMN IF NOT EXISTS price_range text;

ALTER TABLE public.performers 
  ADD COLUMN IF NOT EXISTS upcoming_gigs jsonb DEFAULT '[]'::jsonb;

-- Update location from home_city
UPDATE public.performers 
  SET location = home_city;

-- Update price range from base_price
UPDATE public.performers 
  SET price_range = CASE 
    WHEN base_price = 0 THEN 'Contact for pricing'
    WHEN base_price < 500 THEN '$'
    WHEN base_price < 1000 THEN '$$'
    WHEN base_price < 2000 THEN '$$$'
    ELSE '$$$$'
  END;

-- Update booking count from shows_played
UPDATE public.performers 
  SET booking_count = shows_played;

-- Update category based on genres
UPDATE public.performers 
  SET category = CASE 
    WHEN 'DJ' = ANY(genres) THEN 'DJ'
    WHEN 'Rock' = ANY(genres) OR 'Pop' = ANY(genres) THEN 'Band'
    WHEN 'Jazz' = ANY(genres) OR 'Classical' = ANY(genres) THEN 'Musician'
    WHEN 'Comedy' = ANY(genres) THEN 'Comedian'
    ELSE 'Artist'
  END;

-- =============================================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_venues_location ON venues USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_venues_community ON venues (community_id);
CREATE INDEX IF NOT EXISTS idx_venues_verified ON venues (verified);
CREATE INDEX IF NOT EXISTS idx_venues_capacity ON venues (capacity);
CREATE INDEX IF NOT EXISTS idx_venues_price ON venues (price_per_hour);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON events (start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);
CREATE INDEX IF NOT EXISTS idx_events_venue ON events (venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events (status);

CREATE INDEX IF NOT EXISTS idx_performers_available ON performers (available_for_booking);
CREATE INDEX IF NOT EXISTS idx_performers_category ON performers (category);
CREATE INDEX IF NOT EXISTS idx_performers_rating ON performers (rating);

-- =============================================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for venue cards with all needed data
CREATE OR REPLACE VIEW venue_cards AS
SELECT 
  v.id,
  v.name,
  v.description,
  v.capacity,
  v.price_per_hour,
  v.address,
  v.images,
  v.amenities,
  v.rating,
  v.review_count,
  v.slug,
  v.community_id,
  v.account_id,
  v.venue_type,
  v.verified,
  v.response_time_hours,
  v.listed_date,
  v.last_booked_days_ago,
  v.unavailable_dates,
  v.city || ', ' || v.state as neighborhood,
  json_build_object(
    'address', v.address,
    'neighborhood', v.city || ', ' || v.state,
    'coordinates', json_build_object(
      'lat', v.latitude,
      'lng', v.longitude
    )
  ) as location,
  -- Calculate distance (this would need user location)
  0 as distance
FROM venues v
WHERE v.is_active = true;

-- View for event cards
CREATE OR REPLACE VIEW event_cards AS
SELECT 
  e.id,
  e.title,
  e.description,
  e.start_date,
  e.time,
  e.image,
  e.price,
  e.category,
  e.attendees,
  v.name as venue,
  v.address as venue_address
FROM events e
LEFT JOIN venues v ON e.venue_id = v.id
WHERE e.status = 'published'
  AND e.start_date >= NOW();

-- View for performer cards
CREATE OR REPLACE VIEW performer_cards AS
SELECT 
  p.id,
  p.name,
  p.image,
  p.bio,
  p.category,
  p.genres,
  p.rating,
  p.reviews,
  p.location,
  p.price_range,
  p.available_for_booking,
  p.is_verified as verified,
  p.last_active,
  p.response_time,
  p.booking_count,
  p.upcoming_gigs
FROM performers p
WHERE p.available_for_booking = true;

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

GRANT SELECT ON venue_cards TO authenticated;
GRANT SELECT ON event_cards TO authenticated;
GRANT SELECT ON performer_cards TO authenticated;