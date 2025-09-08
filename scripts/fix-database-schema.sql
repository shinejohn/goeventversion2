-- Fix Database Schema Script
-- This script modifies the database to match UI expectations
-- Based on comprehensive analysis of all route and component files

-- =====================================================
-- EVENTS TABLE FIXES
-- =====================================================
-- RULE: Every event MUST be at a venue (parks, streets, etc are venues)

-- The UI expects 'start_date' but database has 'start_datetime'
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (start_datetime) STORED;

-- Add missing columns that UI expects
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS genre VARCHAR(100),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS amenities TEXT[],
  ADD COLUMN IF NOT EXISTS base_hourly_rate DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS state VARCHAR(100);

-- =====================================================
-- PERFORMERS TABLE FIXES
-- =====================================================

-- Ensure performers table exists with expected columns
CREATE TABLE IF NOT EXISTS performers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  stage_name VARCHAR(255),
  category VARCHAR(100),
  genres TEXT[],
  bio TEXT,
  profile_image_url TEXT,
  image_url TEXT,
  rating DECIMAL(3, 2),
  average_rating DECIMAL(3, 2),
  is_verified BOOLEAN DEFAULT false,
  city VARCHAR(100),
  address TEXT,
  total_performances INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
ALTER TABLE performers
  ADD COLUMN IF NOT EXISTS stage_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS genres TEXT[],
  ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2),
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS total_performances INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- =====================================================
-- VENUES TABLE FIXES
-- =====================================================

-- Ensure we have venue types that include public spaces
ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS venue_type VARCHAR(50);

-- Add missing columns to venues
ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS amenities TEXT[],
  ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS price_min DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS price_max DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS available_tickets INTEGER,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS picture_url TEXT,
  ADD COLUMN IF NOT EXISTS start_datetime TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS end_datetime TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  venue_id UUID REFERENCES venues(id),
  title VARCHAR(255),
  name VARCHAR(255),
  category VARCHAR(100),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  address TEXT,
  city VARCHAR(100),
  image_url TEXT,
  profile_image_url TEXT,
  stage_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ARTISTS TABLE (Some routes reference 'artists' instead of 'performers')
-- =====================================================

-- Create artists as a view of performers for backwards compatibility
CREATE OR REPLACE VIEW artists AS SELECT * FROM performers;

-- =====================================================
-- CALENDARS & CALENDAR_SHARES TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id),
  name VARCHAR(255),
  description TEXT,
  visibility VARCHAR(50) DEFAULT 'private',
  picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE,
  shared_with_id UUID REFERENCES auth.users(id),
  permission_level VARCHAR(50) DEFAULT 'view',
  created_by UUID REFERENCES auth.users(id),
  category VARCHAR(100),
  title VARCHAR(255),
  image_url TEXT,
  picture_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SOCIAL FEATURES TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  content TEXT,
  location VARCHAR(255),
  image_url TEXT,
  picture_url TEXT,
  avatar_url TEXT,
  category VARCHAR(100),
  city VARCHAR(100),
  start_date TIMESTAMP WITH TIME ZONE,
  title VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Aliases for different naming conventions in routes
CREATE OR REPLACE VIEW post_comments AS SELECT * FROM social_comments;
CREATE OR REPLACE VIEW post_likes AS SELECT * FROM social_likes;

-- =====================================================
-- MESSAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  thread_id UUID,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HUB TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS hubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_hubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id),
  name VARCHAR(255),
  description TEXT,
  logo_url TEXT,
  avatar_url TEXT,
  current_members INTEGER DEFAULT 0,
  visibility VARCHAR(50) DEFAULT 'public',
  role VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hub_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES community_hubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hub_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES community_hubs(id) ON DELETE CASCADE,
  activity_type VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hub_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES community_hubs(id) ON DELETE CASCADE,
  image_url TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LIVE STREAMING TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  host_id UUID REFERENCES auth.users(id),
  stream_url TEXT,
  description TEXT,
  picture_url TEXT,
  is_live BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PERFORMER-EVENT RELATIONSHIP TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS performers_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  performer_id UUID REFERENCES performers(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  performance_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  stage_name VARCHAR(255), -- e.g., "Main Stage", "Acoustic Stage"
  performance_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove unique constraint to allow multiple performances per performer at same event
DROP INDEX IF EXISTS performers_events_performer_id_event_id_key;

-- Create the expected join table name
CREATE TABLE IF NOT EXISTS event_performers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  performer_id UUID REFERENCES performers(id) ON DELETE CASCADE,
  base_rate DECIMAL(10, 2),
  bio TEXT,
  category VARCHAR(100),
  city VARCHAR(100),
  genres TEXT[],
  image_url TEXT,
  name VARCHAR(255),
  profile_image_url TEXT,
  stage_name VARCHAR(255),
  start_date TIMESTAMP WITH TIME ZONE,
  title VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, performer_id)
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES auth.users(id),
  venue_id UUID REFERENCES venues(id),
  performer_id UUID REFERENCES performers(id),
  event_id UUID REFERENCES events(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LIKED/FAVORITES TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS liked_performers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  performer_id UUID REFERENCES performers(id),
  bio TEXT,
  categories TEXT[],
  city VARCHAR(100),
  name VARCHAR(255),
  profile_image_url TEXT,
  rating DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, performer_id)
);

