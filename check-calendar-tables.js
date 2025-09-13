const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function checkCalendarTables() {
  console.log('🔍 Checking calendar-related tables...');
  
  try {
    // Get all tables
    const { data: tables, error: tablesError } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%calendar%');
    
    console.log('Calendar-related tables:');
    if (tables) {
      tables.forEach(table => console.log('  -', table.table_name));
    } else {
      console.log('  No calendar-related tables found');
    }
    
    // Check for any tables that might contain calendar data
    const { data: allTables, error: allTablesError } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    console.log('\nAll available tables:');
    if (allTables) {
      allTables.forEach(table => console.log('  -', table.table_name));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCalendarTables();
