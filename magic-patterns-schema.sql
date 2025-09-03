/*
 * -------------------------------------------------------
 * Section: Magic Patterns Schema
 * Complete schema for all Magic Patterns components and functionality
 * -------------------------------------------------------
 */

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- EVENTS SYSTEM
-- =============================================================================

-- Event categories enum
CREATE TYPE event_category AS ENUM (
  'music',
  'sports',
  'business', 
  'entertainment',
  'arts',
  'food_drink',
  'community',
  'education',
  'health',
  'technology',
  'other'
);

-- Event status enum
CREATE TYPE event_status AS ENUM (
  'draft',
  'pending',
  'published',
  'cancelled',
  'completed'
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  title varchar(255) NOT NULL,
  description text,
  category event_category DEFAULT 'other',
  status event_status DEFAULT 'draft',
  
  -- Event timing
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  timezone varchar(50) DEFAULT 'UTC',
  
  -- Location
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  location_name varchar(255),
  address text,
  city varchar(100),
  state varchar(100),
  country varchar(100),
  postal_code varchar(20),
  latitude decimal(10,8),
  longitude decimal(11,8),
  
  -- Media
  image_url varchar(1000),
  gallery_images jsonb DEFAULT '[]'::jsonb,
  
  -- Pricing & Capacity
  base_price decimal(10,2) DEFAULT 0,
  max_capacity integer,
  current_bookings integer DEFAULT 0,
  
  -- Event details
  requirements text,
  amenities jsonb DEFAULT '{}'::jsonb,
  tags text[],
  
  -- Meta
  slug varchar(255) UNIQUE,
  is_featured boolean DEFAULT false,
  is_public boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- VENUES SYSTEM  
-- =============================================================================

-- Venue types enum
CREATE TYPE venue_type AS ENUM (
  'indoor',
  'outdoor',
  'hybrid',
  'virtual',
  'mobile'
);

-- Venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  venue_type venue_type DEFAULT 'indoor',
  
  -- Location
  address text NOT NULL,
  city varchar(100) NOT NULL,
  state varchar(100),
  country varchar(100) NOT NULL,
  postal_code varchar(20),
  latitude decimal(10,8),
  longitude decimal(11,8),
  
  -- Capacity & Features
  max_capacity integer NOT NULL,
  amenities jsonb DEFAULT '{}'::jsonb,
  equipment jsonb DEFAULT '{}'::jsonb,
  accessibility_features text[],
  
  -- Media
  image_url varchar(1000),
  gallery_images jsonb DEFAULT '[]'::jsonb,
  virtual_tour_url varchar(1000),
  
  -- Pricing
  base_hourly_rate decimal(10,2) DEFAULT 0,
  setup_fee decimal(10,2) DEFAULT 0,
  cleaning_fee decimal(10,2) DEFAULT 0,
  
  -- Availability
  operating_hours jsonb DEFAULT '{}'::jsonb,
  blackout_dates jsonb DEFAULT '[]'::jsonb,
  
  -- Business info
  contact_email varchar(320),
  contact_phone varchar(20),
  website_url varchar(1000),
  
  -- Meta
  slug varchar(255) UNIQUE,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- PERFORMERS SYSTEM
-- =============================================================================

-- Performer categories
CREATE TYPE performer_category AS ENUM (
  'musician',
  'band',
  'dj',
  'comedian',
  'speaker',
  'dancer',
  'magician',
  'variety',
  'other'
);

-- Performers table
CREATE TABLE IF NOT EXISTS public.performers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  stage_name varchar(255) NOT NULL,
  real_name varchar(255),
  bio text,
  category performer_category DEFAULT 'other',
  
  -- Performance details
  genres text[],
  instruments text[],
  performance_duration_min integer DEFAULT 60,
  setup_time_min integer DEFAULT 30,
  
  -- Media
  profile_image_url varchar(1000),
  gallery_images jsonb DEFAULT '[]'::jsonb,
  demo_videos jsonb DEFAULT '[]'::jsonb,
  audio_samples jsonb DEFAULT '[]'::jsonb,
  
  -- Pricing
  base_rate decimal(10,2) DEFAULT 0,
  travel_fee decimal(10,2) DEFAULT 0,
  equipment_fee decimal(10,2) DEFAULT 0,
  
  -- Requirements
  technical_requirements text,
  space_requirements text,
  
  -- Contact & Booking
  booking_email varchar(320),
  booking_phone varchar(20),
  website_url varchar(1000),
  social_media jsonb DEFAULT '{}'::jsonb,
  
  -- Stats
  total_performances integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0,
  
  -- Meta
  slug varchar(255) UNIQUE,
  is_verified boolean DEFAULT false,
  is_available boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- BOOKINGS SYSTEM
-- =============================================================================

-- Booking status enum
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'refunded'
);

