/*
 * -------------------------------------------------------
 * Section: Subscription Types Seed Data
 * This creates the subscription types and sample data for the platform
 * -------------------------------------------------------
 */

-- Insert subscription types based on WTF pricing schedule
INSERT INTO public.subscription_types (name, description, user_type, price_monthly, price_yearly, features) VALUES
-- User/Fan subscriptions
('user_basic', 'Basic user - discover events and venues', 'fan', 0.00, 0.00, '{"browse_events": true, "search_events": true, "view_details": true, "personal_calendar": true, "purchase_tickets": true, "comments_reviews": true, "check_in": true, "basic_profile": true, "email_notifications": true, "saved_events_limit": 20}'),
('user_premium', 'Premium user - enhanced social and early access', 'fan', 9.99, 100.00, '{"browse_events": true, "search_events": true, "view_details": true, "personal_calendar": true, "purchase_tickets": true, "comments_reviews": true, "check_in": true, "basic_profile": true, "email_notifications": true, "unlimited_saved_events": true, "share_checkins": true, "direct_messaging": true, "friend_connections": true, "calendar_sharing": true, "group_planning": true, "social_discovery": true, "early_alerts": true, "early_ticket_access": true, "price_drop_alerts": true, "vip_events": true, "advanced_filters": true, "personal_analytics": true, "data_export": true, "enhanced_notifications": true, "priority_support": true, "double_points": true, "exclusive_perks": true, "premium_badge": true}'),

-- Performer subscriptions
('performer_basic', 'Basic performer - showcase your talent', 'performer', 0.00, 0.00, '{"basic_profile": true, "event_listings": 5, "basic_event_details": true, "contact_display": true, "social_links": true, "basic_search": true}'),
('performer_premium', 'Premium performer - verified and enhanced features', 'performer', 19.99, 200.00, '{"basic_profile": true, "verified_badge": true, "enhanced_profile": true, "custom_url": true, "unlimited_events": true, "early_publishing": true, "video_embedding": true, "fan_management": true, "direct_fan_messaging": true, "fan_alerts": true, "community_hub": true, "calendar_sharing": true, "presale_access": true, "booking_marketplace": true, "contract_management": true, "invoice_tools": true, "gear_marketplace": true, "merchandise_integration": true, "advanced_analytics": true, "attendee_data": true, "checkin_data": true, "calendar_save_data": true, "data_export": true, "community_creation": true, "mass_messaging": true, "content_curation": true, "monetization_tools": true, "free_ad_package": true, "self_serve_ads": true, "promotional_listings": true, "featured_placement": true, "cross_promotion": true}'),

-- Venue subscriptions
('venue_basic', 'Basic venue - list your venue', 'venue_manager', 0.00, 0.00, '{"basic_profile": true, "event_listings": 5, "basic_management": true, "contact_display": true, "operating_hours": true, "basic_search": true}'),
('venue_premium', 'Premium venue - verified and enhanced management', 'venue_manager', 19.99, 200.00, '{"basic_profile": true, "verified_badge": true, "enhanced_profile": true, "custom_url": true, "unlimited_events": true, "multi_space_management": true, "video_embedding": true, "booking_marketplace": true, "availability_calendar": true, "rate_card_tools": true, "contract_management": true, "invoice_processing": true, "staff_scheduling": true, "customer_messaging": true, "loyalty_program": true, "attendee_communication": true, "review_management": true, "community_building": true, "advanced_analytics": true, "attendee_data": true, "checkin_data": true, "calendar_save_data": true, "revenue_tracking": true, "data_export": true, "community_creation": true, "mass_messaging": true, "event_curation": true, "local_leadership": true, "free_ad_package": true, "self_serve_ads": true, "featured_listings": true, "event_promotion": true, "cross_promotion": true}'),

-- Organizer subscriptions (same as performer premium)
('organizer_basic', 'Basic organizer - create and manage events', 'performer', 0.00, 0.00, '{"basic_event_creation": true, "event_limit": 5, "standard_details": true, "basic_ticketing": true, "checkin_tools": true, "basic_promotion": true, "simple_forms": true}'),
('organizer_premium', 'Premium organizer - advanced event management', 'performer', 19.99, 200.00, '{"unlimited_events": true, "multi_tier_ticketing": true, "advanced_forms": true, "recurring_events": true, "event_series": true, "team_collaboration": true, "attendee_management": true, "advanced_analytics": true, "marketing_automation": true, "communication_tools": true, "data_export": true}'),

-- Influencer subscriptions
('influencer_premium', 'Premium influencer - create calendars and communities', 'influencer', 19.99, 200.00, '{"unlimited_calendars": true, "unlimited_communities": true, "advanced_analytics": true, "custom_branding": true, "priority_support": true, "revenue_sharing": true, "content_curation": true, "mass_messaging": true, "monetization_tools": true}'),

