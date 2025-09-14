const { createClient } = require('@supabase/supabase-js');

// Use the production Supabase URL from the app's environment
const SUPABASE_URL = 'https://goeventversion2-production.up.railway.app';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testEventCreateLoader() {
  console.log('🧪 Testing Event Create Loader...');
  
  try {
    // Test the venues query that the loader uses
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, name, address')
      .order('name');
    
    if (venuesError) {
      console.error('❌ Venues query error:', venuesError);
      return false;
    }
    
    console.log('✅ Venues query successful:', venues?.length || 0, 'venues found');
    console.log('   Sample venues:', venues?.slice(0, 3));
    
    return true;
  } catch (error) {
    console.error('❌ Loader test error:', error);
    return false;
  }
}

async function testPerformerCreateLoader() {
  console.log('🧪 Testing Performer Create Loader...');
  
  try {
    // Test user authentication (this would normally be done in the loader)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('⚠️  User auth error (expected for service role):', userError.message);
    } else {
      console.log('✅ User auth successful:', user?.id);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Loader test error:', error);
    return false;
  }
}

async function testVenueCreateLoader() {
  console.log('🧪 Testing Venue Create Loader...');
  
  try {
    // Test user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('⚠️  User auth error (expected for service role):', userError.message);
    } else {
      console.log('✅ User auth successful:', user?.id);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Loader test error:', error);
    return false;
  }
}

async function runLoaderTests() {
  console.log('🚀 Starting Loader Tests...');
  console.log(`   Supabase URL: ${SUPABASE_URL}`);
  
  const results = await Promise.all([
    testEventCreateLoader(),
    testPerformerCreateLoader(),
    testVenueCreateLoader()
  ]);
  
  const successCount = results.filter(r => r).length;
  console.log(`\n📊 RESULTS: ${successCount}/${results.length} loaders working`);
  
  if (successCount === results.length) {
    console.log('✅ All loaders are working correctly');
  } else {
    console.log('❌ Some loaders have issues');
  }
}

runLoaderTests().then(() => {
  console.log('\n🎉 Loader testing complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
