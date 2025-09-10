-- Migration: Add missing fields identified from UI requirements
-- Date: 2025-01-10
-- Description: Adds fields that UI components expect but don't exist in production database

-- =====================================================
-- PRIORITY 1: Essential Missing Fields (Core Functionality)
-- =====================================================

-- Events table: Add location and ticketing fields
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS ticket_url TEXT,
ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES public.event_series(id) ON DELETE SET NULL;

-- Create index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Venues table: Add essential booking and location fields
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS parking_info JSONB DEFAULT '{"type": "street", "capacity": 0, "cost": "Free", "distance": "Adjacent"}',
ADD COLUMN IF NOT EXISTS transit_options JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS nearby_amenities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS minimum_booking_hours INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS deposit_percentage INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'Standard',
ADD COLUMN IF NOT EXISTS insurance_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS security_deposit DECIMAL(10, 2) DEFAULT 0;

-- Create index for venue geospatial queries
CREATE INDEX IF NOT EXISTS idx_venues_location ON public.venues(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Performers table: Add essential booking fields
ALTER TABLE public.performers
ADD COLUMN IF NOT EXISTS technical_requirements TEXT,
ADD COLUMN IF NOT EXISTS media_gallery JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS min_booking_hours INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_travel_distance INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS setup_time_required INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS equipment_provided BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS insurance_coverage BOOLEAN DEFAULT false;

-- Bookings table: Add check-in tracking
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS seat_numbers JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS ticket_tier TEXT,
ADD COLUMN IF NOT EXISTS special_instructions TEXT;

-- =====================================================
-- PRIORITY 2: Enhanced Features (Better UX)
-- =====================================================

-- Venues table: Add enhanced venue information
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT,
ADD COLUMN IF NOT EXISTS rules_and_restrictions TEXT,
ADD COLUMN IF NOT EXISTS blackout_dates DATE[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS minimum_notice_hours INTEGER DEFAULT 48,
ADD COLUMN IF NOT EXISTS rentable_amenities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS seated_capacity INTEGER,
ADD COLUMN IF NOT EXISTS cocktail_capacity INTEGER;

-- Add computed columns for capacity variations
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS standing_capacity INTEGER GENERATED ALWAYS AS (max_capacity) STORED,
ADD COLUMN IF NOT EXISTS seated_capacity_calc INTEGER GENERATED ALWAYS AS (FLOOR(max_capacity * 0.7)) STORED,
ADD COLUMN IF NOT EXISTS cocktail_capacity_calc INTEGER GENERATED ALWAYS AS (FLOOR(max_capacity * 0.8)) STORED;

-- =====================================================
-- PRIORITY 3: Calendar and Recurring Events Support
-- =====================================================

-- Create event_series table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.event_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table: Add calendar-specific fields
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS recurring_pattern JSONB,
ADD COLUMN IF NOT EXISTS recurring_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS reminder_settings JSONB DEFAULT '{}';

-- =====================================================
-- PRIORITY 4: Analytics Fields (Calculated)
-- =====================================================

-- Create functions for calculated analytics

-- Function to calculate venue occupancy rate
CREATE OR REPLACE FUNCTION public.calculate_venue_occupancy_rate(venue_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_hours DECIMAL;
    booked_hours DECIMAL;
BEGIN
    -- Calculate total available hours in the last 30 days (8 hours per day)
    total_hours := 30 * 8;
    
    -- Calculate actual booked hours
    SELECT COALESCE(SUM(
        EXTRACT(EPOCH FROM (end_datetime - start_datetime)) / 3600
    ), 0) INTO booked_hours
    FROM public.events
    WHERE venue_id = $1
    AND start_datetime >= NOW() - INTERVAL '30 days'
    AND status = 'completed';
    
    IF total_hours = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((booked_hours / total_hours) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate repeat booking rate
CREATE OR REPLACE FUNCTION public.calculate_repeat_booking_rate(entity_id UUID, entity_type TEXT)
RETURNS DECIMAL AS $$
DECLARE
    total_customers INTEGER;
    repeat_customers INTEGER;
BEGIN
    IF entity_type = 'venue' THEN
        SELECT COUNT(DISTINCT account_id) INTO total_customers
        FROM public.bookings b
        JOIN public.events e ON b.event_id = e.id
        WHERE e.venue_id = entity_id;
        
        SELECT COUNT(DISTINCT account_id) INTO repeat_customers
        FROM public.bookings b
        JOIN public.events e ON b.event_id = e.id
        WHERE e.venue_id = entity_id
        GROUP BY account_id
        HAVING COUNT(*) > 1;
    ELSIF entity_type = 'performer' THEN
        SELECT COUNT(DISTINCT b.account_id) INTO total_customers
        FROM public.bookings b
        JOIN public.event_performers ep ON b.event_id = ep.event_id
        WHERE ep.performer_id = entity_id;
        
        SELECT COUNT(DISTINCT b.account_id) INTO repeat_customers
        FROM public.bookings b
        JOIN public.event_performers ep ON b.event_id = ep.event_id
        WHERE ep.performer_id = entity_id
        GROUP BY b.account_id
        HAVING COUNT(*) > 1;
    END IF;
    
    IF total_customers = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND((repeat_customers::DECIMAL / total_customers) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PRIORITY 5: Communities/Hubs Table (If Needed)
-- =====================================================

-- Create communities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    image_url TEXT,
    location TEXT,
    category TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy for communities
CREATE POLICY "Communities are viewable by everyone" ON public.communities
    FOR SELECT USING (true);

-- =====================================================
-- PERFORMER REVIEWS TABLE (Better than JSON)
-- =====================================================

-- Create performer_reviews table for better querying
CREATE TABLE IF NOT EXISTS public.performer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performer_id UUID REFERENCES public.performers(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    reviewer_name TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performer reviews
CREATE INDEX IF NOT EXISTS idx_performer_reviews_performer ON public.performer_reviews(performer_id);
CREATE INDEX IF NOT EXISTS idx_performer_reviews_rating ON public.performer_reviews(rating);

-- Enable RLS on performer_reviews
ALTER TABLE public.performer_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for performer_reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.performer_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for events they booked" ON public.performer_reviews
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE bookings.account_id = auth.uid()
            AND bookings.event_id = performer_reviews.event_id
        )
    );

-- =====================================================
-- VENUE REVIEWS TABLE (Similar structure)
-- =====================================================

-- Create venue_reviews table if referenced
CREATE TABLE IF NOT EXISTS public.venue_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    reviewer_name TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for venue reviews
CREATE INDEX IF NOT EXISTS idx_venue_reviews_venue ON public.venue_reviews(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_reviews_rating ON public.venue_reviews(rating);

-- Enable RLS on venue_reviews
ALTER TABLE public.venue_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for venue_reviews
CREATE POLICY "Venue reviews are viewable by everyone" ON public.venue_reviews
    FOR SELECT USING (true);

-- =====================================================
-- HELPER FUNCTIONS FOR LOCATION DATA
-- =====================================================

-- Function to extract latitude/longitude from location_data JSONB
CREATE OR REPLACE FUNCTION public.update_venue_coordinates()
RETURNS void AS $$
BEGIN
    UPDATE public.venues
    SET 
        latitude = (location_data->>'lat')::DECIMAL(10, 8),
        longitude = (location_data->>'lng')::DECIMAL(11, 8)
    WHERE 
        location_data IS NOT NULL 
        AND location_data->>'lat' IS NOT NULL 
        AND location_data->>'lng' IS NOT NULL
        AND latitude IS NULL
        AND longitude IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Run the function to populate coordinates from existing data
SELECT public.update_venue_coordinates();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

-- Add comments to new columns
COMMENT ON COLUMN public.events.latitude IS 'Event location latitude for mapping';
COMMENT ON COLUMN public.events.longitude IS 'Event location longitude for mapping';
COMMENT ON COLUMN public.events.ticket_url IS 'External URL for ticket purchases';
COMMENT ON COLUMN public.events.highlights IS 'Array of event highlights or features';
COMMENT ON COLUMN public.events.series_id IS 'Reference to event series for recurring events';

COMMENT ON COLUMN public.venues.parking_info IS 'JSON object with parking details: type, capacity, cost, distance';
COMMENT ON COLUMN public.venues.transit_options IS 'JSON array of nearby public transit options';
COMMENT ON COLUMN public.venues.minimum_booking_hours IS 'Minimum hours required for booking';
COMMENT ON COLUMN public.venues.deposit_percentage IS 'Percentage of total cost required as deposit';

COMMENT ON COLUMN public.performers.technical_requirements IS 'Technical setup requirements for performances';
COMMENT ON COLUMN public.performers.media_gallery IS 'JSON array of media items (photos, videos, audio samples)';
COMMENT ON COLUMN public.performers.availability IS 'JSON object with availability schedule';

-- =====================================================
-- FINAL NOTES
-- =====================================================

-- This migration adds all missing fields identified in the UI
-- Fields are organized by priority for implementation
-- Calculated fields use functions instead of storing redundant data
-- JSON/JSONB is used for flexible, structured data
-- Proper indexes are created for performance
-- RLS policies are included where appropriate