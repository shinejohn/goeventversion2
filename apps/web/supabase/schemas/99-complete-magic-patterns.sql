/*
 * -------------------------------------------------------
 * COMPLETE MAGIC PATTERNS DATABASE SCHEMA
 * All tables for When's The Fun platform
 * -------------------------------------------------------
 */

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "postgis"; -- Comment out for now, enable if you need geography types

-- =============================================================================
-- VENUES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  address text NOT NULL,
  city varchar(100) NOT NULL,
  state varchar(100) NOT NULL,
  postal_code varchar(20),
  country varchar(100) DEFAULT 'USA',
  latitude decimal(10,8),
  longitude decimal(11,8),
  
  -- Venue details
  venue_type varchar(100) NOT NULL, -- theater, stadium, arena, club, outdoor, etc
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
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- PERFORMERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  name varchar(255) NOT NULL,
  bio text,
  genres text[] DEFAULT '{}',
  location varchar(255),
  
  -- Contact
  email varchar(255),
  phone varchar(20),
  website varchar(255),
  social_links jsonb DEFAULT '{}'::jsonb,
  
  -- Pricing
  base_price decimal(10,2),
  price_range varchar(50), -- $, $$, $$$, $$$$
  
  -- Media
  image_url varchar(1000),
  gallery_images text[] DEFAULT '{}',
  videos jsonb DEFAULT '[]'::jsonb,
  
  -- Ratings
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  available_for_booking boolean DEFAULT true,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- EVENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  organizer_id uuid REFERENCES auth.users(id) NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  
  -- Event info
  title varchar(255) NOT NULL,
  description text,
  category varchar(50) DEFAULT 'other',
  slug varchar(255) UNIQUE,
  
  -- Timing
  start_datetime timestamp with time zone NOT NULL,
  end_datetime timestamp with time zone NOT NULL,
  timezone varchar(50) DEFAULT 'America/New_York',
  
  -- Pricing
  price_min decimal(10,2) DEFAULT 0,
  price_max decimal(10,2) DEFAULT 0,
  
  -- Capacity
  capacity integer,
  sold_count integer DEFAULT 0,
  
  -- Media
  image_url varchar(1000),
  gallery_images text[] DEFAULT '{}',
  
  -- Status
  status varchar(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  visibility varchar(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  
  -- SEO
  tags text[] DEFAULT '{}',
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- EVENT PERFORMERS JUNCTION
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.event_performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  performer_id uuid REFERENCES public.performers(id) ON DELETE CASCADE NOT NULL,
  performance_time timestamp with time zone,
  duration_minutes integer,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(event_id, performer_id)
);

-- =============================================================================
-- BOOKINGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  performer_id uuid REFERENCES public.performers(id) ON DELETE SET NULL,
  
  -- Booking details
  booking_number text UNIQUE,
  event_name text NOT NULL,
  event_type text,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  guest_count integer DEFAULT 1,
  
  -- Requirements
  setup_requirements text,
  services jsonb DEFAULT '[]'::jsonb,
  special_requests text,
  
  -- Contact
  contact_person jsonb DEFAULT '{}'::jsonb, -- {name, email, phone}
  
  -- Pricing
  subtotal decimal(10,2),
  service_fee decimal(10,2),
  total_price decimal(10,2),
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  
  -- Status
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  qr_code text UNIQUE,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- TICKETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Ticket details
  ticket_type text NOT NULL, -- general, reserved, vip, platinum
  ticket_number text UNIQUE NOT NULL,
  qr_code text UNIQUE NOT NULL,
  
  -- Pricing
  price decimal(10,2) NOT NULL,
  service_fee decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  
  -- Purchase info
  purchase_date timestamp with time zone DEFAULT now(),
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  
  -- Status
  status text DEFAULT 'active' CHECK (status IN ('active', 'used', 'cancelled', 'expired')),
  used_at timestamp with time zone,
  
  -- Attendee info
  attendee_info jsonb DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- CALENDARS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Calendar details
  name text NOT NULL,
  description text,
  slug text UNIQUE,
  color text DEFAULT '#4F46E5',
  
  -- Access
  visibility text DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'friends')),
  is_shared boolean DEFAULT false,
  contributors uuid[] DEFAULT '{}',
  
  -- Settings
  categories text[] DEFAULT '{}',
  timezone text DEFAULT 'America/New_York',
  sync_settings jsonb DEFAULT '{}'::jsonb,
  external_calendar_url text,
  
  -- Monetization
  is_monetized boolean DEFAULT false,
  subscription_price decimal(10,2),
  one_time_price decimal(10,2),
  
  -- Stats
  subscriber_count integer DEFAULT 0,
  event_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- CALENDAR EVENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id uuid REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  custom_event jsonb,
  color text,
  reminder_minutes integer DEFAULT 30,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- CHECK-INS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  venue_name text NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  
  -- Location
  location point,
  location_accuracy numeric,
  address text,
  
  -- Check-in details
  check_in_time timestamp with time zone DEFAULT now(),
  check_out_time timestamp with time zone,
  is_active boolean DEFAULT true,
  
  -- Social
  note text,
  mood text,
  privacy text DEFAULT 'friends' CHECK (privacy IN ('public', 'friends', 'private')),
  photos text[] DEFAULT '{}',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  event_details jsonb,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- COMMUNITY HUBS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.community_hubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Hub info
  name varchar(255) NOT NULL,
  description text,
  category varchar(50),
  slug varchar(255) UNIQUE,
  
  -- Settings
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invite-only')),
  membership_type text DEFAULT 'free' CHECK (membership_type IN ('free', 'paid', 'approval')),
  features text[] DEFAULT '{}',
  custom_domain varchar(255),
  
  -- Media
  image_url varchar(1000),
  banner_url varchar(1000),
  
  -- Stats
  member_count integer DEFAULT 0,
  event_count integer DEFAULT 0,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- REVIEWS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- What's being reviewed
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  performer_id uuid REFERENCES public.performers(id) ON DELETE CASCADE,
  
  -- Review content
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title varchar(255),
  content text,
  
  -- Status
  is_verified boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Ensure only one entity is reviewed
  CHECK (
    (venue_id IS NOT NULL AND event_id IS NULL AND performer_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NOT NULL AND performer_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NULL AND performer_id IS NOT NULL)
  )
);

