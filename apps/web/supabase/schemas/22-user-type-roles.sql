/*
 * -------------------------------------------------------
 * Section: User Type Roles
 * Add our specific user types as roles in the system
 * -------------------------------------------------------
 */

-- Add our specific user types as roles
INSERT INTO public.roles (name, hierarchy_level) VALUES 
  ('fan', 10),
  ('performer', 8),
  ('venue_manager', 6),
  ('influencer', 4),
  ('admin', 2)
ON CONFLICT (name) DO NOTHING;

-- Add role permissions for our user types
INSERT INTO public.role_permissions (role, permission) VALUES 
  -- Fan permissions
  ('fan', 'events.view'),
  ('fan', 'venues.view'),
  ('fan', 'performers.view'),
  ('fan', 'shop.purchase'),
  
  -- Performer permissions
  ('performer', 'events.view'),
  ('performer', 'events.create'),
  ('performer', 'events.manage'),
  ('performer', 'venues.view'),
  ('performer', 'performers.view'),
  ('performer', 'performers.create'),
  ('performer', 'performers.manage'),
  ('performer', 'shop.purchase'),
  
  -- Venue Manager permissions
  ('venue_manager', 'events.view'),
  ('venue_manager', 'events.create'),
  ('venue_manager', 'events.manage'),
  ('venue_manager', 'venues.view'),
  ('venue_manager', 'venues.create'),
  ('venue_manager', 'venues.manage'),
  ('venue_manager', 'performers.view'),
  ('venue_manager', 'shop.purchase'),
  
  -- Influencer permissions
  ('influencer', 'events.view'),
  ('influencer', 'events.create'),
  ('influencer', 'venues.view'),
  ('influencer', 'performers.view'),
  ('influencer', 'communities.create'),
  ('influencer', 'communities.manage'),
  ('influencer', 'calendars.create'),
  ('influencer', 'calendars.manage'),
  ('influencer', 'shop.purchase'),
  
  -- Admin permissions (inherits all)
  ('admin', 'events.view'),
  ('admin', 'events.create'),
  ('admin', 'events.manage'),
  ('admin', 'venues.view'),
  ('admin', 'venues.create'),
  ('admin', 'venues.manage'),
  ('performers.view'),
  ('performers.create'),
  ('performers.manage'),
  ('communities.view'),
  ('communities.create'),
  ('communities.manage'),
  ('calendars.view'),
  ('calendars.create'),
  ('calendars.manage'),
  ('shop.view'),
  ('shop.manage'),
  ('users.manage'),
  ('settings.manage')
ON CONFLICT (role, permission) DO NOTHING;
