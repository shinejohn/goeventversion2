const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function fixDatabaseRelationships() {
  console.log('🔧 Fixing database relationships with correct schema...');
  
  // Step 1: Fix event-venue relationships
  console.log('\n1️⃣ Fixing event-venue relationships...');
  await fixEventVenueRelationships();
  
  // Step 2: Fix event-performer relationships
  console.log('\n2️⃣ Fixing event-performer relationships...');
  await fixEventPerformerRelationships();
  
  // Step 3: Fix performer-account relationships
  console.log('\n3️⃣ Fixing performer-account relationships...');
  await fixPerformerAccountRelationships();
  
  // Step 4: Fix venue-account relationships
  console.log('\n4️⃣ Fixing venue-account relationships...');
  await fixVenueAccountRelationships();
  
  // Step 5: Fix community-event relationships
  console.log('\n5️⃣ Fixing community-event relationships...');
  await fixCommunityEventRelationships();
  
  // Step 6: Fix user-profile-account relationships
  console.log('\n6️⃣ Fixing user-profile-account relationships...');
  await fixUserProfileAccountRelationships();
  
  console.log('\n✅ Database relationships fixed!');
}

async function fixEventVenueRelationships() {
  // Get events without venue_id
  const { data: eventsWithoutVenue, error: eventsError } = await client
    .from('events')
    .select('id, title, category')
    .is('venue_id', null);
  
  if (eventsError) {
    console.log('  Error fetching events:', eventsError.message);
    return;
  }
  
  console.log(`  Found ${eventsWithoutVenue.length} events without venue_id`);
  
  if (eventsWithoutVenue.length === 0) {
    console.log('  ✅ All events already have venue_id');
    return;
  }
  
  // Get available venues
  const { data: venues, error: venuesError } = await client
    .from('venues')
    .select('id, name, venue_type');
  
  if (venuesError) {
    console.log('  Error fetching venues:', venuesError.message);
    return;
  }
  
  console.log(`  Found ${venues.length} available venues`);
  
  // Assign venues to events
  for (let i = 0; i < eventsWithoutVenue.length; i++) {
    const event = eventsWithoutVenue[i];
    const venue = venues[i % venues.length];
    
    const { error: updateError } = await client
      .from('events')
      .update({ venue_id: venue.id })
      .eq('id', event.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating event ${event.title}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned venue ${venue.name} to event ${event.title}`);
    }
  }
}

async function fixEventPerformerRelationships() {
  // Get events without performers
  const { data: events, error: eventsError } = await client
    .from('events')
    .select('id, title, category, event_performers(count)');
  
  if (eventsError) {
    console.log('  Error fetching events:', eventsError.message);
    return;
  }
  
  const eventsWithoutPerformers = events.filter(event => 
    !event.event_performers || event.event_performers.length === 0
  );
  
  console.log(`  Found ${eventsWithoutPerformers.length} events without performers`);
  
  if (eventsWithoutPerformers.length === 0) {
    console.log('  ✅ All events already have performers');
    return;
  }
  
  // Get performers
  const { data: performers, error: performersError } = await client
    .from('performers')
    .select('id, stage_name, category');
  
  if (performersError) {
    console.log('  Error fetching performers:', performersError.message);
    return;
  }
  
  console.log(`  Found ${performers.length} available performers`);
  
  // Create relationships
  for (const event of eventsWithoutPerformers) {
    let suitablePerformers = [];
    
    if (event.category === 'music') {
      suitablePerformers = performers.filter(p => 
        p.category === 'musician' || 
        p.stage_name?.includes('Jazz') || 
        p.stage_name?.includes('Music') ||
        p.stage_name?.includes('Band') ||
        p.stage_name?.includes('Quartet')
      ).slice(0, 2);
    } else if (event.category === 'entertainment') {
      suitablePerformers = performers.filter(p => 
        p.stage_name?.includes('Comedy') || 
        p.stage_name?.includes('Laugh') ||
        p.stage_name?.includes('Improv')
      ).slice(0, 1);
    } else {
      suitablePerformers = performers.slice(0, 1);
    }
    
    for (const performer of suitablePerformers) {
      const { error: insertError } = await client
        .from('event_performers')
        .insert({
          event_id: event.id,
          performer_id: performer.id,
          is_headliner: true,
          performance_order: 1,
          set_duration_minutes: 60,
          compensation: 500.00,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.log(`  ❌ Error creating relationship for ${event.title}:`, insertError.message);
      } else {
        console.log(`  ✅ Created relationship: ${event.title} -> ${performer.stage_name}`);
      }
    }
  }
}

async function fixPerformerAccountRelationships() {
  // Get performers without account_id
  const { data: performers, error: performersError } = await client
    .from('performers')
    .select('id, stage_name, account_id');
  
  if (performersError) {
    console.log('  Error fetching performers:', performersError.message);
    return;
  }
  
  const performersWithoutAccount = performers.filter(p => !p.account_id);
  console.log(`  Found ${performersWithoutAccount.length} performers without account_id`);
  
  if (performersWithoutAccount.length === 0) {
    console.log('  ✅ All performers already have account_id');
    return;
  }
  
  // Get accounts
  const { data: accounts, error: accountsError } = await client
    .from('accounts')
    .select('id, name');
  
  if (accountsError) {
    console.log('  Error fetching accounts:', accountsError.message);
    return;
  }
  
  console.log(`  Found ${accounts.length} available accounts`);
  
  // Assign accounts to performers
  for (let i = 0; i < performersWithoutAccount.length; i++) {
    const performer = performersWithoutAccount[i];
    const account = accounts[i % accounts.length];
    
    const { error: updateError } = await client
      .from('performers')
      .update({ account_id: account.id })
      .eq('id', performer.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating performer ${performer.stage_name}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned account ${account.name} to performer ${performer.stage_name}`);
    }
  }
}

