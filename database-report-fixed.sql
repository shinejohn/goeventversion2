-- =====================================================
-- COMPLETE DATABASE REPORT (FIXED)
-- =====================================================

-- 1. DATABASE OVERVIEW
SELECT '=== DATABASE OVERVIEW ===' as section;

SELECT 
    current_database() as database_name,
    current_user as current_user,
    version() as postgres_version,
    current_timestamp as report_generated_at;

-- 2. ALL TABLES WITH RLS STATUS
SELECT '=== TABLES WITH RLS STATUS ===' as section;

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
    CASE 
        WHEN (SELECT relrowsecurity FROM pg_class WHERE oid = (schemaname||'.'||tablename)::regclass) THEN 'ENABLED' 
        ELSE 'DISABLED' 
    END as rls_status,
    CASE 
        WHEN (SELECT relforcerowsecurity FROM pg_class WHERE oid = (schemaname||'.'||tablename)::regclass) THEN 'YES' 
        ELSE 'NO' 
    END as rls_forced
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3. RECORD COUNTS FOR EACH TABLE
SELECT '=== RECORD COUNTS ===' as section;

-- Check if tables exist before counting
SELECT 'accounts' as table_name, 
       CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'accounts' AND schemaname = 'public')
            THEN (SELECT COUNT(*) FROM public.accounts)::text
            ELSE 'TABLE MISSING' END as count
UNION ALL
SELECT 'accounts_memberships',
       CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'accounts_memberships' AND schemaname = 'public')
            THEN (SELECT COUNT(*) FROM public.accounts_memberships)::text
            ELSE 'TABLE MISSING' END
UNION ALL
SELECT 'roles',
       CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'roles' AND schemaname = 'public')
            THEN (SELECT COUNT(*) FROM public.roles)::text
            ELSE 'TABLE MISSING' END
UNION ALL
SELECT 'role_permissions',
       CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'role_permissions' AND schemaname = 'public')
            THEN (SELECT COUNT(*) FROM public.role_permissions)::text
            ELSE 'TABLE MISSING' END
UNION ALL
SELECT 'subscriptions',
       CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'subscriptions' AND schemaname = 'public')
            THEN (SELECT COUNT(*) FROM public.subscriptions)::text
            ELSE 'TABLE MISSING' END
UNION ALL
SELECT 'venues',
       CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'venues' AND schemaname = 'public')
            THEN (SELECT COUNT(*) FROM public.venues)::text
            ELSE 'TABLE MISSING' END
UNION ALL
SELECT 'events',
       CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'events' AND schemaname = 'public')
            THEN (SELECT COUNT(*) FROM public.events)::text
            ELSE 'TABLE MISSING' END
UNION ALL
SELECT 'performers',
       CASE WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'performers' AND schemaname = 'public')
            THEN (SELECT COUNT(*) FROM public.performers)::text
            ELSE 'TABLE MISSING' END
ORDER BY table_name;

-- 4. RLS POLICIES (Fixed column names)
SELECT '=== RLS POLICIES BY TABLE ===' as section;

SELECT 
    n.nspname as schema,
    c.relname as table,
    pol.polname as policy,
    CASE pol.polpermissive 
        WHEN TRUE THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END as type,
    CASE pol.polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END as command,
    (SELECT rolname FROM pg_roles WHERE oid = ANY(pol.polroles)) as roles
FROM pg_policy pol
JOIN pg_class c ON c.oid = pol.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
ORDER BY c.relname, pol.polname;

-- 5. TABLE PERMISSIONS
SELECT '=== TABLE PERMISSIONS ===' as section;

SELECT 
    schemaname,
    tablename,
    grantee,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY schemaname, tablename, grantee
ORDER BY tablename, grantee;

-- 6. VIEWS
SELECT '=== VIEWS ===' as section;

SELECT 
    schemaname,
    viewname,
    viewowner
FROM pg_views
WHERE schemaname = 'public'
ORDER BY viewname;

-- 7. VIEW PERMISSIONS
SELECT '=== VIEW PERMISSIONS ===' as section;

