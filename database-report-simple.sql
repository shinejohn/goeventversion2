-- =====================================================
-- SIMPLE DATABASE REPORT
-- =====================================================

-- 1. CHECK WHAT TABLES EXIST
SELECT 'EXISTING TABLES:' as info;
SELECT tablename, tableowner 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. CHECK RLS STATUS
SELECT '---' as separator;
SELECT 'RLS STATUS:' as info;
SELECT 
    tablename,
    CASE 
        WHEN (SELECT relrowsecurity FROM pg_class WHERE oid = ('public.'||tablename)::regclass) 
        THEN 'ENABLED' 
        ELSE 'DISABLED' 
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3. CHECK VIEWS
SELECT '---' as separator;
SELECT 'EXISTING VIEWS:' as info;
SELECT viewname, viewowner 
FROM pg_views 
WHERE schemaname = 'public';

-- 4. CHECK SPECIFIC VIEWS WE NEED
SELECT '---' as separator;
SELECT 'REQUIRED VIEWS CHECK:' as info;
SELECT 
    'user_account_workspace' as view_name,
    EXISTS(SELECT 1 FROM pg_views WHERE viewname = 'user_account_workspace' AND schemaname = 'public') as exists
UNION ALL
SELECT 
    'user_accounts',
    EXISTS(SELECT 1 FROM pg_views WHERE viewname = 'user_accounts' AND schemaname = 'public');

-- 5. CHECK PERMISSIONS FOR ANON USER
SELECT '---' as separator;
SELECT 'ANON USER PERMISSIONS:' as info;
SELECT 
    tablename,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND grantee = 'anon'
GROUP BY tablename
ORDER BY tablename;

-- 6. CHECK PERMISSIONS FOR AUTHENTICATED USER
SELECT '---' as separator;
SELECT 'AUTHENTICATED USER PERMISSIONS:' as info;
SELECT 
    tablename,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND grantee = 'authenticated'
GROUP BY tablename
ORDER BY tablename;

-- 7. COUNT USERS
SELECT '---' as separator;
SELECT 'USER COUNT:' as info;
SELECT COUNT(*) as total_users FROM auth.users;

-- 8. CHECK EVENT TABLES
SELECT '---' as separator;
SELECT 'EVENT SYSTEM TABLES:' as info;
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'venues' AND schemaname = 'public') 
         THEN 'venues EXISTS' ELSE 'venues MISSING' END as status
UNION ALL
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'events' AND schemaname = 'public') 
         THEN 'events EXISTS' ELSE 'events MISSING' END
UNION ALL
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'performers' AND schemaname = 'public') 
         THEN 'performers EXISTS' ELSE 'performers MISSING' END
UNION ALL
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'calendars' AND schemaname = 'public') 
         THEN 'calendars EXISTS' ELSE 'calendars MISSING' END;