async function fixVenueAccountRelationships() {
  // Get venues without account_id
  const { data: venues, error: venuesError } = await client
    .from('venues')
    .select('id, name, account_id');
  
  if (venuesError) {
    console.log('  Error fetching venues:', venuesError.message);
    return;
  }
  
  const venuesWithoutAccount = venues.filter(v => !v.account_id);
  console.log(`  Found ${venuesWithoutAccount.length} venues without account_id`);
  
  if (venuesWithoutAccount.length === 0) {
    console.log('  ✅ All venues already have account_id');
    return;
  }
  
  // Get accounts
  const { data: accounts, error: accountsError } = await client
    .from('accounts')
    .select('id, name');
  
  if (accountsError) {
    console.log('  Error fetching accounts:', accountsError.message);
    return;
  }
  
  console.log(`  Found ${accounts.length} available accounts`);
  
  // Assign accounts to venues
  for (let i = 0; i < venuesWithoutAccount.length; i++) {
    const venue = venuesWithoutAccount[i];
    const account = accounts[i % accounts.length];
    
    const { error: updateError } = await client
      .from('venues')
      .update({ account_id: account.id })
      .eq('id', venue.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating venue ${venue.name}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned account ${account.name} to venue ${venue.name}`);
    }
  }
}

async function fixCommunityEventRelationships() {
  // Get events without community_id
  const { data: events, error: eventsError } = await client
    .from('events')
    .select('id, title, community_id');
  
  if (eventsError) {
    console.log('  Error fetching events:', eventsError.message);
    return;
  }
  
  const eventsWithoutCommunity = events.filter(e => !e.community_id);
  console.log(`  Found ${eventsWithoutCommunity.length} events without community_id`);
  
  if (eventsWithoutCommunity.length === 0) {
    console.log('  ✅ All events already have community_id');
    return;
  }
  
  // Get communities
  const { data: communities, error: communitiesError } = await client
    .from('community_hubs')
    .select('id, name');
  
  if (communitiesError) {
    console.log('  Error fetching communities:', communitiesError.message);
    return;
  }
  
  console.log(`  Found ${communities.length} available communities`);
  
  // Assign communities to events
  for (let i = 0; i < eventsWithoutCommunity.length; i++) {
    const event = eventsWithoutCommunity[i];
    const community = communities[i % communities.length];
    
    const { error: updateError } = await client
      .from('events')
      .update({ community_id: community.id })
      .eq('id', event.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating event ${event.title}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned community ${community.name} to event ${event.title}`);
    }
  }
}

async function fixUserProfileAccountRelationships() {
  // Get user profiles without account_id
  const { data: profiles, error: profilesError } = await client
    .from('user_profiles')
    .select('id, display_name, home_community_id');
  
  if (profilesError) {
    console.log('  Error fetching user profiles:', profilesError.message);
    return;
  }
  
  console.log(`  Found ${profiles.length} user profiles`);
  
  // Get accounts
  const { data: accounts, error: accountsError } = await client
    .from('accounts')
    .select('id, name');
  
  if (accountsError) {
    console.log('  Error fetching accounts:', accountsError.message);
    return;
  }
  
  console.log(`  Found ${accounts.length} available accounts`);
  
  // Assign accounts to user profiles
  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const account = accounts[i % accounts.length];
    
    const { error: updateError } = await client
      .from('user_profiles')
      .update({ account_id: account.id })
      .eq('id', profile.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating profile ${profile.display_name}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned account ${account.name} to profile ${profile.display_name}`);
    }
  }
}

fixDatabaseRelationships().catch(console.error);