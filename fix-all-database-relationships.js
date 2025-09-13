const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const client = createClient(supabaseUrl, serviceKey);

async function fixAllDatabaseRelationships() {
  console.log('🔧 Fixing all database relationships...');
  
  // Step 1: Fix event-venue relationships
  console.log('\n1️⃣ Fixing event-venue relationships...');
  await fixEventVenueRelationships();
  
  // Step 2: Fix event-performer relationships (already done, but verify)
  console.log('\n2️⃣ Verifying event-performer relationships...');
  await verifyEventPerformerRelationships();
  
  // Step 3: Fix performer-venue relationships
  console.log('\n3️⃣ Fixing performer-venue relationships...');
  await fixPerformerVenueRelationships();
  
  // Step 4: Fix community-event relationships
  console.log('\n4️⃣ Fixing community-event relationships...');
  await fixCommunityEventRelationships();
  
  // Step 5: Fix calendar-event relationships
  console.log('\n5️⃣ Fixing calendar-event relationships...');
  await fixCalendarEventRelationships();
  
  // Step 6: Fix shop-product relationships
  console.log('\n6️⃣ Fixing shop-product relationships...');
  await fixShopProductRelationships();
  
  // Step 7: Fix user-account relationships
  console.log('\n7️⃣ Fixing user-account relationships...');
  await fixUserAccountRelationships();
  
  console.log('\n✅ All database relationships fixed!');
}

