-- UI-Driven Database Migration
-- This migration aligns the database schema with Magic Patterns UI component expectations
-- The UI drives the database structure, not the other way around!

-- =============================================================================
-- VENUES TABLE - Match VenueDetailPage expectations
-- =============================================================================

-- The VenueDetailPage expects these fields:
-- venue.images (array), venue.location.address, venue.location.coordinates.lat/lng
-- venue.verified, venue.reviewCount, venue.rating, venue.amenities (array)
-- venue.description, venue.venueType, venue.capacity, venue.priceRange

-- Add images array column
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT ARRAY[]::text[];

-- Sync images from existing data
UPDATE public.venues 
SET images = CASE 
  WHEN gallery_images IS NOT NULL AND jsonb_array_length(gallery_images) > 0 
  THEN ARRAY(SELECT jsonb_array_elements_text(gallery_images))
  WHEN image_url IS NOT NULL 
  THEN ARRAY[image_url]
  ELSE ARRAY['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80']
END
WHERE images IS NULL OR array_length(images, 1) = 0;

-- Add location JSONB to match UI structure
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS location jsonb;

UPDATE public.venues
SET location = jsonb_build_object(
  'address', COALESCE(address, 'Address not available'),
  'coordinates', jsonb_build_object(
    'lat', COALESCE(latitude, 40.7128),  -- Default to NYC if no coords
    'lng', COALESCE(longitude, -74.0060)
  )
);

-- Rename columns to match UI expectations
ALTER TABLE public.venues 
RENAME COLUMN is_verified TO verified;

ALTER TABLE public.venues 
RENAME COLUMN max_capacity TO capacity;

-- Add missing columns
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS rating decimal(3,1) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS reviewCount integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS priceRange integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS venueType text;

-- Set venueType from venue_type enum
UPDATE public.venues
SET venueType = CASE venue_type
  WHEN 'indoor' THEN 'Indoor Venue'
  WHEN 'outdoor' THEN 'Outdoor Venue'
  WHEN 'hybrid' THEN 'Hybrid Indoor/Outdoor'
  WHEN 'virtual' THEN 'Virtual Venue'
  WHEN 'mobile' THEN 'Mobile Venue'
  ELSE 'Multi-Purpose Venue'
END
WHERE venueType IS NULL;

-- Convert amenities JSONB to text array for UI
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS amenities_array text[];

UPDATE public.venues
SET amenities_array = ARRAY[
  'Sound System',
  'Lighting Equipment',
  'Parking Available',
  'Catering Services',
  'Wi-Fi',
  'Air Conditioning',
  'Stage',
  'Bar Service',
  'Wheelchair Accessible',
  'Security',
  'Coat Check',
  'VIP Areas',
  'Outdoor Space',
  'Kitchen Facilities',
  'Projector & Screen'
]
WHERE amenities_array IS NULL;

-- Ensure all venues have a description
UPDATE public.venues
SET description = 
  'A ' || LOWER(venue_type::text) || ' venue with a capacity of ' || max_capacity || 
  ' guests. Perfect for concerts, corporate events, private parties, and special occasions. ' ||
  'Located in ' || city || ', ' || COALESCE(state, country) || '.'
WHERE description IS NULL OR description = '';

-- =============================================================================
-- EVENTS TABLE - Match event card and detail page expectations
-- =============================================================================

-- The event components expect:
-- event.date, event.time, event.image, event.venue.name, event.price, event.attendees

ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS date date,
ADD COLUMN IF NOT EXISTS time text,
ADD COLUMN IF NOT EXISTS image text,
ADD COLUMN IF NOT EXISTS price text,
ADD COLUMN IF NOT EXISTS attendees integer DEFAULT 0;

