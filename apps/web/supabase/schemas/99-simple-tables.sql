/*
 * -------------------------------------------------------
 * SIMPLE TABLES - WHEN'S THE FUN
 * Basic table structure integrated with existing MakerKit schema
 * -------------------------------------------------------
 */

-- Note: Not dropping existing tables - extending MakerKit schema

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
  venue_type varchar(100) NOT NULL,
  capacity integer DEFAULT 100,
  price_per_hour decimal(10,2),
  latitude decimal(10,8),
  longitude decimal(11,8),
  email varchar(255),
  phone varchar(20),
  image_url varchar(1000),
  rating decimal(3,2) DEFAULT 0.00,
  is_active boolean DEFAULT true,
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
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
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
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
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
-- CALENDARS
-- =============================================================================
CREATE TABLE public.calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
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
-- CHECK-INS
-- =============================================================================
CREATE TABLE public.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  venue_id uuid,
  venue_name text NOT NULL,
  event_id uuid,
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
-- BOOKINGS
-- =============================================================================
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  venue_id uuid,
  performer_id uuid,
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
-- INDEXES
-- =============================================================================
CREATE INDEX idx_venues_city_state ON public.venues(city, state);
CREATE INDEX idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX idx_events_venue_id ON public.events(venue_id);
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_calendars_owner_id ON public.calendars(owner_id);
CREATE INDEX idx_calendars_slug ON public.calendars(slug);
CREATE INDEX idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX idx_checkins_venue_id ON public.checkins(venue_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON public.bookings(venue_id);

-- =============================================================================
-- TEST DATA
-- =============================================================================
INSERT INTO public.venues (name, address, city, state, venue_type, capacity) VALUES
('Test Theater', '123 Main St', 'New York', 'NY', 'theater', 500),
('Concert Hall', '456 Music Ave', 'Nashville', 'TN', 'concert_hall', 1000),
('Community Center', '789 Park Rd', 'Austin', 'TX', 'community_center', 200);

INSERT INTO public.performers (name, genre, location, base_price) VALUES
('The Jazz Quartet', 'Jazz', 'New York, NY', 1500.00),
('Rock Band X', 'Rock', 'Los Angeles, CA', 2500.00),
('Classical Ensemble', 'Classical', 'Boston, MA', 2000.00);

INSERT INTO public.events (title, description, start_datetime, end_datetime, venue_id, price_min, price_max, capacity) VALUES
('Jazz Night', 'An evening of smooth jazz', '2024-10-15 19:00:00-05', '2024-10-15 22:00:00-05', 
 (SELECT id FROM public.venues WHERE name = 'Test Theater'), 25.00, 75.00, 300),
('Rock Concert', 'High-energy rock performance', '2024-10-20 20:00:00-05', '2024-10-20 23:00:00-05',
 (SELECT id FROM public.venues WHERE name = 'Concert Hall'), 35.00, 150.00, 800);