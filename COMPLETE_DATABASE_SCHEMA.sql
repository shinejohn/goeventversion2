/*
 * -------------------------------------------------------
 * COMPLETE DATABASE SCHEMA - WHEN'S THE FUN
 * 
 * WARNING: This will DROP ALL EXISTING TABLES and recreate everything
 * -------------------------------------------------------
 */

-- Drop all existing tables (in reverse dependency order)
DROP TABLE IF EXISTS public.checkin_comments CASCADE;
DROP TABLE IF EXISTS public.checkin_likes CASCADE;
DROP TABLE IF EXISTS public.checkins CASCADE;
DROP TABLE IF EXISTS public.calendar_subscriptions CASCADE;
DROP TABLE IF EXISTS public.calendar_events CASCADE;
DROP TABLE IF EXISTS public.calendars CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.hub_memberships CASCADE;
DROP TABLE IF EXISTS public.community_hubs CASCADE;
DROP TABLE IF EXISTS public.event_performers CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.performers CASCADE;
DROP TABLE IF EXISTS public.venues CASCADE;
DROP TABLE IF EXISTS public.event_analytics CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.product_categories CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS event_category CASCADE;
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS venue_type CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS visibility_type CASCADE;
DROP TYPE IF EXISTS privacy_type CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================
CREATE TYPE event_category AS ENUM (
  'music', 'sports', 'business', 'entertainment', 'arts', 
  'food_drink', 'community', 'education', 'health', 'technology', 'other'
);

CREATE TYPE event_status AS ENUM (
  'draft', 'pending', 'published', 'cancelled', 'completed'
);

CREATE TYPE booking_status AS ENUM (
  'pending', 'confirmed', 'cancelled', 'completed'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'paid', 'refunded', 'failed'
);

CREATE TYPE ticket_status AS ENUM (
  'active', 'used', 'cancelled', 'expired'
);

CREATE TYPE visibility_type AS ENUM (
  'public', 'private', 'unlisted', 'friends'
);

CREATE TYPE privacy_type AS ENUM (
  'public', 'friends', 'private'
);

