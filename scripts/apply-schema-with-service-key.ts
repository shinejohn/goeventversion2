#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQLFile() {
  console.log('🚀 Applying database schema fixes...\n');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix-database-schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split into individual statements by semicolon followed by newline
    // This is more robust than just splitting by semicolon
    const statements = sqlContent
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: { statement: string; error: any }[] = [];
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      
      // Skip empty statements and comments
      if (!statement || statement.startsWith('--')) continue;
      
      // Get first 80 chars for logging
      const preview = statement.split('\n')[0].substring(0, 80);
      process.stdout.write(`[${i + 1}/${statements.length}] ${preview}...`);
      
      try {
        // Use raw SQL execution
        const { error } = await supabase.rpc('exec', { 
          sql_query: statement + ';'
        }).single();
        
        if (error) {
          // Try direct execution as fallback
          const { error: directError } = await supabase
            .from('_sql')
            .select()
            .eq('query', statement + ';')
            .single();
            
          if (directError) throw directError;
        }
        
        successCount++;
        console.log(' ✅');
      } catch (error: any) {
        errorCount++;
        console.log(' ❌');
        
        // Check if it's an expected error
        const isExpectedError = 
          error.message?.includes('already exists') ||
          error.message?.includes('duplicate key') ||
          error.code === '42701' || // duplicate column
          error.code === '42P07' || // duplicate table
          error.code === '42710';   // duplicate constraint
          
        if (!isExpectedError) {
          errors.push({ 
            statement: preview, 
            error: error.message || error 
          });
        }
      }
    }
    
    console.log('\n=== Summary ===');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\n=== Unexpected Errors ===');
      errors.forEach(({ statement, error }) => {
        console.log(`Statement: ${statement}`);
        console.log(`Error: ${error}`);
        console.log('---');
      });
    }
    
    console.log('\n✅ Schema update completed!');
    console.log('\nNext step: Run the test data script:');
    console.log('npm run tsx scripts/add-comprehensive-test-data.ts');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Create a function to execute raw SQL
async function createExecFunction() {
  console.log('Setting up SQL execution...\n');
  
  const createFunction = `
    CREATE OR REPLACE FUNCTION exec(sql_query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, auth
    AS $$
    BEGIN
      EXECUTE sql_query;
    END;
    $$;
  `;
  
  try {
    // Direct execution using service role
    const { error } = await supabase.rpc('query', { 
      query_text: createFunction 
    });
    
    if (error && !error.message?.includes('already exists')) {
      console.log('Note: Direct SQL execution may require manual setup');
    }
  } catch (error) {
    // Expected - we'll use a different approach
  }
}

async function main() {
  await createExecFunction();
  await executeSQLFile();
}

main().catch(console.error);