CREATE TABLE IF NOT EXISTS liked_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  venue_id UUID REFERENCES venues(id),
  address TEXT,
  category VARCHAR(100),
  city VARCHAR(100),
  image_url TEXT,
  name VARCHAR(255),
  rating DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, venue_id)
);

-- =====================================================
-- MISC TABLES REFERENCED IN ROUTES
-- =====================================================

CREATE TABLE IF NOT EXISTS event_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  reminder_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE TABLE IF NOT EXISTS event_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  commenter_id UUID REFERENCES auth.users(id),
  content TEXT,
  rating INTEGER,
  title VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  friend_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS shared_calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id),
  name VARCHAR(255),
  description TEXT,
  subscriber_count INTEGER DEFAULT 0,
  visibility VARCHAR(50) DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TICKET TYPES & PRICING
-- =====================================================

-- Ticket types that can be used for events or series
CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  series_id UUID REFERENCES event_series(id),
  name VARCHAR(255), -- "General Admission", "VIP", "Season Pass", "Weekend Pass"
  description TEXT,
  price DECIMAL(10, 2),
  early_bird_price DECIMAL(10, 2),
  early_bird_deadline TIMESTAMP WITH TIME ZONE,
  max_quantity INTEGER,
  available_quantity INTEGER,
  min_purchase INTEGER DEFAULT 1,
  max_purchase INTEGER,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  benefits TEXT[], -- ["Front row seating", "Meet & greet", "Free parking"]
  restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT ticket_type_scope CHECK (
    (event_id IS NOT NULL AND series_id IS NULL) OR 
    (event_id IS NULL AND series_id IS NOT NULL)
  )
);

-- Individual tickets purchased by users
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_type_id UUID REFERENCES ticket_types(id),
  event_id UUID REFERENCES events(id),
  series_id UUID REFERENCES event_series(id),
  user_id UUID REFERENCES auth.users(id),
  order_id UUID, -- for grouping tickets bought together
  ticket_number VARCHAR(100) UNIQUE, -- "EVT-2024-00001"
  purchase_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'valid', -- valid, used, cancelled, refunded
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  qr_code TEXT,
  seat_number VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Series passes (tickets valid for multiple events in a series)
CREATE TABLE IF NOT EXISTS series_passes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id),
  series_id UUID REFERENCES event_series(id),
  pass_type VARCHAR(100), -- full-access, weekend, specific-days
  events_included UUID[], -- specific event IDs if not full access
  events_attended UUID[], -- track which events were attended
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_series ON ticket_types(series_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_series ON tickets(series_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_series_passes_series ON series_passes(series_id);

-- Enable RLS
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_passes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public read ticket types" ON ticket_types 
  FOR SELECT TO authenticated USING (is_active = true);
  
CREATE POLICY "Users read own tickets" ON tickets 
  FOR SELECT TO authenticated USING (user_id = auth.uid());
  
CREATE POLICY "Users read own series passes" ON series_passes 
  FOR SELECT TO authenticated USING (
    ticket_id IN (SELECT id FROM tickets WHERE user_id = auth.uid())
  );

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100),
  slug VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  preferred_categories TEXT[],
  notification_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  platform VARCHAR(50),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_data JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_id UUID REFERENCES events(id),
  venue_id UUID REFERENCES venues(id),
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hub_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES hubs(id),
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hub_id, user_id)
);

-- =====================================================
-- FIX ACCOUNTS TABLE EXTENSIONS
-- =====================================================