-- =============================================================================
-- VENUES
-- =============================================================================
CREATE TABLE public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
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
  location geography(POINT, 4326),
  
  -- Venue details
  venue_type varchar(100) NOT NULL,
  capacity integer NOT NULL DEFAULT 100,
  amenities text[] DEFAULT '{}',
  price_per_hour decimal(10,2),
  minimum_hours integer DEFAULT 2,
  
  -- Contact
  email varchar(255),
  phone varchar(20),
  website varchar(255),
  
  -- Media
  image_url varchar(1000),
  gallery_images text[] DEFAULT '{}',
  virtual_tour_url varchar(1000),
  
  -- Ratings
  rating decimal(3,2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  
  -- Availability
  operating_hours jsonb DEFAULT '{}'::jsonb,
  unavailable_dates date[] DEFAULT '{}',
  
  -- Status
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- PERFORMERS
-- =============================================================================
CREATE TABLE public.performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic info
  name varchar(255) NOT NULL,
  bio text,
  genres text[] DEFAULT '{}',
  location varchar(255),
  slug varchar(255) UNIQUE,
  
  -- Contact
  email varchar(255),
  phone varchar(20),
  website varchar(255),
  social_links jsonb DEFAULT '{}'::jsonb,
  
  -- Pricing
  base_price decimal(10,2),
  price_range varchar(50),
  currency varchar(3) DEFAULT 'USD',
  
  -- Media
  image_url varchar(1000),
  gallery_images text[] DEFAULT '{}',
  videos jsonb DEFAULT '[]'::jsonb,
  spotify_url varchar(500),
  soundcloud_url varchar(500),
  
  -- Ratings
  rating decimal(3,2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  
  -- Availability
  available_for_booking boolean DEFAULT true,
  touring_radius integer DEFAULT 100,
  unavailable_dates date[] DEFAULT '{}',
  
  -- Status
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  
  -- Performance details
  performance_duration_minutes integer DEFAULT 60,
  setup_time_minutes integer DEFAULT 30,
  equipment_provided boolean DEFAULT false,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- =============================================================================
-- EVENTS
-- =============================================================================
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  organizer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  community_id uuid REFERENCES public.community_hubs(id) ON DELETE SET NULL,
  
  -- Event info
  title varchar(255) NOT NULL,
  description text,
  category event_category DEFAULT 'other',
  slug varchar(255) UNIQUE,
  
  -- Timing
  start_datetime timestamp with time zone NOT NULL,
  end_datetime timestamp with time zone NOT NULL,
  timezone varchar(50) DEFAULT 'America/New_York',
  is_all_day boolean DEFAULT false,
  recurrence_rule text,
  
  -- Location (if not using venue)
  location_name varchar(255),
  location_address text,
  location_city varchar(100),
  location_state varchar(100),
  location_country varchar(100),
  location_latitude decimal(10,8),
  location_longitude decimal(11,8),
  
  -- Pricing
  is_free boolean DEFAULT false,
  price_min decimal(10,2) DEFAULT 0,
  price_max decimal(10,2) DEFAULT 0,
  early_bird_price decimal(10,2),
  early_bird_ends_at timestamp with time zone,
  
  -- Capacity
  capacity integer,
  sold_count integer DEFAULT 0,
  waitlist_count integer DEFAULT 0,
  
  -- Media
  image_url varchar(1000),
  gallery_images text[] DEFAULT '{}',
  video_url varchar(1000),
  
  -- Settings
  status event_status DEFAULT 'draft',
  visibility visibility_type DEFAULT 'public',
  requires_approval boolean DEFAULT false,
  allow_waitlist boolean DEFAULT true,
  
  -- Social
  allow_comments boolean DEFAULT true,
  allow_sharing boolean DEFAULT true,
  
  -- SEO
  tags text[] DEFAULT '{}',
  meta_description text,
  
  -- External links
  external_url varchar(500),
  streaming_url varchar(500),
  
  -- Statistics
  view_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone,
  cancelled_at timestamp with time zone
);

-- =============================================================================
-- EVENT PERFORMERS JUNCTION
-- =============================================================================
CREATE TABLE public.event_performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  performer_id uuid REFERENCES public.performers(id) ON DELETE CASCADE NOT NULL,
  
  -- Performance details
  performance_time timestamp with time zone,
  duration_minutes integer,
  is_headliner boolean DEFAULT false,
  performance_order integer,
  
  -- Pricing (if different from event)
  ticket_price decimal(10,2),
  
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(event_id, performer_id)
);

-- =============================================================================
-- BOOKINGS
-- =============================================================================
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  performer_id uuid REFERENCES public.performers(id) ON DELETE SET NULL,
  
  -- Booking details
  booking_number text UNIQUE NOT NULL,
  booking_type varchar(50) NOT NULL CHECK (booking_type IN ('venue', 'performer', 'both')),
  
  -- Event details
  event_name text NOT NULL,
  event_type varchar(100),
  event_description text,
  
  -- Timing
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  setup_time time,
  breakdown_time time,
  
  -- Attendance
  guest_count integer DEFAULT 1,
  
  -- Requirements
  setup_requirements text,
  technical_requirements text,
  catering_requirements text,
  services jsonb DEFAULT '[]'::jsonb,
  special_requests text,
  
  -- Contact
  contact_person jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Pricing
  venue_subtotal decimal(10,2) DEFAULT 0,
  performer_subtotal decimal(10,2) DEFAULT 0,
  services_subtotal decimal(10,2) DEFAULT 0,
  subtotal decimal(10,2) NOT NULL,
  tax_amount decimal(10,2) DEFAULT 0,
  service_fee decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_price decimal(10,2) NOT NULL,
  deposit_amount decimal(10,2),
  deposit_paid boolean DEFAULT false,
  
  -- Payment
  payment_method varchar(50),
  payment_status payment_status DEFAULT 'pending',
  paid_at timestamp with time zone,
  
  -- Status
  status booking_status DEFAULT 'pending',
  confirmed_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  cancellation_reason text,
  completed_at timestamp with time zone,
  
  -- Verification
  qr_code text UNIQUE NOT NULL,
  
  -- Notes
  internal_notes text,
  venue_notes text,
  performer_notes text,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- TICKETS