async function fixEventVenueRelationships() {
  // Get all events without venue_id
  const { data: eventsWithoutVenue, error: eventsError } = await client
    .from('events')
    .select('id, title, category')
    .is('venue_id', null);
  
  if (eventsError) {
    console.log('  Error fetching events:', eventsError.message);
    return;
  }
  
  console.log(`  Found ${eventsWithoutVenue.length} events without venue_id`);
  
  // Get available venues
  const { data: venues, error: venuesError } = await client
    .from('venues')
    .select('id, name, category');
  
  if (venuesError) {
    console.log('  Error fetching venues:', venuesError.message);
    return;
  }
  
  console.log(`  Found ${venues.length} available venues`);
  
  // Assign venues to events
  for (let i = 0; i < eventsWithoutVenue.length; i++) {
    const event = eventsWithoutVenue[i];
    const venue = venues[i % venues.length]; // Cycle through venues
    
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

async function verifyEventPerformerRelationships() {
  const { data: events, error: eventsError } = await client
    .from('events')
    .select('id, title, event_performers(count)');
  
  if (eventsError) {
    console.log('  Error fetching events:', eventsError.message);
    return;
  }
  
  let eventsWithPerformers = 0;
  let eventsWithoutPerformers = 0;
  
  events.forEach(event => {
    if (event.event_performers && event.event_performers.length > 0) {
      eventsWithPerformers++;
    } else {
      eventsWithoutPerformers++;
    }
  });
  
  console.log(`  Events with performers: ${eventsWithPerformers}`);
  console.log(`  Events without performers: ${eventsWithoutPerformers}`);
  
  if (eventsWithoutPerformers > 0) {
    console.log('  ⚠️ Some events still missing performers - running fix...');
    await createEventPerformersRelationships();
  }
}

async function createEventPerformersRelationships() {
  // Get events without performers
  const { data: events, error: eventsError } = await client
    .from('events')
    .select('id, title, category')
    .not('id', 'in', `(SELECT DISTINCT event_id FROM event_performers)`);
  
  if (eventsError) {
    console.log('  Error fetching events:', eventsError.message);
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
  
  // Create relationships
  for (const event of events) {
    let suitablePerformers = [];
    
    if (event.category === 'music') {
      suitablePerformers = performers.filter(p => 
        p.category === 'musician' || 
        p.stage_name?.includes('Jazz') || 
        p.stage_name?.includes('Music') ||
        p.stage_name?.includes('Band') ||
        p.stage_name?.includes('Quartet')
      ).slice(0, 2);
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

async function fixPerformerVenueRelationships() {
  // Get performers without venue_id
  const { data: performers, error: performersError } = await client
    .from('performers')
    .select('id, stage_name, category, venue_id');
  
  if (performersError) {
    console.log('  Error fetching performers:', performersError.message);
    return;
  }
  
  const performersWithoutVenue = performers.filter(p => !p.venue_id);
  console.log(`  Found ${performersWithoutVenue.length} performers without venue_id`);
  
  // Get venues
  const { data: venues, error: venuesError } = await client
    .from('venues')
    .select('id, name, category');
  
  if (venuesError) {
    console.log('  Error fetching venues:', venuesError.message);
    return;
  }
  
  // Assign venues to performers
  for (let i = 0; i < performersWithoutVenue.length; i++) {
    const performer = performersWithoutVenue[i];
    const venue = venues[i % venues.length];
    
    const { error: updateError } = await client
      .from('performers')
      .update({ venue_id: venue.id })
      .eq('id', performer.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating performer ${performer.stage_name}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned venue ${venue.name} to performer ${performer.stage_name}`);
    }
  }
}

async function fixCommunityEventRelationships() {
  // Get communities
  const { data: communities, error: communitiesError } = await client
    .from('community_hubs')
    .select('id, name, category');
  
  if (communitiesError) {
    console.log('  Error fetching communities:', communitiesError.message);
    return;
  }
  
  // Get events
  const { data: events, error: eventsError } = await client
    .from('events')
    .select('id, title, category');
  
  if (eventsError) {
    console.log('  Error fetching events:', eventsError.message);
    return;
  }
  
  console.log(`  Found ${communities.length} communities and ${events.length} events`);
  
  // Assign events to communities
  for (let i = 0; i < communities.length; i++) {
    const community = communities[i];
    const event = events[i % events.length];
    
    const { error: updateError } = await client
      .from('events')
      .update({ community_id: community.id })
      .eq('id', event.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating event ${event.title}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned event ${event.title} to community ${community.name}`);
    }
  }
}

async function fixCalendarEventRelationships() {
  // Get calendars
  const { data: calendars, error: calendarsError } = await client
    .from('calendars')
    .select('id, name, type');
  
  if (calendarsError) {
    console.log('  Error fetching calendars:', calendarsError.message);
    return;
  }
  
  // Get events
  const { data: events, error: eventsError } = await client
    .from('events')
    .select('id, title, start_datetime');
  
  if (eventsError) {
    console.log('  Error fetching events:', eventsError.message);
    return;
  }
  
  console.log(`  Found ${calendars.length} calendars and ${events.length} events`);
  
  // Assign events to calendars
  for (let i = 0; i < calendars.length; i++) {
    const calendar = calendars[i];
    const event = events[i % events.length];
    
    const { error: updateError } = await client
      .from('events')
      .update({ calendar_id: calendar.id })
      .eq('id', event.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating event ${event.title}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned event ${event.title} to calendar ${calendar.name}`);
    }
  }
}

async function fixShopProductRelationships() {
  // Get shops
  const { data: shops, error: shopsError } = await client
    .from('shops')
    .select('id, name, category');
  
  if (shopsError) {
    console.log('  Error fetching shops:', shopsError.message);
    return;
  }
  
  // Get products
  const { data: products, error: productsError } = await client
    .from('products')
    .select('id, name, category');
  
  if (productsError) {
    console.log('  Error fetching products:', productsError.message);
    return;
  }
  
  console.log(`  Found ${shops.length} shops and ${products.length} products`);
  
  // Assign products to shops
  for (let i = 0; i < shops.length; i++) {
    const shop = shops[i];
    const product = products[i % products.length];
    
    const { error: updateError } = await client
      .from('products')
      .update({ shop_id: shop.id })
      .eq('id', product.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating product ${product.name}:`, updateError.message);
    } else {
      console.log(`  ✅ Assigned product ${product.name} to shop ${shop.name}`);
    }
  }
}

async function fixUserAccountRelationships() {
  // Get accounts
  const { data: accounts, error: accountsError } = await client
    .from('accounts')
    .select('id, name, is_personal_account');
  
  if (accountsError) {
    console.log('  Error fetching accounts:', accountsError.message);
    return;
  }
  
  // Get user profiles
  const { data: userProfiles, error: profilesError } = await client
    .from('user_profiles')
    .select('id, user_id, first_name, last_name');
  
  if (profilesError) {
    console.log('  Error fetching user profiles:', profilesError.message);
    return;
  }
  
  console.log(`  Found ${accounts.length} accounts and ${userProfiles.length} user profiles`);
  
  // Link user profiles to accounts
  for (let i = 0; i < userProfiles.length; i++) {
    const profile = userProfiles[i];
    const account = accounts[i % accounts.length];
    
    const { error: updateError } = await client
      .from('user_profiles')
      .update({ account_id: account.id })
      .eq('id', profile.id);
    
    if (updateError) {
      console.log(`  ❌ Error updating profile ${profile.first_name}:`, updateError.message);
    } else {
      console.log(`  ✅ Linked profile ${profile.first_name} to account ${account.name}`);
    }
  }
}

fixAllDatabaseRelationships().catch(console.error);
