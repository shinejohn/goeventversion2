-- Community and Calendar Seed Data
-- This file populates the community and calendar tables with sample data

-- Update existing community_hubs with additional data
UPDATE public.community_hubs 
SET 
  image_url = 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  member_count = 3427,
  thread_count = 156,
  categories = ARRAY['music', 'arts', 'culture'],
  thread_types = ARRAY['Discussion', 'Question', 'Announcement', 'Resource', 'Event'],
  popular_tags = ARRAY['Miles Davis', 'Saxophone', 'Improvisation', 'Jazz History', 'Music Theory', 'Bebop', 'Venues', 'Albums'],
  is_public = true,
  status = 'active',
  location = 'Clearwater, FL',
  website_url = 'https://jazzlovers.com',
  social_links = '{"twitter": "https://twitter.com/jazzlovers", "facebook": "https://facebook.com/jazzlovers", "instagram": "https://instagram.com/jazzlovers"}'
WHERE slug = 'hub-1';

UPDATE public.community_hubs 
SET 
  image_url = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  member_count = 2156,
  thread_count = 89,
  categories = ARRAY['lifestyle', 'hobbies'],
  thread_types = ARRAY['Discussion', 'Question', 'Announcement', 'Resource', 'Event'],
  popular_tags = ARRAY['Composting', 'Urban Farming', 'Seed Starting', 'Container Gardens', 'Herbs', 'Sustainable', 'Hydroponics'],
  is_public = true,
  status = 'active',
  location = 'Tampa, FL',
  website_url = 'https://urbangardeners.com',
  social_links = '{"twitter": "https://twitter.com/urbangardeners", "facebook": "https://facebook.com/urbangardeners", "instagram": "https://instagram.com/urbangardeners"}'
WHERE slug = 'hub-2';

UPDATE public.community_hubs 
SET 
  image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  cover_image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  member_count = 1851,
  thread_count = 67,
  categories = ARRAY['sports', 'fitness'],
  thread_types = ARRAY['Discussion', 'Question', 'Announcement', 'Resource', 'Event'],
  popular_tags = ARRAY['Volleyball', 'Beach Sports', 'Tournament', 'Training', 'Equipment', 'Rules', 'Technique', 'Fitness'],
  is_public = true,
  status = 'active',
  location = 'Miami, FL',
  website_url = 'https://beachvolleyballleague.com',
  social_links = '{"twitter": "https://twitter.com/beachvolleyball", "facebook": "https://facebook.com/beachvolleyball", "instagram": "https://instagram.com/beachvolleyball"}'
WHERE slug = 'hub-3';

-- Add more community hubs
INSERT INTO public.community_hubs (name, description, slug, image_url, cover_image_url, member_count, thread_count, categories, thread_types, popular_tags, is_public, status, location, website_url, social_links)
VALUES 
  ('Tech Entrepreneurs', 'A community for tech entrepreneurs, startup founders, and innovators', 'tech-entrepreneurs', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 5420, 234, ARRAY['technology', 'business', 'startups'], ARRAY['Discussion', 'Question', 'Announcement', 'Resource', 'Event'], ARRAY['Startup', 'Funding', 'Technology', 'Innovation', 'Networking', 'Marketing', 'Product', 'Growth'], true, 'active', 'San Francisco, CA', 'https://techentrepreneurs.com', '{"twitter": "https://twitter.com/techentrepreneurs", "linkedin": "https://linkedin.com/company/techentrepreneurs"}'),
  
  ('Photography Enthusiasts', 'Share your passion for photography and learn from fellow photographers', 'photography-enthusiasts', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 3120, 178, ARRAY['arts', 'photography', 'creative'], ARRAY['Discussion', 'Question', 'Announcement', 'Resource', 'Event'], ARRAY['Portrait', 'Landscape', 'Street Photography', 'Gear', 'Editing', 'Composition', 'Lighting', 'Techniques'], true, 'active', 'New York, NY', 'https://photographyenthusiasts.com', '{"instagram": "https://instagram.com/photographyenthusiasts", "flickr": "https://flickr.com/groups/photographyenthusiasts"}');