-- Sponsor subscriptions (custom pricing)
('sponsor_custom', 'Custom sponsor - promote your brand', 'venue_manager', 0.00, 0.00, '{"custom_pricing": true, "brand_promotion": true, "event_sponsorship": true, "advanced_analytics": true, "priority_placement": true, "custom_campaigns": true, "revenue_sharing": true}');

-- Create sample communities for influencers
INSERT INTO public.communities (name, slug, description, creator_id, category, location, is_public, member_count, event_count) VALUES
('Downtown Music Scene', 'downtown-music-scene', 'Discover the best live music in downtown', (SELECT id FROM auth.users LIMIT 1), 'Music', 'Downtown', true, 150, 25),
('Indie Art Collective', 'indie-art-collective', 'Supporting local independent artists', (SELECT id FROM auth.users LIMIT 1), 'Art', 'City Center', true, 89, 12),
('Tech Meetup Hub', 'tech-meetup-hub', 'Technology events and networking', (SELECT id FROM auth.users LIMIT 1), 'Technology', 'Tech District', true, 234, 18);

-- Create sample curated calendars
INSERT INTO public.curated_calendars (name, description, creator_id, community_id, is_public, event_count, follower_count) VALUES
('Weekend Warriors', 'The best weekend events in the city', (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM public.communities LIMIT 1), true, 15, 45),
('Music Lovers Guide', 'Curated music events by genre', (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM public.communities LIMIT 1), true, 22, 78),
('Art & Culture Calendar', 'Cultural events and exhibitions', (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM public.communities LIMIT 1), true, 8, 32);

-- Create sample user role links
INSERT INTO public.user_role_links (user_id, role_type, linked_entity_id, linked_entity_type, is_verified) VALUES
-- Link first user as a performer
((SELECT id FROM auth.users LIMIT 1), 'performer', (SELECT id FROM public.performers LIMIT 1), 'performer', true),
-- Link second user as venue manager
((SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'venue_manager', (SELECT id FROM public.venues LIMIT 1), 'venue', true),
-- Link third user as influencer
((SELECT id FROM auth.users OFFSET 2 LIMIT 1), 'influencer', NULL, NULL, true);

-- Create sample subscriptions
INSERT INTO public.user_subscriptions (user_id, subscription_type_id, status, billing_cycle, current_period_start, current_period_end) VALUES
-- Fan with premium subscription
((SELECT id FROM auth.users LIMIT 1), (SELECT id FROM public.subscription_types WHERE name = 'fan_premium'), 'active', 'monthly', NOW(), NOW() + INTERVAL '1 month'),
-- Performer with organizer subscription
((SELECT id FROM auth.users OFFSET 1 LIMIT 1), (SELECT id FROM public.subscription_types WHERE name = 'performer_organizer'), 'active', 'yearly', NOW(), NOW() + INTERVAL '1 year'),
-- Venue manager with sponsor subscription
((SELECT id FROM auth.users OFFSET 2 LIMIT 1), (SELECT id FROM public.subscription_types WHERE name = 'venue_sponsor'), 'active', 'monthly', NOW(), NOW() + INTERVAL '1 month'),
-- Influencer with pro subscription
((SELECT id FROM auth.users OFFSET 3 LIMIT 1), (SELECT id FROM public.subscription_types WHERE name = 'influencer_pro'), 'active', 'yearly', NOW(), NOW() + INTERVAL '1 year');

-- Update user profiles with correct user types
UPDATE public.user_profiles 
SET user_type = 'fan' 
WHERE id IN (SELECT id FROM auth.users LIMIT 1);

UPDATE public.user_profiles 
SET user_type = 'performer' 
WHERE id IN (SELECT id FROM auth.users OFFSET 1 LIMIT 1);

UPDATE public.user_profiles 
SET user_type = 'venue_manager' 
WHERE id IN (SELECT id FROM auth.users OFFSET 2 LIMIT 1);

UPDATE public.user_profiles 
SET user_type = 'influencer' 
WHERE id IN (SELECT id FROM auth.users OFFSET 3 LIMIT 1);

-- Add some sample calendar events
INSERT INTO public.calendar_events (calendar_id, event_id, added_by) VALUES
((SELECT id FROM public.curated_calendars LIMIT 1), (SELECT id FROM public.events LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM public.curated_calendars LIMIT 1), (SELECT id FROM public.events OFFSET 1 LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM public.curated_calendars OFFSET 1 LIMIT 1), (SELECT id FROM public.events OFFSET 2 LIMIT 1), (SELECT id FROM auth.users OFFSET 1 LIMIT 1));

-- Add some community members
INSERT INTO public.community_members (community_id, user_id, role) VALUES
((SELECT id FROM public.communities LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 'admin'),
((SELECT id FROM public.communities LIMIT 1), (SELECT id FROM auth.users OFFSET 1 LIMIT 1), 'member'),
((SELECT id FROM public.communities OFFSET 1 LIMIT 1), (SELECT id FROM auth.users OFFSET 2 LIMIT 1), 'admin'),
((SELECT id FROM public.communities OFFSET 1 LIMIT 1), (SELECT id FROM auth.users OFFSET 3 LIMIT 1), 'member');
