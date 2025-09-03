const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function executeMigrations() {
  const files = [
    '01-schema-fixes.sql',
    '02-community-hub.sql', 
    '03-venues-data.sql',
    '04-events-data.sql',
    '05-performers-data.sql'
  ];

  for (const file of files) {
    console.log(`\n🔄 Executing ${file}...`);
    
    try {
      const sql = fs.readFileSync(file, 'utf8');
      const { data, error } = await supabase.rpc('exec', { sql });
      
      if (error) {
        console.error(`❌ Error in ${file}:`, error);
        break;
      }
      
      console.log(`✅ ${file} executed successfully`);
    } catch (err) {
      console.error(`💥 Failed to execute ${file}:`, err.message);
      break;
    }
  }

  console.log('\n🏁 Migration complete!');
}

executeMigrations().catch(console.error);