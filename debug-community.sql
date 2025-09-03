-- DEBUG: Check if community was inserted
SELECT * FROM public.communities WHERE id = '00000000-0000-0000-0000-000000000001';

-- Also check what communities exist
SELECT id, name, slug FROM public.communities LIMIT 5;