-- Check all views in the database
SELECT 
    'EXISTING VIEWS:' as check_type,
    viewname,
    viewowner
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;

-- Check if the critical views that the app needs exist
SELECT '---' as separator;
SELECT 'CRITICAL VIEWS CHECK:' as check_type;
SELECT 
    'user_account_workspace' as required_view,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'user_account_workspace') 
        THEN 'EXISTS ✓' 
        ELSE 'MISSING ✗ - APP WILL FAIL!' 
    END as status
UNION ALL
SELECT 
    'user_accounts' as required_view,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'user_accounts') 
        THEN 'EXISTS ✓' 
        ELSE 'MISSING ✗ - APP WILL FAIL!' 
    END as status;

-- Check permissions on views for anon and authenticated users
SELECT '---' as separator;
SELECT 'VIEW PERMISSIONS:' as check_type;
SELECT 
    table_name as view_name,
    grantee,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('user_account_workspace', 'user_accounts')
AND grantee IN ('anon', 'authenticated')
GROUP BY table_name, grantee
ORDER BY table_name, grantee;