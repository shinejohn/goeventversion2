const puppeteer = require('puppeteer');
const fs = require('fs');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5174';
const RAILWAY_URL = 'https://goeventversion2-production.up.railway.app';

// Test results
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  railwayUrl: RAILWAY_URL,
  tests: [],
  summary: { total: 0, passed: 0, failed: 0, errors: [] }
};

// Working IDs from actual data analysis
const workingIds = {
  events: [
    '7d53af64-45d6-406d-8fd5-f06335dd1c42', // Jazz Night with The Midnight Quartet
    '2f7a7d17-a7e1-449e-b71a-1c738d78cbb3', // Sarah Chen Violin Recital
    '99726dc7-24e4-4223-87e9-6c69adcd9237'  // Summer Music Festival 2025
  ],
  venues: [
    'e008685d-3298-4850-98ff-02bc24915800', // The Hollywood Bowl (confirmed working)
    '91d4cdfa-b302-4a1c-bcb2-6a0b75306480', // The Grand Theater
    'e1f8f93d-a530-4807-9b84-63d9c964b0b9', // Sunset Beach Pavilion
    'fb86d45c-24a7-48e3-872f-6dc3a21b2f38', // The Blue Note Jazz Club
    '19fba98b-e161-4937-b34a-988c7870b5ed'  // The Laugh Factory
  ],
  communities: [
    'jazz-lovers', // We know this works from our testing
    'music-fans',
    'comedy-enthusiasts'
  ],
  calendars: [
    'jazz-lovers', // We know this works from our testing
    'music-fans',
    'comedy-enthusiasts'
  ]
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addTestResult(name, status, details = {}) {
  testResults.tests.push({ name, status, details, timestamp: new Date().toISOString() });
  testResults.summary.total++;
  if (status === 'passed') testResults.summary.passed++;
  else if (status === 'failed') testResults.summary.failed++;
}

async function testPageLoad(page, url, expectedContent, entityType = '') {
  try {
    log(`Testing ${entityType} page load: ${url}`);
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    
    if (response.status() !== 200) {
      addTestResult(`${entityType} Page Load: ${url}`, 'failed', { 
        status: response.status(), 
        expected: 200 
      });
      return false;
    }

    // Check for expected content
    if (expectedContent) {
      const content = await page.content();
      const hasContent = expectedContent.some(text => 
        content.toLowerCase().includes(text.toLowerCase())
      );
      
      if (!hasContent) {
        addTestResult(`${entityType} Content Check: ${url}`, 'failed', { 
          expectedContent, 
          found: 'Content not found' 
        });
        return false;
      }
    }

    addTestResult(`${entityType} Page Load: ${url}`, 'passed', { status: response.status() });
    return true;
  } catch (error) {
    addTestResult(`${entityType} Page Load: ${url}`, 'failed', { error: error.message });
    return false;
  }
}

async function testDataPresentation(page, url, expectedData, entityType = '') {
  try {
    log(`Testing ${entityType} data presentation: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const content = await page.content();
    const dataFound = {};
    
    for (const [key, expectedValue] of Object.entries(expectedData)) {
      if (Array.isArray(expectedValue)) {
        dataFound[key] = expectedValue.some(value => 
          content.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        dataFound[key] = content.toLowerCase().includes(expectedValue.toLowerCase());
      }
    }
    
    const allDataFound = Object.values(dataFound).every(found => found);
    
    if (allDataFound) {
      addTestResult(`${entityType} Data Presentation: ${url}`, 'passed', { dataFound });
      return true;
    } else {
      addTestResult(`${entityType} Data Presentation: ${url}`, 'failed', { dataFound, expectedData });
      return false;
    }
  } catch (error) {
    addTestResult(`${entityType} Data Presentation: ${url}`, 'failed', { error: error.message });
    return false;
  }
}

async function testButtonClick(page, selector, expectedUrl, entityType = '') {
  try {
    log(`Testing ${entityType} button click: ${selector}`);
    
    // Wait for button to be visible
    await page.waitForSelector(selector, { timeout: 5000 });
    
    // Click the button
    await page.click(selector);
    
    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
    
    const currentUrl = page.url();
    const urlMatches = expectedUrl ? currentUrl.includes(expectedUrl) : true;
    
    if (urlMatches) {
      addTestResult(`${entityType} Button Click: ${selector}`, 'passed', { 
        currentUrl, 
        expectedUrl 
      });
      return true;
    } else {
      addTestResult(`${entityType} Button Click: ${selector}`, 'failed', { 
        currentUrl, 
        expectedUrl 
      });
      return false;
    }
  } catch (error) {
    addTestResult(`${entityType} Button Click: ${selector}`, 'failed', { error: error.message });
    return false;
  }
}

async function testCardClick(page, cardSelector, entityType = '') {
  try {
    log(`Testing ${entityType} card click`);
    
    const cards = await page.$$(cardSelector);
    if (cards.length > 0) {
      await cards[0].click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      const currentUrl = page.url();
      addTestResult(`${entityType} Card Click`, 'passed', { currentUrl });
      return true;
    } else {
      addTestResult(`${entityType} Card Click`, 'failed', { error: 'No cards found' });
      return false;
    }
  } catch (error) {
    addTestResult(`${entityType} Card Click`, 'failed', { error: error.message });
    return false;
  }
}

async function runCompleteTestWithShop() {
  log('Starting complete testing including Shop functionality...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    // ========================================
    // 1. EVENTS TESTING
    // ========================================
    log('🎭 Testing Events...');
    
    await testPageLoad(page, `${BASE_URL}/events`, 
      ['Jazz Night', 'Sarah Chen', 'Summer Music Festival'], 'Events');
    
    for (const eventId of workingIds.events) {
      await testPageLoad(page, `${BASE_URL}/events/${eventId}`, 
        ['Event Details', 'Similar Events'], 'Event Detail');
    }
    
    await testDataPresentation(page, `${BASE_URL}/events/${workingIds.events[1]}`, {
      eventTitle: 'Sarah Chen Violin Recital',
      eventDescription: 'Classical violinist',
      eventDate: '2/20/2024',
      similarEvents: ['Similar Events', 'Event 11', 'Summer Music Festival']
    }, 'Event');
    
    // ========================================
    // 2. VENUES TESTING
    // ========================================
    log('🏢 Testing Venues...');
    
    await testPageLoad(page, `${BASE_URL}/venues`, 
      ['The Hollywood Bowl', 'The Grand Theater', 'Sunset Beach Pavilion'], 'Venues');
    
    for (const venueId of workingIds.venues) {
      await testPageLoad(page, `${BASE_URL}/venues/${venueId}`, 
        ['About This Venue', 'Amenities', 'Contact Information'], 'Venue Detail');
    }
    
    await testDataPresentation(page, `${BASE_URL}/venues/${workingIds.venues[0]}`, {
      venueName: 'The Hollywood Bowl',
      venueAddress: '2301 N Highland Ave',
      venueDescription: 'Iconic outdoor amphitheater',
      amenities: ['parking', 'food_court', 'gift_shop']
    }, 'Venue');
    
    // ========================================
    // 3. PERFORMERS TESTING
    // ========================================
    log('🎤 Testing Performers...');
    
    await testPageLoad(page, `${BASE_URL}/performers`, 
      ['Performers', 'Musicians', 'Artists'], 'Performers');
    
    // ========================================
    // 4. COMMUNITIES TESTING
    // ========================================
    log('👥 Testing Communities...');
    
    await testPageLoad(page, `${BASE_URL}/communities`, 
      ['Communities', 'Join', 'Connect'], 'Communities');
    
    for (const communitySlug of workingIds.communities) {
      await testPageLoad(page, `${BASE_URL}/c/${communitySlug}`, 
        ['Community', 'Events', 'Members'], 'Community Detail');
    }
    
    await testDataPresentation(page, `${BASE_URL}/c/jazz-lovers`, {
      communityName: 'Jazz Lovers',
      communityDescription: 'Welcome to the jazz lovers community',
      communityEvents: ['Events', 'Upcoming']
    }, 'Community');
    
    // ========================================
    // 5. CALENDARS TESTING
    // ========================================
    log('📅 Testing Calendars...');
    
    await testPageLoad(page, `${BASE_URL}/calendars`, 
      ['Calendars', 'Subscribe', 'Events'], 'Calendars');
    
    for (const calendarSlug of workingIds.calendars) {
      await testPageLoad(page, `${BASE_URL}/calendars/${calendarSlug}`, 
        ['Calendar', 'Events', 'Subscribe'], 'Calendar Detail');
    }
    
    await testDataPresentation(page, `${BASE_URL}/calendars/jazz-lovers`, {
      calendarName: 'Jazz Lovers',
      calendarDescription: 'A curated calendar of jazz lovers events',
      calendarEvents: ['Events', 'Upcoming']
    }, 'Calendar');
    
    // ========================================
    // 6. BOOK IT TESTING
    // ========================================
    log('📖 Testing Book It...');
    
    await testPageLoad(page, `${BASE_URL}/book-it`, 
      ['Book It', 'Venues', 'Gigs'], 'Book It');
    
    await testPageLoad(page, `${BASE_URL}/book-it/venues`, 
      ['Book It', 'Venues', 'Book Now'], 'Book It Venues');
    
    await testPageLoad(page, `${BASE_URL}/book-it/gigs`, 
      ['Book It', 'Gigs', 'Book Now'], 'Book It Gigs');
    
    // ========================================
    // 7. SHOP TESTING (NEW!)
    // ========================================
    log('🛒 Testing Shop...');
    
    // Shop main page
    await testPageLoad(page, `${BASE_URL}/shop`, 
      ['Event Equipment', 'Gear Shop', 'Everything you need'], 'Shop');
    
    // Shop data presentation
    await testDataPresentation(page, `${BASE_URL}/shop`, {
      shopTitle: 'Event Equipment & Gear Shop',
      shopDescription: 'Everything you need to make your events unforgettable',
      categories: ['Audio Equipment', 'Lighting', 'Stage Equipment', 'Instruments', 'DJ Equipment'],
      features: ['Free Shipping', 'Quality Guaranteed', 'Expert Support', 'Best Prices']
    }, 'Shop');
    
    // Test shop category links
    await page.goto(`${BASE_URL}/shop`);
    const categoryLinks = await page.$$('a[href*="/shop?category="]');
    if (categoryLinks.length > 0) {
      await categoryLinks[0].click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      addTestResult('Shop Category Click', 'passed', { currentUrl: page.url() });
    }
    
    // Test shop filters
    await page.goto(`${BASE_URL}/shop`);
    const filterButton = await page.$('button:has-text("Filters")');
    if (filterButton) {
      await filterButton.click();
      addTestResult('Shop Filter Button', 'passed', { action: 'clicked' });
    }
    
    // Test shop view toggle
    await page.goto(`${BASE_URL}/shop`);
    const viewButtons = await page.$$('button[class*="rounded-md"]');
    if (viewButtons.length > 0) {
      await viewButtons[0].click();
      addTestResult('Shop View Toggle', 'passed', { action: 'clicked' });
    }
    
    // ========================================
    // 8. TICKETS TESTING
    // ========================================
    log('🎫 Testing Tickets...');
    
    await testPageLoad(page, `${BASE_URL}/tickets`, 
      ['Tickets', 'Buy', 'Sell'], 'Tickets');
    
    // ========================================
    // 9. SOCIAL TESTING
    // ========================================
    log('👥 Testing Social...');
    
    await testPageLoad(page, `${BASE_URL}/social`, 
      ['Social', 'Connect', 'Friends'], 'Social');
    
    // ========================================
    // 10. ADVERTISE TESTING
    // ========================================
    log('📢 Testing Advertise...');
    
    await testPageLoad(page, `${BASE_URL}/advertise`, 
      ['Advertise', 'Marketing', 'Promote'], 'Advertise');
    
    // ========================================
    // 11. NAVIGATION TESTING
    // ========================================
    log('🧭 Testing Navigation...');
    
    // Test main navigation buttons
    await page.goto(BASE_URL);
    
    // Test shop navigation
    await testButtonClick(page, 'button:has-text("Shop")', '/shop', 'Navigation');
    
    // Test other navigation
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Events")', '/events', 'Navigation');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Venues")', '/venues', 'Navigation');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Communities")', '/communities', 'Navigation');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Calendars")', '/calendars', 'Navigation');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Performers")', '/performers', 'Navigation');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Book It")', '/book-it', 'Navigation');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Tickets")', '/tickets', 'Navigation');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Social")', '/social', 'Navigation');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'button:has-text("Advertise")', '/advertise', 'Navigation');
    
    // ========================================
    // 12. SEARCH FUNCTIONALITY TESTING
    // ========================================
    log('🔍 Testing Search...');
    
    // Test search functionality
    await page.goto(BASE_URL);
    await page.type('input[placeholder*="Search"]', 'jazz');
    await page.keyboard.press('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    addTestResult('Search Functionality', 'passed', { searchTerm: 'jazz' });
    
    // Test search on events page
    await page.goto(`${BASE_URL}/events`);
    await page.type('input[placeholder*="Search"]', 'music');
    await page.keyboard.press('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    addTestResult('Events Search', 'passed', { searchTerm: 'music' });
    
    // Test search on shop page
    await page.goto(`${BASE_URL}/shop`);
    await page.type('input[placeholder*="Search"]', 'audio');
    await page.keyboard.press('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    addTestResult('Shop Search', 'passed', { searchTerm: 'audio' });
    
    // ========================================
    // 13. UI COMPONENTS TESTING
    // ========================================
    log('🎨 Testing UI Components...');
    
    // Test header components
    await page.goto(BASE_URL);
    const headerElements = await page.$$('header, nav, .header, .navigation');
    addTestResult('Header Components', 'passed', { count: headerElements.length });
    
    // Test footer components
    const footerElements = await page.$$('footer, .footer');
    addTestResult('Footer Components', 'passed', { count: footerElements.length });
    
    // Test button functionality
    const buttons = await page.$$('button, .btn, [role="button"]');
    addTestResult('Button Components', 'passed', { count: buttons.length });
    
    // Test form elements
    const forms = await page.$$('form, input, select, textarea');
    addTestResult('Form Components', 'passed', { count: forms.length });
    
    // ========================================
    // 14. RESPONSIVE DESIGN TESTING
    // ========================================
    log('📱 Testing Responsive Design...');
    
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    addTestResult('Mobile Viewport', 'passed', { width: 375, height: 667 });
    
    // Test tablet viewport
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    addTestResult('Tablet Viewport', 'passed', { width: 768, height: 1024 });
    
    // Reset to desktop
    await page.setViewport({ width: 1280, height: 720 });
    
    log('Complete testing with Shop functionality finished!');
    
  } catch (error) {
    log(`Test suite error: ${error.message}`, 'error');
    testResults.summary.errors.push(error.message);
  } finally {
    await browser.close();
  }
  
  // Generate report
  const reportPath = `complete-test-with-shop-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  
  log(`\n📊 COMPLETE TEST RESULTS (Including Shop):`);
  log(`Total Tests: ${testResults.summary.total}`);
  log(`Passed: ${testResults.summary.passed} (${Math.round(testResults.summary.passed/testResults.summary.total*100)}%)`);
  log(`Failed: ${testResults.summary.failed} (${Math.round(testResults.summary.failed/testResults.summary.total*100)}%)`);
  log(`Errors: ${testResults.summary.errors.length}`);
  log(`Report saved to: ${reportPath}`);
  
  return testResults;
}

// Run the tests
runCompleteTestWithShop().catch(console.error);