-- The UI expects these columns on accounts
ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS allow_calendar_sharing BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS show_liked_performers BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_liked_venues BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS url TEXT,
  ADD COLUMN IF NOT EXISTS visibility_level VARCHAR(50) DEFAULT 'public';

-- =====================================================
-- CREATE MISSING FUNCTIONS
-- =====================================================

-- Some routes call these functions
CREATE OR REPLACE FUNCTION get_account_invitations(account_id UUID)
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT i.id, i.email, i.role, i.created_at
  FROM invitations i
  WHERE i.account_id = get_account_invitations.account_id
  AND i.accepted_at IS NULL
  ORDER BY i.created_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_account_members(account_id UUID)
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50),
  joined_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, a.name, am.account_role, am.created_at
  FROM accounts_memberships am
  JOIN auth.users u ON u.id = am.user_id
  JOIN accounts a ON a.id = am.user_id
  WHERE am.account_id = get_account_members.account_id
  ORDER BY am.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE performers_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_memberships ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE BASIC RLS POLICIES
-- =====================================================

-- Allow authenticated users to read all public data
CREATE POLICY "Public read access" ON performers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON venues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON hubs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON community_hubs FOR SELECT TO authenticated USING (visibility = 'public');

-- Users can manage their own data
CREATE POLICY "Users manage own bookings" ON bookings FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own calendars" ON calendars FOR ALL TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "Users manage own posts" ON social_posts FOR ALL TO authenticated USING (author_id = auth.uid());
CREATE POLICY "Users manage own messages" ON messages FOR ALL TO authenticated USING (from_user_id = auth.uid() OR to_user_id = auth.uid());
CREATE POLICY "Users manage own likes" ON liked_performers FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own likes" ON liked_venues FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own preferences" ON user_preferences FOR ALL TO authenticated USING (user_id = auth.uid());

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);

CREATE INDEX IF NOT EXISTS idx_performers_category ON performers(category);
CREATE INDEX IF NOT EXISTS idx_performers_city ON performers(city);

CREATE INDEX IF NOT EXISTS idx_venues_category ON venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);

CREATE INDEX IF NOT EXISTS idx_reviews_venue_id ON reviews(venue_id);
CREATE INDEX IF NOT EXISTS idx_reviews_performer_id ON reviews(performer_id);

CREATE INDEX IF NOT EXISTS idx_social_posts_author_id ON social_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_posts(created_at);

-- =====================================================
-- CREATE COMMON PUBLIC VENUES
-- =====================================================
-- Since every event must be at a venue, create common public venues

