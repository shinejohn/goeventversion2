const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function getSchema() {
  console.log('📊 Getting database schema...');
  
  // Get all table names
  const { data: tables, error } = await supabase.rpc('get_table_columns');
  
  if (error) {
    console.error('Error getting schema:', error);
    return;
  }
  
  console.log('Tables and columns:', JSON.stringify(tables, null, 2));
}

async function getTablesDirectly() {
  console.log('📊 Getting table info directly...');
  
  const tables = ['venues', 'events', 'performers', 'community_hubs', 'accounts'];
  
  for (const table of tables) {
    console.log(`\n🏢 Table: ${table}`);
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(0);
      
    if (error) {
      console.error(`❌ Error accessing ${table}:`, error.message);
    } else {
      console.log(`✅ ${table} table exists (empty result expected)`);
    }
  }
}

async function main() {
  await getTablesDirectly();
  
  // Try inserting minimal records to understand required fields
  console.log('\n🧪 Testing minimal inserts...');
  
  const tests = [
    {
      table: 'venues',
      data: { name: 'Test Venue' }
    },
    {
      table: 'events', 
      data: { name: 'Test Event' }
    },
    {
      table: 'performers',
      data: { name: 'Test Performer' }
    }
  ];
  
  for (const test of tests) {
    const { data, error } = await supabase
      .from(test.table)
      .insert(test.data)
      .select();
      
    if (error) {
      console.log(`❌ ${test.table} requires: ${error.message}`);
    } else {
      console.log(`✅ ${test.table} minimal insert successful:`, data);
      
      // Clean up the test record
      await supabase
        .from(test.table)
        .delete()
        .eq('id', data[0].id);
    }
  }
}

main().catch(console.error);