const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

// Test user credentials (you'll need to create these in Supabase)
const TEST_USERS = {
  performer: {
    email: 'performer@test.com',
    password: 'testpass123',
    role: 'performer'
  },
  venue_owner: {
    email: 'venue@test.com', 
    password: 'testpass123',
    role: 'venue_owner'
  },
  organizer: {
    email: 'organizer@test.com',
    password: 'testpass123', 
    role: 'organizer'
  },
  admin: {
    email: 'admin@test.com',
    password: 'testpass123',
    role: 'admin'
  }
};

// Test pages to check
const TEST_PAGES = {
  public: [
    { url: '/', name: 'Homepage' },
    { url: '/events', name: 'Events Discovery' },
    { url: '/performers', name: 'Performers Discovery' },
    { url: '/venues', name: 'Venues Discovery' },
    { url: '/communities', name: 'Communities Discovery' },
    { url: '/calendars', name: 'Calendars Discovery' },
    { url: '/shop', name: 'Shop/Marketplace' },
    { url: '/tickets', name: 'Tickets' },
    { url: '/pricing', name: 'Pricing' },
    { url: '/about', name: 'About' },
    { url: '/contact', name: 'Contact' }
  ],
  create: [
    { url: '/events/create', name: 'Create Event' },
    { url: '/performers/create', name: 'Create Performer Profile' },
    { url: '/venues/create', name: 'Create Venue' },
    { url: '/communities/create', name: 'Create Community' },
    { url: '/calendars/create', name: 'Create Calendar' }
  ],
  detail: [
    { url: '/events/4ddfb41a-991f-4098-9965-f498a3d06a2f', name: 'Event Detail' },
    { url: '/communities/hub-1', name: 'Community Detail' },
    { url: '/calendars/summer-music-festival', name: 'Calendar Detail' }
  ],
  dashboard: [
    { url: '/dashboard', name: 'Main Dashboard' },
    { url: '/dashboard/performer', name: 'Performer Dashboard' },
    { url: '/dashboard/venue-owner', name: 'Venue Owner Dashboard' },
    { url: '/dashboard/organizer', name: 'Organizer Dashboard' },
    { url: '/my-tickets', name: 'My Tickets' },
    { url: '/saved-items', name: 'Saved Items' }
  ]
};

