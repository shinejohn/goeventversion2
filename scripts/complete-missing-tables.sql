-- Complete Missing Tables Schema
-- This script creates all missing tables identified in the database connection inventory

-- =====================================================
-- SOCIAL FEATURES
-- =====================================================

-- Social Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  performer_id UUID REFERENCES performers(id) ON DELETE SET NULL,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friendships/Following Table
CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER PREFERENCES & PROFILES
-- =====================================================

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT true,
  event_reminders BOOLEAN DEFAULT true,
  friend_requests BOOLEAN DEFAULT true,
  message_alerts BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  theme VARCHAR(20) DEFAULT 'light',
  privacy_level VARCHAR(20) DEFAULT 'public',
  show_online_status BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Links Table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CALENDAR & SHARING FEATURES
-- =====================================================

-- Shared Calendars Table
CREATE TABLE IF NOT EXISTS shared_calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  cover_image VARCHAR(500),
  theme_color VARCHAR(7) DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Shares (who has access)
CREATE TABLE IF NOT EXISTS calendar_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID NOT NULL REFERENCES shared_calendars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission VARCHAR(20) CHECK (permission IN ('view', 'edit', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calendar_id, user_id)
);

-- Event Reminders
CREATE TABLE IF NOT EXISTS event_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) CHECK (reminder_type IN ('email', 'push', 'sms')),
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id, reminder_type)
);

-- =====================================================
-- COMMUNITY & HUBS
-- =====================================================

-- Community Hubs Table
CREATE TABLE IF NOT EXISTS community_hubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100),
  cover_image VARCHAR(500),
  avatar_image VARCHAR(500),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  member_count INT DEFAULT 0,
  event_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hub Members
CREATE TABLE IF NOT EXISTS hub_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID NOT NULL REFERENCES community_hubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hub_id, user_id)
);

-- Hub Activities
CREATE TABLE IF NOT EXISTS hub_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID NOT NULL REFERENCES community_hubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hub Gallery
CREATE TABLE IF NOT EXISTS hub_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID NOT NULL REFERENCES community_hubs(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  caption TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- E-COMMERCE
-- =====================================================

-- Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  description TEXT,
  image_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES product_categories(id),
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  stock_quantity INT DEFAULT 0,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping Cart
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS shop_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EVENT RELATIONSHIPS
-- =====================================================

-- Event Performers (many-to-many)
CREATE TABLE IF NOT EXISTS event_performers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  performer_id UUID NOT NULL REFERENCES performers(id) ON DELETE CASCADE,
  performance_time TIME,
  performance_order INT,
  is_headliner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, performer_id)
);

-- Event Comments
CREATE TABLE IF NOT EXISTS event_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  is_verified_attendee BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Liked Venues
CREATE TABLE IF NOT EXISTS liked_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, venue_id)
);

-- Liked Performers
CREATE TABLE IF NOT EXISTS liked_performers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  performer_id UUID NOT NULL REFERENCES performers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, performer_id)
);

-- =====================================================
-- STREAMING
-- =====================================================

-- Live Streams
CREATE TABLE IF NOT EXISTS live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  stream_key VARCHAR(255) UNIQUE,
  stream_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  is_live BOOLEAN DEFAULT false,
  viewer_count INT DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BOOKING SESSIONS
-- =====================================================

-- Booking Sessions (for multi-step booking process)
CREATE TABLE IF NOT EXISTS booking_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id),
  event_id UUID REFERENCES events(id),
  session_data JSONB DEFAULT '{}',
  current_step VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check-ins
CREATE TABLE IF NOT EXISTS checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id),
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location POINT,
  notes TEXT,
  UNIQUE(user_id, event_id)
);

-- =====================================================
-- ARTISTS (separate from performers)
-- =====================================================

CREATE TABLE IF NOT EXISTS artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  genre VARCHAR(100),
  image_url VARCHAR(500),
  website VARCHAR(500),
  social_links JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  follower_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CALENDARS (simpler version for personal calendars)
-- =====================================================

CREATE TABLE IF NOT EXISTS calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  color VARCHAR(7) DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- HUBS TABLE (alias for community_hubs)
-- =====================================================

-- Create a view for backwards compatibility
CREATE OR REPLACE VIEW hubs AS 
SELECT * FROM community_hubs;

-- Create a view for hub_memberships
CREATE OR REPLACE VIEW hub_memberships AS 
SELECT * FROM hub_members;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Social features indexes
CREATE INDEX idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);

-- Calendar indexes
CREATE INDEX idx_shared_calendars_owner_id ON shared_calendars(owner_id);
CREATE INDEX idx_shared_calendars_slug ON shared_calendars(slug);
CREATE INDEX idx_calendar_shares_calendar_id ON calendar_shares(calendar_id);
CREATE INDEX idx_event_reminders_user_id ON event_reminders(user_id, reminder_time);

-- Hub indexes
CREATE INDEX idx_community_hubs_slug ON community_hubs(slug);
CREATE INDEX idx_hub_members_hub_id ON hub_members(hub_id);
CREATE INDEX idx_hub_members_user_id ON hub_members(user_id);

-- E-commerce indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_shop_orders_user_id ON shop_orders(user_id);
CREATE INDEX idx_shop_orders_created_at ON shop_orders(created_at DESC);

-- Event relationship indexes
CREATE INDEX idx_event_performers_event_id ON event_performers(event_id);
CREATE INDEX idx_event_performers_performer_id ON event_performers(performer_id);
CREATE INDEX idx_event_comments_event_id ON event_comments(event_id);
CREATE INDEX idx_liked_venues_user_id ON liked_venues(user_id);
CREATE INDEX idx_liked_performers_user_id ON liked_performers(user_id);

-- Booking indexes
CREATE INDEX idx_booking_sessions_user_id ON booking_sessions(user_id);
CREATE INDEX idx_booking_sessions_expires_at ON booking_sessions(expires_at);
CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_event_id ON checkins(event_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_performers ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- BASIC RLS POLICIES
-- =====================================================

-- Social Posts: Users can see public posts or their own
CREATE POLICY "social_posts_select" ON social_posts FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

-- Social Posts: Users can create their own posts
CREATE POLICY "social_posts_insert" ON social_posts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Social Posts: Users can update their own posts
CREATE POLICY "social_posts_update" ON social_posts FOR UPDATE
  USING (user_id = auth.uid());

-- Social Posts: Users can delete their own posts
CREATE POLICY "social_posts_delete" ON social_posts FOR DELETE
  USING (user_id = auth.uid());

-- Friendships: Users can see their own friendships
CREATE POLICY "friendships_select" ON friendships FOR SELECT
  USING (user_id = auth.uid() OR friend_id = auth.uid());

-- Messages: Users can see messages they sent or received
CREATE POLICY "messages_select" ON messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Messages: Users can send messages
CREATE POLICY "messages_insert" ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Notifications: Users can see their own notifications
CREATE POLICY "notifications_select" ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- User Preferences: Users can manage their own preferences
CREATE POLICY "user_preferences_all" ON user_preferences FOR ALL
  USING (user_id = auth.uid());

-- Products: Everyone can view active products
CREATE POLICY "products_select" ON products FOR SELECT
  USING (is_active = true);

-- Cart Items: Users can manage their own cart
CREATE POLICY "cart_items_all" ON cart_items FOR ALL
  USING (user_id = auth.uid());

-- Add more policies as needed for other tables...