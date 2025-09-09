-- Check if the views exist
SELECT 
    'VIEW' as object_type,
    schemaname,
    viewname as object_name
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname IN ('user_account_workspace', 'user_accounts')

UNION ALL

-- Check if they exist as tables instead
SELECT 
    'TABLE' as object_type,
    schemaname,
    tablename as object_name
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_account_workspace', 'user_accounts')

UNION ALL

-- Check all objects with these names
SELECT 
    CASE 
        WHEN c.relkind = 'r' THEN 'TABLE'
        WHEN c.relkind = 'v' THEN 'VIEW'
        WHEN c.relkind = 'm' THEN 'MATERIALIZED VIEW'
        ELSE 'OTHER'
    END as object_type,
    n.nspname as schemaname,
    c.relname as object_name
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname IN ('user_account_workspace', 'user_accounts')
AND n.nspname = 'public';

-- Also check if the schema file has been applied
SELECT 
    'Checking if accounts table exists' as check_description,
    EXISTS(SELECT 1 FROM pg_tables WHERE tablename = 'accounts' AND schemaname = 'public') as result

UNION ALL

SELECT 
    'Checking if accounts_memberships table exists' as check_description,
    EXISTS(SELECT 1 FROM pg_tables WHERE tablename = 'accounts_memberships' AND schemaname = 'public') as result;