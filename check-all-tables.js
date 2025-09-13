const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function checkAllTables() {
  console.log('🔍 Checking all tables...');
  
  try {
    // Try to query a known table first
    console.log('📊 Testing events table...');
    const { data: events, error: eventsError } = await client
      .from('events')
      .select('*')
      .limit(1);
    
    console.log('Events table result:');
    console.log('  Error:', eventsError);
    console.log('  Data count:', events ? events.length : 0);
    
    // Try to query performers table
    console.log('\n📊 Testing performers table...');
    const { data: performers, error: performersError } = await client
      .from('performers')
      .select('*')
      .limit(1);
    
    console.log('Performers table result:');
    console.log('  Error:', performersError);
    console.log('  Data count:', performers ? performers.length : 0);
    
    // Try to query venues table
    console.log('\n📊 Testing venues table...');
    const { data: venues, error: venuesError } = await client
      .from('venues')
      .select('*')
      .limit(1);
    
    console.log('Venues table result:');
    console.log('  Error:', venuesError);
    console.log('  Data count:', venues ? venues.length : 0);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAllTables();
