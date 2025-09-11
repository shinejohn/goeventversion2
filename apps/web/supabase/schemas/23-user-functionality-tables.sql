-- User Functionality Tables
-- Tables needed for user dropdown functionality

-- =============================================================================
-- USER TICKETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  
  -- Ticket details
  ticket_type varchar(50) NOT NULL DEFAULT 'general',
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  price decimal(10,2) NOT NULL,
  status varchar(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'used')),
  
  -- QR Code for entry
  qr_code varchar(255) UNIQUE NOT NULL DEFAULT 'WTF-' || gen_random_uuid()::text,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_tickets_user_id ON public.user_tickets(user_id);
CREATE INDEX idx_user_tickets_event_id ON public.user_tickets(event_id);
CREATE INDEX idx_user_tickets_status ON public.user_tickets(status);

-- RLS
ALTER TABLE public.user_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
  ON public.user_tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own tickets"
  ON public.user_tickets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tickets"
  ON public.user_tickets FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================================================
-- USER SAVED ITEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Item details
  item_type varchar(20) NOT NULL CHECK (item_type IN ('event', 'venue', 'performer')),
  item_id uuid NOT NULL,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_saved_items_user_id ON public.user_saved_items(user_id);
CREATE INDEX idx_user_saved_items_type_id ON public.user_saved_items(item_type, item_id);

-- RLS
ALTER TABLE public.user_saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved items"
  ON public.user_saved_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own saved items"
  ON public.user_saved_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own saved items"
  ON public.user_saved_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================================================
-- FRIENDSHIPS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Status
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Ensure unique friendships
  UNIQUE(user_id, friend_id),
  CHECK(user_id != friend_id)
);

-- Indexes
CREATE INDEX idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);

-- RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own friendships"
  ON public.friendships FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friendships"
  ON public.friendships FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own friendships"
  ON public.friendships FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can delete their own friendships"
  ON public.friendships FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR friend_id = auth.uid());

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification details
  type varchar(50) NOT NULL,
  title varchar(255) NOT NULL,
  message text NOT NULL,
  link varchar(500),
  
  -- Status
  is_read boolean DEFAULT false,
  read_at timestamp with time zone,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================================================
-- USER PROFILES (if not exists)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile details
  display_name varchar(100),
  bio text,
  location varchar(200),
  website varchar(500),
  phone varchar(20),
  
  -- Social links
  social_links jsonb DEFAULT '{}'::jsonb,
  
  -- Preferences
  preferences jsonb DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_profiles_display_name ON public.user_profiles(display_name);
CREATE INDEX idx_user_profiles_location ON public.user_profiles(location);

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public profiles"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_user_tickets_updated_at
  BEFORE UPDATE ON public.user_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