INSERT INTO venues (name, category, venue_type, address, city, state, capacity, max_capacity, is_active, description)
VALUES 
  ('Clearwater Beach', 'outdoor', 'beach', 'Clearwater Beach, FL', 'Clearwater', 'Florida', 5000, 5000, true, 'Public beach venue for outdoor events'),
  ('Coachman Park', 'outdoor', 'park', '301 Drew St, Clearwater, FL 33755', 'Clearwater', 'Florida', 2000, 2000, true, 'Downtown waterfront park'),
  ('Downtown Street Fair Area', 'outdoor', 'street', 'Cleveland St, Clearwater, FL', 'Clearwater', 'Florida', 1000, 1000, true, 'Closed street area for festivals and fairs'),
  ('Sand Key Park', 'outdoor', 'park', '1060 Gulf Blvd, Clearwater, FL 33767', 'Clearwater', 'Florida', 500, 500, true, 'Beachfront park with pavilions'),
  ('Ruth Eckerd Hall Plaza', 'outdoor', 'plaza', '1111 McMullen Booth Rd, Clearwater, FL 33759', 'Clearwater', 'Florida', 300, 300, true, 'Outdoor plaza area')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SPONSORS & ORGANIZERS TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  category VARCHAR(100), -- nonprofit, corporate, government, individual
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  category VARCHAR(100), -- individual, company, community-group
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sponsor and organizer to events
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES sponsors(id),
  ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES organizers(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_sponsor_id ON events(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);

-- Enable RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;

-- RLS policies - public read access
CREATE POLICY "Public read access" ON sponsors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON organizers FOR SELECT TO authenticated USING (true);

-- Add some common sponsors/organizers
INSERT INTO sponsors (name, slug, category, description) VALUES
  ('Friends of Clearwater Library', 'friends-clearwater-library', 'nonprofit', 'Supporting literacy and community programs'),
  ('Tampa Bay Community Foundation', 'tampa-bay-foundation', 'nonprofit', 'Funding community initiatives'),
  ('City of Clearwater Parks & Rec', 'clearwater-parks-rec', 'government', 'Municipal recreation programs'),
  ('Downtown Business Alliance', 'downtown-business-alliance', 'corporate', 'Supporting local businesses')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO organizers (name, slug, category, description) VALUES
  ('Clearwater Events Team', 'clearwater-events', 'company', 'Professional event organizers'),
  ('Community Volunteers Group', 'community-volunteers', 'community-group', 'Volunteer-run community events'),
  ('Bay Area Arts Council', 'bay-arts-council', 'nonprofit', 'Promoting arts in the Tampa Bay area')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- EVENT SERIES TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS event_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  series_type VARCHAR(100), -- festival, conference, tour, circuit, program, convention, symposium, retreat, workshop-series, experience
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern VARCHAR(100), -- annual, biannual, quarterly, monthly
  logo_url TEXT,
  banner_image_url TEXT,
  website_url TEXT,
  sponsor_id UUID REFERENCES sponsors(id),
  organizer_id UUID REFERENCES organizers(id),
  primary_venue_id UUID REFERENCES venues(id), -- main venue if applicable
  total_events INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add series relationship to events
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES event_series(id),
  ADD COLUMN IF NOT EXISTS series_order INTEGER, -- position in the series
  ADD COLUMN IF NOT EXISTS series_day INTEGER; -- day number for multi-day events

-- Series venues (for tours/circuits that visit multiple venues)
CREATE TABLE IF NOT EXISTS event_series_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID REFERENCES event_series(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id),
  visit_order INTEGER,
  visit_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Series sponsors (multiple sponsors possible)
CREATE TABLE IF NOT EXISTS event_series_sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID REFERENCES event_series(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES sponsors(id),
  sponsor_level VARCHAR(100), -- title, presenting, gold, silver, bronze
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_series_id ON events(series_id);
CREATE INDEX IF NOT EXISTS idx_event_series_type ON event_series(series_type);
CREATE INDEX IF NOT EXISTS idx_event_series_dates ON event_series(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_event_series_venues_series ON event_series_venues(series_id);

-- Enable RLS
ALTER TABLE event_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_series_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_series_sponsors ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public read access" ON event_series FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Public read access" ON event_series_venues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON event_series_sponsors FOR SELECT TO authenticated USING (true);

-- =====================================================
-- EVENT ACTIVITIES & SCHEDULES
-- =====================================================

-- Event activities (for fairs, festivals with multiple activities)
CREATE TABLE IF NOT EXISTS event_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  activity_name VARCHAR(255),
  activity_type VARCHAR(100), -- performance, workshop, vendor, food, kids-zone, etc
  description TEXT,
  location_name VARCHAR(255), -- "Main Stage", "Food Court", "Kids Area"
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  host_name VARCHAR(255),
  image_url TEXT,
  max_participants INTEGER,
  requires_registration BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event stages/areas for multi-venue events
CREATE TABLE IF NOT EXISTS event_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  stage_name VARCHAR(255),
  stage_type VARCHAR(100), -- main-stage, acoustic-stage, dj-booth, workshop-area
  description TEXT,
  location_within_venue TEXT,
  capacity INTEGER,
  has_sound_system BOOLEAN DEFAULT true,
  has_lighting BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event schedule (comprehensive schedule for complex events)
CREATE TABLE IF NOT EXISTS event_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES event_stages(id),
  activity_id UUID REFERENCES event_activities(id),
  performer_id UUID REFERENCES performers(id),
  schedule_type VARCHAR(50), -- performance, activity, break, setup
  title VARCHAR(255),
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns to events for complex event support
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS has_multiple_stages BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_activities BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS event_layout_url TEXT, -- map/layout image
  ADD COLUMN IF NOT EXISTS parking_info TEXT,
  ADD COLUMN IF NOT EXISTS admission_info TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_activities_event_id ON event_activities(event_id);
CREATE INDEX IF NOT EXISTS idx_event_activities_start_time ON event_activities(start_time);
CREATE INDEX IF NOT EXISTS idx_event_stages_event_id ON event_stages(event_id);
CREATE INDEX IF NOT EXISTS idx_event_schedules_event_id ON event_schedules(event_id);
CREATE INDEX IF NOT EXISTS idx_event_schedules_start_time ON event_schedules(start_time);

-- Enable RLS
ALTER TABLE event_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public read access" ON event_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON event_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON event_schedules FOR SELECT TO authenticated USING (true);

-- =====================================================
-- MEETING-SPECIFIC TABLES
-- =====================================================

-- Meeting details table
CREATE TABLE IF NOT EXISTS meeting_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE UNIQUE,
  agenda_url TEXT,
  agenda_content TEXT,
  meeting_type VARCHAR(100), -- regular, special, emergency, workshop
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supporting documents for meetings
CREATE TABLE IF NOT EXISTS meeting_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  document_type VARCHAR(100), -- agenda, minutes, presentation, report, resolution
  title VARCHAR(255),
  description TEXT,
  document_url TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Past meeting minutes reference
CREATE TABLE IF NOT EXISTS past_meeting_minutes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  current_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  past_event_id UUID REFERENCES events(id),
  minutes_url TEXT,
  minutes_date DATE,
  title VARCHAR(255),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add meeting-specific columns to events
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_meeting BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS meeting_number VARCHAR(50), -- e.g., "2024-03"
  ADD COLUMN IF NOT EXISTS requires_rsvp BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rsvp_deadline TIMESTAMP WITH TIME ZONE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meeting_details_event_id ON meeting_details(event_id);
CREATE INDEX IF NOT EXISTS idx_meeting_documents_event_id ON meeting_documents(event_id);
CREATE INDEX IF NOT EXISTS idx_meeting_documents_type ON meeting_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_past_minutes_current_event ON past_meeting_minutes(current_event_id);
CREATE INDEX IF NOT EXISTS idx_events_is_meeting ON events(is_meeting);

-- Enable RLS
ALTER TABLE meeting_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_meeting_minutes ENABLE ROW LEVEL SECURITY;

-- RLS policies - public read access
CREATE POLICY "Public read access" ON meeting_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON meeting_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access" ON past_meeting_minutes FOR SELECT TO authenticated USING (true);

-- =====================================================
-- ENSURE EVENT-VENUE INTEGRITY
-- =====================================================

-- Update any events that might have venue addresses but no venue_id
-- This creates a venue for each unique address
DO $$
DECLARE
  event_record RECORD;
  new_venue_id UUID;
BEGIN
  FOR event_record IN 
    SELECT DISTINCT ON (address) id, title, address, city, state 
    FROM events 
    WHERE venue_id IS NULL AND address IS NOT NULL
  LOOP
    -- Create a venue for this address
    INSERT INTO venues (
      name, 
      address, 
      city, 
      state, 
      category, 
      venue_type,
      capacity, 
      is_active
    ) VALUES (
      COALESCE(
        CASE 
          WHEN event_record.address LIKE '%Park%' THEN event_record.address
          WHEN event_record.address LIKE '%Beach%' THEN event_record.address
          WHEN event_record.address LIKE '%Street%' THEN event_record.address
          ELSE 'Venue at ' || event_record.address
        END,
        'Venue for ' || event_record.title
      ),
      event_record.address,
      COALESCE(event_record.city, 'Unknown'),
      COALESCE(event_record.state, 'Unknown'),
      'other',
      CASE 
        WHEN event_record.address LIKE '%Park%' THEN 'park'
        WHEN event_record.address LIKE '%Beach%' THEN 'beach'
        WHEN event_record.address LIKE '%Street%' THEN 'street'
        ELSE 'other'
      END,
      100,
      true
    )
    RETURNING id INTO new_venue_id;
    
    -- Update all events at this address to use this venue
    UPDATE events 
    SET venue_id = new_venue_id 
    WHERE address = event_record.address AND venue_id IS NULL;
  END LOOP;
END $$;

-- Now make venue_id NOT NULL to enforce the rule
ALTER TABLE events 
  ALTER COLUMN venue_id SET NOT NULL;

-- =====================================================
-- LOG NON-DATABASE FIXES
-- =====================================================

-- The following issues cannot be fixed by database changes and need code fixes:
-- 1. Route: /events/$id.tsx:35 - Uses 'start_date' but also joins with venues expecting different structure
-- 2. Route: /performers/$performerId.tsx - Expects 'performers_events' join table with specific structure
-- 3. Route: /hub/$slug/events.tsx - Expects hub-event relationships that aren't defined
-- 4. Route: /home/user/index.tsx - Complex queries expecting specific account structures
-- 5. Multiple routes use .rpc() calls expecting stored procedures that don't exist