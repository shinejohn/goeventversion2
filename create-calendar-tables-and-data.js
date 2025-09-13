const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function createCalendarTablesAndData() {
  console.log('🔧 Creating calendar tables and data...');
  
  try {
    // Create curated_calendars table
    console.log('\\n📅 Creating curated_calendars table...');
    const { error: curatedTableError } = await client.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.curated_calendars (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          slug VARCHAR(255) UNIQUE NOT NULL,
          creator_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
          event_count INTEGER DEFAULT 0,
          subscriber_count INTEGER DEFAULT 0,
          is_public BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (curatedTableError) {
      console.log('Curated calendars table error:', curatedTableError);
    } else {
      console.log('✅ Curated calendars table created');
    }
    
    // Create calendars table
    console.log('\\n📅 Creating calendars table...');
    const { error: calendarsTableError } = await client.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.calendars (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          slug VARCHAR(255) UNIQUE NOT NULL,
          user_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
          event_count INTEGER DEFAULT 0,
          subscriber_count INTEGER DEFAULT 0,
          is_public BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (calendarsTableError) {
      console.log('Calendars table error:', calendarsTableError);
    } else {
      console.log('✅ Calendars table created');
    }
    
    // Get first account for creator_id
    const { data: accounts } = await client
      .from('accounts')
      .select('id')
      .limit(1);
    
    const creatorId = accounts && accounts.length > 0 ? accounts[0].id : null;
    
    // Insert curated calendars data
    console.log('\\n📊 Inserting curated calendars data...');
    const curatedCalendarsData = [
      {
        name: 'Summer Music Festival',
        description: 'The ultimate summer music experience featuring top artists and emerging talent',
        slug: 'summer-music-festival',
        creator_id: creatorId,
        event_count: 12,
        subscriber_count: 1250,
        is_public: true
      },
      {
        name: 'Food & Wine Events',
        description: 'Culinary adventures and wine tastings for food enthusiasts',
        slug: 'food-wine-events',
        creator_id: creatorId,
        event_count: 8,
        subscriber_count: 890,
        is_public: true
      },
      {
        name: 'Tech Conference Series',
        description: 'Cutting-edge technology conferences and workshops',
        slug: 'tech-conference-series',
        creator_id: creatorId,
        event_count: 15,
        subscriber_count: 2100,
        is_public: true
      },
      {
        name: 'Art & Culture Calendar',
        description: 'Exhibitions, galleries, and cultural events in the city',
        slug: 'art-culture-calendar',
        creator_id: creatorId,
        event_count: 20,
        subscriber_count: 750,
        is_public: true
      },
      {
        name: 'Sports & Fitness',
        description: 'Marathons, tournaments, and fitness events',
        slug: 'sports-fitness',
        creator_id: creatorId,
        event_count: 10,
        subscriber_count: 1100,
        is_public: true
      }
    ];
    
    const { error: curatedInsertError } = await client
      .from('curated_calendars')
      .insert(curatedCalendarsData);
    
    if (curatedInsertError) {
      console.log('❌ Error inserting curated calendars:', curatedInsertError);
    } else {
      console.log('✅ Curated calendars data inserted');
    }
    
    // Insert regular calendars data
    console.log('\\n📊 Inserting calendars data...');
    const calendarsData = [
      {
        name: 'My Personal Events',
        description: 'Personal events and reminders',
        slug: 'my-personal-events',
        user_id: creatorId,
        event_count: 5,
        subscriber_count: 0,
        is_public: false
      },
      {
        name: 'Work Schedule',
        description: 'Work meetings and professional events',
        slug: 'work-schedule',
        user_id: creatorId,
        event_count: 8,
        subscriber_count: 0,
        is_public: false
      },
      {
        name: 'Family Events',
        description: 'Family gatherings and celebrations',
        slug: 'family-events',
        user_id: creatorId,
        event_count: 3,
        subscriber_count: 0,
        is_public: false
      }
    ];
    
    const { error: calendarsInsertError } = await client
      .from('calendars')
      .insert(calendarsData);
    
    if (calendarsInsertError) {
      console.log('❌ Error inserting calendars:', calendarsInsertError);
    } else {
      console.log('✅ Calendars data inserted');
    }
    
    // Verify data was inserted
    console.log('\\n✅ Verifying data...');
    const { data: finalCuratedCalendars } = await client
      .from('curated_calendars')
      .select('*');
    
    const { data: finalCalendars } = await client
      .from('calendars')
      .select('*');
    
    console.log(`📊 Final counts:`);
    console.log(`  Curated calendars: ${finalCuratedCalendars ? finalCuratedCalendars.length : 0}`);
    console.log(`  Regular calendars: ${finalCalendars ? finalCalendars.length : 0}`);
    
  } catch (error) {
    console.error('❌ Error creating calendar tables and data:', error);
  }
}

createCalendarTablesAndData();
