const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function checkSupabaseFunctions() {
  console.log('🔍 Checking available Supabase functions...');
  
  try {
    // Check what functions are available
    const { data: functions, error } = await client
      .from('information_schema.routines')
      .select('routine_name, routine_type')
      .eq('routine_schema', 'public')
      .like('routine_name', '%exec%');
    
    console.log('Available exec functions:');
    if (functions) {
      functions.forEach(func => console.log(`  - ${func.routine_name} (${func.routine_type})`));
    } else {
      console.log('  No exec functions found');
    }
    
    // Try to create a simple table using a different approach
    console.log('\n🔧 Trying to create tables using direct SQL...');
    
    // Try using the SQL editor approach
    const { data, error: sqlError } = await client
      .from('curated_calendars')
      .select('*')
      .limit(1);
    
    if (sqlError) {
      console.log('❌ curated_calendars table does not exist:', sqlError.message);
    } else {
      console.log('✅ curated_calendars table exists');
    }
    
    // Try calendars table
    const { data: calendarsData, error: calendarsError } = await client
      .from('calendars')
      .select('*')
      .limit(1);
    
    if (calendarsError) {
      console.log('❌ calendars table does not exist:', calendarsError.message);
    } else {
      console.log('✅ calendars table exists');
    }
    
  } catch (error) {
    console.error('❌ Error checking functions:', error);
  }
}

checkSupabaseFunctions();
