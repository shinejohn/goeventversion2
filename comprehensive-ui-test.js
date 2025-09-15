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

// Working IDs from actual data
const workingIds = {
  events: [
    '7d53af64-45d6-406d-8fd5-f06335dd1c42', // Jazz Night with The Midnight Quartet
    '2f7a7d17-a7e1-449e-b71a-1c738d78cbb3', // Sarah Chen Violin Recital
    '99726dc7-24e4-4223-87e9-6c69adcd9237'  // Summer Music Festival 2025
  ],
  venues: [
    'e008685d-3298-4850-98ff-02bc24915800'  // The Hollywood Bowl (confirmed working)
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

async function testPageLoad(page, url, expectedContent) {
  try {
    log(`Testing page load: ${url}`);
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    
    if (response.status() !== 200) {
      addTestResult(`Page Load: ${url}`, 'failed', { 
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
        addTestResult(`Content Check: ${url}`, 'failed', { 
          expectedContent, 
          found: 'Content not found' 
        });
        return false;
      }
    }

    addTestResult(`Page Load: ${url}`, 'passed', { status: response.status() });
    return true;
  } catch (error) {
    addTestResult(`Page Load: ${url}`, 'failed', { error: error.message });
    return false;
  }
}

async function testButtonClick(page, selector, expectedUrl) {
  try {
    log(`Testing button click: ${selector}`);
    
    // Wait for button to be visible
    await page.waitForSelector(selector, { timeout: 5000 });
    
    // Click the button
    await page.click(selector);
    
    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
    
    const currentUrl = page.url();
    const urlMatches = expectedUrl ? currentUrl.includes(expectedUrl) : true;
    
    if (urlMatches) {
      addTestResult(`Button Click: ${selector}`, 'passed', { 
        currentUrl, 
        expectedUrl 
      });
      return true;
    } else {
      addTestResult(`Button Click: ${selector}`, 'failed', { 
        currentUrl, 
        expectedUrl 
      });
      return false;
    }
  } catch (error) {
    addTestResult(`Button Click: ${selector}`, 'failed', { error: error.message });
    return false;
  }
}

async function testFormSubmission(page, formSelector, inputData) {
  try {
    log(`Testing form submission: ${formSelector}`);
    
    // Wait for form to be visible
    await page.waitForSelector(formSelector, { timeout: 5000 });
    
    // Fill form inputs
    for (const [selector, value] of Object.entries(inputData)) {
      await page.type(selector, value);
    }
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    addTestResult(`Form Submission: ${formSelector}`, 'passed', { inputData });
    return true;
  } catch (error) {
    addTestResult(`Form Submission: ${formSelector}`, 'failed', { error: error.message });
    return false;
  }
}

async function testDataPresentation(page, url, expectedData) {
  try {
    log(`Testing data presentation: ${url}`);
    
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
      addTestResult(`Data Presentation: ${url}`, 'passed', { dataFound });
      return true;
    } else {
      addTestResult(`Data Presentation: ${url}`, 'failed', { dataFound, expectedData });
      return false;
    }
  } catch (error) {
    addTestResult(`Data Presentation: ${url}`, 'failed', { error: error.message });
    return false;
  }
}

async function runComprehensiveTests() {
  log('Starting comprehensive UI testing...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    // Test 1: Homepage
    await testPageLoad(page, BASE_URL, ['Go Event City', 'Events', 'Venues']);
    
    // Test 2: Events listing page
    await testPageLoad(page, `${BASE_URL}/events`, ['Jazz Night', 'Sarah Chen', 'Summer Music Festival']);
    
    // Test 3: Event detail pages with actual working IDs
    for (const eventId of workingIds.events) {
      await testPageLoad(page, `${BASE_URL}/events/${eventId}`, ['Event Details', 'Similar Events']);
    }
    
    // Test 4: Venues listing page
    await testPageLoad(page, `${BASE_URL}/venues`, ['The Hollywood Bowl', 'Venue']);
    
    // Test 5: Venue detail page with working ID
    for (const venueId of workingIds.venues) {
      await testPageLoad(page, `${BASE_URL}/venues/${venueId}`, ['The Hollywood Bowl', 'About This Venue']);
    }
    
    // Test 6: Communities page
    await testPageLoad(page, `${BASE_URL}/communities`, ['Communities', 'Join']);
    
    // Test 7: Community detail page
    await testPageLoad(page, `${BASE_URL}/c/jazz-lovers`, ['Jazz Lovers', 'Community']);
    
    // Test 8: Calendars page
    await testPageLoad(page, `${BASE_URL}/calendars`, ['Calendars', 'Subscribe']);
    
    // Test 9: Calendar detail page
    await testPageLoad(page, `${BASE_URL}/calendars/jazz-lovers`, ['Jazz Lovers', 'Calendar']);
    
    // Test 10: Book It pages
    await testPageLoad(page, `${BASE_URL}/book-it`, ['Book It', 'Venues', 'Gigs']);
    await testPageLoad(page, `${BASE_URL}/book-it/venues`, ['Book It', 'Venues']);
    await testPageLoad(page, `${BASE_URL}/book-it/gigs`, ['Book It', 'Gigs']);
    
    // Test 11: Test data presentation on event detail page
    await testDataPresentation(page, `${BASE_URL}/events/${workingIds.events[1]}`, {
      eventTitle: 'Sarah Chen Violin Recital',
      eventDescription: 'Classical violinist',
      eventPrice: '$35',
      eventDate: '2/20/2024',
      similarEvents: ['Similar Events', 'Event 11', 'Summer Music Festival']
    });
    
    // Test 12: Test data presentation on venue detail page
    await testDataPresentation(page, `${BASE_URL}/venues/${workingIds.venues[0]}`, {
      venueName: 'The Hollywood Bowl',
      venueAddress: '2301 N Highland Ave',
      venueDescription: 'Iconic outdoor amphitheater',
      amenities: ['parking', 'food_court', 'gift_shop']
    });
    
    // Test 13: Test navigation buttons
    await page.goto(BASE_URL);
    await testButtonClick(page, 'a[href="/events"]', '/events');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'a[href="/venues"]', '/venues');
    
    await page.goto(BASE_URL);
    await testButtonClick(page, 'a[href="/communities"]', '/communities');
    
    // Test 14: Test event card clicks
    await page.goto(`${BASE_URL}/events`);
    const eventCards = await page.$$('[data-test="event-card"], .cursor-pointer');
    if (eventCards.length > 0) {
      await eventCards[0].click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      addTestResult('Event Card Click', 'passed', { currentUrl: page.url() });
    }
    
    // Test 15: Test search functionality
    await page.goto(BASE_URL);
    await page.type('input[placeholder*="Search"]', 'jazz');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    addTestResult('Search Functionality', 'passed', { searchTerm: 'jazz' });
    
    log('Comprehensive testing completed!');
    
  } catch (error) {
    log(`Test suite error: ${error.message}`, 'error');
    testResults.summary.errors.push(error.message);
  } finally {
    await browser.close();
  }
  
  // Generate report
  const reportPath = `comprehensive-ui-test-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  
  log(`\n📊 TEST RESULTS SUMMARY:`);
  log(`Total Tests: ${testResults.summary.total}`);
  log(`Passed: ${testResults.summary.passed} (${Math.round(testResults.summary.passed/testResults.summary.total*100)}%)`);
  log(`Failed: ${testResults.summary.failed} (${Math.round(testResults.summary.failed/testResults.summary.total*100)}%)`);
  log(`Errors: ${testResults.summary.errors.length}`);
  log(`Report saved to: ${reportPath}`);
  
  return testResults;
}

// Run the tests
runComprehensiveTests().catch(console.error);
