const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function generateSchemaReport() {
  console.log('CURRENT DATABASE SCHEMA REPORT');
  console.log('=====================================\n');
  
  const tables = ['venues', 'events', 'performers', 'accounts'];
  
  for (const table of tables) {
    console.log(`TABLE: ${table.toUpperCase()}`);
    console.log('-'.repeat(30));
    
    // Try to get one record to see the structure
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
      
    if (error) {
      console.log(`❌ Error: ${error.message}\n`);
      continue;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      columns.forEach(col => {
        console.log(`  - ${col}: ${typeof data[0][col]} ${data[0][col] === null ? '(nullable)' : ''}`);
      });
    } else {
      console.log('  (No data - will test with minimal insert)');
      
      // Test minimal insert to discover required fields
      let testData = { name: 'Test' };
      if (table === 'events') {
        testData = { title: 'Test Event' };
      }
      
      const { error: insertError } = await supabase
        .from(table)
        .insert(testData);
        
      if (insertError) {
        console.log(`  Required fields hint: ${insertError.message}`);
      }
    }
    
    console.log('');
  }
  
  console.log('\nAPP REQUIREMENTS ANALYSIS');
  console.log('=====================================');
  console.log('Based on the route files, the app expects:');
  console.log('\nVENUES:');
  console.log('  - id, name, description, city, state, country');
  console.log('  - max_capacity, is_active, image_url');
  console.log('  - venue_type, address, contact_email');
  console.log('\nEVENTS:');  
  console.log('  - id, title, description, start_date, end_date');
  console.log('  - image_url, category, status, venue_id');
  console.log('  - account_id, is_public');
  console.log('\nPERFORMERS:');
  console.log('  - id, stage_name, bio, category');
  console.log('  - profile_image_url, is_available');
  console.log('  - account_id, average_rating');
}

generateSchemaReport().catch(console.error);