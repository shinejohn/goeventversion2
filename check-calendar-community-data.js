const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function checkCalendarCommunityData() {
  console.log('🔍 Checking calendar and community data...');
  
  try {
    // Check if calendar tables exist and have data
    console.log('\\n📊 Checking calendar tables...');
    
    // Try to query curated_calendars
    const { data: curatedCalendars, error: curatedError } = await client
      .from('curated_calendars')
      .select('*')
      .limit(5);
    
    console.log('Curated calendars:');
    console.log('  Error:', curatedError);
    console.log('  Data count:', curatedCalendars ? curatedCalendars.length : 0);
    if (curatedCalendars && curatedCalendars.length > 0) {
      console.log('  Sample:', curatedCalendars[0]);
    }
    
    // Try to query calendars
    const { data: calendars, error: calendarsError } = await client
      .from('calendars')
      .select('*')
      .limit(5);
    
    console.log('\\nCalendars:');
    console.log('  Error:', calendarsError);
    console.log('  Data count:', calendars ? calendars.length : 0);
    if (calendars && calendars.length > 0) {
      console.log('  Sample:', calendars[0]);
    }
    
    // Check community_hubs table
    console.log('\\n🏢 Checking community_hubs table...');
    const { data: communityHubs, error: communityError } = await client
      .from('community_hubs')
      .select('*')
      .limit(5);
    
    console.log('Community hubs:');
    console.log('  Error:', communityError);
    console.log('  Data count:', communityHubs ? communityHubs.length : 0);
    if (communityHubs && communityHubs.length > 0) {
      console.log('  Sample:', communityHubs[0]);
    }
    
    // Check what tables actually exist
    console.log('\\n📋 Checking all tables...');
    const { data: tables, error: tablesError } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%calendar%');
    
    console.log('Calendar-related tables:');
    if (tables) {
      tables.forEach(table => console.log('  -', table.table_name));
    } else {
      console.log('  No calendar tables found');
    }
    
    // Check community-related tables
    const { data: communityTables, error: communityTablesError } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%community%');
    
    console.log('\\nCommunity-related tables:');
    if (communityTables) {
      communityTables.forEach(table => console.log('  -', table.table_name));
    } else {
      console.log('  No community tables found');
    }
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  }
}

checkCalendarCommunityData();
