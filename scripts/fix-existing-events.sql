-- Update any existing events that don't have a status to be 'published'
UPDATE events 
SET status = 'published' 
WHERE status IS NULL OR status = '';

-- Also ensure future events are marked as published
UPDATE events 
SET status = 'published' 
WHERE start_datetime >= NOW() 
  AND (status IS NULL OR status = '');

-- Show count of events by status
SELECT status, COUNT(*) as count 
FROM events 
GROUP BY status;

-- Show sample of events
SELECT id, title, status, start_datetime, venue_id, city
FROM events
WHERE start_datetime >= NOW()
ORDER BY start_datetime
LIMIT 10;