-- =====================================================
-- COMPLETE DATABASE REPORT
-- =====================================================

-- Set formatting for better readability
\pset border 2
\pset format aligned

-- 1. DATABASE OVERVIEW
SELECT '=== DATABASE OVERVIEW ===' as section;

SELECT 
    current_database() as database_name,
    current_user as current_user,
    version() as postgres_version,
    current_timestamp as report_generated_at;

-- 2. ALL TABLES WITH RLS STATUS AND RECORD COUNTS
SELECT '=== TABLES WITH RLS STATUS AND RECORD COUNTS ===' as section;

WITH table_info AS (
    SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
        (SELECT relrowsecurity FROM pg_class WHERE oid = (schemaname||'.'||tablename)::regclass) as rls_enabled,
        (SELECT relforcerowsecurity FROM pg_class WHERE oid = (schemaname||'.'||tablename)::regclass) as rls_forced
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename
)
SELECT 
    t.tablename,
    t.table_size,
    CASE 
        WHEN t.rls_enabled THEN 'ENABLED' 
        ELSE 'DISABLED' 
    END as rls_status,
    CASE 
        WHEN t.rls_forced THEN 'YES' 
        ELSE 'NO' 
    END as rls_forced,
    (SELECT COUNT(*) FROM public.t) as record_count
FROM table_info t;

-- Dynamic count for each table
DO $$
DECLARE
    r RECORD;
    table_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== RECORD COUNTS BY TABLE ===';
    RAISE NOTICE '';
    
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM public.%I', r.tablename) INTO table_count;
        RAISE NOTICE 'Table: % - Records: %', rpad(r.tablename, 30), table_count;
    END LOOP;
END $$;

-- 3. RLS POLICIES
SELECT '=== RLS POLICIES BY TABLE ===' as section;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. TABLE PERMISSIONS
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

-- 5. VIEWS
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

-- 6. VIEW PERMISSIONS
SELECT '=== VIEW PERMISSIONS ===' as section;

SELECT 
    table_schema,
    table_name,
    grantee,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN (SELECT viewname FROM pg_views WHERE schemaname = 'public')
AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY table_schema, table_name, grantee
ORDER BY table_name, grantee;

-- 7. FUNCTIONS
SELECT '=== FUNCTIONS ===' as section;

SELECT 
    n.nspname as schema,
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
ORDER BY p.proname;

-- 8. FUNCTION PERMISSIONS
SELECT '=== FUNCTION PERMISSIONS ===' as section;

SELECT 
    routine_schema,
    routine_name,
    grantee,
    string_agg(privilege_type, ', ') as privileges
FROM information_schema.routine_privileges
WHERE routine_schema = 'public'
AND grantee IN ('anon', 'authenticated', 'service_role')
GROUP BY routine_schema, routine_name, grantee
ORDER BY routine_name, grantee;

-- 9. SEQUENCES
SELECT '=== SEQUENCES ===' as section;

SELECT 
    sequence_schema,
    sequence_name,
    data_type,
    start_value,
    minimum_value,
    maximum_value,
    increment
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- 10. FOREIGN KEY RELATIONSHIPS
SELECT '=== FOREIGN KEY RELATIONSHIPS ===' as section;

SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 11. INDEXES
SELECT '=== INDEXES ===' as section;

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 12. ROLES AND THEIR PERMISSIONS
SELECT '=== DATABASE ROLES ===' as section;

SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    rolconnlimit,
    rolvaliduntil
FROM pg_roles
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'supabase_admin', 'postgres')
ORDER BY rolname;

-- 13. SCHEMA PERMISSIONS
SELECT '=== SCHEMA PERMISSIONS ===' as section;

SELECT 
    nspname as schema_name,
    rolname as role_name,
    has_schema_privilege(rolname, nspname, 'USAGE') as has_usage,
    has_schema_privilege(rolname, nspname, 'CREATE') as has_create
FROM pg_namespace
CROSS JOIN pg_roles
WHERE nspname IN ('public', 'auth', 'storage')
AND rolname IN ('anon', 'authenticated', 'service_role')
ORDER BY schema_name, role_name;

-- 14. CHECK SPECIFIC TABLES EXISTENCE
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

-- 15. AUTH SCHEMA TABLES
SELECT '=== AUTH SCHEMA TABLES ===' as section;

SELECT 
    tablename,
    tableowner,
    (SELECT COUNT(*) FROM auth.users) as user_count
FROM pg_tables
WHERE schemaname = 'auth'
AND tablename = 'users';

-- 16. SUMMARY
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