const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gbcjlsnbamjchdtgrquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc'
);

async function checkDataQuality() {
  console.log('🔍 COMPREHENSIVE DATABASE QUALITY CHECK\n');
  
  // Get sample data from each table
  const { data: venues } = await supabase.from('venues').select('id, name, description, address, city, state, max_capacity, image_url, contact_email, is_active').limit(3);
  const { data: events } = await supabase.from('events').select('id, title, description, start_datetime, end_datetime, category, image_url, status').limit(3);  
  const { data: performers } = await supabase.from('performers').select('id, name, stage_name, bio, profile_image_url, average_rating, is_available').limit(3);
  const { data: community } = await supabase.from('community_hubs').select('*').limit(1);
  
  // Get record counts
  console.log('📊 RECORD COUNTS:');
  const vCount = await supabase.from('venues').select('id', { count: 'exact', head: true });
  const eCount = await supabase.from('events').select('id', { count: 'exact', head: true });
  const pCount = await supabase.from('performers').select('id', { count: 'exact', head: true });
  const cCount = await supabase.from('community_hubs').select('id', { count: 'exact', head: true });
  
  console.log(`Venues: ${vCount.count || 0}/12 ✨`);
  console.log(`Events: ${eCount.count || 0}/12 ✨`);
  console.log(`Performers: ${pCount.count || 0}/12 ✨`);
  console.log(`Communities: ${cCount.count || 0}/1 ✨`);
  
  // Check data quality
  console.log('\n📋 SAMPLE DATA QUALITY:');
  
  console.log('\n🏟️  VENUES:');
  if (venues?.length > 0) {
    venues.forEach(v => {
      console.log(`  • ${v.name}`);
      console.log(`    Description: ${v.description?.substring(0,60)}...`);
      console.log(`    Address: ${v.address || 'MISSING'}`);
      console.log(`    Image: ${v.image_url ? '✅' : '❌ MISSING'}`);
      console.log(`    Contact: ${v.contact_email || 'MISSING'}`);
      console.log('');
    });
  } else {
    console.log('  ❌ NO VENUES FOUND');
  }
  
  console.log('🎭 EVENTS:');
  if (events?.length > 0) {
    events.forEach(e => {
      console.log(`  • ${e.title}`);
      console.log(`    Description: ${e.description?.substring(0,60)}...`);
      console.log(`    Dates: ${e.start_datetime} to ${e.end_datetime}`);
      console.log(`    Category: ${e.category || 'MISSING'}`);
      console.log(`    Image: ${e.image_url ? '✅' : '❌ MISSING'}`);
      console.log('');
    });
  } else {
    console.log('  ❌ NO EVENTS FOUND');
  }
  
  console.log('🎤 PERFORMERS:');
  if (performers?.length > 0) {
    performers.forEach(p => {
      console.log(`  • ${p.stage_name || p.name}`);
      console.log(`    Bio: ${p.bio?.substring(0,60)}...`);
      console.log(`    Rating: ${p.average_rating || 'MISSING'}`);
      console.log(`    Image: ${p.profile_image_url ? '✅' : '❌ MISSING'}`);
      console.log(`    Available: ${p.is_available ? '✅' : '❌'}`);
      console.log('');
    });
  } else {
    console.log('  ❌ NO PERFORMERS FOUND');
  }
  
  console.log('🏘️  COMMUNITY:');
  if (community?.length > 0) {
    community.forEach(c => {
      console.log(`  • ${c.name}`);
      console.log(`    Slug: ${c.slug}`);
      console.log(`    Description: ${c.description}`);
      console.log('');
    });
  } else {
    console.log('  ❌ NO COMMUNITY FOUND - NEED TO RUN MANUAL SQL!');
  }
  
  // Missing data analysis
  console.log('🚨 MISSING DATA ANALYSIS:');
  if (venues) {
    const missingImages = venues.filter(v => !v.image_url).length;
    const missingAddresses = venues.filter(v => !v.address).length;
    const missingContact = venues.filter(v => !v.contact_email).length;
    console.log(`Venues missing images: ${missingImages}/${venues.length}`);
    console.log(`Venues missing addresses: ${missingAddresses}/${venues.length}`);
    console.log(`Venues missing contact: ${missingContact}/${venues.length}`);
  }
  
  if (events) {
    const missingImages = events.filter(e => !e.image_url).length;
    const missingDates = events.filter(e => !e.start_datetime || !e.end_datetime).length;
    console.log(`Events missing images: ${missingImages}/${events.length}`);
    console.log(`Events missing dates: ${missingDates}/${events.length}`);
  }
  
  if (performers) {
    const missingImages = performers.filter(p => !p.profile_image_url).length;
    const missingRatings = performers.filter(p => !p.average_rating).length;
    const missingBios = performers.filter(p => !p.bio).length;
    console.log(`Performers missing images: ${missingImages}/${performers.length}`);
    console.log(`Performers missing ratings: ${missingRatings}/${performers.length}`);
    console.log(`Performers missing bios: ${missingBios}/${performers.length}`);
  }
  
  // Final assessment
  console.log('\n🎯 FINAL ASSESSMENT:');
  const venueReady = (vCount.count >= 12);
  const eventReady = (eCount.count >= 12);
  const performerReady = (pCount.count >= 12);
  const communityReady = (cCount.count >= 1);
  
  console.log(`Venues ready: ${venueReady ? '✅' : '❌'}`);
  console.log(`Events ready: ${eventReady ? '✅' : '❌'}`);
  console.log(`Performers ready: ${performerReady ? '✅' : '❌'}`);
  console.log(`Community ready: ${communityReady ? '✅' : '❌'}`);
  
  if (venueReady && eventReady && performerReady && communityReady) {
    console.log('\n🎊 SUCCESS! Database is fully populated with quality test data!');
  } else {
    console.log('\n⚠️  MANUAL ACTION REQUIRED: Run MANUAL-SQL-TO-RUN.sql in Supabase SQL Editor');
  }
}

checkDataQuality().catch(console.error);