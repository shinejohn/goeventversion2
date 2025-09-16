/*
 * -------------------------------------------------------
 * Section: Enhanced Hubs System with Images
 * Schema for community hubs with proper image support and metadata
 * Based on Magic Patterns Hub UI requirements
 * -------------------------------------------------------
 */

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENHANCED HUBS SYSTEM
-- =============================================================================

-- Drop existing community_hubs table if it exists and recreate with enhanced schema
DROP TABLE IF EXISTS public.community_hubs CASCADE;

-- Enhanced community hubs table with image support
CREATE TABLE IF NOT EXISTS public.community_hubs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic hub info
  name varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  tagline text,
  description text,
  
  -- Visual assets
  banner_image varchar(1000),
  logo varchar(1000),
  gallery_images text[] DEFAULT '{}',
  
  -- Creator info
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  creator_name varchar(255) NOT NULL,
  creator_avatar varchar(1000),
  creator_verified boolean DEFAULT false,
  
  -- Hub settings
  visibility varchar(50) DEFAULT 'public', -- public, private, unlisted
  membership_type varchar(50) DEFAULT 'open', -- open, closed, invite_only
  is_featured boolean DEFAULT false,
  
  -- Categories and tags
  categories text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  
  -- Stats (denormalized for performance)
  members_count integer DEFAULT 0,
  events_count integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  growth_rate decimal(5,2) DEFAULT 0,
  
  -- Location (optional)
  location_name varchar(255),
  location_address text,
  location_city varchar(100),
  location_state varchar(100),
  location_country varchar(100),
  location_radius integer, -- in miles
  
  -- Settings
  allow_member_posts boolean DEFAULT true,
  allow_guest_viewing boolean DEFAULT true,
  require_approval boolean DEFAULT false,
  auto_approve_members boolean DEFAULT true,
  
  -- Monetization
  is_paid boolean DEFAULT false,
  subscription_price decimal(10,2) DEFAULT 0,
  currency varchar(3) DEFAULT 'USD',
  subscription_period varchar(50) DEFAULT 'monthly', -- monthly, yearly, lifetime
  
  -- Status
  status varchar(50) DEFAULT 'active', -- active, paused, archived, deleted
  is_verified boolean DEFAULT false,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_activity_at timestamptz,
  
  -- Constraints
  CONSTRAINT valid_visibility CHECK (visibility IN ('public', 'private', 'unlisted')),
  CONSTRAINT valid_membership_type CHECK (membership_type IN ('open', 'closed', 'invite_only')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'paused', 'archived', 'deleted')),
  CONSTRAINT valid_subscription_period CHECK (subscription_period IN ('monthly', 'yearly', 'lifetime')),
  CONSTRAINT valid_price CHECK (subscription_price >= 0),
  CONSTRAINT valid_members CHECK (members_count >= 0),
  CONSTRAINT valid_events CHECK (events_count >= 0)
);

-- Hub members table
CREATE TABLE IF NOT EXISTS public.hub_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Hub and user
  hub_id uuid REFERENCES public.community_hubs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Membership details
  role varchar(50) DEFAULT 'member', -- owner, admin, moderator, member
  status varchar(50) DEFAULT 'active', -- active, pending, suspended, banned
  
  -- Permissions
  can_post boolean DEFAULT true,
  can_comment boolean DEFAULT true,
  can_invite boolean DEFAULT false,
  can_moderate boolean DEFAULT false,
  
  -- Meta
  joined_at timestamptz DEFAULT now(),
  last_active_at timestamptz,
  invited_by uuid REFERENCES auth.users(id),
  invited_at timestamptz,
  
  -- Constraints
  UNIQUE(hub_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'pending', 'suspended', 'banned'))
);

-- Hub activities/posts table
CREATE TABLE IF NOT EXISTS public.hub_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Hub and user
  hub_id uuid REFERENCES public.community_hubs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity content
  type varchar(50) NOT NULL, -- post, event, announcement, discussion, question
  title varchar(255),
  content text,
  image_url varchar(1000),
  
  -- Engagement
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  
  -- Status
  is_pinned boolean DEFAULT false,
  is_approved boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_type CHECK (type IN ('post', 'event', 'announcement', 'discussion', 'question')),
  CONSTRAINT valid_likes CHECK (likes_count >= 0),
  CONSTRAINT valid_comments CHECK (comments_count >= 0)
);

