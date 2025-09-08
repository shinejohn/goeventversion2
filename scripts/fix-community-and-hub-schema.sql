-- Fix Schema Based on Business Rules
-- 1. Remove community_id requirement from events (events belong to venues, not communities)
-- 2. Create proper hub and shared calendar structure
-- 3. Add status values as database enum

-- =====================================================
-- REMOVE COMMUNITY_ID FROM EVENTS
-- =====================================================
-- Events don't need community_id - they have venues which determine location
ALTER TABLE events 
  ALTER COLUMN community_id DROP NOT NULL;

-- Eventually remove this column entirely after code is updated
-- ALTER TABLE events DROP COLUMN community_id;

-- =====================================================
-- STATUS VALUES AS DATABASE ENUM
-- =====================================================
-- Create enum type for event status
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
    CREATE TYPE event_status AS ENUM (
      'draft',
      'published',
      'upcoming',
      'ongoing',
      'completed',
      'cancelled',
      'postponed'
    );
  END IF;
END $$;

-- Update events table to use enum (keeping existing varchar for now)
-- ALTER TABLE events ALTER COLUMN status TYPE event_status USING status::event_status;

-- =====================================================
-- SHARED CALENDARS (User-Curated Event Lists)
-- =====================================================
-- Redefine shared_calendars for user-curated lists
DROP TABLE IF EXISTS shared_calendars CASCADE;

CREATE TABLE shared_calendars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  is_public BOOLEAN DEFAULT true,
  tags TEXT[], -- ['jazz', 'morning', 'yoga', 'county-events']
  cover_image_url TEXT,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events in shared calendars
CREATE TABLE shared_calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES shared_calendars(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id),
  notes TEXT, -- curator's notes about why this event is included
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calendar_id, event_id)
);

-- Calendar followers/subscribers
CREATE TABLE shared_calendar_followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES shared_calendars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calendar_id, user_id)
);

-- =====================================================
-- HUBS (Shared Calendars + Social Features)
-- =====================================================
-- Hubs extend shared calendars with community features
DROP TABLE IF EXISTS hubs CASCADE;

CREATE TABLE hubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID REFERENCES shared_calendars(id) ON DELETE CASCADE UNIQUE,
  -- Hub-specific social features
  discussion_enabled BOOLEAN DEFAULT true,
  membership_type VARCHAR(50) DEFAULT 'open', -- open, request, invite-only
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  rules TEXT,
  welcome_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hub members (separate from calendar followers)
CREATE TABLE hub_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- admin, moderator, member
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hub_id, user_id)
);

-- Hub discussions/posts
CREATE TABLE hub_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES hubs(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  title VARCHAR(255),
  content TEXT,
  event_id UUID REFERENCES events(id), -- optional link to event being discussed
  is_pinned BOOLEAN DEFAULT false,
  is_announcement BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hub post comments
CREATE TABLE hub_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES hub_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT,
  parent_comment_id UUID REFERENCES hub_comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VENUE & PERFORMER COMMUNITY FEATURES
-- =====================================================
-- Venues and performers have built-in calendar and community capabilities

-- Venue followers (for venue's built-in calendar)
CREATE TABLE venue_followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(venue_id, user_id)
);

-- Performer followers (for performer's built-in calendar)  
CREATE TABLE performer_followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  performer_id UUID REFERENCES performers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(performer_id, user_id)
);

-- Venue community posts (venues have full community features)
CREATE TABLE venue_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT,
  image_url TEXT,
  event_id UUID REFERENCES events(id), -- discussing specific event
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performer community posts
CREATE TABLE performer_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  performer_id UUID REFERENCES performers(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT,
  image_url TEXT,
  event_id UUID REFERENCES events(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_shared_calendar_events_calendar ON shared_calendar_events(calendar_id);
CREATE INDEX idx_shared_calendar_events_event ON shared_calendar_events(event_id);
CREATE INDEX idx_hub_posts_hub ON hub_posts(hub_id);
CREATE INDEX idx_venue_followers_venue ON venue_followers(venue_id);
CREATE INDEX idx_performer_followers_performer ON performer_followers(performer_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE shared_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_calendar_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE performer_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE performer_posts ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Public read shared calendars" ON shared_calendars 
  FOR SELECT TO authenticated USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY "Users manage own calendars" ON shared_calendars 
  FOR ALL TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "Calendar events visible to followers" ON shared_calendar_events
  FOR SELECT TO authenticated USING (
    calendar_id IN (
      SELECT calendar_id FROM shared_calendar_followers WHERE user_id = auth.uid()
    ) OR
    calendar_id IN (
      SELECT id FROM shared_calendars WHERE owner_id = auth.uid() OR is_public = true
    )
  );

CREATE POLICY "Hub posts visible to members" ON hub_posts
  FOR SELECT TO authenticated USING (
    hub_id IN (
      SELECT hub_id FROM hub_members WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- MIGRATION NOTES
-- =====================================================
-- 1. Events no longer require community_id
-- 2. Shared calendars are user-curated event lists
-- 3. Hubs are shared calendars with social features
-- 4. Venues and performers have built-in community features
-- 5. Status values should become database enum