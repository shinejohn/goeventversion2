-- Check if events table exists and show its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'events'
ORDER BY ordinal_position;

-- Check if there are any events
SELECT COUNT(*) as total_events FROM events;

-- Show first 5 events
SELECT id, title, status, start_datetime, created_at 
FROM events 
LIMIT 5;

-- Check specifically for published events
SELECT COUNT(*) as published_events 
FROM events 
WHERE status = 'published';

-- Check for future published events
SELECT COUNT(*) as future_published_events 
FROM events 
WHERE status = 'published' 
  AND start_datetime >= NOW();