-- Payment status enum  
CREATE TYPE payment_status AS ENUM (
  'unpaid',
  'deposit_paid',
  'paid_in_full',
  'refunded',
  'partial_refund'
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Related entities
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  performer_id uuid REFERENCES public.performers(id) ON DELETE SET NULL,
  
  -- Booking details
  booking_number varchar(50) UNIQUE NOT NULL,
  status booking_status DEFAULT 'pending',
  
  -- Timing
  event_date timestamptz NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  setup_start_time time,
  breakdown_end_time time,
  
  -- Attendee information
  guest_count integer NOT NULL,
  guest_details jsonb DEFAULT '{}'::jsonb,
  special_requests text,
  
  -- Pricing breakdown
  base_price decimal(10,2) NOT NULL,
  additional_fees jsonb DEFAULT '{}'::jsonb,
  taxes decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  
  -- Payment tracking
  payment_status payment_status DEFAULT 'unpaid',
  deposit_amount decimal(10,2) DEFAULT 0,
  deposit_due_date date,
  balance_due_date date,
  stripe_payment_intent_id varchar(255),
  
  -- Contact information
  client_name varchar(255) NOT NULL,
  client_email varchar(320) NOT NULL,
  client_phone varchar(20),
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- COMMUNITY HUBS SYSTEM
-- =============================================================================

-- Hub visibility enum
CREATE TYPE hub_visibility AS ENUM (
  'public',
  'private',
  'invite_only'
);

-- Community hubs table
CREATE TABLE IF NOT EXISTS public.community_hubs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Hub details
  name varchar(255) NOT NULL,
  description text,
  slug varchar(255) UNIQUE NOT NULL,
  
  -- Settings
  visibility hub_visibility DEFAULT 'public',
  member_limit integer,
  current_members integer DEFAULT 0,
  
  -- Branding
  logo_url varchar(1000),
  banner_url varchar(1000),
  theme_config jsonb DEFAULT '{}'::jsonb,
  
  -- Features
  features_enabled jsonb DEFAULT '{}'::jsonb,
  custom_pages jsonb DEFAULT '[]'::jsonb,
  
  -- Meta
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid USERS auth.users(id)
);

-- Hub memberships table
CREATE TABLE IF NOT EXISTS public.hub_memberships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hub_id uuid REFERENCES public.community_hubs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role varchar(50) DEFAULT 'member',
  
  -- Membership details
  joined_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  
  UNIQUE(hub_id, user_id)
);

-- =============================================================================
-- REVIEWS & RATINGS SYSTEM
-- =============================================================================

-- Review entity types
CREATE TYPE review_entity_type AS ENUM (
  'event',
  'venue', 
  'performer',
  'booking'
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Review target
  entity_type review_entity_type NOT NULL,
  entity_id uuid NOT NULL,
  
  -- Review content
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title varchar(255),
  content text,
  
  -- Media
  images jsonb DEFAULT '[]'::jsonb,
  
  -- Verification
  is_verified boolean DEFAULT false,
  booking_id uuid REFERENCES public.bookings(id),
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  
  UNIQUE(account_id, entity_type, entity_id, booking_id)
);

