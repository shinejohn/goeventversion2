const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function testCalendarDetail() {
  console.log('🔍 Testing calendar detail query...');
  
  const slug = 'summer-music-festival';
  
  try {
    // Test curated_calendars table
    console.log('📊 Testing curated_calendars table...');
    const { data: curatedCalendars, error: curatedError } = await client
      .from('curated_calendars')
      .select('*')
      .eq('slug', slug)
      .single();
    
    console.log('Curated calendars result:');
    console.log('  Error:', curatedError);
    console.log('  Data:', curatedCalendars);
    
    // Test calendars table
    console.log('\n📊 Testing calendars table...');
    const { data: calendars, error: calendarsError } = await client
      .from('calendars')
      .select('*')
      .eq('slug', slug)
      .single();
    
    console.log('Calendars result:');
    console.log('  Error:', calendarsError);
    console.log('  Data:', calendars);
    
    // Check what tables exist
    console.log('\n📊 Checking available tables...');
    const { data: tables, error: tablesError } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    console.log('Available tables:');
    if (tables) {
      tables.forEach(table => console.log('  -', table.table_name));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testCalendarDetail();
