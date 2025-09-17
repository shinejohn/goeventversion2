const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const RAILWAY_APP_URL = 'https://when-the-fun-production.up.railway.app';
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkShopAndBooking() {
  console.log('Shop & Booking Features Check');
  console.log('=============================\n');
  
  // Check Shop Routes
  console.log('SHOP FEATURES:');
  console.log('--------------');
  
  const shopRoutes = [
    { path: '/shop', name: 'Shop Homepage' },
    { path: '/shop/cart', name: 'Shopping Cart' },
    { path: '/shop/checkout', name: 'Checkout' },
    { path: '/shop/product/1', name: 'Product Detail' },
  ];
  
  for (const route of shopRoutes) {
    await checkRoute(route.path, route.name);
  }
  
  // Check database for shop data
  console.log('\nChecking Shop Database:');
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .limit(5);
  
  if (prodError) {
    console.log('❌ Products table error:', prodError.message);
  } else {
    console.log(`✅ Found ${products?.length || 0} products in database`);
    products?.forEach(p => {
      console.log(`   - ${p.name}: $${p.price}`);
    });
  }
  
  // Check Booking Routes
  console.log('\n\nBOOKING FEATURES:');
  console.log('------------------');
  
  const bookingRoutes = [
    { path: '/booking/wizard', name: 'Booking Wizard' },
    { path: '/booking/calendar', name: 'Booking Calendar' },
    { path: '/booking/manage', name: 'Manage Bookings' },
    { path: '/bookings', name: 'My Bookings' },
    { path: '/book', name: 'Book Page' },
    { path: '/book-it', name: 'Book It Page' },
  ];
  
  for (const route of bookingRoutes) {
    await checkRoute(route.path, route.name);
  }
  
  // Check database for booking data
  console.log('\nChecking Booking Database:');
  const { data: bookings, error: bookError } = await supabase
    .from('bookings')
    .select('*')
    .limit(5);
  
  if (bookError) {
    console.log('❌ Bookings table error:', bookError.message);
  } else {
    console.log(`✅ Found ${bookings?.length || 0} bookings in database`);
  }
  
  // Check Ticket Routes (related to booking)
  console.log('\n\nTICKET FEATURES:');
  console.log('------------------');
  
  const ticketRoutes = [
    { path: '/tickets', name: 'Tickets Homepage' },
    { path: '/tickets/marketplace', name: 'Ticket Marketplace' },
    { path: '/my-tickets', name: 'My Tickets' },
    { path: '/tickets/buy', name: 'Buy Tickets' },
    { path: '/tickets/purchase', name: 'Purchase Tickets' },
  ];
  
  for (const route of ticketRoutes) {
    await checkRoute(route.path, route.name);
  }
  
  // Check database for ticket data
  console.log('\nChecking Tickets Database:');
  const { data: tickets, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .limit(5);
  
  if (ticketError) {
    console.log('❌ Tickets table error:', ticketError.message);
  } else {
    console.log(`✅ Found ${tickets?.length || 0} tickets in database`);
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(50));
  console.log('ANALYSIS:');
  console.log('='.repeat(50));
  console.log('\nBased on the results above:');
  console.log('1. If routes return 404 - they are not deployed');
  console.log('2. If routes return 500 - there may be server/database issues');
  console.log('3. If database queries fail - tables may not exist');
  console.log('4. If everything fails - the deployment is missing these features');
}

async function checkRoute(path, name) {
  return new Promise((resolve) => {
    const url = `${RAILWAY_APP_URL}${path}`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'ShopBookingChecker/1.0',
        'Accept': 'text/html'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        let status = '❓';
        let details = '';
        
        if (res.statusCode === 200) {
          // Check if it's actually showing content or an error
          if (data.includes('Shop') || data.includes('shop') || 
              data.includes('Book') || data.includes('book') ||
              data.includes('Ticket') || data.includes('ticket')) {
            status = '✅';
            details = 'Page loads with relevant content';
          } else if (data.includes('Not Found') || data.includes('404')) {
            status = '⚠️';
            details = 'Page loads but shows 404 content';
          } else {
            status = '❓';
            details = 'Page loads but content unclear';
          }
        } else if (res.statusCode === 404) {
          status = '❌';
          details = 'Route not found (404)';
        } else if (res.statusCode === 500) {
          status = '💥';
          details = 'Server error (500)';
        } else if (res.statusCode === 302) {
          status = '↪️';
          details = `Redirects to: ${res.headers.location}`;
        } else {
          status = '❓';
          details = `Status: ${res.statusCode}`;
        }
        
        console.log(`${status} ${name} (${path}): ${details}`);
        resolve();
      });
    }).on('error', (err) => {
      console.log(`💥 ${name} (${path}): Connection error - ${err.message}`);
      resolve();
    });
  });
}

// Run the check
checkShopAndBooking().catch(console.error);