-- Populate from existing data
UPDATE public.events
SET 
  date = start_date::date,
  time = TO_CHAR(start_date::time, 'HH12:MI AM'),
  image = COALESCE(image_url, 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  price = CASE 
    WHEN base_price = 0 THEN 'Free'
    WHEN base_price < 50 THEN '$' || base_price::text
    ELSE '$' || base_price::text || '+'
  END
WHERE date IS NULL;

-- =============================================================================
-- PERFORMERS TABLE - Match performer profile expectations
-- =============================================================================

-- The PerformerProfilePage expects:
-- performer.name, performer.image, performer.bio, performer.genre, performer.location
-- performer.rating, performer.totalReviews, performer.price, performer.nextPerformance

ALTER TABLE public.performers 
RENAME COLUMN stage_name TO name;

ALTER TABLE public.performers 
RENAME COLUMN profile_image_url TO image;

ALTER TABLE public.performers 
ADD COLUMN IF NOT EXISTS genre text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS rating decimal(3,1) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS totalReviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS price text,
ADD COLUMN IF NOT EXISTS nextPerformance timestamp;

-- Set default image if null
UPDATE public.performers
SET image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
WHERE image IS NULL OR image = '';

-- Extract primary genre from genres array
UPDATE public.performers
SET genre = COALESCE(genres[1], 'Variety')
WHERE genre IS NULL;

-- Set location (assuming we need to add a city field or use a default)
UPDATE public.performers
SET location = 'Los Angeles, CA'
WHERE location IS NULL;

-- Format price from base_rate
UPDATE public.performers
SET price = CASE 
  WHEN base_rate = 0 THEN 'Contact for pricing'
  WHEN base_rate < 500 THEN 'Starting at $' || base_rate::text
  ELSE '$' || base_rate::text || '/show'
END
WHERE price IS NULL;

-- Add a default bio if missing
UPDATE public.performers
SET bio = 
  'Professional ' || LOWER(COALESCE(category::text, 'performer')) || 
  ' specializing in ' || COALESCE(genres[1], 'live entertainment') || 
  '. Available for bookings at venues and private events.'
WHERE bio IS NULL OR bio = '';

-- Set next performance to a future date for demo
UPDATE public.performers
SET nextPerformance = NOW() + INTERVAL '7 days'
WHERE nextPerformance IS NULL AND is_available = true;

-- =============================================================================
-- REVIEWS TABLE - Support rating calculations
-- =============================================================================

-- Create function to update ratings when reviews change
CREATE OR REPLACE FUNCTION update_entity_ratings()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating decimal(3,1);
  total_reviews integer;
BEGIN
  -- Handle different entity types
  IF (TG_OP = 'DELETE') THEN
    -- Use OLD for DELETE operations
    IF OLD.entity_type = 'venue' THEN
      SELECT COALESCE(AVG(rating), 0), COUNT(*)
      INTO avg_rating, total_reviews
      FROM public.reviews
      WHERE entity_type = 'venue' AND entity_id = OLD.entity_id;
      
      UPDATE public.venues
      SET rating = avg_rating, reviewCount = total_reviews
      WHERE id = OLD.entity_id;
      
    ELSIF OLD.entity_type = 'performer' THEN
      SELECT COALESCE(AVG(rating), 0), COUNT(*)
      INTO avg_rating, total_reviews
      FROM public.reviews
      WHERE entity_type = 'performer' AND entity_id = OLD.entity_id;
      
      UPDATE public.performers
      SET rating = avg_rating, totalReviews = total_reviews
      WHERE id = OLD.entity_id;
    END IF;
  ELSE
    -- Use NEW for INSERT and UPDATE
    IF NEW.entity_type = 'venue' THEN
      SELECT COALESCE(AVG(rating), 0), COUNT(*)
      INTO avg_rating, total_reviews
      FROM public.reviews
      WHERE entity_type = 'venue' AND entity_id = NEW.entity_id;
      
      UPDATE public.venues
      SET rating = avg_rating, reviewCount = total_reviews
      WHERE id = NEW.entity_id;
      
    ELSIF NEW.entity_type = 'performer' THEN
      SELECT COALESCE(AVG(rating), 0), COUNT(*)
      INTO avg_rating, total_reviews
      FROM public.reviews
      WHERE entity_type = 'performer' AND entity_id = NEW.entity_id;
      
      UPDATE public.performers
      SET rating = avg_rating, totalReviews = total_reviews
      WHERE id = NEW.entity_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS update_ratings_on_review_change ON public.reviews;
CREATE TRIGGER update_ratings_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_entity_ratings();

-- =============================================================================
-- SAMPLE REVIEWS for demo purposes
-- =============================================================================

-- Add some sample reviews for venues to populate ratings
INSERT INTO public.reviews (account_id, entity_type, entity_id, rating, title, content, created_by)
SELECT 
  account_id,
  'venue',
  id,
  (4 + random())::numeric(3,1), -- Random rating between 4.0 and 5.0
  'Great venue!',
  'Amazing space for events. The staff was helpful and the facilities were top-notch.',
  account_id
FROM public.venues
WHERE NOT EXISTS (
  SELECT 1 FROM public.reviews 
  WHERE entity_type = 'venue' AND entity_id = venues.id
)
LIMIT 10;

-- Add some sample reviews for performers
INSERT INTO public.reviews (account_id, entity_type, entity_id, rating, title, content, created_by)
SELECT 
  account_id,
  'performer',
  id,
  (4 + random())::numeric(3,1), -- Random rating between 4.0 and 5.0
  'Fantastic performance!',
  'Incredible talent and professionalism. The audience loved every minute of the show.',
  account_id
FROM public.performers
WHERE NOT EXISTS (
  SELECT 1 FROM public.reviews 
  WHERE entity_type = 'performer' AND entity_id = performers.id
)
LIMIT 10;

-- =============================================================================
-- FINAL CLEANUP AND INDEXES
-- =============================================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_venues_rating ON public.venues(rating DESC);
CREATE INDEX IF NOT EXISTS idx_venues_location_gin ON public.venues USING gin(location);
CREATE INDEX IF NOT EXISTS idx_performers_rating ON public.performers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_entity ON public.reviews(entity_type, entity_id);

-- Ensure all required fields have sensible defaults
UPDATE public.venues SET images = ARRAY['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'] WHERE images IS NULL OR array_length(images, 1) = 0;
UPDATE public.performers SET image = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f' WHERE image IS NULL OR image = '';
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14' WHERE image IS NULL OR image = '';