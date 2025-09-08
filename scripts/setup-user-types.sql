-- User Types and Account Management Schema
-- This establishes the different types of users in the system

-- First, ensure we have the necessary user profile extensions
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN (
    'fan',              -- Regular event-goer
    'influencer',       -- Creates hubs and curated calendars
    'performer',        -- Artist/band member
    'venue_manager',    -- Manages a venue
    'organizer',        -- Event organizer
    'sponsor',          -- Event sponsor
    'admin'             -- Platform admin
  )),
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User can read their own profile and others' public info
CREATE POLICY "Users can view profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Link performers to their user accounts
ALTER TABLE performers 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS claimed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE;

-- Link venues to manager accounts
CREATE TABLE IF NOT EXISTS venue_managers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'manager',
  permissions JSONB DEFAULT '{"edit": true, "manage_events": true, "view_analytics": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(venue_id, user_id)
);

-- Enable RLS
ALTER TABLE venue_managers ENABLE ROW LEVEL SECURITY;

-- Venue managers can view their assignments
CREATE POLICY "Venue managers can view assignments" ON venue_managers
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM venue_managers vm2 
      WHERE vm2.venue_id = venue_managers.venue_id 
      AND vm2.user_id = auth.uid() 
      AND vm2.role = 'owner'
    )
  );

-- Link organizers to their user accounts  
ALTER TABLE organizers
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Link sponsors to their user accounts
ALTER TABLE sponsors
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255);

-- Influencer-specific features
CREATE TABLE IF NOT EXISTS influencer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  follower_count INTEGER DEFAULT 0,
  social_links JSONB DEFAULT '{}', -- {"instagram": "@handle", "tiktok": "@handle"}
  specialties TEXT[], -- ['nightlife', 'food', 'music']
  reach_metrics JSONB DEFAULT '{}',
  verified_influencer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;

-- Public can view influencer profiles
CREATE POLICY "View influencer profiles" ON influencer_profiles
  FOR SELECT USING (true);

-- Influencers can update their own profile
CREATE POLICY "Update own influencer profile" ON influencer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Fan features and preferences
CREATE TABLE IF NOT EXISTS fan_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  favorite_categories TEXT[],
  favorite_venues UUID[],
  favorite_performers UUID[],
  preferred_cities TEXT[],
  price_range JSONB DEFAULT '{"min": 0, "max": 500}',
  notifications JSONB DEFAULT '{"new_events": true, "price_drops": true, "venue_updates": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE fan_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only access their own preferences
CREATE POLICY "Users manage own preferences" ON fan_preferences
  FOR ALL USING (auth.uid() = user_id);

-- User follow relationships (fans follow venues/performers/influencers)
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_type VARCHAR(50) NOT NULL CHECK (following_type IN ('user', 'venue', 'performer')),
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_type, following_id)
);

-- Enable RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Anyone can view follows
CREATE POLICY "View follows" ON user_follows
  FOR SELECT USING (true);

-- Users can manage their own follows
CREATE POLICY "Manage own follows" ON user_follows
  FOR ALL USING (auth.uid() = follower_id);

-- Function to create appropriate profile based on user type
CREATE OR REPLACE FUNCTION create_user_profile(
  p_user_id UUID,
  p_user_type VARCHAR(50),
  p_display_name VARCHAR(255),
  p_metadata JSONB DEFAULT '{}'
)
RETURNS user_profiles AS $$
DECLARE
  v_profile user_profiles;
BEGIN
  -- Insert base profile
  INSERT INTO user_profiles (
    id, 
    user_type, 
    display_name,
    metadata
  ) VALUES (
    p_user_id,
    p_user_type,
    p_display_name,
    p_metadata
  )
  RETURNING * INTO v_profile;
  
  -- Create type-specific profile
  CASE p_user_type
    WHEN 'influencer' THEN
      INSERT INTO influencer_profiles (user_id) VALUES (p_user_id);
    WHEN 'fan' THEN  
      INSERT INTO fan_preferences (user_id) VALUES (p_user_id);
  END CASE;
  
  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to claim a performer profile
CREATE OR REPLACE FUNCTION claim_performer_profile(
  p_performer_id UUID,
  p_user_id UUID
) 
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if performer exists and isn't claimed
  IF NOT EXISTS (
    SELECT 1 FROM performers 
    WHERE id = p_performer_id 
    AND (claimed IS NULL OR claimed = false)
  ) THEN
    RAISE EXCEPTION 'Performer not found or already claimed';
  END IF;
  
  -- Update performer with user link
  UPDATE performers 
  SET 
    user_id = p_user_id,
    claimed = true,
    claimed_at = NOW()
  WHERE id = p_performer_id;
  
  -- Update user profile to performer type if needed
  UPDATE user_profiles 
  SET user_type = 'performer'
  WHERE id = p_user_id 
  AND user_type = 'fan';
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data for testing
DO $$
DECLARE
  v_fan_id UUID;
  v_influencer_id UUID;
  v_venue_manager_id UUID;
  v_performer_id UUID;
  v_organizer_id UUID;
  v_sponsor_id UUID;
BEGIN
  -- Create a fan user
  INSERT INTO auth.users (id, email) 
  VALUES (gen_random_uuid(), 'fan@example.com')
  RETURNING id INTO v_fan_id;
  
  PERFORM create_user_profile(v_fan_id, 'fan', 'Event Fan', 
    '{"interests": ["music", "food"]}');
  
  -- Create an influencer
  INSERT INTO auth.users (id, email) 
  VALUES (gen_random_uuid(), 'influencer@example.com')
  RETURNING id INTO v_influencer_id;
  
  PERFORM create_user_profile(v_influencer_id, 'influencer', 'Local Influencer',
    '{"instagram": "@localinfluencer"}');
    
  -- Create a venue manager
  INSERT INTO auth.users (id, email) 
  VALUES (gen_random_uuid(), 'venue@example.com')
  RETURNING id INTO v_venue_manager_id;
  
  PERFORM create_user_profile(v_venue_manager_id, 'venue_manager', 'Venue Manager', '{}');
  
  -- Link to a venue
  INSERT INTO venue_managers (venue_id, user_id, role)
  SELECT id, v_venue_manager_id, 'owner'
  FROM venues
  LIMIT 1;
  
  -- More user types can be added similarly...
EXCEPTION WHEN OTHERS THEN
  -- Ignore if users already exist
  NULL;
END;
$$;

-- Add indexes for performance
CREATE INDEX idx_user_profiles_type ON user_profiles(user_type);
CREATE INDEX idx_venue_managers_venue ON venue_managers(venue_id);
CREATE INDEX idx_venue_managers_user ON venue_managers(user_id);
CREATE INDEX idx_performers_user ON performers(user_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_type, following_id);