const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function createCalendarTables() {
  console.log('🔧 Creating calendar tables using direct database operations...');
  
  try {
    // First, let's try to create tables using individual SQL statements
    const statements = [
      // Create curated_calendars table
      `CREATE TABLE IF NOT EXISTS public.curated_calendars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        creator_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
        event_count INTEGER DEFAULT 0,
        subscriber_count INTEGER DEFAULT 0,
        is_public BOOLEAN DEFAULT true,
        image_url TEXT,
        website TEXT,
        social_media TEXT,
        tags TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      // Create calendars table
      `CREATE TABLE IF NOT EXISTS public.calendars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        user_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
        event_count INTEGER DEFAULT 0,
        subscriber_count INTEGER DEFAULT 0,
        is_public BOOLEAN DEFAULT true,
        color VARCHAR(7) DEFAULT '#3B82F6',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      // Create calendar_events table
      `CREATE TABLE IF NOT EXISTS public.calendar_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        calendar_id UUID REFERENCES public.curated_calendars(id) ON DELETE CASCADE,
        event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
        added_by UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(calendar_id, event_id)
      )`,
      
      // Create calendar_subscriptions table
      `CREATE TABLE IF NOT EXISTS public.calendar_subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        calendar_id UUID REFERENCES public.curated_calendars(id) ON DELETE CASCADE,
        user_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(calendar_id, user_id)
      )`
    ];
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      console.log(`\n📊 Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Try using rpc with a custom function
        const { error } = await client.rpc('exec_sql', { sql: statements[i] });
        
        if (error) {
          console.log(`❌ Error with rpc: ${error.message}`);
          
          // Try alternative approach - direct table operations
          if (i === 0) {
            // Try to create curated_calendars by inserting a test record
            console.log('🔄 Trying alternative approach...');
            const { error: insertError } = await client
              .from('curated_calendars')
              .insert({
                name: 'Test Calendar',
                description: 'Test description',
                slug: 'test-calendar-' + Date.now(),
                creator_id: (await client.from('accounts').select('id').limit(1).single()).data?.id,
                is_public: true
              });
            
            if (insertError && insertError.message.includes('relation "public.curated_calendars" does not exist')) {
              console.log('❌ Table does not exist and cannot be created programmatically');
              console.log('📋 Please run the SQL script manually in Supabase Dashboard');
              return;
            }
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.log(`❌ Error executing statement ${i + 1}:`, err.message);
      }
    }
    
    // Test if tables exist
    console.log('\n🔍 Testing if tables were created...');
    
    const { data: curatedCalendars, error: curatedError } = await client
      .from('curated_calendars')
      .select('*')
      .limit(1);
    
    if (curatedError) {
      console.log('❌ curated_calendars table does not exist:', curatedError.message);
      console.log('\n📋 MANUAL ACTION REQUIRED:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Copy and paste the contents of create-calendar-tables-complete.sql');
      console.log('3. Click "Run" to execute');
      return;
    } else {
      console.log('✅ curated_calendars table exists');
    }
    
  } catch (error) {
    console.error('❌ Error creating calendar tables:', error);
    console.log('\n📋 MANUAL ACTION REQUIRED:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste the contents of create-calendar-tables-complete.sql');
    console.log('3. Click "Run" to execute');
  }
}

createCalendarTables();