-- =============================================================================
CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  order_id uuid,
  
  -- Ticket details
  ticket_type varchar(50) NOT NULL,
  ticket_tier varchar(50),
  ticket_number text UNIQUE NOT NULL,
  qr_code text UNIQUE NOT NULL,
  
  -- Seating (if applicable)
  section varchar(50),
  row varchar(10),
  seat varchar(10),
  
  -- Pricing
  face_value decimal(10,2) NOT NULL,
  service_fee decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  
  -- Purchase info
  purchase_date timestamp with time zone DEFAULT now(),
  payment_method varchar(50),
  confirmation_number text,
  
  -- Status
  status ticket_status DEFAULT 'active',
  used_at timestamp with time zone,
  used_by uuid REFERENCES auth.users(id),
  
  -- Transfer
  is_transferable boolean DEFAULT true,
  transferred_from uuid REFERENCES public.tickets(id),
  transferred_to_email varchar(255),
  transferred_at timestamp with time zone,
  
  -- Attendee info
  attendee_name varchar(255),
  attendee_email varchar(255),
  attendee_phone varchar(20),
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- CALENDARS
-- =============================================================================
CREATE TABLE public.calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Calendar details
  name text NOT NULL,
  description text,
  slug text UNIQUE,
  color text DEFAULT '#4F46E5',
  icon varchar(50),
  
  -- Access
  visibility visibility_type DEFAULT 'private',
  is_public boolean DEFAULT false,
  password_protected boolean DEFAULT false,
  password_hash text,
  contributors uuid[] DEFAULT '{}',
  
  -- Settings
  default_event_duration integer DEFAULT 60,
  timezone text DEFAULT 'America/New_York',
  week_starts_on integer DEFAULT 0,
  
  -- Event categories
  categories jsonb DEFAULT '[
    {"name": "Meeting", "color": "#3B82F6"},
    {"name": "Event", "color": "#10B981"},
    {"name": "Reminder", "color": "#F59E0B"},
    {"name": "Task", "color": "#EF4444"}
  ]'::jsonb,
  
  -- Sync
  sync_enabled boolean DEFAULT false,
  sync_settings jsonb DEFAULT '{}'::jsonb,
  external_calendar_url text,
  last_synced_at timestamp with time zone,
  
  -- Sharing
  is_embeddable boolean DEFAULT false,
  embed_settings jsonb DEFAULT '{}'::jsonb,
  share_url text,
  
  -- Monetization
  is_monetized boolean DEFAULT false,
  subscription_price decimal(10,2),
  one_time_price decimal(10,2),
  free_trial_days integer DEFAULT 0,
  
  -- Analytics
  subscriber_count integer DEFAULT 0,
  event_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  revenue_total decimal(10,2) DEFAULT 0,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- CALENDAR EVENTS
-- =============================================================================
CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id uuid REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  
  -- Custom event (if not linked to main event)
  title varchar(255),
  description text,
  location text,
  start_datetime timestamp with time zone,
  end_datetime timestamp with time zone,
  all_day boolean DEFAULT false,
  
  -- Display
  color text,
  icon varchar(50),
  category varchar(50),
  
  -- Reminders
  reminders jsonb DEFAULT '[{"minutes": 15, "type": "notification"}]'::jsonb,
  
  -- Recurrence
  recurrence_rule text,
  recurrence_exceptions date[] DEFAULT '{}',
  parent_event_id uuid REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  
  -- Privacy
  is_private boolean DEFAULT false,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- CALENDAR SUBSCRIPTIONS
-- =============================================================================
CREATE TABLE public.calendar_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id uuid REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
  subscriber_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Subscription
  subscription_type varchar(20) CHECK (subscription_type IN ('free', 'paid', 'one_time')),
  amount_paid decimal(10,2),
  currency varchar(3) DEFAULT 'USD',
  
  -- Access
  can_add_events boolean DEFAULT false,
  can_edit_events boolean DEFAULT false,
  
  -- Settings
  notifications_enabled boolean DEFAULT true,
  email_reminders boolean DEFAULT true,
  
  -- Status
  is_active boolean DEFAULT true,
  started_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(calendar_id, subscriber_id)
);

