const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeUserFunctionalityMigration() {
  console.log('🚀 Starting User Functionality Database Migration...\n');

  try {
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'apps/web/supabase/schemas/23-user-functionality-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 SQL Migration Content:');
    console.log('=' .repeat(50));
    console.log(sqlContent);
    console.log('=' .repeat(50));

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`\n📊 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`);
        console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.log(`❌ Statement ${i + 1} failed:`, error.message);
            // Continue with next statement
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} error:`, err.message);
          // Continue with next statement
        }
      }
    }

    console.log('\n🎉 Migration execution completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify tables were created in Supabase dashboard');
    console.log('2. Test the new user functionality routes');
    console.log('3. Implement data loading for notifications and help pages');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Check if exec_sql function exists, if not try direct SQL execution
async function checkAndExecute() {
  try {
    // First check if exec_sql function exists
    const { data: functions, error: funcError } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'exec_sql');

    if (funcError || !functions || functions.length === 0) {
      console.log('⚠️ exec_sql function not found, trying direct SQL execution...');
      
      // Try to execute SQL directly using the SQL editor approach
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(1);

      if (error) {
        console.log('❌ Cannot execute SQL directly. Please run the migration manually in Supabase dashboard.');
        console.log('📄 Migration file location: apps/web/supabase/schemas/23-user-functionality-tables.sql');
        return;
      }
    }

    await executeUserFunctionalityMigration();
  } catch (error) {
    console.log('❌ Cannot execute migration programmatically.');
    console.log('📄 Please run the migration manually in Supabase dashboard:');
    console.log('📁 File: apps/web/supabase/schemas/23-user-functionality-tables.sql');
    console.log('🔗 Dashboard: https://supabase.com/dashboard/project/gbcjlsnbamjchdtgrquu/sql');
  }
}

checkAndExecute();
