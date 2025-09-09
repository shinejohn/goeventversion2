-- =====================================================
-- COMPLETE DATABASE REPORT
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

-- 3. RECORD COUNTS FOR EACH TABLE (Manual list since dynamic SQL doesn't work in Supabase)
SELECT '=== RECORD COUNTS ===' as section;

SELECT 'accounts' as table_name, COUNT(*) as count FROM public.accounts
UNION ALL
SELECT 'accounts_memberships', COUNT(*) FROM public.accounts_memberships
UNION ALL
SELECT 'roles', COUNT(*) FROM public.roles
UNION ALL
SELECT 'role_permissions', COUNT(*) FROM public.role_permissions
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM public.subscriptions
UNION ALL
SELECT 'subscription_items', COUNT(*) FROM public.subscription_items
UNION ALL
SELECT 'billing_customers', COUNT(*) FROM public.billing_customers
UNION ALL
SELECT 'invitations', COUNT(*) FROM public.invitations
UNION ALL
SELECT 'notifications', COUNT(*) FROM public.notifications
UNION ALL
SELECT 'config', COUNT(*) FROM public.config
UNION ALL
SELECT 'orders', COUNT(*) FROM public.orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM public.order_items
UNION ALL
SELECT 'nonces', COUNT(*) FROM public.nonces
ORDER BY table_name;

-- 4. RLS POLICIES
SELECT '=== RLS POLICIES BY TABLE ===' as section;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    SUBSTRING(qual::text, 1, 100) as qual_preview,
    SUBSTRING(with_check::text, 1, 100) as with_check_preview
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

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
    viewowner,
    CASE 
        WHEN definition LIKE '%security_invoker = true%' THEN 'SECURITY INVOKER'
        ELSE 'SECURITY DEFINER'
    END as security_mode
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
    END as status,
    t.tableowner
FROM expected_tables e
LEFT JOIN pg_tables t ON t.tablename = e.table_name AND t.schemaname = 'public'
ORDER BY e.table_name;

-- 10. FUNCTIONS
SELECT '=== PUBLIC FUNCTIONS ===' as section;

SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
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

-- 12. ROLES AND THEIR PERMISSIONS
SELECT '=== DATABASE ROLES ===' as section;

SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'supabase_admin', 'postgres')
ORDER BY rolname;

-- 13. SCHEMA PERMISSIONS
SELECT '=== SCHEMA PERMISSIONS ===' as section;

SELECT 
    nspname as schema_name,
    'anon' as role_name,
    has_schema_privilege('anon', nspname, 'USAGE') as has_usage,
    has_schema_privilege('anon', nspname, 'CREATE') as has_create
FROM pg_namespace
WHERE nspname IN ('public', 'auth', 'storage')
UNION ALL
SELECT 
    nspname,
    'authenticated',
    has_schema_privilege('authenticated', nspname, 'USAGE'),
    has_schema_privilege('authenticated', nspname, 'CREATE')
FROM pg_namespace
WHERE nspname IN ('public', 'auth', 'storage')
ORDER BY schema_name, role_name;

-- 14. SUMMARY
SELECT '=== SUMMARY ===' as section;

WITH summary AS (
    SELECT 
        (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as total_tables,
        (SELECT COUNT(*) FROM pg_tables t WHERE schemaname = 'public' 
         AND (SELECT relrowsecurity FROM pg_class WHERE oid = (t.schemaname||'.'||t.tablename)::regclass)) as rls_enabled_tables,
        (SELECT COUNT(*) FROM pg_views WHERE schemaname = 'public') as total_views,
        (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace 
         WHERE n.nspname = 'public' AND p.prokind = 'f') as total_functions,
        (SELECT COUNT(*) FROM auth.users) as total_users
)
SELECT 
    total_tables,
    rls_enabled_tables,
    total_tables - rls_enabled_tables as rls_disabled_tables,
    total_views,
    total_functions,
    total_users
FROM summary;