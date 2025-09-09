-- =====================================================
-- FIX VIEW PERMISSIONS FOR ANON AND AUTHENTICATED
-- =====================================================

-- Grant permissions on the views to anon users as well
GRANT SELECT ON public.user_account_workspace TO anon;
GRANT SELECT ON public.user_accounts TO anon;

-- Also grant execute on the function
GRANT EXECUTE ON FUNCTION public.team_account_workspace(text) TO anon;

-- Check all views and grant permissions
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Grant permissions on all views in public schema
    FOR r IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('GRANT SELECT ON %I.%I TO anon, authenticated', r.schemaname, r.viewname);
        RAISE NOTICE 'Granted SELECT on view %.%', r.schemaname, r.viewname;
    END LOOP;
    
    RAISE NOTICE '===================================================';
    RAISE NOTICE 'View permissions granted to anon users';
    RAISE NOTICE '===================================================';
END $$;

-- List all views to verify
SELECT 
    schemaname,
    viewname,
    pg_has_role('anon', viewowner, 'USAGE') as anon_can_use,
    pg_has_role('authenticated', viewowner, 'USAGE') as auth_can_use
FROM pg_views 
WHERE schemaname = 'public'
ORDER BY viewname;