-- =============================================================================
-- CHECK-INS
-- =============================================================================
CREATE TABLE public.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  
  -- Location
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  venue_name text NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  
  -- Geolocation
  location geography(POINT, 4326),
  location_accuracy numeric,
  address text,
  city varchar(100),
  state varchar(100),
  country varchar(100),
  
  -- Check-in details
  check_in_time timestamp with time zone DEFAULT now(),
  check_out_time timestamp with time zone,
  duration_minutes integer GENERATED ALWAYS AS (
    CASE 
      WHEN check_out_time IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (check_out_time - check_in_time)) / 60
      ELSE NULL
    END
  ) STORED,
  is_active boolean DEFAULT true,
  
  -- Social
  message text,
  mood varchar(50),
  with_friends uuid[] DEFAULT '{}',
  privacy privacy_type DEFAULT 'friends',
  
  -- Media
  photos text[] DEFAULT '{}',
  
  -- Engagement
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  
  -- Event details (cached)
  event_details jsonb,
  
  -- Source
  source varchar(20) DEFAULT 'manual',
  device_info jsonb,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- CHECK-IN LIKES
-- =============================================================================
CREATE TABLE public.checkin_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id uuid REFERENCES public.checkins(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(checkin_id, user_id)
);

-- =============================================================================
-- CHECK-IN COMMENTS
-- =============================================================================
CREATE TABLE public.checkin_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id uuid REFERENCES public.checkins(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id uuid REFERENCES public.checkin_comments(id) ON DELETE CASCADE,
  
  comment text NOT NULL,
  is_edited boolean DEFAULT false,
  edited_at timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- COMMUNITY HUBS
-- =============================================================================
CREATE TABLE public.community_hubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Hub info
  name varchar(255) NOT NULL,
  description text,
  category varchar(50),
  slug varchar(255) UNIQUE NOT NULL,
  
  -- Settings
  visibility varchar(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invite-only')),
  membership_type varchar(20) DEFAULT 'free' CHECK (membership_type IN ('free', 'paid', 'approval')),
  membership_fee decimal(10,2),
  
  -- Features
  features text[] DEFAULT '{events,discussions,resources,marketplace}'::text[],
  modules jsonb DEFAULT '{}'::jsonb,
  
  -- Customization
  theme jsonb DEFAULT '{}'::jsonb,
  custom_domain varchar(255) UNIQUE,
  
  -- Media
  logo_url varchar(1000),
  banner_url varchar(1000),
  
  -- Limits
  max_members integer DEFAULT 1000,
  max_events_per_month integer DEFAULT 100,
  storage_limit_mb integer DEFAULT 5000,
  
  -- Stats
  member_count integer DEFAULT 0,
  event_count integer DEFAULT 0,
  post_count integer DEFAULT 0,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- HUB MEMBERSHIPS
-- =============================================================================
CREATE TABLE public.hub_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid REFERENCES public.community_hubs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Membership
  role varchar(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  status varchar(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'banned')),
  
  -- Permissions
  permissions text[] DEFAULT '{}',
  
  -- Payment (for paid hubs)
  membership_expires_at timestamp with time zone,
  auto_renew boolean DEFAULT true,
  
  -- Activity
  last_active_at timestamp with time zone DEFAULT now(),
  contribution_score integer DEFAULT 0,
  
  -- Metadata
  joined_at timestamp with time zone DEFAULT now(),
  invited_by uuid REFERENCES auth.users(id),
  
  UNIQUE(hub_id, user_id)
);

-- =============================================================================
-- REVIEWS
-- =============================================================================
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- What's being reviewed (only one should be set)
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  performer_id uuid REFERENCES public.performers(id) ON DELETE CASCADE,
  
  -- Review
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title varchar(255),
  content text NOT NULL,
  
  -- Detailed ratings
  rating_breakdown jsonb DEFAULT '{}'::jsonb,
  
  -- Media
  photos text[] DEFAULT '{}',
  
  -- Verification
  is_verified_purchase boolean DEFAULT false,
  booking_id uuid REFERENCES public.bookings(id),
  
  -- Moderation
  is_featured boolean DEFAULT false,
  is_flagged boolean DEFAULT false,
  moderation_status varchar(20) DEFAULT 'pending',
  
  -- Engagement
  helpful_count integer DEFAULT 0,
  not_helpful_count integer DEFAULT 0,
  
  -- Response
  owner_response text,
  owner_response_at timestamp with time zone,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Ensure only one entity is reviewed
  CONSTRAINT review_single_entity CHECK (
    (venue_id IS NOT NULL AND event_id IS NULL AND performer_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NOT NULL AND performer_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NULL AND performer_id IS NOT NULL)
  )
);