-- =============================================================================
-- MESSAGING SYSTEM
-- =============================================================================

-- Message types
CREATE TYPE message_type AS ENUM (
  'direct',
  'booking_inquiry',
  'booking_update', 
  'system',
  'notification'
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Participants
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Message details
  message_type message_type DEFAULT 'direct',
  subject varchar(255),
  content text NOT NULL,
  
  -- Related entities
  booking_id uuid REFERENCES public.bookings(id),
  event_id uuid REFERENCES public.events(id),
  
  -- Status
  is_read boolean DEFAULT false,
  read_at timestamptz,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================================================
-- FAVORITES & WISHLIST SYSTEM
-- =============================================================================

-- Favorite entity types
CREATE TYPE favorite_entity_type AS ENUM (
  'event',
  'venue',
  'performer',
  'hub'
);

-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Favorite target
  entity_type favorite_entity_type NOT NULL,
  entity_id uuid NOT NULL,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(account_id, entity_type, entity_id)
);

-- =============================================================================
-- ANALYTICS & INSIGHTS
-- =============================================================================

-- Event analytics table
CREATE TABLE IF NOT EXISTS public.event_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  
  -- Traffic metrics
  page_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  
  -- Engagement metrics  
  bookings_count integer DEFAULT 0,
  inquiries_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  
  -- Conversion metrics
  view_to_inquiry_rate decimal(5,4) DEFAULT 0,
  inquiry_to_booking_rate decimal(5,4) DEFAULT 0,
  
  -- Revenue metrics
  total_revenue decimal(12,2) DEFAULT 0,
  average_booking_value decimal(10,2) DEFAULT 0,
  
  -- Date tracking
  date date NOT NULL,
  
  UNIQUE(event_id, date)
);

-- =============================================================================
-- NOTIFICATIONS SYSTEM (Extended)
-- =============================================================================

-- Notification categories
CREATE TYPE notification_category AS ENUM (
  'booking',
  'payment',
  'event',
  'message',
  'review',
  'system',
  'marketing'
);

-- Extended notifications (builds on existing table)
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS category notification_category DEFAULT 'system',
ADD COLUMN IF NOT EXISTS related_entity_type varchar(50),
ADD COLUMN IF NOT EXISTS related_entity_id uuid,
ADD COLUMN IF NOT EXISTS action_url varchar(1000),
ADD COLUMN IF NOT EXISTS is_push_sent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_email_sent boolean DEFAULT false;

-- =============================================================================
-- USER PREFERENCES (Extended)
-- =============================================================================

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Notification preferences
  email_notifications jsonb DEFAULT '{"bookings": true, "messages": true, "events": false, "marketing": false}'::jsonb,
  push_notifications jsonb DEFAULT '{"bookings": true, "messages": true, "events": false}'::jsonb,
  sms_notifications jsonb DEFAULT '{"bookings": false, "messages": false}'::jsonb,
  
  -- Privacy preferences
  profile_visibility varchar(20) DEFAULT 'public',
  show_email boolean DEFAULT false,
  show_phone boolean DEFAULT false,
  allow_messages boolean DEFAULT true,
  
  -- Content preferences
  preferred_categories text[],
  preferred_locations text[],
  price_range_min decimal(10,2),
  price_range_max decimal(10,2),
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_account_id ON public.events(account_id);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON public.events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(city, state, country);
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events(is_featured) WHERE is_featured = true;

-- Venues indexes
CREATE INDEX IF NOT EXISTS idx_venues_account_id ON public.venues(account_id);
CREATE INDEX IF NOT EXISTS idx_venues_location ON public.venues(city, state, country);
CREATE INDEX IF NOT EXISTS idx_venues_capacity ON public.venues(max_capacity);
CREATE INDEX IF NOT EXISTS idx_venues_active ON public.venues(is_active) WHERE is_active = true;

