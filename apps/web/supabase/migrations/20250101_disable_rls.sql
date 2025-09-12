-- Disable RLS on all tables to eliminate security restrictions during development
-- This allows us to focus on routing and data issues without RLS complications

-- Events and related tables
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_performers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Community and calendar tables
ALTER TABLE public.community_hubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_calendars DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_subscribers DISABLE ROW LEVEL SECURITY;

-- User-related tables
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies to ensure no restrictions remain
DROP POLICY IF EXISTS "events_read" ON public.events;
DROP POLICY IF EXISTS "events_write" ON public.events;
DROP POLICY IF EXISTS "venues_read" ON public.venues;
DROP POLICY IF EXISTS "venues_write" ON public.venues;
DROP POLICY IF EXISTS "performers_read" ON public.performers;
DROP POLICY IF EXISTS "performers_write" ON public.performers;
DROP POLICY IF EXISTS "event_performers_read" ON public.event_performers;
DROP POLICY IF EXISTS "event_performers_write" ON public.event_performers;
DROP POLICY IF EXISTS "tickets_read" ON public.tickets;
DROP POLICY IF EXISTS "tickets_write" ON public.tickets;
DROP POLICY IF EXISTS "bookings_read" ON public.bookings;
DROP POLICY IF EXISTS "bookings_write" ON public.bookings;

-- Community policies
DROP POLICY IF EXISTS "community_hubs_read" ON public.community_hubs;
DROP POLICY IF EXISTS "community_hubs_write" ON public.community_hubs;
DROP POLICY IF EXISTS "curated_calendars_read" ON public.curated_calendars;
DROP POLICY IF EXISTS "curated_calendars_write" ON public.curated_calendars;
DROP POLICY IF EXISTS "calendars_read" ON public.calendars;
DROP POLICY IF EXISTS "calendars_write" ON public.calendars;

-- User policies
DROP POLICY IF EXISTS "user_profiles_read" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_write" ON public.user_profiles;
DROP POLICY IF EXISTS "user_roles_read" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_write" ON public.user_roles;
DROP POLICY IF EXISTS "messages_read" ON public.messages;
DROP POLICY IF EXISTS "messages_write" ON public.messages;
DROP POLICY IF EXISTS "user_preferences_read" ON public.user_preferences;
DROP POLICY IF EXISTS "user_preferences_write" ON public.user_preferences;
DROP POLICY IF EXISTS "friendships_read" ON public.friendships;
DROP POLICY IF EXISTS "friendships_write" ON public.friendships;
DROP POLICY IF EXISTS "saved_items_read" ON public.saved_items;
DROP POLICY IF EXISTS "saved_items_write" ON public.saved_items;