-- =============================================================================
-- FAVORITES
-- =============================================================================
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- What's being favorited (only one should be set)
  venue_id uuid REFERENCES public.venues(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  performer_id uuid REFERENCES public.performers(id) ON DELETE CASCADE,
  calendar_id uuid REFERENCES public.calendars(id) ON DELETE CASCADE,
  hub_id uuid REFERENCES public.community_hubs(id) ON DELETE CASCADE,
  
  -- Organization
  folder varchar(50),
  tags text[] DEFAULT '{}',
  notes text,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  
  -- Ensure only one entity is favorited
  CONSTRAINT favorite_single_entity CHECK (
    (venue_id IS NOT NULL AND event_id IS NULL AND performer_id IS NULL AND calendar_id IS NULL AND hub_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NOT NULL AND performer_id IS NULL AND calendar_id IS NULL AND hub_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NULL AND performer_id IS NOT NULL AND calendar_id IS NULL AND hub_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NULL AND performer_id IS NULL AND calendar_id IS NOT NULL AND hub_id IS NULL) OR
    (venue_id IS NULL AND event_id IS NULL AND performer_id IS NULL AND calendar_id IS NULL AND hub_id IS NOT NULL)
  )
);

-- =============================================================================
-- MESSAGES
-- =============================================================================
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL,
  from_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Message
  subject varchar(255),
  content text NOT NULL,
  
  -- Context (optional)
  related_booking_id uuid REFERENCES public.bookings(id),
  related_event_id uuid REFERENCES public.events(id),
  
  -- Status
  is_read boolean DEFAULT false,
  read_at timestamp with time zone,
  is_archived boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- USER PREFERENCES
-- =============================================================================
CREATE TABLE public.user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notifications
  email_notifications jsonb DEFAULT '{
    "marketing": true,
    "updates": true,
    "reminders": true,
    "messages": true,
    "reviews": true,
    "bookings": true
  }'::jsonb,
  
  push_notifications jsonb DEFAULT '{
    "events": true,
    "messages": true,
    "reminders": true,
    "checkins": true,
    "updates": true
  }'::jsonb,
  
  sms_notifications jsonb DEFAULT '{
    "reminders": false,
    "urgent": true,
    "bookings": false
  }'::jsonb,
  
  -- Privacy
  profile_visibility visibility_type DEFAULT 'public',
  show_email boolean DEFAULT false,
  show_phone boolean DEFAULT false,
  allow_messages_from varchar(20) DEFAULT 'anyone',
  
  -- Discovery preferences
  preferred_categories text[] DEFAULT '{}',
  preferred_genres text[] DEFAULT '{}',
  preferred_locations text[] DEFAULT '{}',
  distance_radius integer DEFAULT 25,
  distance_unit varchar(10) DEFAULT 'miles',
  
  -- Display preferences
  theme varchar(20) DEFAULT 'system',
  language varchar(10) DEFAULT 'en',
  timezone varchar(50),
  date_format varchar(20) DEFAULT 'MM/DD/YYYY',
  time_format varchar(20) DEFAULT '12h',
  week_starts_on integer DEFAULT 0,
  
  -- Communication
  marketing_emails boolean DEFAULT true,
  newsletter_frequency varchar(20) DEFAULT 'weekly',
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- EVENT ANALYTICS
-- =============================================================================
CREATE TABLE public.event_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  
  -- Traffic
  page_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  
  -- Engagement
  ticket_clicks integer DEFAULT 0,
  shares integer DEFAULT 0,
  favorites integer DEFAULT 0,
  
  -- Conversion
  tickets_sold integer DEFAULT 0,
  revenue decimal(10,2) DEFAULT 0,
  
  -- Source
  traffic_sources jsonb DEFAULT '{}'::jsonb,
  
  UNIQUE(event_id, date)
);

