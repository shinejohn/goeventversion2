-- Multi-Role User System
-- A user can have multiple roles simultaneously

-- Base user profile (one per auth user)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- User can read all profiles (public info)
CREATE POLICY "Users can view profiles" ON user_profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- User roles table - a user can have multiple roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_type VARCHAR(50) NOT NULL CHECK (role_type IN (
    'fan',              -- Always active for any user
    'influencer',       -- Creates hubs and curated calendars
    'performer',        -- Artist/band member
    'venue_manager',    -- Manages venues
    'organizer',        -- Event organizer
    'sponsor',          -- Event sponsor
    'admin'             -- Platform admin
  )),
  is_active BOOLEAN DEFAULT true,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, role_type)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view all roles
CREATE POLICY "View user roles" ON user_roles
  FOR SELECT USING (true);

-- Users can manage their own roles
CREATE POLICY "Manage own roles" ON user_roles
  FOR ALL USING (auth.uid() = user_id);

-- Every user is automatically a fan
CREATE OR REPLACE FUNCTION ensure_fan_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role_type)
  VALUES (NEW.id, 'fan')
  ON CONFLICT (user_id, role_type) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_fan_role_to_user
AFTER INSERT ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION ensure_fan_role();

-- Performer profiles (when user activates performer role)
CREATE TABLE IF NOT EXISTS performer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  performer_id UUID REFERENCES performers(id), -- Can link to existing performer
  stage_name VARCHAR(255) NOT NULL,
  genres TEXT[],
  bio TEXT,
  social_links JSONB DEFAULT '{}',
  booking_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE performer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View performer profiles" ON performer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Manage own performer profile" ON performer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Venue management relationships
CREATE TABLE IF NOT EXISTS venue_managers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'manager' CHECK (role IN ('owner', 'manager', 'staff')),
  permissions JSONB DEFAULT '{"edit": true, "manage_events": true, "view_analytics": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(venue_id, user_id)
);

-- Enable RLS
ALTER TABLE venue_managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View venue managers" ON venue_managers
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM venue_managers vm2 
      WHERE vm2.venue_id = venue_managers.venue_id 
      AND vm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Venue owners can manage managers" ON venue_managers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM venue_managers vm
      WHERE vm.venue_id = venue_managers.venue_id
      AND vm.user_id = auth.uid()
      AND vm.role = 'owner'
    )
  );

-- Influencer profile (when user activates influencer role)
CREATE TABLE IF NOT EXISTS influencer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  follower_count INTEGER DEFAULT 0,
  social_links JSONB DEFAULT '{}',
  specialties TEXT[],
  reach_metrics JSONB DEFAULT '{}',
  verified_influencer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View influencer profiles" ON influencer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Update own influencer profile" ON influencer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Organizer profile (when user activates organizer role)
CREATE TABLE IF NOT EXISTS organizer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  organizer_id UUID REFERENCES organizers(id), -- Can link to existing organizer
  company_name VARCHAR(255),
  event_types TEXT[],
  experience_level VARCHAR(50),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View organizer profiles" ON organizer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Manage own organizer profile" ON organizer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Sponsor profile (when user activates sponsor role)
CREATE TABLE IF NOT EXISTS sponsor_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  sponsor_id UUID REFERENCES sponsors(id), -- Can link to existing sponsor
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  sponsorship_budget JSONB DEFAULT '{"min": 0, "max": 10000}',
  interests TEXT[],
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sponsor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View sponsor profiles" ON sponsor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Manage own sponsor profile" ON sponsor_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Fan preferences (always available for any user)
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

CREATE POLICY "Users manage own preferences" ON fan_preferences
  FOR ALL USING (auth.uid() = user_id);

-- User follow relationships
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

CREATE POLICY "View follows" ON user_follows
  FOR SELECT USING (true);

CREATE POLICY "Manage own follows" ON user_follows
  FOR ALL USING (auth.uid() = follower_id);

