-- Create missing tables for calendar and community detail pages
-- This SQL script creates the required tables with sample data

-- Create curated_calendars table
CREATE TABLE IF NOT EXISTS public.curated_calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    subscriber_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendars table
CREATE TABLE IF NOT EXISTS public.calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    subscriber_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(calendar_id, event_id)
);

-- Create calendar_subscriptions table
CREATE TABLE IF NOT EXISTS public.calendar_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(calendar_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.curated_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for curated_calendars
CREATE POLICY "curated_calendars_read" ON public.curated_calendars FOR SELECT
    TO authenticated USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "curated_calendars_insert" ON public.curated_calendars FOR INSERT
    TO authenticated WITH CHECK (creator_id = auth.uid());

CREATE POLICY "curated_calendars_update" ON public.curated_calendars FOR UPDATE
    TO authenticated USING (creator_id = auth.uid());

CREATE POLICY "curated_calendars_delete" ON public.curated_calendars FOR DELETE
    TO authenticated USING (creator_id = auth.uid());

-- Create RLS policies for calendars
CREATE POLICY "calendars_read" ON public.calendars FOR SELECT
    TO authenticated USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "calendars_insert" ON public.calendars FOR INSERT
    TO authenticated WITH CHECK (creator_id = auth.uid());

CREATE POLICY "calendars_update" ON public.calendars FOR UPDATE
    TO authenticated USING (creator_id = auth.uid());

CREATE POLICY "calendars_delete" ON public.calendars FOR DELETE
    TO authenticated USING (creator_id = auth.uid());

-- Create RLS policies for calendar_events
CREATE POLICY "calendar_events_read" ON public.calendar_events FOR SELECT
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.calendars 
            WHERE calendars.id = calendar_events.calendar_id 
            AND (calendars.is_public = true OR calendars.creator_id = auth.uid())
        )
    );

CREATE POLICY "calendar_events_insert" ON public.calendar_events FOR INSERT
    TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.calendars 
            WHERE calendars.id = calendar_events.calendar_id 
            AND calendars.creator_id = auth.uid()
        )
    );

CREATE POLICY "calendar_events_delete" ON public.calendar_events FOR DELETE
    TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.calendars 
            WHERE calendars.id = calendar_events.calendar_id 
            AND calendars.creator_id = auth.uid()
        )
    );

-- Create RLS policies for calendar_subscriptions
CREATE POLICY "calendar_subscriptions_read" ON public.calendar_subscriptions FOR SELECT
    TO authenticated USING (user_id = auth.uid());

CREATE POLICY "calendar_subscriptions_insert" ON public.calendar_subscriptions FOR INSERT
    TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "calendar_subscriptions_delete" ON public.calendar_subscriptions FOR DELETE
    TO authenticated USING (user_id = auth.uid());

-- Insert sample data for curated_calendars
INSERT INTO public.curated_calendars (id, name, slug, description, creator_id, subscriber_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Jazz Events Calendar', 'jazz-events', 'A curated collection of the best jazz events in the city', '550e8400-e29b-41d4-a716-446655440000', 150),
('550e8400-e29b-41d4-a716-446655440002', 'Rock & Roll Calendar', 'rock-roll', 'All the rock and roll events you need to know about', '550e8400-e29b-41d4-a716-446655440000', 89),
('550e8400-e29b-41d4-a716-446655440003', 'Classical Music Events', 'classical-music', 'Elegant classical music performances and concerts', '550e8400-e29b-41d4-a716-446655440000', 67);

-- Insert sample data for calendars
INSERT INTO public.calendars (id, name, slug, description, creator_id, subscriber_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Jazz Events Calendar', 'jazz-events', 'A curated collection of the best jazz events in the city', '550e8400-e29b-41d4-a716-446655440000', 150),
('550e8400-e29b-41d4-a716-446655440002', 'Rock & Roll Calendar', 'rock-roll', 'All the rock and roll events you need to know about', '550e8400-e29b-41d4-a716-446655440000', 89),
('550e8400-e29b-41d4-a716-446655440003', 'Classical Music Events', 'classical-music', 'Elegant classical music performances and concerts', '550e8400-e29b-41d4-a716-446655440000', 67);

-- Insert sample calendar_events (linking to existing events)
INSERT INTO public.calendar_events (calendar_id, event_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004');

-- Insert sample calendar_subscriptions
INSERT INTO public.calendar_subscriptions (calendar_id, user_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000');

-- Update subscriber counts
UPDATE public.calendars SET subscriber_count = (
    SELECT COUNT(*) FROM public.calendar_subscriptions 
    WHERE calendar_subscriptions.calendar_id = calendars.id
);

UPDATE public.curated_calendars SET subscriber_count = (
    SELECT COUNT(*) FROM public.calendar_subscriptions 
    WHERE calendar_subscriptions.calendar_id = curated_calendars.id
);
