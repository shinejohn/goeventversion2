-- SCHEMA FIXES ONLY
-- Run this first to fix the database schema

BEGIN;

-- Create community_hubs table first (required for foreign keys)
CREATE TABLE IF NOT EXISTS public.community_hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to venues table
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS max_capacity INTEGER;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS contact_email VARCHAR(320);

-- Add missing columns to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue_id UUID;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Fix performers table - add stage_name column
ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS stage_name VARCHAR(255);

COMMIT;