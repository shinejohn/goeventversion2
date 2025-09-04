-- Populate new UI fields with realistic test data
-- Run this after the structure migration to add test data

BEGIN;

-- ==========================================
-- UPDATE VENUES WITH NEW UI FIELDS
-- ==========================================

-- Update venues with realistic ratings, venue types, and amenities
UPDATE public.venues 
SET 
  rating = CASE 
    WHEN name LIKE '%Grand%' THEN 4.8
    WHEN name LIKE '%Blue%' THEN 4.6
    WHEN name LIKE '%Crystal%' THEN 4.7
    WHEN name LIKE '%Sunset%' THEN 4.9
    WHEN name LIKE '%Garden%' THEN 4.5
    WHEN name LIKE '%Warehouse%' THEN 4.3
    WHEN name LIKE '%Rooftop%' THEN 4.4
    WHEN name LIKE '%Plaza%' THEN 4.6
    ELSE 4.5 + (RANDOM() * 0.4) -- 4.5 to 4.9
  END,
  review_count = FLOOR(50 + RANDOM() * 200)::int, -- 50-250 reviews
  price_range = CASE
    WHEN max_capacity > 1000 THEN 3 -- $$$
    WHEN max_capacity > 500 THEN 2  -- $$
    ELSE 1 -- $
  END,
  venue_type = CASE
    WHEN name ILIKE '%theatre%' THEN 'Theater'
    WHEN name ILIKE '%club%' OR name ILIKE '%bar%' THEN 'Nightclub'
    WHEN name ILIKE '%ballroom%' THEN 'Ballroom'
    WHEN name ILIKE '%amphitheater%' THEN 'Amphitheater'
    WHEN name ILIKE '%garden%' THEN 'Garden Venue'
    WHEN name ILIKE '%warehouse%' THEN 'Warehouse'
    WHEN name ILIKE '%rooftop%' THEN 'Rooftop Venue'
    WHEN name ILIKE '%plaza%' THEN 'Event Plaza'
    ELSE 'Entertainment Venue'
  END,
  amenities = CASE
    WHEN name ILIKE '%theatre%' THEN '{"sound_system": true, "lighting": true, "parking": true, "wheelchair_access": true, "restrooms": true, "air_conditioning": true, "backstage_area": true, "orchestra_pit": true}'::jsonb
    WHEN name ILIKE '%club%' THEN '{"sound_system": true, "lighting": true, "bar": true, "dance_floor": true, "vip_area": true, "coat_check": true, "security": true}'::jsonb
    WHEN name ILIKE '%ballroom%' THEN '{"sound_system": true, "lighting": true, "dance_floor": true, "catering_kitchen": true, "bridal_suite": true, "parking": true, "wheelchair_access": true}'::jsonb
    WHEN name ILIKE '%amphitheater%' THEN '{"sound_system": true, "lighting": true, "parking": true, "concessions": true, "lawn_seating": true, "covered_seating": true}'::jsonb
    ELSE '{"sound_system": true, "lighting": true, "parking": true, "restrooms": true, "wifi": true, "air_conditioning": true}'::jsonb
  END;

-- ==========================================
-- UPDATE EVENTS WITH NEW UI FIELDS  
-- ==========================================

-- Update events with amenities and enhanced details
UPDATE public.events 
SET 
  amenities = '{"parking": true, "restrooms": true, "concessions": true, "merchandise": true, "wheelchair_access": true, "photography": true, "coat_check": false, "vip_access": false}'::jsonb,
  lineup = CASE
    WHEN title ILIKE '%festival%' THEN '[
      {
        "day": "Day 1",
        "acts": [
          {"name": "Opening Act", "time": "7:00 PM", "duration": "45 min"},
          {"name": "Main Headliner", "time": "8:30 PM", "duration": "90 min"}
        ]
      }
    ]'::jsonb
    WHEN title ILIKE '%jazz%' THEN '[
      {
        "day": "Performance",
        "acts": [
          {"name": "Jazz Ensemble", "time": "8:00 PM", "duration": "2 hours"},
          {"name": "Special Guest", "time": "10:15 PM", "duration": "45 min"}
        ]
      }
    ]'::jsonb
    ELSE '[
      {
        "day": "Performance Day",
        "acts": [
          {"name": "Featured Performance", "time": "8:00 PM", "duration": "2 hours"}
        ]
      }
    ]'::jsonb
  END,
  ticket_info = CASE
    WHEN max_capacity > 1000 THEN '{"general": {"price": 45, "available": true}, "vip": {"price": 85, "available": true}, "early_bird": {"price": 35, "available": false}}'::jsonb
    WHEN max_capacity > 500 THEN '{"general": {"price": 25, "available": true}, "reserved": {"price": 40, "available": true}}'::jsonb
    ELSE '{"general": {"price": 15, "available": true}}'::jsonb
  END;

-- ==========================================
-- UPDATE PERFORMERS WITH NEW UI FIELDS
-- ==========================================

-- Update performers with review counts and pricing
UPDATE public.performers 
SET 
  total_reviews = FLOOR(10 + RANDOM() * 90)::int, -- 10-100 reviews
  price = CASE
    WHEN genre ILIKE '%classical%' OR genre ILIKE '%orchestra%' THEN '$2,500 - $5,000 per event'
    WHEN genre ILIKE '%jazz%' THEN '$800 - $2,000 per event'  
    WHEN genre ILIKE '%rock%' OR genre ILIKE '%pop%' THEN '$1,200 - $3,500 per event'
    WHEN genre ILIKE '%acoustic%' OR genre ILIKE '%folk%' THEN '$400 - $1,200 per event'
    WHEN genre ILIKE '%electronic%' OR genre ILIKE '%dj%' THEN '$600 - $2,500 per event'
    ELSE 'Contact for pricing'
  END,
  next_performance = CASE
    WHEN RANDOM() > 0.3 THEN (NOW() + INTERVAL '7 days' + (RANDOM() * INTERVAL '60 days'))
    ELSE NULL -- Some performers don't have scheduled shows
  END;

-- ==========================================
-- CREATE SAMPLE EVENT-PERFORMER RELATIONSHIPS
-- ==========================================

-- Link some events with performers (where both exist)
INSERT INTO public.event_performers (event_id, performer_id, role, billing_order)
SELECT 
  e.id as event_id,
  p.id as performer_id,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY e.id ORDER BY RANDOM()) = 1 THEN 'headliner'
    ELSE 'performer'
  END as role,
  ROW_NUMBER() OVER (PARTITION BY e.id ORDER BY RANDOM())::int as billing_order
FROM public.events e
CROSS JOIN public.performers p
WHERE RANDOM() > 0.7 -- Only link ~30% randomly for realistic data
  AND e.status = 'published'
  AND p.is_active = true
LIMIT 20; -- Limit to prevent too many relationships

COMMIT;