-- Hub comments table
CREATE TABLE IF NOT EXISTS public.hub_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Activity and user
  activity_id uuid REFERENCES public.hub_activities(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.hub_comments(id) ON DELETE CASCADE, -- for replies
  
  -- Comment content
  content text NOT NULL,
  
  -- Engagement
  likes_count integer DEFAULT 0,
  
  -- Status
  is_approved boolean DEFAULT true,
  is_pinned boolean DEFAULT false,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  CONSTRAINT valid_likes CHECK (likes_count >= 0)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Community hubs indexes
CREATE INDEX IF NOT EXISTS idx_community_hubs_slug ON public.community_hubs(slug);
CREATE INDEX IF NOT EXISTS idx_community_hubs_creator ON public.community_hubs(creator_id);
CREATE INDEX IF NOT EXISTS idx_community_hubs_visibility ON public.community_hubs(visibility);
CREATE INDEX IF NOT EXISTS idx_community_hubs_status ON public.community_hubs(status);
CREATE INDEX IF NOT EXISTS idx_community_hubs_featured ON public.community_hubs(is_featured);
CREATE INDEX IF NOT EXISTS idx_community_hubs_members ON public.community_hubs(members_count DESC);
CREATE INDEX IF NOT EXISTS idx_community_hubs_created ON public.community_hubs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_hubs_activity ON public.community_hubs(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_hubs_categories ON public.community_hubs USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_community_hubs_tags ON public.community_hubs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_community_hubs_location ON public.community_hubs(location_city, location_state);

-- Hub members indexes
CREATE INDEX IF NOT EXISTS idx_hub_members_hub ON public.hub_members(hub_id);
CREATE INDEX IF NOT EXISTS idx_hub_members_user ON public.hub_members(user_id);
CREATE INDEX IF NOT EXISTS idx_hub_members_role ON public.hub_members(role);
CREATE INDEX IF NOT EXISTS idx_hub_members_status ON public.hub_members(status);

-- Hub activities indexes
CREATE INDEX IF NOT EXISTS idx_hub_activities_hub ON public.hub_activities(hub_id);
CREATE INDEX IF NOT EXISTS idx_hub_activities_user ON public.hub_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_hub_activities_type ON public.hub_activities(type);
CREATE INDEX IF NOT EXISTS idx_hub_activities_created ON public.hub_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hub_activities_pinned ON public.hub_activities(is_pinned);

-- Hub comments indexes
CREATE INDEX IF NOT EXISTS idx_hub_comments_activity ON public.hub_comments(activity_id);
CREATE INDEX IF NOT EXISTS idx_hub_comments_user ON public.hub_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_hub_comments_parent ON public.hub_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_hub_comments_created ON public.hub_comments(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS
ALTER TABLE public.community_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_comments ENABLE ROW LEVEL SECURITY;

-- Community hubs policies
-- Anyone can read public hubs
CREATE POLICY "community_hubs_read_public" ON public.community_hubs
  FOR SELECT TO authenticated, anon
  USING (visibility = 'public' AND status = 'active');

-- Creators can manage their own hubs
CREATE POLICY "community_hubs_manage_own" ON public.community_hubs
  FOR ALL TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Hub members policies
-- Users can view members of public hubs they're part of
CREATE POLICY "hub_members_read_public" ON public.hub_members
  FOR SELECT TO authenticated
  USING (
    hub_id IN (
      SELECT id FROM public.community_hubs 
      WHERE visibility = 'public' AND status = 'active'
    ) OR
    user_id = auth.uid()
  );

-- Users can manage their own memberships
CREATE POLICY "hub_members_manage_own" ON public.hub_members
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Hub activities policies
-- Anyone can read activities from public hubs
CREATE POLICY "hub_activities_read_public" ON public.hub_activities
  FOR SELECT TO authenticated, anon
  USING (
    is_approved = true AND
    hub_id IN (
      SELECT id FROM public.community_hubs 
      WHERE visibility = 'public' AND status = 'active'
    )
  );

-- Hub members can create activities
CREATE POLICY "hub_activities_create_member" ON public.hub_activities
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    hub_id IN (
      SELECT hub_id FROM public.hub_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Hub comments policies
-- Anyone can read approved comments on public activities
CREATE POLICY "hub_comments_read_public" ON public.hub_comments
  FOR SELECT TO authenticated, anon
  USING (
    is_approved = true AND
    activity_id IN (
      SELECT id FROM public.hub_activities 
      WHERE hub_id IN (
        SELECT id FROM public.community_hubs 
        WHERE visibility = 'public' AND status = 'active'
      )
    )
  );

-- Users can manage their own comments
CREATE POLICY "hub_comments_manage_own" ON public.hub_comments
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to update hub stats
CREATE OR REPLACE FUNCTION public.update_hub_stats(hub_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.community_hubs
  SET 
    members_count = (
      SELECT COUNT(*) FROM public.hub_members 
      WHERE hub_id = hub_id AND status = 'active'
    ),
    posts_count = (
      SELECT COUNT(*) FROM public.hub_activities 
      WHERE hub_id = hub_id AND is_approved = true
    ),
    last_activity_at = (
      SELECT MAX(created_at) FROM public.hub_activities 
      WHERE hub_id = hub_id
    ),
    updated_at = now()
  WHERE id = hub_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is member of hub
CREATE OR REPLACE FUNCTION public.is_hub_member(user_id uuid, hub_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.hub_members 
    WHERE user_id = user_id 
    AND hub_id = hub_id 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to update hub stats when members change
CREATE OR REPLACE FUNCTION public.trigger_update_hub_stats()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM public.update_hub_stats(NEW.hub_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.update_hub_stats(OLD.hub_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_hub_members_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.hub_members
  FOR EACH ROW EXECUTE FUNCTION public.trigger_update_hub_stats();

-- Trigger to update hub stats when activities change
CREATE TRIGGER trigger_hub_activities_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.hub_activities
  FOR EACH ROW EXECUTE FUNCTION public.trigger_update_hub_stats();

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert sample community hubs with proper images
INSERT INTO public.community_hubs (
  name, slug, tagline, description, banner_image, logo,
  creator_id, creator_name, creator_avatar, creator_verified,
  visibility, membership_type, is_featured,
  categories, tags, members_count, events_count, posts_count,
  location_city, location_state, status, is_verified
) VALUES
  (
    'Jazz Lovers Collective',
    'jazz-lovers',
    'Where jazz enthusiasts connect and discover',
    'A vibrant community dedicated to sharing jazz events, discussing legendary artists, and connecting musicians with venues. Join us to discover the best jazz performances in your area.',
    'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    (SELECT id FROM auth.users LIMIT 1),
    'Jazz Association',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    true,
    'public',
    'open',
    true,
    ARRAY['Music', 'Jazz', 'Arts & Culture'],
    ARRAY['Jazz', 'Music', 'Live Performance', 'Art', 'Culture'],
    3427,
    156,
    892,
    'Clearwater',
    'FL',
    'active',
    true
  ),
  (
    'Urban Gardeners Network',
    'urban-gardeners',
    'Growing community, one garden at a time',
    'Connect with fellow urban gardeners to share tips, organize seed swaps, and collaborate on community garden projects. Perfect for both beginners and experienced gardeners.',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    (SELECT id FROM auth.users LIMIT 1),
    'Green Thumb Community',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    false,
    'public',
    'open',
    true,
    ARRAY['Lifestyle', 'Gardening', 'Sustainability'],
    ARRAY['Gardening', 'Urban Farming', 'Sustainability', 'Community', 'Nature'],
    2156,
    89,
    456,
    'Clearwater',
    'FL',
    'active',
    false
  ),
  (
    'Fitness Enthusiasts',
    'fitness-enthusiasts',
    'Stay active, stay connected',
    'Join our community of fitness enthusiasts who share workout routines, nutrition tips, and organize group fitness events. From yoga to CrossFit, we cover it all.',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    (SELECT id FROM auth.users LIMIT 1),
    'Fitness Community',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    false,
    'public',
    'open',
    false,
    ARRAY['Fitness', 'Health', 'Wellness'],
    ARRAY['Fitness', 'Workout', 'Health', 'Wellness', 'Exercise'],
    1892,
    67,
    234,
    'Clearwater',
    'FL',
    'active',
    false
  ),
  (
    'Food & Wine Society',
    'food-wine-society',
    'Culinary adventures and wine discoveries',
    'A community for food lovers and wine enthusiasts to share recipes, discover new restaurants, and organize tasting events. From home cooking to fine dining.',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
    (SELECT id FROM auth.users LIMIT 1),
    'Culinary Community',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    false,
    'public',
    'open',
    false,
    ARRAY['Food', 'Wine', 'Cooking', 'Dining'],
    ARRAY['Food', 'Wine', 'Cooking', 'Restaurants', 'Recipes'],
    1234,
    45,
    178,
    'Clearwater',
    'FL',
    'active',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- GRANTS
-- =============================================================================

-- Grant permissions
GRANT SELECT ON public.community_hubs TO authenticated, anon;
GRANT ALL ON public.community_hubs TO authenticated;

GRANT SELECT ON public.hub_members TO authenticated;
GRANT ALL ON public.hub_members TO authenticated;

GRANT SELECT ON public.hub_activities TO authenticated, anon;
GRANT ALL ON public.hub_activities TO authenticated;

GRANT SELECT ON public.hub_comments TO authenticated, anon;
GRANT ALL ON public.hub_comments TO authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION public.update_hub_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_hub_member(uuid, uuid) TO authenticated;
