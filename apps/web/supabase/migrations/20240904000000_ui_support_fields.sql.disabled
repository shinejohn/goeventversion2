-- Migration to add UI support fields for main pages
-- This adds missing fields that the UI components expect

BEGIN;

-- ==========================================
-- EVENTS TABLE UPDATES
-- ==========================================
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS amenities jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS lineup jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS ticket_info jsonb DEFAULT '{}';

-- Update existing events with default amenities
UPDATE public.events 
SET amenities = '{"parking": true, "restrooms": true, "food_vendors": true, "merchandise": true, "accessibility": true}'
WHERE amenities = '{}' OR amenities IS NULL;

-- ==========================================
-- VENUES TABLE UPDATES  
-- ==========================================
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rating decimal(2,1) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_range integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS venue_type varchar(100),
ADD COLUMN IF NOT EXISTS max_capacity integer,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS amenities jsonb DEFAULT '{}';

-- Update existing venues with default values
UPDATE public.venues 
SET 
  rating = COALESCE(rating, 4.5),
  review_count = COALESCE(review_count, 0),
  price_range = COALESCE(price_range, 2),
  venue_type = COALESCE(venue_type, 'Entertainment Venue'),
  max_capacity = COALESCE(max_capacity, 500),
  is_verified = COALESCE(is_verified, false),
  amenities = CASE 
    WHEN amenities = '{}' OR amenities IS NULL 
    THEN '{"sound_system": true, "lighting": true, "parking": true, "wifi": true, "air_conditioning": true, "restrooms": true}'
    ELSE amenities
  END;

-- ==========================================
-- PERFORMERS TABLE UPDATES
-- ==========================================
ALTER TABLE public.performers
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS next_performance timestamp with time zone,
ADD COLUMN IF NOT EXISTS price varchar(100);

-- Update existing performers with defaults
UPDATE public.performers 
SET 
  total_reviews = COALESCE(total_reviews, 0),
  price = COALESCE(price, 'Contact for pricing');

-- ==========================================
-- EVENT-PERFORMER RELATIONSHIP TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.event_performers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  performer_id uuid REFERENCES public.performers(id) ON DELETE CASCADE,
  role varchar(100) DEFAULT 'performer', -- 'headliner', 'opener', 'featured', 'performer'
  billing_order integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(event_id, performer_id)
);

-- Enable RLS
ALTER TABLE public.event_performers ENABLE ROW LEVEL SECURITY;

-- RLS Policy for event_performers
CREATE POLICY "event_performers_read" ON public.event_performers 
FOR SELECT TO authenticated 
USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_performers TO authenticated, service_role;

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_event_performers_event_id ON public.event_performers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_performers_performer_id ON public.event_performers(performer_id);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON public.venues(rating);
CREATE INDEX IF NOT EXISTS idx_venues_venue_type ON public.venues(venue_type);

COMMIT;