-- Performers indexes
CREATE INDEX IF NOT EXISTS idx_performers_account_id ON public.performers(account_id);
CREATE INDEX IF NOT EXISTS idx_performers_category ON public.performers(category);
CREATE INDEX IF NOT EXISTS idx_performers_available ON public.performers(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_performers_rating ON public.performers(average_rating);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_account_id ON public.bookings(account_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON public.bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_performer_id ON public.bookings(performer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_entity ON public.reviews(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_reviews_account_id ON public.reviews(account_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(recipient_id, is_read) WHERE is_read = false;

-- Favorites indexes  
CREATE INDEX IF NOT EXISTS idx_favorites_account ON public.favorites(account_id);
CREATE INDEX IF NOT EXISTS idx_favorites_entity ON public.favorites(entity_type, entity_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "events_select" ON public.events FOR SELECT
  USING (is_public = true OR account_id = auth.uid() OR public.has_role_on_account(account_id));

CREATE POLICY "events_insert" ON public.events FOR INSERT
  WITH CHECK (account_id = auth.uid() OR public.has_permission(auth.uid(), account_id, 'events.create'));

CREATE POLICY "events_update" ON public.events FOR UPDATE
  USING (account_id = auth.uid() OR public.has_permission(auth.uid(), account_id, 'events.manage'))
  WITH CHECK (account_id = auth.uid() OR public.has_permission(auth.uid(), account_id, 'events.manage'));

CREATE POLICY "events_delete" ON public.events FOR DELETE
  USING (account_id = auth.uid() OR public.has_permission(auth.uid(), account_id, 'events.manage'));

-- Venues policies
CREATE POLICY "venues_select" ON public.venues FOR SELECT
  USING (is_active = true OR account_id = auth.uid() OR public.has_role_on_account(account_id));

CREATE POLICY "venues_insert" ON public.venues FOR INSERT
  WITH CHECK (account_id = auth.uid() OR public.has_permission(auth.uid(), account_id, 'venues.create'));

CREATE POLICY "venues_update" ON public.venues FOR UPDATE
  USING (account_id = auth.uid() OR public.has_permission(auth.uid(), account_id, 'venues.manage'))
  WITH CHECK (account_id = auth.uid() OR public.has_permission(auth.uid(), account_id, 'venues.manage'));

CREATE POLICY "venues_delete" ON public.venues FOR DELETE
  USING (account_id = auth.uid() OR public.has_permission(auth.uid(), account_id, 'venues.manage'));

-- Performers policies
CREATE POLICY "performers_select" ON public.performers FOR SELECT
  USING (is_available = true OR account_id = auth.uid() OR public.has_role_on_account(account_id));

CREATE POLICY "performers_insert" ON public.performers FOR INSERT
  WITH CHECK (account_id = auth.uid());

CREATE POLICY "performers_update" ON public.performers FOR UPDATE
  USING (account_id = auth.uid())
  WITH CHECK (account_id = auth.uid());

CREATE POLICY "performers_delete" ON public.performers FOR DELETE
  USING (account_id = auth.uid());

-- Bookings policies
CREATE POLICY "bookings_select" ON public.bookings FOR SELECT
  USING (account_id = auth.uid() OR 
         EXISTS(SELECT 1 FROM public.events e WHERE e.id = event_id AND e.account_id = auth.uid()) OR
         EXISTS(SELECT 1 FROM public.venues v WHERE v.id = venue_id AND v.account_id = auth.uid()) OR
         EXISTS(SELECT 1 FROM public.performers p WHERE p.id = performer_id AND p.account_id = auth.uid()));

CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT
  WITH CHECK (account_id = auth.uid());

CREATE POLICY "bookings_update" ON public.bookings FOR UPDATE
  USING (account_id = auth.uid() OR 
         EXISTS(SELECT 1 FROM public.events e WHERE e.id = event_id AND e.account_id = auth.uid()) OR
         EXISTS(SELECT 1 FROM public.venues v WHERE v.id = venue_id AND v.account_id = auth.uid()) OR
         EXISTS(SELECT 1 FROM public.performers p WHERE p.id = performer_id AND p.account_id = auth.uid()));

-- Reviews policies
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT
  USING (true); -- Reviews are public

CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT
  WITH CHECK (account_id = auth.uid());

CREATE POLICY "reviews_update" ON public.reviews FOR UPDATE
  USING (account_id = auth.uid())
  WITH CHECK (account_id = auth.uid());

CREATE POLICY "reviews_delete" ON public.reviews FOR DELETE
  USING (account_id = auth.uid());

-- Messages policies
CREATE POLICY "messages_select" ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "messages_insert" ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "messages_update" ON public.messages FOR UPDATE
  USING (recipient_id = auth.uid()) -- Only recipient can mark as read
  WITH CHECK (recipient_id = auth.uid());

-- Favorites policies
CREATE POLICY "favorites_select" ON public.favorites FOR SELECT
  USING (account_id = auth.uid());

CREATE POLICY "favorites_insert" ON public.favorites FOR INSERT
  WITH CHECK (account_id = auth.uid());

CREATE POLICY "favorites_delete" ON public.favorites FOR DELETE
  USING (account_id = auth.uid());

-- User preferences policies
CREATE POLICY "user_preferences_select" ON public.user_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_preferences_insert" ON public.user_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_preferences_update" ON public.user_preferences FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues  
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_performers_updated_at
  BEFORE UPDATE ON public.performers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_community_hubs_updated_at
  BEFORE UPDATE ON public.community_hubs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to generate booking number
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := 'BK-' || to_char(now(), 'YYYYMMDD') || '-' || 
                         UPPER(substring(NEW.id::text from 1 for 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_booking_number_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.generate_booking_number();

-- Function to update venue/event/performer stats
CREATE OR REPLACE FUNCTION public.update_entity_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update performer stats when booking is completed
  IF TG_TABLE_NAME = 'bookings' AND NEW.performer_id IS NOT NULL THEN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
      UPDATE public.performers 
      SET total_performances = total_performances + 1
      WHERE id = NEW.performer_id;
    END IF;
  END IF;
  
  -- Update venue booking count
  IF TG_TABLE_NAME = 'bookings' AND NEW.venue_id IS NOT NULL THEN
    UPDATE public.venues
    SET current_bookings = (
      SELECT COUNT(*) FROM public.bookings 
      WHERE venue_id = NEW.venue_id AND status IN ('pending', 'confirmed')
    )
    WHERE id = NEW.venue_id;
  END IF;
  
  -- Update event booking count  
  IF TG_TABLE_NAME = 'bookings' AND NEW.event_id IS NOT NULL THEN
    UPDATE public.events
    SET current_bookings = (
      SELECT COALESCE(SUM(guest_count), 0) FROM public.bookings 
      WHERE event_id = NEW.event_id AND status IN ('pending', 'confirmed')
    )
    WHERE id = NEW.event_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_stats_trigger
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_entity_stats();

-- =============================================================================
-- SAMPLE DATA (OPTIONAL - FOR DEVELOPMENT)
-- =============================================================================

-- Insert sample event categories and data would go here
-- This would be useful for development but should be removed for production

-- =============================================================================
-- GRANTS & PERMISSIONS
-- =============================================================================

-- Grant permissions to authenticated users
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.venues TO authenticated;
GRANT ALL ON public.performers TO authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.community_hubs TO authenticated;
GRANT ALL ON public.hub_memberships TO authenticated;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.favorites TO authenticated;
GRANT ALL ON public.event_analytics TO authenticated;
GRANT ALL ON public.user_preferences TO authenticated;

-- Grant read access to service role (for admin functions)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;

COMMENT ON SCHEMA public IS 'Magic Patterns complete schema with events, venues, performers, bookings, community hubs, reviews, messaging, favorites, analytics, and user preferences';