-- Function to activate a role for a user
CREATE OR REPLACE FUNCTION activate_user_role(
  p_user_id UUID,
  p_role_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Insert or reactivate the role
  INSERT INTO user_roles (user_id, role_type, is_active)
  VALUES (p_user_id, p_role_type, true)
  ON CONFLICT (user_id, role_type) 
  DO UPDATE SET is_active = true, activated_at = NOW();
  
  -- Create role-specific profile if needed
  CASE p_role_type
    WHEN 'performer' THEN
      INSERT INTO performer_profiles (user_id, stage_name)
      SELECT p_user_id, up.display_name
      FROM user_profiles up
      WHERE up.id = p_user_id
      ON CONFLICT (user_id) DO NOTHING;
      
    WHEN 'influencer' THEN
      INSERT INTO influencer_profiles (user_id)
      VALUES (p_user_id)
      ON CONFLICT (user_id) DO NOTHING;
      
    WHEN 'organizer' THEN
      INSERT INTO organizer_profiles (user_id)
      VALUES (p_user_id)
      ON CONFLICT (user_id) DO NOTHING;
      
    WHEN 'sponsor' THEN
      INSERT INTO sponsor_profiles (user_id, company_name)
      SELECT p_user_id, up.display_name
      FROM user_profiles up
      WHERE up.id = p_user_id
      ON CONFLICT (user_id) DO NOTHING;
  END CASE;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION user_has_role(
  p_user_id UUID,
  p_role_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = p_user_id
    AND role_type = p_role_type
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get all active roles for a user
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID)
RETURNS TABLE(role_type VARCHAR(50), is_active BOOLEAN, activated_at TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
  RETURN QUERY
  SELECT ur.role_type, ur.is_active, ur.activated_at
  FROM user_roles ur
  WHERE ur.user_id = p_user_id
  AND ur.is_active = true
  ORDER BY ur.activated_at;
END;
$$ LANGUAGE plpgsql STABLE;

-- Example: Creating a user who is both a fan and a performer who also manages a venue
DO $$
DECLARE
  v_user_id UUID;
  v_venue_id UUID;
BEGIN
  -- Create base user
  INSERT INTO auth.users (id, email) 
  VALUES (gen_random_uuid(), 'multi-role@example.com')
  RETURNING id INTO v_user_id;
  
  -- Create profile
  INSERT INTO user_profiles (id, display_name, bio)
  VALUES (v_user_id, 'Multi-Role User', 'I wear many hats!');
  
  -- They're automatically a fan via trigger
  
  -- Activate performer role
  PERFORM activate_user_role(v_user_id, 'performer');
  
  -- Activate venue_manager role
  PERFORM activate_user_role(v_user_id, 'venue_manager');
  
  -- Link them to a venue
  SELECT id INTO v_venue_id FROM venues LIMIT 1;
  INSERT INTO venue_managers (venue_id, user_id, role)
  VALUES (v_venue_id, v_user_id, 'manager');
  
  -- They could also become an influencer later
  PERFORM activate_user_role(v_user_id, 'influencer');
  
EXCEPTION WHEN OTHERS THEN
  -- Ignore if already exists
  NULL;
END;
$$;

-- Views for easy querying
CREATE OR REPLACE VIEW user_role_summary AS
SELECT 
  up.id,
  up.display_name,
  up.verified,
  array_agg(ur.role_type ORDER BY ur.activated_at) as roles,
  count(ur.role_type) as role_count
FROM user_profiles up
LEFT JOIN user_roles ur ON ur.user_id = up.id AND ur.is_active = true
GROUP BY up.id, up.display_name, up.verified;

-- Indexes for performance
CREATE INDEX idx_user_roles_user ON user_roles(user_id) WHERE is_active = true;
CREATE INDEX idx_user_roles_type ON user_roles(role_type) WHERE is_active = true;
CREATE INDEX idx_venue_managers_venue ON venue_managers(venue_id);
CREATE INDEX idx_venue_managers_user ON venue_managers(user_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_type, following_id);