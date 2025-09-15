const { createClient } = require('@supabase/supabase-js');

// Use environment variables directly
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTablesViaAPI() {
  try {
    console.log('🚀 Creating tables via Supabase API...');
    
    // Create curated_calendars table
    console.log('📝 Creating curated_calendars table...');
    const { error: curatedError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.curated_calendars (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          creator_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
          is_public BOOLEAN DEFAULT true,
          subscriber_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (curatedError) {
      console.error('❌ Error creating curated_calendars:', curatedError.message);
    } else {
      console.log('✅ curated_calendars table created');
    }
    
    // Create calendars table
    console.log('📝 Creating calendars table...');
    const { error: calendarsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.calendars (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          creator_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
          is_public BOOLEAN DEFAULT true,
          subscriber_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (calendarsError) {
      console.error('❌ Error creating calendars:', calendarsError.message);
    } else {
      console.log('✅ calendars table created');
    }
    
    // Create calendar_events table
    console.log('📝 Creating calendar_events table...');
    const { error: eventsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.calendar_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
          event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
          added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(calendar_id, event_id)
        );
      `
    });
    
    if (eventsError) {
      console.error('❌ Error creating calendar_events:', eventsError.message);
    } else {
      console.log('✅ calendar_events table created');
    }
    
    // Create calendar_subscriptions table
    console.log('📝 Creating calendar_subscriptions table...');
    const { error: subscriptionsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.calendar_subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
          user_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
          subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(calendar_id, user_id)
        );
      `
    });
    
    if (subscriptionsError) {
      console.error('❌ Error creating calendar_subscriptions:', subscriptionsError.message);
    } else {
      console.log('✅ calendar_subscriptions table created');
    }
    
    // Enable RLS
    console.log('📝 Enabling RLS...');
    const { error: rlsError } = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE public.curated_calendars ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.calendar_subscriptions ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError.message);
    } else {
      console.log('✅ RLS enabled');
    }
    
    // Insert sample data
    console.log('📝 Inserting sample data...');
    const { error: dataError } = await supabase.rpc('exec', {
      sql: `
        INSERT INTO public.curated_calendars (id, name, slug, description, creator_id, subscriber_count) VALUES
        ('550e8400-e29b-41d4-a716-446655440001', 'Jazz Events Calendar', 'jazz-events', 'A curated collection of the best jazz events in the city', '550e8400-e29b-41d4-a716-446655440000', 150)
        ON CONFLICT (id) DO NOTHING;
        
        INSERT INTO public.calendars (id, name, slug, description, creator_id, subscriber_count) VALUES
        ('550e8400-e29b-41d4-a716-446655440001', 'Jazz Events Calendar', 'jazz-events', 'A curated collection of the best jazz events in the city', '550e8400-e29b-41d4-a716-446655440000', 150)
        ON CONFLICT (id) DO NOTHING;
        
        INSERT INTO public.calendar_events (calendar_id, event_id) VALUES
        ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
        ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002')
        ON CONFLICT (calendar_id, event_id) DO NOTHING;
      `
    });
    
    if (dataError) {
      console.error('❌ Error inserting data:', dataError.message);
    } else {
      console.log('✅ Sample data inserted');
    }
    
    console.log('🎉 Table creation completed!');
    
    // Test the tables
    console.log('\n🔍 Testing created tables...');
    
    const { data: calendars, error: calendarsTestError } = await supabase
      .from('calendars')
      .select('*')
      .limit(3);
    
    if (calendarsTestError) {
      console.error('❌ Error querying calendars:', calendarsTestError.message);
    } else {
      console.log('✅ Calendars table working:', calendars?.length || 0, 'records');
    }
    
    const { data: curatedCalendars, error: curatedTestError } = await supabase
      .from('curated_calendars')
      .select('*')
      .limit(3);
    
    if (curatedTestError) {
      console.error('❌ Error querying curated_calendars:', curatedTestError.message);
    } else {
      console.log('✅ Curated calendars table working:', curatedCalendars?.length || 0, 'records');
    }
    
    // Test the specific calendar that was failing
    console.log('\n🎯 Testing calendar detail page...');
    
    const { data: jazzCalendar, error: jazzError } = await supabase
      .from('calendars')
      .select(`
        *,
        calendar_events (
          event_id,
          events (
            id,
            title,
            start_datetime,
            end_datetime
          )
        ),
        calendar_subscriptions (
          user_id
        )
      `)
      .eq('slug', 'jazz-events')
      .single();
    
    if (jazzError) {
      console.error('❌ Error querying jazz calendar:', jazzError.message);
    } else {
      console.log('✅ Jazz calendar found:', jazzCalendar?.name);
      console.log('   Events:', jazzCalendar?.calendar_events?.length || 0);
      console.log('   Subscribers:', jazzCalendar?.calendar_subscriptions?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

createTablesViaAPI();
