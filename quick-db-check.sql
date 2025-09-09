-- Quick Database Check
-- Run this entire script at once

-- 1. What tables exist?
SELECT 
    'Tables in public schema:' as check_type,
    string_agg(tablename, ', ' ORDER BY tablename) as result
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. Do event tables exist?
SELECT 
    'Event tables exist:' as check_type,
    string_agg(
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = t.table_name)
            THEN t.table_name || ' ✓'
            ELSE t.table_name || ' ✗'
        END, 
        ', '
    ) as result
FROM (VALUES ('events'), ('venues'), ('performers'), ('calendars'), ('bookings')) t(table_name);

-- 3. RLS disabled count
SELECT 
    'Tables with RLS disabled:' as check_type,
    COUNT(*)::text || ' tables' as result
FROM pg_tables t
WHERE schemaname = 'public'
AND NOT (SELECT relrowsecurity FROM pg_class WHERE oid = (t.schemaname||'.'||t.tablename)::regclass);

-- 4. Do critical views exist?
SELECT 
    'Critical views:' as check_type,
    string_agg(
        v.view_name || ': ' || 
        CASE WHEN EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = v.view_name)
             THEN 'EXISTS'
             ELSE 'MISSING'
        END,
        ', '
    ) as result
FROM (VALUES ('user_account_workspace'), ('user_accounts')) v(view_name);

-- 5. User count
SELECT 
    'Total users in system:' as check_type,
    COUNT(*)::text as result
FROM auth.users;

-- 6. Anon user has permissions on how many tables?
SELECT 
    'Anon user can access:' as check_type,
    COUNT(DISTINCT table_name)::text || ' tables' as result
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND grantee = 'anon';