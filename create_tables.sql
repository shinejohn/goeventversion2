-- SIMPLE WORKING SCRIPT - When's The Fun Database Tables
-- Run this directly in your Supabase SQL editor or via psql

BEGIN;

-- =============================================================================
-- VENUES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL, -- Will add FK later if needed
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
  created_by uuid
);

-- =============================================================================
-- PERFORMERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL, -- Will add FK later if needed
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
  created_by uuid
);

-- =============================================================================
-- EVENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL, -- Will add FK later if needed
  organizer_id uuid NOT NULL, -- Will add FK later if needed
  title varchar(255) NOT NULL,
  description text,
  start_datetime timestamp with time zone NOT NULL,
  end_datetime timestamp with time zone NOT NULL,
  venue_id uuid, -- Will add FK later if needed
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
  event_id uuid NOT NULL, -- Will add FK later if needed
  performer_id uuid NOT NULL, -- Will add FK later if needed
  role varchar(100) DEFAULT 'performer',
  billing_order integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- TICKETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL, -- Will add FK later if needed
  user_id uuid NOT NULL, -- Will add FK later if needed
  account_id uuid NOT NULL, -- Will add FK later if needed
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
  user_id uuid NOT NULL, -- Will add FK later if needed
  venue_id uuid, -- Will add FK later if needed
  performer_id uuid, -- Will add FK later if needed
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
  owner_id uuid NOT NULL, -- Will add FK later if needed
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
  user_id uuid NOT NULL, -- Will add FK later if needed
  venue_id uuid, -- Will add FK later if needed
  venue_name text NOT NULL,
  event_id uuid, -- Will add FK later if needed
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
-- BASIC INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_venues_city_state ON public.venues(city, state);
CREATE INDEX IF NOT EXISTS idx_venues_venue_type ON public.venues(venue_type);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON public.venues(rating);

CREATE INDEX IF NOT EXISTS idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON public.events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

CREATE INDEX IF NOT EXISTS idx_performers_genre ON public.performers(genre);
CREATE INDEX IF NOT EXISTS idx_performers_location ON public.performers(location);

CREATE INDEX IF NOT EXISTS idx_event_performers_event_id ON public.event_performers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_performers_performer_id ON public.event_performers(performer_id);

CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);

CREATE INDEX IF NOT EXISTS idx_calendars_owner_id ON public.calendars(owner_id);
CREATE INDEX IF NOT EXISTS idx_calendars_slug ON public.calendars(slug);

CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_venue_id ON public.checkins(venue_id);
CREATE INDEX IF NOT EXISTS idx_checkins_check_in_time ON public.checkins(check_in_time);

-- =============================================================================
-- BASIC RLS (Enable but allow everything for now)
-- =============================================================================
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

-- Temporarily allow all operations (you can lock this down later)
CREATE POLICY "Allow all for now" ON public.venues FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON public.performers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON public.event_performers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON public.tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON public.bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON public.calendars FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON public.checkins FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================================================
-- SAMPLE DATA
-- =============================================================================
INSERT INTO public.venues (name, address, city, state, venue_type, capacity, account_id) VALUES
('The Grand Theater', '123 Main St', 'New York', 'NY', 'theater', 500, gen_random_uuid()),
('Blue Note Jazz Club', '456 Music Ave', 'Nashville', 'TN', 'club', 200, gen_random_uuid()),
('Riverside Park', '789 Park Rd', 'Austin', 'TX', 'outdoor', 1000, gen_random_uuid())
ON CONFLICT DO NOTHING;

INSERT INTO public.performers (name, genre, location, base_price, account_id) VALUES
('The Jazz Quartet', 'Jazz', 'New York, NY', 1500.00, gen_random_uuid()),
('Electric Storm', 'Rock', 'Los Angeles, CA', 2500.00, gen_random_uuid()),
('Sarah Smith', 'Folk', 'Austin, TX', 800.00, gen_random_uuid())
ON CONFLICT DO NOTHING;

COMMIT;

-- Success message
SELECT 'Database tables created successfully! You can now run the app.' as message;