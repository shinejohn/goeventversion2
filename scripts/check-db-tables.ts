import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
  console.log('=== Checking Cloud Database Tables ===\n');
  console.log('Database URL:', supabaseUrl);
  console.log('\n');
  
  // Check some potential tables for data
  const tablesToCheck = [
    // Standard MakerKit tables
    'accounts', 
    'accounts_memberships',
    'subscriptions',
    'billing_customers',
    'invitations',
    'roles',
    'role_permissions',
    
    // Potential When's The Fun tables
    'events', 
    'venues', 
    'performers',
    'performers_events',
    'categories',
    'event_categories',
    'bookings',
    'tickets',
    'reviews',
    'favorites',
    'communities',
    'locations',
    'schedules',
    'promotions'
  ];
  
  console.log('Checking table contents...\n');
  
  for (const tableName of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist - skip silently
          continue;
        }
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: ${count || 0} records`);
        
        // If table exists and has data, show a sample
        if (count && count > 0) {
          const { data: sample } = await supabase
            .from(tableName)
            .select('*')
            .limit(2);
          
          if (sample && sample.length > 0) {
            console.log(`   Sample columns: ${Object.keys(sample[0]).join(', ')}`);
          }
        }
      }
    } catch (err) {
      console.log(`❌ ${tableName}: Error checking`);
    }
  }
  
  console.log('\n=== Summary ===');
  console.log('Tables checked. Use the existing tables above to understand the schema.');
}

listTables();