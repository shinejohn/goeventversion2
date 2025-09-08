-- =====================================================
-- DISABLE ALL RLS - TEMPORARY FOR DEBUGGING
-- =====================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Disable RLS on ALL tables in public schema
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
        RAISE NOTICE 'RLS disabled on table: %', r.tablename;
    END LOOP;

    -- Grant ALL permissions to anon and authenticated on everything
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
    GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
    GRANT USAGE ON SCHEMA public TO anon, authenticated;
    
    -- Also grant permissions on auth schema tables that might be needed
    GRANT SELECT ON auth.users TO authenticated;
    
    RAISE WARNING '===================================================';
    RAISE WARNING 'RLS IS COMPLETELY DISABLED ON ALL TABLES!';
    RAISE WARNING 'THIS IS A MAJOR SECURITY RISK!';
    RAISE WARNING 'RE-ENABLE RLS BEFORE GOING TO PRODUCTION!';
    RAISE WARNING '===================================================';
END $$;