-- =====================================================
-- FIX PERMISSIONS FOR ANON AND AUTHENTICATED USERS
-- =====================================================

-- First, check what tables exist and their RLS status
DO $$
DECLARE
    r RECORD;
BEGIN
    RAISE NOTICE 'Checking and fixing permissions...';
    
    -- Grant schema usage
    GRANT USAGE ON SCHEMA public TO anon, authenticated;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated;
    
    -- Grant permissions on all existing tables
    FOR r IN 
        SELECT schemaname, tablename, 
               (SELECT relrowsecurity FROM pg_class WHERE oid = (schemaname||'.'||tablename)::regclass) as rls_enabled
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        -- Grant all permissions
        EXECUTE format('GRANT ALL ON TABLE %I.%I TO anon, authenticated', r.schemaname, r.tablename);
        RAISE NOTICE 'Granted permissions on %.%', r.schemaname, r.tablename;
        
        -- Check if RLS is enabled
        IF r.rls_enabled THEN
            RAISE NOTICE '  WARNING: RLS is still enabled on %.%', r.schemaname, r.tablename;
        END IF;
    END LOOP;
    
    -- Grant permissions on all sequences
    FOR r IN 
        SELECT sequence_schema, sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE format('GRANT ALL ON SEQUENCE %I.%I TO anon, authenticated', r.sequence_schema, r.sequence_name);
    END LOOP;
    
    -- Grant permissions on all functions
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
    
    -- Grant permissions on specific auth tables
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') THEN
        GRANT SELECT ON auth.users TO anon, authenticated;
        RAISE NOTICE 'Granted SELECT on auth.users';
    END IF;
    
    -- Grant permissions on views (important!)
    FOR r IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('GRANT ALL ON %I.%I TO anon, authenticated', r.schemaname, r.viewname);
        RAISE NOTICE 'Granted permissions on view %.%', r.schemaname, r.viewname;
    END LOOP;
    
    RAISE NOTICE '===================================================';
    RAISE NOTICE 'Permissions granted to anon and authenticated users';
    RAISE NOTICE 'on all tables, sequences, functions, and views';
    RAISE NOTICE '===================================================';
END $$;

-- Also check if there are any specific views that might need permissions
SELECT 
    schemaname,
    viewname,
    viewowner
FROM pg_views 
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, viewname;