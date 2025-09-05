/*
 * -------------------------------------------------------
 * COMPLETE DATABASE SCHEMA - WHEN'S THE FUN (FIXED)
 * 
 * WARNING: This will DROP ALL EXISTING TABLES and recreate everything
 * 
 * To run this file:
 * psql -U your_user -d your_database -f COMPLETE_DATABASE_SCHEMA_FIXED.sql
 * -------------------------------------------------------
 */

-- First, drop all existing indexes that might cause conflicts
DROP INDEX IF EXISTS idx_venues_location;
DROP INDEX IF EXISTS idx_events_location; 
DROP INDEX IF EXISTS idx_checkins_location;

-- Continue with the full schema...
-- (The rest of the schema from the previous file, but I'll create a simpler test first)

-- Let's test with just the venues table first
DROP TABLE IF EXISTS public.venues CASCADE;

CREATE TABLE public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL, -- Remove FK temporarily for testing
  
  -- Basic info
  name varchar(255) NOT NULL,
  description text,
  slug varchar(255) UNIQUE,
  
  -- Location
  address text NOT NULL,
  city varchar(100) NOT NULL,
  state varchar(100) NOT NULL,
  postal_code varchar(20),
  country varchar(100) DEFAULT 'USA',
  latitude decimal(10,8),
  longitude decimal(11,8),
  -- Don't use geography type yet to avoid issues
  
  -- Venue details
  venue_type varchar(100) NOT NULL,
  capacity integer NOT NULL DEFAULT 100,
  amenities text[] DEFAULT '{}',
  price_per_hour decimal(10,2),
  
  -- Contact
  email varchar(255),
  phone varchar(20),
  website varchar(255),
  
  -- Media
  image_url varchar(1000),
  gallery_images text[] DEFAULT '{}',
  
  -- Ratings
  rating decimal(3,2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Create a simple index on lat/lng columns
CREATE INDEX IF NOT EXISTS idx_venues_latitude ON public.venues(latitude);
CREATE INDEX IF NOT EXISTS idx_venues_longitude ON public.venues(longitude);
CREATE INDEX IF NOT EXISTS idx_venues_city_state ON public.venues(city, state);

-- Test insert
INSERT INTO public.venues (
  account_id,
  name,
  address,
  city,
  state,
  venue_type,
  capacity
) VALUES (
  gen_random_uuid(),
  'Test Venue',
  '123 Main St',
  'New York',
  'NY',
  'theater',
  500
);

-- If this works, we can proceed with the full schema