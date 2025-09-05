-- Create event system tables
-- Migration: 20250905000000_create_event_system.sql

BEGIN;

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
  venue_type varchar(100) NOT NULL DEFAULT 'other',
  capacity integer DEFAULT 100,
  price_per_hour decimal(10,2),
  latitude decimal(10,8),
  longitude decimal(11,8),
  email varchar(255),
  phone varchar(20),
  image_url varchar(1000),
  gallery_images text[] DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  amenities jsonb DEFAULT '{}',
  max_capacity integer DEFAULT 500,
  price_range integer DEFAULT 2,
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
  genre varchar(100),
  location varchar(255),
  base_price decimal(10,2),
  image_url varchar(1000),
  rating decimal(3,2) DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  price varchar(100),
  is_active boolean DEFAULT true,
  next_performance timestamp with time zone,
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
  title varchar(255) NOT NULL,
  description text,
  start_datetime timestamp with time zone NOT NULL,
  end_datetime timestamp with time zone NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  price_min decimal(10,2) DEFAULT 0,
  price_max decimal(10,2) DEFAULT 0,
  capacity integer,
  image_url varchar(1000),
  status varchar(20) DEFAULT 'published',
  amenities jsonb DEFAULT '{}',
  lineup jsonb DEFAULT '[]',
  ticket_info jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- EVENT_PERFORMERS (Junction Table)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.event_performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  performer_id uuid REFERENCES public.performers(id) ON DELETE CASCADE NOT NULL,
  role varchar(100) DEFAULT 'performer',
  billing_order integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(event_id, performer_id)
);

-- =============================================================================
-- TICKETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  ticket_type varchar(50) NOT NULL,
  ticket_number varchar(255) UNIQUE NOT NULL DEFAULT 'TKT-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 8),
  qr_code varchar(255) UNIQUE NOT NULL DEFAULT 'WTF-' || gen_random_uuid()::text,
  price decimal(10,2) NOT NULL,
  service_fee decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  quantity integer DEFAULT 1,
  status varchar(20) DEFAULT 'active',
  attendee_info jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- BOOKINGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  performer_id uuid REFERENCES public.performers(id) ON DELETE SET NULL,
  booking_number varchar(255) UNIQUE NOT NULL DEFAULT 'BK-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6),
  event_name text NOT NULL,
  event_type varchar(100),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  guest_count integer DEFAULT 1,
  setup_requirements text,
  services jsonb DEFAULT '[]'::jsonb,
  contact_person jsonb DEFAULT '{}'::jsonb,
  special_requests text,
  subtotal decimal(10,2),
  service_fee decimal(10,2),
  total_price decimal(10,2),
  payment_method varchar(50),
  payment_status varchar(20) DEFAULT 'pending',
  status varchar(20) DEFAULT 'pending',
  qr_code varchar(255) UNIQUE NOT NULL DEFAULT 'BOOK-' || gen_random_uuid()::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- CALENDARS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  slug text UNIQUE,
  color text DEFAULT '#4F46E5',
  visibility varchar(20) DEFAULT 'private',
  is_shared boolean DEFAULT false,
  contributors uuid[] DEFAULT '{}',
  categories text[] DEFAULT '{}',
  timezone text DEFAULT 'America/New_York',
  is_monetized boolean DEFAULT false,
  subscription_price decimal(10,2),
  one_time_price decimal(10,2),
  subscriber_count integer DEFAULT 0,
  event_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- CHECKINS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  venue_name text NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  latitude decimal(10,8),
  longitude decimal(11,8),
  address text,
  check_in_time timestamp with time zone DEFAULT now(),
  check_out_time timestamp with time zone,
  is_active boolean DEFAULT true,
  note text,
  mood varchar(50),
  privacy varchar(20) DEFAULT 'friends',
  photos text[] DEFAULT '{}',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  event_details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_venues_account_id ON public.venues(account_id);
CREATE INDEX IF NOT EXISTS idx_venues_city_state ON public.venues(city, state);
CREATE INDEX IF NOT EXISTS idx_venues_venue_type ON public.venues(venue_type);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON public.venues(rating);

CREATE INDEX IF NOT EXISTS idx_performers_account_id ON public.performers(account_id);
CREATE INDEX IF NOT EXISTS idx_performers_genre ON public.performers(genre);
CREATE INDEX IF NOT EXISTS idx_performers_location ON public.performers(location);

CREATE INDEX IF NOT EXISTS idx_events_account_id ON public.events(account_id);
CREATE INDEX IF NOT EXISTS idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON public.events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