async function testPage(browser, page, testPage, userType = 'public') {
  const fullUrl = `${BASE_URL}${testPage.url}`;
  
  try {
    console.log(`\n🔍 Testing ${testPage.name} (${userType})...`);
    console.log(`   URL: ${fullUrl}`);
    
    await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait a bit for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for common error indicators
    const errorIndicators = [
      'Ouch! :|',
      'Page Not Found',
      '404',
      '500',
      'Error',
      'Something went wrong'
    ];
    
    const pageContent = await page.content();
    const hasError = errorIndicators.some(indicator => 
      pageContent.includes(indicator)
    );
    
    if (hasError) {
      console.log(`   ❌ ERROR: Page shows error indicators`);
      return { success: false, error: 'Error indicators found' };
    }
    
    // Check for expected content based on page type
    let hasExpectedContent = false;
    
    if (testPage.name.includes('Discovery') || testPage.name.includes('Homepage')) {
      // Look for data cards or content
      const cards = await page.$$('[data-test*="card"], .card, article, .bg-white.rounded-lg');
      hasExpectedContent = cards.length > 0;
    } else if (testPage.name.includes('Create')) {
      // Look for form elements
      const forms = await page.$$('form, input, textarea, select');
      hasExpectedContent = forms.length > 0;
    } else if (testPage.name.includes('Detail')) {
      // Look for detail content
      const detailContent = await page.$$('h1, h2, .text-xl, .text-2xl, .text-3xl');
      hasExpectedContent = detailContent.length > 0;
    } else {
      // General content check
      const content = await page.$$('h1, h2, h3, p, div');
      hasExpectedContent = content.length > 0;
    }
    
    if (hasExpectedContent) {
      console.log(`   ✅ SUCCESS: Page loads with expected content`);
      return { success: true };
    } else {
      console.log(`   ⚠️  WARNING: Page loads but may be missing content`);
      return { success: true, warning: 'Content may be missing' };
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function loginUser(page, user) {
  try {
    console.log(`\n🔐 Logging in as ${user.role}...`);
    
    // Go to login page
    await page.goto(`${BASE_URL}/auth/sign-in`, { waitUntil: 'networkidle2' });
    
    // Fill in credentials
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.type('input[type="email"]', user.email);
    await page.type('input[type="password"]', user.password);
    
    // Click login button
    await page.click('button[type="submit"], button:has-text("Sign In")');
    
    // Wait for redirect
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    
    // Check if login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('/auth/sign-in')) {
      console.log(`   ❌ Login failed for ${user.role}`);
      return false;
    }
    
    console.log(`   ✅ Login successful for ${user.role}`);
    return true;
    
  } catch (error) {
    console.log(`   ❌ Login error for ${user.role}: ${error.message}`);
    return false;
  }
}

async function testUserType(browser, userType, user) {
  console.log(`\n👤 Testing UI for ${userType.toUpperCase()} user...`);
  
  const page = await browser.newPage();
  const results = {
    userType,
    loginSuccess: false,
    pages: {}
  };
  
  try {
    // Try to login
    results.loginSuccess = await loginUser(page, user);
    
    if (!results.loginSuccess) {
      console.log(`   ⚠️  Skipping page tests due to login failure`);
      return results;
    }
    
    // Test all page categories
    const allPages = [
      ...TEST_PAGES.public,
      ...TEST_PAGES.create,
      ...TEST_PAGES.detail,
      ...TEST_PAGES.dashboard
    ];
    
    for (const testPage of allPages) {
      const result = await testPage(browser, page, testPage, userType);
      results.pages[testPage.name] = result;
    }
    
  } catch (error) {
    console.log(`   ❌ Error testing ${userType}: ${error.message}`);
  } finally {
    await page.close();
  }
  
  return results;
}

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive UI Testing...');
  console.log(`   Base URL: ${BASE_URL}`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const allResults = {
    public: {},
    users: {}
  };
  
  try {
    // Test public pages (no login required)
    console.log('\n🌐 Testing Public Pages...');
    const publicPage = await browser.newPage();
    
    for (const testPage of TEST_PAGES.public) {
      const result = await testPage(browser, publicPage, testPage, 'public');
      allResults.public[testPage.name] = result;
    }
    
    await publicPage.close();
    
    // Test each user type
    for (const [userType, user] of Object.entries(TEST_USERS)) {
      const userResults = await testUserType(browser, userType, user);
      allResults.users[userType] = userResults;
    }
    
    // Generate summary report
    console.log('\n📊 COMPREHENSIVE TEST RESULTS SUMMARY');
    console.log('=' .repeat(50));
    
    // Public pages summary
    console.log('\n🌐 PUBLIC PAGES:');
    const publicPages = Object.entries(allResults.public);
    const publicSuccess = publicPages.filter(([_, result]) => result.success).length;
    console.log(`   ✅ Working: ${publicSuccess}/${publicPages.length}`);
    
    publicPages.forEach(([name, result]) => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${name}`);
    });
    
    // User types summary
    console.log('\n👤 USER TYPES:');
    Object.entries(allResults.users).forEach(([userType, userResults]) => {
      const loginStatus = userResults.loginSuccess ? '✅' : '❌';
      console.log(`   ${loginStatus} ${userType.toUpperCase()}: Login ${userResults.loginSuccess ? 'Success' : 'Failed'}`);
      
      if (userResults.loginSuccess) {
        const pageResults = Object.entries(userResults.pages);
        const successCount = pageResults.filter(([_, result]) => result.success).length;
        console.log(`      Pages: ${successCount}/${pageResults.length} working`);
      }
    });
    
    // Create pages summary
    console.log('\n🔧 CREATE PAGES:');
    const createPages = [
      ...TEST_PAGES.create,
      ...TEST_PAGES.detail
    ];
    
    createPages.forEach(page => {
      const publicResult = allResults.public[page.name];
      const status = publicResult?.success ? '✅' : '❌';
      console.log(`   ${status} ${page.name}`);
    });
    
  } catch (error) {
    console.error('❌ Test suite error:', error);
  } finally {
    await browser.close();
  }
  
  return allResults;
}

// Run the tests
runComprehensiveTests().then(results => {
  console.log('\n🎉 Testing complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
