#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkkukfyfqbmfvwjxqmrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJra3VrZnlmcWJtZnZ3anhxbXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3MzMwNTUsImV4cCI6MjAzODMwOTA1NX0.EBSoiwZkdNrZPawQ0eY-P7zXYe3c9eXRI4Ek0H9HAFI';

async function checkDatabaseSchema() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get all tables
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');
    
  if (error) {
    console.error('Error fetching tables:', error);
    return;
  }
  
  console.log('Current tables in database:');
  console.log('=========================');
  tables?.forEach(t => console.log(t.table_name));
}

checkDatabaseSchema().catch(console.error);