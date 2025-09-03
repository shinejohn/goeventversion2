-- CHECK RECORD COUNTS
SELECT 'communities' as table_name, count(*) as record_count FROM public.communities
UNION ALL
SELECT 'venues' as table_name, count(*) as record_count FROM public.venues
UNION ALL
SELECT 'events' as table_name, count(*) as record_count FROM public.events  
UNION ALL
SELECT 'performers' as table_name, count(*) as record_count FROM public.performers;