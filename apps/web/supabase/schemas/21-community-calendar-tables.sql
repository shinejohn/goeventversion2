-- Community and Calendar Tables Migration
-- This migration creates tables to support community detail pages and calendar functionality

-- Enable RLS
ALTER TABLE IF EXISTS public.community_hubs ENABLE ROW LEVEL SECURITY;

-- Add missing columns to community_hubs table
ALTER TABLE public.community_hubs 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS member_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS thread_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS thread_types TEXT[] DEFAULT '{"Discussion", "Question", "Announcement", "Resource", "Event"}',
ADD COLUMN IF NOT EXISTS popular_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- Create community_members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.community_hubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Enable RLS on community_members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Create community_threads table
CREATE TABLE IF NOT EXISTS public.community_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.community_hubs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  thread_type TEXT DEFAULT 'Discussion' CHECK (thread_type IN ('Discussion', 'Question', 'Announcement', 'Resource', 'Event')),
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on community_threads
ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;

-- Create community_thread_replies table
CREATE TABLE IF NOT EXISTS public.community_thread_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.community_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.community_thread_replies(id) ON DELETE CASCADE,
  like_count INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on community_thread_replies
ALTER TABLE public.community_thread_replies ENABLE ROW LEVEL SECURITY;

-- Create curated_calendars table
CREATE TABLE IF NOT EXISTS public.curated_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_count INTEGER DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  color TEXT DEFAULT '#3B82F6',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on curated_calendars
ALTER TABLE public.curated_calendars ENABLE ROW LEVEL SECURITY;

-- Create calendar_events table (links events to curated calendars)
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES public.curated_calendars(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calendar_id, event_id)
);

-- Enable RLS on calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create calendar_subscribers table
CREATE TABLE IF NOT EXISTS public.calendar_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES public.curated_calendars(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(calendar_id, user_id)
);

-- Enable RLS on calendar_subscribers
ALTER TABLE public.calendar_subscribers ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_threads_community_id ON public.community_threads(community_id);
CREATE INDEX IF NOT EXISTS idx_community_threads_author_id ON public.community_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_community_threads_created_at ON public.community_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_thread_replies_thread_id ON public.community_thread_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_calendar_id ON public.calendar_events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_id ON public.calendar_events(event_id);
CREATE INDEX IF NOT EXISTS idx_calendar_subscribers_calendar_id ON public.calendar_subscribers(calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_subscribers_user_id ON public.calendar_subscribers(user_id);

-- Create RLS policies for community_hubs
CREATE POLICY IF NOT EXISTS "community_hubs_read" ON public.community_hubs
  FOR SELECT TO authenticated
  USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY IF NOT EXISTS "community_hubs_insert" ON public.community_hubs
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY IF NOT EXISTS "community_hubs_update" ON public.community_hubs
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY IF NOT EXISTS "community_hubs_delete" ON public.community_hubs
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- Create RLS policies for community_members
CREATE POLICY IF NOT EXISTS "community_members_read" ON public.community_members
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.community_hubs 
      WHERE id = community_id AND (is_public = true OR owner_id = auth.uid())
    )
  );

CREATE POLICY IF NOT EXISTS "community_members_insert" ON public.community_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "community_members_update" ON public.community_members
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "community_members_delete" ON public.community_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Create RLS policies for community_threads
CREATE POLICY IF NOT EXISTS "community_threads_read" ON public.community_threads
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_hubs 
      WHERE id = community_id AND (is_public = true OR owner_id = auth.uid())
    )
  );

CREATE POLICY IF NOT EXISTS "community_threads_insert" ON public.community_threads
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.community_members 
      WHERE community_id = community_threads.community_id AND user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "community_threads_update" ON public.community_threads
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "community_threads_delete" ON public.community_threads
  FOR DELETE TO authenticated
  USING (author_id = auth.uid());

