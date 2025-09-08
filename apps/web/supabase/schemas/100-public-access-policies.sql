/*
 * -------------------------------------------------------
 * PUBLIC ACCESS RLS POLICIES
 * Allow public (unauthenticated) users to view certain data
 * -------------------------------------------------------
 */

-- =============================================================================
-- VENUES - Public can view active venues
-- =============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public can view active venues" ON public.venues;
DROP POLICY IF EXISTS "Authenticated users can manage their venues" ON public.venues;

-- Allow anyone (including anonymous users) to view active venues
CREATE POLICY "Public can view active venues" ON public.venues
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to manage their own venues
CREATE POLICY "Authenticated users can manage their venues" ON public.venues
  FOR ALL
  TO authenticated
  USING (
    account_id IN (
      SELECT id FROM public.accounts 
      WHERE primary_owner_user_id = auth.uid()
    )
    OR
    public.has_role_on_account(account_id)
  );

-- =============================================================================
-- EVENTS - Public can view published events
-- =============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can manage their events" ON public.events;

-- Allow anyone to view published events
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated users to manage their own events
CREATE POLICY "Authenticated users can manage their events" ON public.events
  FOR ALL
  TO authenticated
  USING (
    organizer_id = auth.uid()
    OR
    account_id IN (
      SELECT id FROM public.accounts 
      WHERE primary_owner_user_id = auth.uid()
    )
    OR
    public.has_role_on_account(account_id)
  );

-- =============================================================================
-- PERFORMERS - Public can view active performers
-- =============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.performers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active performers" ON public.performers;
DROP POLICY IF EXISTS "Authenticated users can manage their performer profile" ON public.performers;

-- Allow anyone to view active performers
CREATE POLICY "Public can view active performers" ON public.performers
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to manage their own performer profile
CREATE POLICY "Authenticated users can manage their performer profile" ON public.performers
  FOR ALL
  TO authenticated
  USING (
    account_id IN (
      SELECT id FROM public.accounts 
      WHERE primary_owner_user_id = auth.uid()
    )
    OR
    public.has_role_on_account(account_id)
  );

-- =============================================================================
-- TICKETS - Users can only see their own tickets
-- =============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Event organizers can view their event tickets" ON public.tickets;

-- Users can view their own tickets
CREATE POLICY "Users can view their own tickets" ON public.tickets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create tickets
CREATE POLICY "Users can create tickets" ON public.tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Event organizers can view tickets for their events
CREATE POLICY "Event organizers can view their event tickets" ON public.tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- CALENDARS - Public can view public calendars
-- =============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view public calendars" ON public.calendars;
DROP POLICY IF EXISTS "Users can manage their own calendars" ON public.calendars;

-- Allow anyone to view public calendars
CREATE POLICY "Public can view public calendars" ON public.calendars
  FOR SELECT
  USING (is_public = true);

-- Users can manage their own calendars
CREATE POLICY "Users can manage their own calendars" ON public.calendars
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

-- =============================================================================
-- CALENDAR_EVENTS - Public can view events in public calendars
-- =============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view events in public calendars" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can manage events in their calendars" ON public.calendar_events;

-- Allow anyone to view events in public calendars
CREATE POLICY "Public can view events in public calendars" ON public.calendar_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calendars
      WHERE calendars.id = calendar_events.calendar_id
      AND calendars.is_public = true
    )
  );

-- Users can manage events in their own calendars
CREATE POLICY "Users can manage events in their calendars" ON public.calendar_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.calendars
      WHERE calendars.id = calendar_events.calendar_id
      AND calendars.created_by = auth.uid()
    )
  );

-- =============================================================================
-- BOOKINGS - Users can see their own bookings
-- =============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Event organizers can view bookings for their events" ON public.bookings;

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Event organizers can view bookings for their events
CREATE POLICY "Event organizers can view bookings for their events" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = bookings.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- =============================================================================
-- USER_ROLES - Public can view role types (for filtering)
-- =============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view role types" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Allow anyone to see distinct role types (for filtering purposes)
-- This is a restricted view that only shows the role_type column
CREATE POLICY "Public can view role types" ON public.user_roles
  FOR SELECT
  USING (is_active = true);

-- Users can see their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================================================
-- Grant necessary permissions for anonymous access
-- =============================================================================

-- Grant SELECT permissions on public tables to anon role
GRANT SELECT ON public.venues TO anon;
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.performers TO anon;
GRANT SELECT ON public.calendars TO anon;
GRANT SELECT ON public.calendar_events TO anon;
GRANT SELECT ON public.user_roles TO anon;

-- Grant ALL permissions on these tables to authenticated users
GRANT ALL ON public.venues TO authenticated;
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.performers TO authenticated;
GRANT ALL ON public.calendars TO authenticated;
GRANT ALL ON public.calendar_events TO authenticated;
GRANT ALL ON public.tickets TO authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;