SELECT 
    table_schema,
    table_name as view_name,
    grantee,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN (SELECT viewname FROM pg_views WHERE schemaname = 'public')
AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY table_schema, table_name, grantee
ORDER BY table_name, grantee;

-- 8. CHECK IF SPECIFIC VIEWS EXIST
SELECT '=== CHECK SPECIFIC VIEWS ===' as section;

SELECT 
    'user_account_workspace' as expected_view,
    CASE WHEN EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'user_account_workspace') 
         THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
    'user_accounts',
    CASE WHEN EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'user_accounts') 
         THEN 'EXISTS' ELSE 'MISSING' END
ORDER BY expected_view;

-- 9. CHECK SPECIFIC TABLES EXISTENCE
SELECT '=== SPECIFIC TABLES CHECK ===' as section;

WITH expected_tables AS (
    SELECT unnest(ARRAY[
        'accounts',
        'accounts_memberships',
        'roles',
        'role_permissions',
        'subscriptions',
        'billing_customers',
        'invitations',
        'notifications',
        'config',
        'venues',
        'events',
        'performers',
        'tickets',
        'calendars',
        'bookings'
    ]) as table_name
)
SELECT 
    e.table_name,
    CASE 
        WHEN t.tablename IS NOT NULL THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM expected_tables e
LEFT JOIN pg_tables t ON t.tablename = e.table_name AND t.schemaname = 'public'
ORDER BY 
    CASE WHEN t.tablename IS NOT NULL THEN 0 ELSE 1 END,
    e.table_name;

-- 10. FUNCTIONS (simplified)
SELECT '=== PUBLIC FUNCTIONS ===' as section;

SELECT 
    p.proname as function_name,
    CASE p.prosecdef
        WHEN true THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END as security
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
AND p.prokind = 'f'
ORDER BY p.proname
LIMIT 20;

-- 11. AUTH USERS COUNT
SELECT '=== AUTH USERS ===' as section;

SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
    COUNT(CASE WHEN last_sign_in_at IS NOT NULL THEN 1 END) as active_users
FROM auth.users;

-- 12. ROLES CHECK
SELECT '=== DATABASE ROLES ===' as section;

SELECT 
    rolname,
    rolcanlogin as can_login,
    rolsuper as is_super
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'service_role')
ORDER BY rolname;

-- 13. SCHEMA PERMISSIONS
SELECT '=== SCHEMA PERMISSIONS ===' as section;

SELECT 
    nspname as schema_name,
    'anon' as role_name,
    has_schema_privilege('anon', nspname, 'USAGE') as has_usage
FROM pg_namespace
WHERE nspname IN ('public', 'auth')
UNION ALL
SELECT 
    nspname,
    'authenticated',
    has_schema_privilege('authenticated', nspname, 'USAGE')
FROM pg_namespace
WHERE nspname IN ('public', 'auth')
ORDER BY schema_name, role_name;

-- 14. SUMMARY
SELECT '=== SUMMARY ===' as section;

SELECT 
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as total_tables,
    (SELECT COUNT(*) FROM pg_tables t WHERE schemaname = 'public' 
     AND EXISTS (SELECT 1 FROM pg_class c WHERE c.oid = (t.schemaname||'.'||t.tablename)::regclass AND c.relrowsecurity)) as rls_enabled_tables,
    (SELECT COUNT(*) FROM pg_views WHERE schemaname = 'public') as total_views,
    (SELECT COUNT(*) FROM auth.users) as total_users;

-- 15. CHECK EVENT-RELATED TABLES
SELECT '=== EVENT SYSTEM TABLES ===' as section;

SELECT 
    tablename,
    CASE 
        WHEN (SELECT relrowsecurity FROM pg_class WHERE oid = ('public.'||tablename)::regclass) THEN 'RLS ENABLED' 
        ELSE 'RLS DISABLED' 
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('venues', 'events', 'performers', 'tickets', 'calendars', 'bookings', 'community_hubs', 'checkins')
ORDER BY tablename;