-- Create RLS policies for community_thread_replies
CREATE POLICY IF NOT EXISTS "community_thread_replies_read" ON public.community_thread_replies
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_threads ct
      JOIN public.community_hubs ch ON ct.community_id = ch.id
      WHERE ct.id = thread_id AND (ch.is_public = true OR ch.owner_id = auth.uid())
    )
  );

CREATE POLICY IF NOT EXISTS "community_thread_replies_insert" ON public.community_thread_replies
  FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.community_threads ct
      JOIN public.community_members cm ON ct.community_id = cm.community_id
      WHERE ct.id = thread_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "community_thread_replies_update" ON public.community_thread_replies
  FOR UPDATE TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY IF NOT EXISTS "community_thread_replies_delete" ON public.community_thread_replies
  FOR DELETE TO authenticated
  USING (author_id = auth.uid());

-- Create RLS policies for curated_calendars
CREATE POLICY IF NOT EXISTS "curated_calendars_read" ON public.curated_calendars
  FOR SELECT TO authenticated
  USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY IF NOT EXISTS "curated_calendars_insert" ON public.curated_calendars
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY IF NOT EXISTS "curated_calendars_update" ON public.curated_calendars
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY IF NOT EXISTS "curated_calendars_delete" ON public.curated_calendars
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- Create RLS policies for calendar_events
CREATE POLICY IF NOT EXISTS "calendar_events_read" ON public.calendar_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.curated_calendars 
      WHERE id = calendar_id AND (is_public = true OR owner_id = auth.uid())
    )
  );

CREATE POLICY IF NOT EXISTS "calendar_events_insert" ON public.calendar_events
  FOR INSERT TO authenticated
  WITH CHECK (
    added_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.curated_calendars 
      WHERE id = calendar_id AND (is_public = true OR owner_id = auth.uid())
    )
  );

CREATE POLICY IF NOT EXISTS "calendar_events_delete" ON public.calendar_events
  FOR DELETE TO authenticated
  USING (added_by = auth.uid());

-- Create RLS policies for calendar_subscribers
CREATE POLICY IF NOT EXISTS "calendar_subscribers_read" ON public.calendar_subscribers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "calendar_subscribers_insert" ON public.calendar_subscribers
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "calendar_subscribers_delete" ON public.calendar_subscribers
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Create functions to update counts
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_hubs 
    SET member_count = member_count + 1 
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_hubs 
    SET member_count = member_count - 1 
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_community_thread_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_hubs 
    SET thread_count = thread_count + 1 
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_hubs 
    SET thread_count = thread_count - 1 
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_calendar_event_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.curated_calendars 
    SET event_count = event_count + 1 
    WHERE id = NEW.calendar_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.curated_calendars 
    SET event_count = event_count - 1 
    WHERE id = OLD.calendar_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_calendar_subscriber_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.curated_calendars 
    SET subscriber_count = subscriber_count + 1 
    WHERE id = NEW.calendar_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.curated_calendars 
    SET subscriber_count = subscriber_count - 1 
    WHERE id = OLD.calendar_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_community_member_count_trigger
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

CREATE TRIGGER update_community_thread_count_trigger
  AFTER INSERT OR DELETE ON public.community_threads
  FOR EACH ROW EXECUTE FUNCTION update_community_thread_count();

CREATE TRIGGER update_calendar_event_count_trigger
  AFTER INSERT OR DELETE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_calendar_event_count();

CREATE TRIGGER update_calendar_subscriber_count_trigger
  AFTER INSERT OR DELETE ON public.calendar_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_calendar_subscriber_count();

-- Create function to update thread reply count
CREATE OR REPLACE FUNCTION update_thread_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_threads 
    SET reply_count = reply_count + 1 
    WHERE id = NEW.thread_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_threads 
    SET reply_count = reply_count - 1 
    WHERE id = OLD.thread_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_reply_count_trigger
  AFTER INSERT OR DELETE ON public.community_thread_replies
  FOR EACH ROW EXECUTE FUNCTION update_thread_reply_count();
