const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function runSQL(filename) {
  console.log(`\n🔄 Running ${filename}...`);
  
  const sql = fs.readFileSync(filename, 'utf8');
  
  // Split by semicolon and filter out empty statements
  const statements = sql.split(';').filter(stmt => stmt.trim() && !stmt.trim().match(/^(BEGIN|COMMIT)$/i));
  
  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;
    
    console.log(`Executing: ${trimmed.substring(0, 60)}...`);
    
    try {
      if (trimmed.toUpperCase().startsWith('CREATE TABLE')) {
        // Handle CREATE TABLE
        const { error } = await supabase.rpc('sql', { query: trimmed });
        if (error) {
          console.log(`⚠️  ${error.message}`);
          // Continue on table exists errors
          if (!error.message.includes('already exists')) {
            throw error;
          }
        }
      } else if (trimmed.toUpperCase().startsWith('ALTER TABLE')) {
        // Handle ALTER TABLE
        const { error } = await supabase.rpc('sql', { query: trimmed });
        if (error) {
          console.log(`⚠️  ${error.message}`);
          // Continue on column exists errors
          if (!error.message.includes('already exists')) {
            throw error;
          }
        }
      } else if (trimmed.toUpperCase().startsWith('INSERT INTO')) {
        // Handle INSERT statements
        const { error } = await supabase.rpc('sql', { query: trimmed });
        if (error) {
          console.log(`⚠️  ${error.message}`);
          if (!error.message.includes('duplicate key')) {
            throw error;
          }
        }
      } else {
        // Handle other statements
        const { error } = await supabase.rpc('sql', { query: trimmed });
        if (error) throw error;
      }
      
      console.log(`✅ Success`);
      
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
      return false;
    }
  }
  
  console.log(`✅ ${filename} completed successfully`);
  return true;
}

// Run the file passed as argument
const filename = process.argv[2];
if (!filename) {
  console.log('Usage: node run-sql.js <filename>');
  process.exit(1);
}

runSQL(filename).catch(console.error);