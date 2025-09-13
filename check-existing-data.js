const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function checkExistingData() {
  console.log('🔍 Checking existing data for calendars and communities...');
  
  try {
    // Check all existing tables
    console.log('\\n📋 Checking all tables...');
    const { data: allTables, error: tablesError } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (allTables) {
      console.log('All tables:');
      allTables.forEach(table => console.log('  -', table.table_name));
    }
    
    // Check community_hubs data in detail
    console.log('\\n🏢 Checking community_hubs data...');
    const { data: communityHubs, error: communityError } = await client
      .from('community_hubs')
      .select('*');
    
    console.log('Community hubs:');
    console.log('  Error:', communityError);
    console.log('  Data count:', communityHubs ? communityHubs.length : 0);
    if (communityHubs && communityHubs.length > 0) {
      console.log('  Sample data:');
      communityHubs.forEach((hub, index) => {
        console.log(`    ${index + 1}. ${hub.name} (${hub.slug})`);
      });
    }
    
    // Check if there are any calendar-related fields in existing tables
    console.log('\\n📅 Checking for calendar-related data in existing tables...');
    
    // Check events table for calendar-related fields
    const { data: events, error: eventsError } = await client
      .from('events')
      .select('*')
      .limit(3);
    
    console.log('Events table:');
    console.log('  Error:', eventsError);
    console.log('  Data count:', events ? events.length : 0);
    if (events && events.length > 0) {
      console.log('  Sample event fields:', Object.keys(events[0]));
    }
    
    // Check if there are any tables with 'calendar' in the name
    const calendarTables = allTables?.filter(table => 
      table.table_name.toLowerCase().includes('calendar') ||
      table.table_name.toLowerCase().includes('event') ||
      table.table_name.toLowerCase().includes('hub')
    ) || [];
    
    console.log('\\n📊 Calendar/Event/Hub related tables:');
    calendarTables.forEach(table => console.log('  -', table.table_name));
    
    // Check accounts table for user data
    console.log('\\n👤 Checking accounts data...');
    const { data: accounts, error: accountsError } = await client
      .from('accounts')
      .select('id, name, slug')
      .limit(3);
    
    console.log('Accounts:');
    console.log('  Error:', accountsError);
    console.log('  Data count:', accounts ? accounts.length : 0);
    if (accounts && accounts.length > 0) {
      console.log('  Sample accounts:');
      accounts.forEach((account, index) => {
        console.log(`    ${index + 1}. ${account.name || 'Unnamed'} (${account.slug || 'no-slug'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking existing data:', error);
  }
}

checkExistingData();
