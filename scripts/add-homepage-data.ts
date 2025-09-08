#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addHomepageData() {
  console.log('🏠 Adding data for homepage...\n');
  
  // First update existing events to have 'published' status
  console.log('Updating existing events to published status...');
  const { error: updateError } = await supabase
    .from('events')
    .update({ status: 'published' })
    .eq('status', 'upcoming');
    
  if (updateError) {
    console.log('Update error:', updateError);
  } else {
    console.log('✅ Updated events to published status');
  }
  
  // Check what data we have now
  console.log('\n📊 Current data status:');
  
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select(`
      *,
      venue:venues(name, address)
    `)
    .eq('status', 'published')
    .gte('start_datetime', new Date().toISOString())
    .limit(8)
    .order('start_datetime');
    
  console.log('Published events:', events?.length || 0);
  if (eventsError) console.log('Events error:', eventsError);
  
  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .limit(6)
    .order('rating', { ascending: false, nullsFirst: false });
    
  console.log('Venues:', venues?.length || 0);
  
  const { data: performers } = await supabase
    .from('performers')
    .select('*')
    .limit(6)
    .order('rating', { ascending: false, nullsFirst: false });
    
  console.log('Performers:', performers?.length || 0);
  
  // If we need to add missing columns to performers
  if (performers && performers.length > 0 && !performers[0].rating) {
    console.log('\n🔧 Adding ratings to performers...');
    
    for (const performer of performers) {
      await supabase
        .from('performers')
        .update({ rating: 4.5 + Math.random() * 0.5 })
        .eq('id', performer.id);
    }
    
    console.log('✅ Added ratings');
  }
  
  // If we need to add missing columns to venues
  if (venues && venues.length > 0 && !venues[0].rating) {
    console.log('\n🔧 Adding ratings to venues...');
    
    for (const venue of venues) {
      await supabase
        .from('venues')
        .update({ rating: 4.0 + Math.random() * 1.0 })
        .eq('id', venue.id);
    }
    
    console.log('✅ Added ratings');
  }
  
  console.log('\n✅ Homepage data ready!');
  console.log('Visit: http://localhost:5173 to see the data');
}

addHomepageData().catch(console.error);