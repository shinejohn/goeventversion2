const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function runCalendarSQL() {
  console.log('🔧 Creating calendar tables and data...');
  
  try {
    // Read the SQL file
    const fs = require('fs');
    const sql = fs.readFileSync('create-calendar-tables.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`\n📊 Executing statement ${i + 1}/${statements.length}...`);
        console.log(`SQL: ${statement.substring(0, 100)}...`);
        
        const { error } = await client.rpc('exec', { sql: statement });
        
        if (error) {
          console.log(`❌ Error in statement ${i + 1}:`, error.message);
          // Continue with next statement
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    // Verify the tables were created and have data
    console.log('\n✅ Verifying calendar tables...');
    
    const { data: curatedCalendars, error: curatedError } = await client
      .from('curated_calendars')
      .select('*');
    
    const { data: calendars, error: calendarsError } = await client
      .from('calendars')
      .select('*');
    
    console.log(`📊 Final results:`);
    console.log(`  Curated calendars: ${curatedCalendars ? curatedCalendars.length : 0}`);
    console.log(`  Personal calendars: ${calendars ? calendars.length : 0}`);
    
    if (curatedCalendars && curatedCalendars.length > 0) {
      console.log('\n📅 Sample curated calendars:');
      curatedCalendars.slice(0, 3).forEach((cal, index) => {
        console.log(`  ${index + 1}. ${cal.name} (${cal.slug}) - ${cal.event_count} events, ${cal.subscriber_count} subscribers`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error running calendar SQL:', error);
  }
}

runCalendarSQL();