CREATE INDEX IF NOT EXISTS idx_event_performers_event_id ON public.event_performers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_performers_performer_id ON public.event_performers(performer_id);

CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_account_id ON public.tickets(account_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);

CREATE INDEX IF NOT EXISTS idx_calendars_owner_id ON public.calendars(owner_id);
CREATE INDEX IF NOT EXISTS idx_calendars_slug ON public.calendars(slug);

CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_venue_id ON public.checkins(venue_id);
CREATE INDEX IF NOT EXISTS idx_checkins_check_in_time ON public.checkins(check_in_time);

-- =============================================================================
-- ENABLE RLS
-- =============================================================================
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES (Permissive for now)
-- =============================================================================

-- Venues policies
CREATE POLICY "venues_select" ON public.venues FOR SELECT
  USING (is_active = true OR public.has_role_on_account(account_id));

CREATE POLICY "venues_manage" ON public.venues FOR ALL
  USING (public.has_role_on_account(account_id))
  WITH CHECK (public.has_role_on_account(account_id));

-- Performers policies  
CREATE POLICY "performers_select" ON public.performers FOR SELECT
  USING (is_active = true OR public.has_role_on_account(account_id));

CREATE POLICY "performers_manage" ON public.performers FOR ALL
  USING (public.has_role_on_account(account_id))
  WITH CHECK (public.has_role_on_account(account_id));

-- Events policies
CREATE POLICY "events_select" ON public.events FOR SELECT
  USING (status = 'published' OR public.has_role_on_account(account_id));

CREATE POLICY "events_manage" ON public.events FOR ALL
  USING (public.has_role_on_account(account_id))
  WITH CHECK (public.has_role_on_account(account_id));

-- Event performers policies
CREATE POLICY "event_performers_select" ON public.event_performers FOR SELECT
  USING (true);

CREATE POLICY "event_performers_manage" ON public.event_performers FOR ALL
  USING (EXISTS(SELECT 1 FROM public.events WHERE id = event_id AND public.has_role_on_account(account_id)))
  WITH CHECK (EXISTS(SELECT 1 FROM public.events WHERE id = event_id AND public.has_role_on_account(account_id)));

-- Tickets policies
CREATE POLICY "tickets_select" ON public.tickets FOR SELECT
  USING (user_id = auth.uid() OR public.has_role_on_account(account_id));

CREATE POLICY "tickets_insert" ON public.tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Bookings policies
CREATE POLICY "bookings_select" ON public.bookings FOR SELECT
  USING (user_id = auth.uid() OR 
         EXISTS(SELECT 1 FROM public.venues WHERE id = venue_id AND public.has_role_on_account(account_id)) OR
         EXISTS(SELECT 1 FROM public.performers WHERE id = performer_id AND public.has_role_on_account(account_id)));

CREATE POLICY "bookings_manage" ON public.bookings FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Calendars policies
CREATE POLICY "calendars_select" ON public.calendars FOR SELECT
  USING (visibility = 'public' OR owner_id = auth.uid());

CREATE POLICY "calendars_manage" ON public.calendars FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Check-ins policies
CREATE POLICY "checkins_select" ON public.checkins FOR SELECT
  USING (privacy = 'public' OR user_id = auth.uid());

CREATE POLICY "checkins_manage" ON public.checkins FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- SAMPLE DATA
-- =============================================================================
DO $$
DECLARE
  sample_account_id uuid;
  sample_user_id uuid;
BEGIN
  -- Get first account for sample data
  SELECT id INTO sample_account_id FROM public.accounts LIMIT 1;
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  IF sample_account_id IS NOT NULL AND sample_user_id IS NOT NULL THEN
    INSERT INTO public.venues (name, address, city, state, venue_type, capacity, account_id, created_by) VALUES
    ('The Grand Theater', '123 Main St', 'New York', 'NY', 'theater', 500, sample_account_id, sample_user_id),
    ('Blue Note Jazz Club', '456 Music Ave', 'Nashville', 'TN', 'club', 200, sample_account_id, sample_user_id),
    ('Riverside Park', '789 Park Rd', 'Austin', 'TX', 'outdoor', 1000, sample_account_id, sample_user_id)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.performers (name, genre, location, base_price, account_id, created_by) VALUES
    ('The Jazz Quartet', 'Jazz', 'New York, NY', 1500.00, sample_account_id, sample_user_id),
    ('Electric Storm', 'Rock', 'Los Angeles, CA', 2500.00, sample_account_id, sample_user_id),
    ('Sarah Smith', 'Folk', 'Austin, TX', 800.00, sample_account_id, sample_user_id)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

COMMIT;