-- =============================================================================
-- SHOP/MARKETPLACE TABLES
-- =============================================================================
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES public.product_categories(id) ON DELETE CASCADE,
  image_url varchar(1000),
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.product_categories(id) ON DELETE SET NULL,
  
  -- Product info
  name varchar(255) NOT NULL,
  description text,
  sku varchar(100) UNIQUE,
  
  -- Pricing
  price decimal(10,2) NOT NULL,
  compare_at_price decimal(10,2),
  cost decimal(10,2),
  
  -- Inventory
  track_inventory boolean DEFAULT true,
  quantity integer DEFAULT 0,
  allow_backorder boolean DEFAULT false,
  
  -- Shipping
  weight decimal(10,2),
  requires_shipping boolean DEFAULT true,
  shipping_price decimal(10,2),
  
  -- Media
  images text[] DEFAULT '{}',
  
  -- Status
  status varchar(20) DEFAULT 'active',
  
  -- SEO
  tags text[] DEFAULT '{}',
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Venues
CREATE INDEX idx_venues_account_id ON public.venues(account_id);
CREATE INDEX idx_venues_location ON public.venues USING gist(location);
CREATE INDEX idx_venues_city_state ON public.venues(city, state);
CREATE INDEX idx_venues_slug ON public.venues(slug);
CREATE INDEX idx_venues_is_active ON public.venues(is_active);

-- Performers
CREATE INDEX idx_performers_account_id ON public.performers(account_id);
CREATE INDEX idx_performers_genres ON public.performers USING gin(genres);
CREATE INDEX idx_performers_slug ON public.performers(slug);

-- Events
CREATE INDEX idx_events_account_id ON public.events(account_id);
CREATE INDEX idx_events_venue_id ON public.events(venue_id);
CREATE INDEX idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_category ON public.events(category);

