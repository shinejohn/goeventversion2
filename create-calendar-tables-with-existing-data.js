const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function createCalendarTablesWithExistingData() {
  console.log('🔧 Creating calendar tables using existing data...');
  
  try {
    // Get existing data
    const { data: accounts } = await client
      .from('accounts')
      .select('id, name')
      .limit(1);
    
    const { data: events } = await client
      .from('events')
      .select('*')
      .limit(5);
    
    const { data: communityHubs } = await client
      .from('community_hubs')
      .select('*')
      .limit(3);
    
    const creatorId = accounts && accounts.length > 0 ? accounts[0].id : null;
    
    console.log(`📊 Using existing data:`);
    console.log(`  Accounts: ${accounts ? accounts.length : 0}`);
    console.log(`  Events: ${events ? events.length : 0}`);
    console.log(`  Community Hubs: ${communityHubs ? communityHubs.length : 0}`);
    
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
    
    // Create curated calendars based on existing community hubs
    console.log('\\n📊 Creating curated calendars from community hubs...');
    const curatedCalendarsData = communityHubs?.map((hub, index) => ({
      name: `${hub.name} Events`,
      description: `Curated events from ${hub.name} - ${hub.description}`,
      slug: `${hub.slug}-events`,
      creator_id: creatorId,
      event_count: Math.floor(Math.random() * 10) + 5, // Random 5-15 events
      subscriber_count: Math.floor(Math.random() * 500) + 100, // Random 100-600 subscribers
      is_public: true
    })) || [];
    
    // Add some additional curated calendars
    const additionalCalendars = [
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
      }
    ];
    
    const allCuratedCalendars = [...curatedCalendarsData, ...additionalCalendars];
    
    const { error: curatedInsertError } = await client
      .from('curated_calendars')
      .insert(allCuratedCalendars);
    
    if (curatedInsertError) {
      console.log('❌ Error inserting curated calendars:', curatedInsertError);
    } else {
      console.log(`✅ Inserted ${allCuratedCalendars.length} curated calendars`);
    }
    
    // Create personal calendars
    console.log('\\n📊 Creating personal calendars...');
    const personalCalendarsData = [
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
      }
    ];
    
    const { error: calendarsInsertError } = await client
      .from('calendars')
      .insert(personalCalendarsData);
    
    if (calendarsInsertError) {
      console.log('❌ Error inserting calendars:', calendarsInsertError);
    } else {
      console.log(`✅ Inserted ${personalCalendarsData.length} personal calendars`);
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
    console.log(`  Personal calendars: ${finalCalendars ? finalCalendars.length : 0}`);
    
    if (finalCuratedCalendars && finalCuratedCalendars.length > 0) {
      console.log('\\n📅 Sample curated calendars:');
      finalCuratedCalendars.slice(0, 3).forEach((cal, index) => {
        console.log(`  ${index + 1}. ${cal.name} (${cal.slug}) - ${cal.event_count} events, ${cal.subscriber_count} subscribers`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error creating calendar tables with existing data:', error);
  }
}

createCalendarTablesWithExistingData();
