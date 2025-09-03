-- DATABASE SCHEMA UPDATE SCRIPT
-- Copy paste this entire script into Supabase SQL Editor

-- 1. ADD MISSING COLUMNS TO VENUES TABLE
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS max_capacity INTEGER;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS contact_email VARCHAR(320);
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS account_id UUID;

-- 2. ADD MISSING COLUMNS TO EVENTS TABLE  
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS venue_id UUID;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS account_id UUID;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- 3. PERFORMERS TABLE ALREADY HAS MOST NEEDED COLUMNS
-- Add account_id if missing
ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS account_id UUID;
-- Add stage_name as alias for name if app expects it
ALTER TABLE public.performers ADD COLUMN IF NOT EXISTS stage_name VARCHAR(255);

-- 4. CREATE COMMUNITY_HUBS TABLE (referenced by community_id in venues/events)
CREATE TABLE IF NOT EXISTS public.community_hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INSERT DEFAULT COMMUNITY FOR TESTING
INSERT INTO public.community_hubs (id, name, description, slug) VALUES 
('00000000-0000-0000-0000-000000000001', 'Default Community', 'Default community for testing', 'default-community')
ON CONFLICT (id) DO NOTHING;

-- 6. CREATE BOOKINGS TABLE FOR COMPLETENESS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID,
    event_id UUID REFERENCES public.events(id),
    venue_id UUID REFERENCES public.venues(id),
    performer_id UUID REFERENCES public.performers(id),
    status VARCHAR(50) DEFAULT 'pending',
    guest_count INTEGER,
    total_amount DECIMAL(10,2),
    client_name VARCHAR(255),
    client_email VARCHAR(320),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID,
    entity_type VARCHAR(50), -- 'event', 'venue', 'performer'
    entity_id UUID,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CREATE MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID,
    recipient_id UUID,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CREATE FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID,
    entity_type VARCHAR(50), -- 'event', 'venue', 'performer'
    entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, entity_type, entity_id)
);

-- 10. UPDATE PERFORMERS TO HAVE STAGE_NAME FROM NAME
UPDATE public.performers SET stage_name = name WHERE stage_name IS NULL;

COMMIT;