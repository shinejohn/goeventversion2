/*
 * -------------------------------------------------------
 * TEMPORARY: DISABLE RLS ON PUBLIC TABLES
 * This disables Row Level Security to allow all access
 * WARNING: Only for development/debugging - RE-ENABLE for production!
 * -------------------------------------------------------
 */

-- Disable RLS on all public-facing tables
ALTER TABLE public.venues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.performers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on any other tables that might be queried
ALTER TABLE public.friendships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Grant full access to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Make sure anon can execute all functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Log that RLS is disabled (so you remember to re-enable it!)
DO $$
BEGIN
  RAISE WARNING 'RLS IS DISABLED - THIS IS A SECURITY RISK! Re-enable before production!';
END $$;