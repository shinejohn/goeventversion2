#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableColumns() {
  console.log('🔍 Checking actual database columns...\n');
  
  // Check performers table
  console.log('=== PERFORMERS TABLE ===');
  const { data: performerData, error: performerError } = await supabase
    .from('performers')
    .select('*')
    .limit(0);
    
  if (performerError) {
    console.log('Error:', performerError.message);
  } else {
    console.log('Performers table exists');
  }
  
  // Check events table
  console.log('\n=== EVENTS TABLE ===');
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('*')
    .limit(0);
    
  if (eventError) {
    console.log('Error:', eventError.message);
  }
  
  // Try to insert a minimal performer to see what fields are required
  console.log('\n=== Testing minimal inserts ===');
  
  const minimalPerformer = {
    name: 'Test Performer',
    category: 'solo-artist'
  };
  
  const { error: insertError } = await supabase
    .from('performers')
    .insert(minimalPerformer);
    
  if (insertError) {
    console.log('Performer insert error:', insertError.message);
  } else {
    console.log('✅ Minimal performer insert successful');
    
    // Clean up
    await supabase
      .from('performers')
      .delete()
      .eq('name', 'Test Performer');
  }
  
  // Test minimal event
  const minimalEvent = {
    title: 'Test Event',
    venue_id: (await supabase.from('venues').select('id').limit(1).single()).data?.id,
    start_datetime: new Date().toISOString(),
    status: 'upcoming'
  };
  
  const { error: eventInsertError } = await supabase
    .from('events')
    .insert(minimalEvent);
    
  if (eventInsertError) {
    console.log('Event insert error:', eventInsertError.message);
  } else {
    console.log('✅ Minimal event insert successful');
    
    // Clean up
    await supabase
      .from('events')
      .delete()
      .eq('title', 'Test Event');
  }
}

checkTableColumns().catch(console.error);