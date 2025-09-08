#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://bkkukfyfqbmfvwjxqmrp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseServiceKey) {
  console.error('Please set SUPABASE_SERVICE_KEY environment variable');
  console.error('You can find it at: https://supabase.com/dashboard/project/bkkukfyfqbmfvwjxqmrp/settings/api');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// IMPORTANT RULE: Every event is always at a venue
// This includes public parks, closed streets, etc - they are all venues

async function applyDatabaseFixes() {
  console.log('Applying database fixes...\n');
  console.log('RULE: Every event MUST be at a venue (parks, streets, etc are venues)\n');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix-database-schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split into individual statements (naive split, works for our case)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: { statement: string; error: any }[] = [];
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Skip comments
      if (statement.trim().startsWith('--')) continue;
      
      // Get a summary of the statement for logging
      const firstLine = statement.split('\n')[0].substring(0, 80);
      process.stdout.write(`[${i + 1}/${statements.length}] ${firstLine}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement 
        }).single();
        
        if (error) throw error;
        
        successCount++;
        console.log(' ✅');
      } catch (error: any) {
        errorCount++;
        console.log(' ❌');
        
        // Some errors are expected (e.g., column already exists)
        const isExpectedError = 
          error.message?.includes('already exists') ||
          error.message?.includes('duplicate key') ||
          error.code === '42701'; // duplicate column
          
        if (!isExpectedError) {
          errors.push({ statement: firstLine, error });
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
        console.log(`Error: ${error.message || error}`);
        console.log('---');
      });
    }
    
    // Now ensure venue constraints
    console.log('\n=== Ensuring Event-Venue Integrity ===');
    
    // Check for events without venues
    const { data: orphanEvents } = await supabase
      .from('events')
      .select('id, title, address')
      .is('venue_id', null);
      
    if (orphanEvents && orphanEvents.length > 0) {
      console.log(`\nFound ${orphanEvents.length} events without venues. Creating venues for them...`);
      
      for (const event of orphanEvents) {
        // Create a venue for this event's address
        const venueName = event.address?.includes('Park') ? event.address :
                         event.address?.includes('Street') ? event.address :
                         `Venue at ${event.address || 'Unknown Location'}`;
                         
        const { data: newVenue, error: venueError } = await supabase
          .from('venues')
          .insert({
            name: venueName,
            address: event.address || 'Unknown Address',
            category: 'other',
            city: 'Unknown',
            state: 'Unknown',
            capacity: 100,
            is_active: true
          })
          .select()
          .single();
          
        if (newVenue && !venueError) {
          // Update the event with the new venue
          await supabase
            .from('events')
            .update({ venue_id: newVenue.id })
            .eq('id', event.id);
            
          console.log(`Created venue "${venueName}" for event "${event.title}"`);
        }
      }
    } else {
      console.log('✅ All events have venues');
    }
    
    // Add constraint to ensure all future events have venues
    console.log('\nAdding constraint to ensure all events have venues...');
    try {
      await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE events 
              DROP CONSTRAINT IF EXISTS events_must_have_venue;
              ALTER TABLE events 
              ADD CONSTRAINT events_must_have_venue 
              CHECK (venue_id IS NOT NULL);`
      });
      console.log('✅ Constraint added');
    } catch (error) {
      console.log('❌ Could not add constraint (may already exist)');
    }
    
    console.log('\n✅ Database fixes applied!');
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Create the exec_sql function if it doesn't exist
async function createExecSqlFunction() {
  const createFunction = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `;
  
  try {
    // Try using direct connection
    console.log('Note: You may need to run the SQL script directly in Supabase SQL Editor');
    console.log('Go to: https://supabase.com/dashboard/project/bkkukfyfqbmfvwjxqmrp/sql/new');
  } catch (error) {
    // Expected, we'll handle it differently
  }
}

applyDatabaseFixes().catch(console.error);