-- =============================================================================
-- FAVORITES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  performer_id uuid REFERENCES public.performers(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  
  -- Ensure only one entity is favorited
  CHECK (
    (venue_id IS NOT NULL AND event_id IS NULL AND performer_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NOT NULL AND performer_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NULL AND performer_id IS NOT NULL)
  )
);

-- =============================================================================
-- MESSAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  thread_id uuid,
  subject varchar(255),
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- USER PREFERENCES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notifications
  email_notifications jsonb DEFAULT '{
    "marketing": true,
    "updates": true,
    "reminders": true,
    "messages": true
  }'::jsonb,
  push_notifications jsonb DEFAULT '{
    "events": true,
    "messages": true,
    "reminders": true
  }'::jsonb,
  
  -- Privacy
  profile_visibility text DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  show_email boolean DEFAULT false,
  show_phone boolean DEFAULT false,
  
  -- Preferences
  preferred_categories text[] DEFAULT '{}',
  preferred_locations text[] DEFAULT '{}',
  distance_radius integer DEFAULT 25,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Venues
CREATE INDEX idx_venues_account_id ON public.venues(account_id);
-- CREATE INDEX idx_venues_location ON public.venues USING gist(point(longitude, latitude)); -- Fixed: column names changed
CREATE INDEX idx_venues_city_state ON public.venues(city, state);

-- Performers
CREATE INDEX idx_performers_account_id ON public.performers(account_id);
CREATE INDEX idx_performers_genres ON public.performers USING gin(genres);

-- Events
CREATE INDEX idx_events_account_id ON public.events(account_id);
CREATE INDEX idx_events_venue_id ON public.events(venue_id);
CREATE INDEX idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_slug ON public.events(slug);