-- Add sample curated calendars
INSERT INTO public.curated_calendars (name, description, slug, event_count, subscriber_count, is_public, color, image_url)
VALUES 
  ('Jazz Lovers Calendar', 'A curated calendar of jazz events and performances', 'jazz-lovers', 15, 342, true, '#8B5CF6', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  
  ('Rock & Roll Events', 'All the best rock concerts and events in the area', 'rock-roll', 23, 567, true, '#EF4444', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  
  ('Classical Music Calendar', 'Symphony orchestras, chamber music, and classical performances', 'classical-music', 18, 234, true, '#3B82F6', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  
  ('Comedy Shows', 'Stand-up comedy, improv, and comedy events', 'comedy-shows', 31, 189, true, '#F59E0B', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  
  ('Art & Culture Events', 'Museums, galleries, and cultural events', 'art-culture', 27, 445, true, '#10B981', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
  
  ('Food & Wine Events', 'Culinary experiences, wine tastings, and food festivals', 'food-wine', 19, 298, true, '#F97316', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');

-- Add sample community threads (using existing events as a base)
INSERT INTO public.community_threads (community_id, author_id, title, content, thread_type, tags, view_count, reply_count, like_count)
SELECT 
  ch.id,
  '00000000-0000-0000-0000-000000000000'::uuid, -- Placeholder user ID
  CASE 
    WHEN ch.slug = 'hub-1' THEN 'Recommendations for beginner jazz albums?'
    WHEN ch.slug = 'hub-2' THEN 'What vegetables grow best in containers?'
    WHEN ch.slug = 'hub-3' THEN 'Best beach volleyball techniques for beginners?'
    ELSE 'Welcome to our community!'
  END,
  CASE 
    WHEN ch.slug = 'hub-1' THEN 'I''m new to jazz and looking for some great albums to start with. What would you recommend for someone just getting into the genre?'
    WHEN ch.slug = 'hub-2' THEN 'I have limited space but want to grow my own vegetables. What are the best options for container gardening?'
    WHEN ch.slug = 'hub-3' THEN 'I''m new to beach volleyball and want to improve my game. What are the most important techniques to focus on?'
    ELSE 'This is a great place to connect with like-minded people and share your experiences!'
  END,
  'Question',
  CASE 
    WHEN ch.slug = 'hub-1' THEN ARRAY['Jazz', 'Music', 'Recommendations']
    WHEN ch.slug = 'hub-2' THEN ARRAY['Gardening', 'Containers', 'Vegetables']
    WHEN ch.slug = 'hub-3' THEN ARRAY['Volleyball', 'Beach Sports', 'Technique']
    ELSE ARRAY['Welcome', 'Community']
  END,
  FLOOR(RANDOM() * 500) + 50,
  FLOOR(RANDOM() * 20) + 1,
  FLOOR(RANDOM() * 50) + 5
FROM public.community_hubs ch
WHERE ch.slug IN ('hub-1', 'hub-2', 'hub-3');

-- Add more sample threads
INSERT INTO public.community_threads (community_id, author_id, title, content, thread_type, tags, view_count, reply_count, like_count)
SELECT 
  ch.id,
  '00000000-0000-0000-0000-000000000000'::uuid,
  CASE 
    WHEN ch.slug = 'hub-1' THEN 'Anyone going to the Downtown Jazz Festival next month?'
    WHEN ch.slug = 'hub-2' THEN 'Starting seeds indoors: tips and tricks'
    WHEN ch.slug = 'hub-3' THEN 'Beach volleyball tournament this weekend'
    ELSE 'Community guidelines and rules'
  END,
  CASE 
    WHEN ch.slug = 'hub-1' THEN 'The Downtown Jazz Festival is coming up next month and I''m planning to attend. Would love to meet up with other community members!'
    WHEN ch.slug = 'hub-2' THEN 'I''ve been starting seeds indoors for the past few years and have learned some great techniques. Here are my top tips...'
    WHEN ch.slug = 'hub-3' THEN 'There''s a beach volleyball tournament happening this weekend at South Beach. Anyone interested in forming a team?'
    ELSE 'Please take a moment to read our community guidelines to ensure everyone has a positive experience.'
  END,
  'Discussion',
  CASE 
    WHEN ch.slug = 'hub-1' THEN ARRAY['Festival', 'Jazz', 'Meetup']
    WHEN ch.slug = 'hub-2' THEN ARRAY['Seeds', 'Indoor', 'Gardening']
    WHEN ch.slug = 'hub-3' THEN ARRAY['Tournament', 'Beach', 'Team']
    ELSE ARRAY['Guidelines', 'Rules', 'Community']
  END,
  FLOOR(RANDOM() * 300) + 30,
  FLOOR(RANDOM() * 15) + 1,
  FLOOR(RANDOM() * 30) + 3
FROM public.community_hubs ch
WHERE ch.slug IN ('hub-1', 'hub-2', 'hub-3');

-- Add sample calendar events (link existing events to calendars)
INSERT INTO public.calendar_events (calendar_id, event_id, added_by)
SELECT 
  cc.id,
  e.id,
  '00000000-0000-0000-0000-000000000000'::uuid
FROM public.curated_calendars cc
CROSS JOIN public.events e
WHERE cc.slug = 'jazz-lovers' 
  AND e.category ILIKE '%jazz%'
LIMIT 5;

INSERT INTO public.calendar_events (calendar_id, event_id, added_by)
SELECT 
  cc.id,
  e.id,
  '00000000-0000-0000-0000-000000000000'::uuid
FROM public.curated_calendars cc
CROSS JOIN public.events e
WHERE cc.slug = 'rock-roll' 
  AND (e.category ILIKE '%rock%' OR e.category ILIKE '%music%')
LIMIT 8;

INSERT INTO public.calendar_events (calendar_id, event_id, added_by)
SELECT 
  cc.id,
  e.id,
  '00000000-0000-0000-0000-000000000000'::uuid
FROM public.curated_calendars cc
CROSS JOIN public.events e
WHERE cc.slug = 'comedy-shows' 
  AND e.category ILIKE '%comedy%'
LIMIT 6;

-- Update calendar event counts
UPDATE public.curated_calendars 
SET event_count = (
  SELECT COUNT(*) 
  FROM public.calendar_events 
  WHERE calendar_id = curated_calendars.id
);
