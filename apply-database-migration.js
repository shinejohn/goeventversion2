const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read the migration file
const migrationSQL = fs.readFileSync('apps/web/supabase/schemas/22-user-type-roles.sql', 'utf8');

// Get Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_URL || 'https://goeventversion2-production.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not found');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  try {
    console.log('🚀 Applying database migration for user roles...');
    
    // Split the SQL into individual statements, handling comments and formatting
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        const trimmed = stmt.trim();
        return trimmed.length > 0 && 
               !trimmed.startsWith('--') && 
               !trimmed.startsWith('/*') &&
               !trimmed.startsWith('*') &&
               !trimmed.startsWith('*/') &&
               trimmed !== '/*' &&
               trimmed !== '*/';
      });
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`\n${i + 1}. Executing: ${statement.substring(0, 50)}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql: statement 
          });
          
          if (error) {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            // Continue with other statements even if one fails
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Exception executing statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('\n🎉 Migration completed!');
    
    // Verify the roles were created
    console.log('\n🔍 Verifying roles were created...');
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('name, hierarchy_level')
      .order('hierarchy_level');
    
    if (rolesError) {
      console.error('❌ Error verifying roles:', rolesError.message);
    } else {
      console.log('✅ Roles found:');
      roles.forEach(role => {
        console.log(`  - ${role.name} (level ${role.hierarchy_level})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyMigration();