-- Bookings
CREATE INDEX idx_bookings_account_id ON public.bookings(account_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX idx_bookings_booking_number ON public.bookings(booking_number);

-- Tickets
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_qr_code ON public.tickets(qr_code);

-- Calendars
CREATE INDEX idx_calendars_owner_id ON public.calendars(owner_id);
CREATE INDEX idx_calendars_slug ON public.calendars(slug);

-- Check-ins
CREATE INDEX idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX idx_checkins_venue_id ON public.checkins(venue_id);
-- CREATE INDEX idx_checkins_location ON public.checkins USING gist(location); -- Requires PostGIS

-- Reviews
CREATE INDEX idx_reviews_venue_id ON public.reviews(venue_id);
CREATE INDEX idx_reviews_event_id ON public.reviews(event_id);
CREATE INDEX idx_reviews_performer_id ON public.reviews(performer_id);

-- Favorites
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);

-- Messages
CREATE INDEX idx_messages_from_user ON public.messages(from_user_id);
CREATE INDEX idx_messages_to_user ON public.messages(to_user_id);
CREATE INDEX idx_messages_thread ON public.messages(thread_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS text AS $$
BEGIN
  RETURN 'BK-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6);
END;
$$ LANGUAGE plpgsql;

-- Generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS text AS $$
BEGIN
  RETURN 'TKT-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Generate QR codes
CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS text AS $$
BEGIN
  RETURN 'WTF-' || gen_random_uuid()::text;
END;
$$ LANGUAGE plpgsql;

-- Generate slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  base_slug := lower(regexp_replace(input_text, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  
  WHILE EXISTS(
    SELECT 1 FROM public.events WHERE slug = final_slug
    UNION
    SELECT 1 FROM public.calendars WHERE slug = final_slug
    UNION
    SELECT 1 FROM public.community_hubs WHERE slug = final_slug
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate booking defaults
CREATE OR REPLACE FUNCTION set_booking_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := generate_booking_number();
  END IF;
  
  IF NEW.qr_code IS NULL THEN
    NEW.qr_code := generate_qr_code();
  END IF;
  
  IF NEW.service_fee IS NULL AND NEW.subtotal IS NOT NULL THEN
    NEW.service_fee := round(NEW.subtotal * 0.1, 2);
  END IF;
  
  IF NEW.subtotal IS NOT NULL AND NEW.service_fee IS NOT NULL THEN
    NEW.total_price := NEW.subtotal + NEW.service_fee;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_defaults_trigger
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE PROCEDURE set_booking_defaults();

-- Auto-generate ticket defaults
CREATE OR REPLACE FUNCTION set_ticket_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  
  IF NEW.qr_code IS NULL THEN
    NEW.qr_code := generate_qr_code();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_defaults_trigger
BEFORE INSERT ON public.tickets
FOR EACH ROW EXECUTE PROCEDURE set_ticket_defaults();

-- Auto-generate slugs for events
CREATE OR REPLACE FUNCTION set_event_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_event_slug_trigger
BEFORE INSERT ON public.events
FOR EACH ROW EXECUTE PROCEDURE set_event_slug();

-- Auto-generate slugs for calendars
CREATE OR REPLACE FUNCTION set_calendar_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_calendar_slug_trigger
BEFORE INSERT ON public.calendars
FOR EACH ROW EXECUTE PROCEDURE set_calendar_slug();

-- Auto-generate slugs for community hubs
CREATE OR REPLACE FUNCTION set_hub_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_hub_slug_trigger
BEFORE INSERT ON public.community_hubs
FOR EACH ROW EXECUTE PROCEDURE set_hub_slug();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you'll need to add more based on your requirements)

-- Venues: Public read, authenticated create/update
CREATE POLICY "Public can view active venues" ON public.venues
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own venues" ON public.venues
  FOR ALL USING (account_id IN (
    SELECT id FROM public.accounts WHERE primary_owner_user_id = auth.uid()
  ));

-- Events: Public read for published, authenticated create/update
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Users can manage their own events" ON public.events
  FOR ALL USING (organizer_id = auth.uid() OR account_id IN (
    SELECT id FROM public.accounts WHERE primary_owner_user_id = auth.uid()
  ));

-- Tickets: Users can only see their own
CREATE POLICY "Users can view their own tickets" ON public.tickets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets" ON public.tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Add more policies as needed...