-- Bookings
CREATE INDEX idx_bookings_account_id ON public.bookings(account_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX idx_bookings_booking_number ON public.bookings(booking_number);
CREATE INDEX idx_bookings_date ON public.bookings(date);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- Tickets
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_qr_code ON public.tickets(qr_code);
CREATE INDEX idx_tickets_status ON public.tickets(status);

-- Calendars
CREATE INDEX idx_calendars_owner_id ON public.calendars(owner_id);
CREATE INDEX idx_calendars_slug ON public.calendars(slug);
CREATE INDEX idx_calendars_visibility ON public.calendars(visibility);

-- Calendar Events
CREATE INDEX idx_calendar_events_calendar_id ON public.calendar_events(calendar_id);
CREATE INDEX idx_calendar_events_event_id ON public.calendar_events(event_id);
CREATE INDEX idx_calendar_events_start_datetime ON public.calendar_events(start_datetime);

-- Check-ins
CREATE INDEX idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX idx_checkins_venue_id ON public.checkins(venue_id);
CREATE INDEX idx_checkins_event_id ON public.checkins(event_id);
CREATE INDEX idx_checkins_location ON public.checkins USING gist(location);
CREATE INDEX idx_checkins_check_in_time ON public.checkins(check_in_time);
CREATE INDEX idx_checkins_is_active ON public.checkins(is_active);

-- Community Hubs
CREATE INDEX idx_hubs_slug ON public.community_hubs(slug);
CREATE INDEX idx_hubs_visibility ON public.community_hubs(visibility);
CREATE INDEX idx_hubs_category ON public.community_hubs(category);

-- Reviews
CREATE INDEX idx_reviews_venue_id ON public.reviews(venue_id);
CREATE INDEX idx_reviews_event_id ON public.reviews(event_id);
CREATE INDEX idx_reviews_performer_id ON public.reviews(performer_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Favorites
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_venue_id ON public.favorites(venue_id);
CREATE INDEX idx_favorites_event_id ON public.favorites(event_id);
CREATE INDEX idx_favorites_performer_id ON public.favorites(performer_id);

-- Messages
CREATE INDEX idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX idx_messages_from_user ON public.messages(from_user_id);
CREATE INDEX idx_messages_to_user ON public.messages(to_user_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Products
CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);

-- =============================================================================
-- FUNCTIONS
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
CREATE OR REPLACE FUNCTION generate_slug(input_text text, table_name text)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  -- Clean the input
  base_slug := lower(regexp_replace(input_text, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  
  -- Check uniqueness based on table
  IF table_name = 'events' THEN
    WHILE EXISTS(SELECT 1 FROM public.events WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
  ELSIF table_name = 'venues' THEN
    WHILE EXISTS(SELECT 1 FROM public.venues WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
  ELSIF table_name = 'performers' THEN
    WHILE EXISTS(SELECT 1 FROM public.performers WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
  ELSIF table_name = 'calendars' THEN
    WHILE EXISTS(SELECT 1 FROM public.calendars WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
  ELSIF table_name = 'community_hubs' THEN
    WHILE EXISTS(SELECT 1 FROM public.community_hubs WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
  END IF;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Update location point when lat/lng changes
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate distance between two points (in miles)
CREATE OR REPLACE FUNCTION calculate_distance(lat1 float, lng1 float, lat2 float, lng2 float)
RETURNS float AS $$
BEGIN
  RETURN ST_DistanceSphere(
    ST_SetSRID(ST_MakePoint(lng1, lat1), 4326),
    ST_SetSRID(ST_MakePoint(lng2, lat2), 4326)
  ) * 0.000621371; -- Convert meters to miles
END;
$$ LANGUAGE plpgsql;

-- Update review counts and ratings
CREATE OR REPLACE FUNCTION update_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.venue_id IS NOT NULL THEN
    UPDATE public.venues
    SET 
      review_count = (SELECT COUNT(*) FROM public.reviews WHERE venue_id = NEW.venue_id),
      rating = (SELECT AVG(rating)::decimal(3,2) FROM public.reviews WHERE venue_id = NEW.venue_id)
    WHERE id = NEW.venue_id;
  ELSIF NEW.event_id IS NOT NULL THEN
    -- Add event review stats if needed
  ELSIF NEW.performer_id IS NOT NULL THEN
    UPDATE public.performers
    SET 
      review_count = (SELECT COUNT(*) FROM public.reviews WHERE performer_id = NEW.performer_id),
      rating = (SELECT AVG(rating)::decimal(3,2) FROM public.reviews WHERE performer_id = NEW.performer_id)
    WHERE id = NEW.performer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update check-in likes count
CREATE OR REPLACE FUNCTION update_checkin_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.checkins 
    SET likes_count = likes_count + 1
    WHERE id = NEW.checkin_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.checkins 
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.checkin_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Booking defaults
CREATE TRIGGER set_booking_defaults_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION set_booking_defaults();

-- Booking number generation
CREATE OR REPLACE FUNCTION set_booking_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := generate_booking_number();
  END IF;
  
  IF NEW.qr_code IS NULL THEN
    NEW.qr_code := generate_qr_code();
  END IF;
  
  -- Calculate service fee (10% of subtotal)
  IF NEW.service_fee IS NULL AND NEW.subtotal IS NOT NULL THEN
    NEW.service_fee := round(NEW.subtotal * 0.1, 2);
  END IF;
  
  -- Calculate total
  NEW.total_price := NEW.subtotal + COALESCE(NEW.tax_amount, 0) + 
                     COALESCE(NEW.service_fee, 0) - COALESCE(NEW.discount_amount, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ticket defaults
CREATE OR REPLACE FUNCTION set_ticket_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  
  IF NEW.qr_code IS NULL THEN
    NEW.qr_code := generate_qr_code();
  END IF;
  
  -- Calculate total
  NEW.total_amount := NEW.face_value + COALESCE(NEW.service_fee, 0) + 
                      COALESCE(NEW.tax_amount, 0) - COALESCE(NEW.discount_amount, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_defaults_trigger
BEFORE INSERT ON public.tickets
FOR EACH ROW EXECUTE FUNCTION set_ticket_defaults();

-- Auto-generate slugs
CREATE TRIGGER set_event_slug_trigger
BEFORE INSERT ON public.events
FOR EACH ROW 
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION set_event_slug();

CREATE OR REPLACE FUNCTION set_event_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := generate_slug(NEW.title, 'events');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_venue_slug_trigger
BEFORE INSERT ON public.venues
FOR EACH ROW 
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION set_venue_slug();

CREATE OR REPLACE FUNCTION set_venue_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := generate_slug(NEW.name, 'venues');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_performer_slug_trigger
BEFORE INSERT ON public.performers
FOR EACH ROW 
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION set_performer_slug();

CREATE OR REPLACE FUNCTION set_performer_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := generate_slug(NEW.name, 'performers');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_calendar_slug_trigger
BEFORE INSERT ON public.calendars
FOR EACH ROW 
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION set_calendar_slug();

CREATE OR REPLACE FUNCTION set_calendar_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := generate_slug(NEW.name, 'calendars');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_hub_slug_trigger
BEFORE INSERT ON public.community_hubs
FOR EACH ROW 
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION set_hub_slug();

CREATE OR REPLACE FUNCTION set_hub_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := generate_slug(NEW.name, 'community_hubs');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update location points
CREATE TRIGGER update_venue_location_trigger
BEFORE INSERT OR UPDATE ON public.venues
FOR EACH ROW 
WHEN (NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL)
EXECUTE FUNCTION update_location_point();

CREATE TRIGGER update_event_location_trigger
BEFORE INSERT OR UPDATE ON public.events
FOR EACH ROW 
WHEN (NEW.location_latitude IS NOT NULL AND NEW.location_longitude IS NOT NULL)
EXECUTE FUNCTION update_location_point();

CREATE TRIGGER update_checkin_location_trigger
BEFORE INSERT OR UPDATE ON public.checkins
FOR EACH ROW 
EXECUTE FUNCTION update_checkin_location();

CREATE OR REPLACE FUNCTION update_checkin_location()
RETURNS TRIGGER AS $$
BEGIN
  -- Location is already a geography point, no conversion needed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update review statistics
CREATE TRIGGER update_review_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_review_stats();

-- Update check-in likes
CREATE TRIGGER update_checkin_likes_count_trigger
AFTER INSERT OR DELETE ON public.checkin_likes
FOR EACH ROW EXECUTE FUNCTION update_checkin_likes_count();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performers_updated_at BEFORE UPDATE ON public.performers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendars_updated_at BEFORE UPDATE ON public.calendars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkins_updated_at BEFORE UPDATE ON public.checkins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
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
ALTER TABLE public.calendar_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- BASIC RLS POLICIES (Add more specific policies based on your requirements)
-- =============================================================================

-- Venues
CREATE POLICY "Public can view active venues" ON public.venues
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create venues" ON public.venues
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own venues" ON public.venues
  FOR UPDATE USING (created_by = auth.uid() OR account_id IN (
    SELECT id FROM public.accounts WHERE primary_owner_user_id = auth.uid()
  ));

-- Events
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT TO authenticated WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (organizer_id = auth.uid());

-- Tickets
CREATE POLICY "Users can view their own tickets" ON public.tickets
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets" ON public.tickets
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid());

-- Messages
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT TO authenticated USING (
    from_user_id = auth.uid() OR to_user_id = auth.uid()
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (from_user_id = auth.uid());

-- User preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- Add more specific policies as needed...

-- =============================================================================
-- GRANTS (Adjust based on your needs)
-- =============================================================================

-- Grant usage on all tables to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant select on public tables to anon users
GRANT SELECT ON public.venues TO anon;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.performers TO anon;

-- =============================================================================
-- INITIAL DATA (Optional - Remove if not needed)
-- =============================================================================

-- Insert some product categories
INSERT INTO public.product_categories (name, slug, description) VALUES
  ('Tickets', 'tickets', 'Event tickets and passes'),
  ('Merchandise', 'merchandise', 'Event and artist merchandise'),
  ('Equipment', 'equipment', 'Music and event equipment'),
  ('Services', 'services', 'Event-related services')
ON CONFLICT (slug) DO NOTHING;