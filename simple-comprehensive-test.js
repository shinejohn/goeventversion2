const puppeteer = require('puppeteer');
const fs = require('fs');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5174';
const MAGIC_PATTERNS_URL = 'https://project-common-application-components-and-pages-template-901.magicpatterns.app';
const RAILWAY_URL = 'https://goeventversion2-production.up.railway.app';

// Test results
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  tests: [],
  summary: { total: 0, passed: 0, failed: 0, errors: [] }
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addTestResult(name, status, details = {}) {
  testResults.tests.push({ name, status, details, timestamp: new Date().toISOString() });
  testResults.summary.total++;
  if (status === 'passed') {
    testResults.summary.passed++;
  } else {
    testResults.summary.failed++;
    if (details.error) {
      testResults.summary.errors.push(details.error);
    }
  }
}

async function takeScreenshot(page, name) {
  const timestamp = Date.now();
  const filename = `screenshots/${name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  return filename;
}

async function testPage(page, url, name) {
  log(`Testing ${name} (${url})`, 'info');
  
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    if (!response) {
      addTestResult(name, 'failed', { error: 'No response received' });
      return;
    }
    
    const status = response.status();
    
    if (status >= 400) {
      addTestResult(name, 'failed', { error: `HTTP ${status} error`, status, url });
      return;
    }
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for error boundaries
    const errorBoundary = await page.$('[data-test="root-error-boundary"]');
    if (errorBoundary) {
      const errorText = await page.evaluate(() => {
        const errorEl = document.querySelector('[data-test="root-error-boundary"]');
        return errorEl ? errorEl.textContent : '';
      });
      
      if (errorText.includes('Ouch!') || errorText.includes('Sorry, something went wrong')) {
        addTestResult(name, 'failed', { error: 'Error boundary triggered', errorText, url });
        return;
      }
    }
    
    // Check for main content
    const mainContent = await page.$('main, [role="main"], .main-content');
    if (!mainContent) {
      addTestResult(name, 'failed', { error: 'No main content found', url });
      return;
    }
    
    // Test interactive elements
    const buttons = await page.$$('button');
    const links = await page.$$('a');
    const inputs = await page.$$('input, select, textarea');
    
    let workingButtons = 0;
    let workingLinks = 0;
    let workingInputs = 0;
    
    // Test buttons
    for (const button of buttons.slice(0, 10)) { // Test first 10 buttons
      try {
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        if (isVisible && isEnabled) workingButtons++;
      } catch (e) {}
    }
    
    // Test links
    for (const link of links.slice(0, 10)) { // Test first 10 links
      try {
        const isVisible = await link.isVisible();
        const href = await link.getAttribute('href');
        if (isVisible && href) workingLinks++;
      } catch (e) {}
    }
    
    // Test inputs
    for (const input of inputs.slice(0, 10)) { // Test first 10 inputs
      try {
        const isVisible = await input.isVisible();
        const isEnabled = await input.isEnabled();
        if (isVisible && isEnabled) workingInputs++;
      } catch (e) {}
    }
    
    // Take screenshot
    const screenshotPath = await takeScreenshot(page, name);
    
    addTestResult(name, 'passed', {
      status,
      url,
      interactiveElements: {
        buttons: buttons.length,
        workingButtons,
        links: links.length,
        workingLinks,
        inputs: inputs.length,
        workingInputs
      },
      screenshot: screenshotPath
    });
    
    log(`✅ ${name} - ${buttons.length} buttons, ${links.length} links, ${inputs.length} inputs`, 'success');
    
  } catch (error) {
    addTestResult(name, 'failed', { error: error.message, url });
    log(`❌ ${name} failed: ${error.message}`, 'error');
  }
}

async function testDatabaseData(page) {
  log('Testing database data integration', 'info');
  
  try {
    // Test events page
    await page.goto(`${BASE_URL}/events`, { waitUntil: 'networkidle2' });
    const eventCards = await page.$$('.card, [data-test="event-card"], .event-card');
    
    if (eventCards.length > 0) {
      log(`✅ Found ${eventCards.length} event cards`, 'success');
      
      // Test clicking on first event
      const firstEventLink = await page.$('a[href*="/events/"]');
      if (firstEventLink) {
        await firstEventLink.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const eventTitle = await page.$('h1, .event-title, [data-test="event-title"]');
        if (eventTitle) {
          log('✅ Event detail page loads with data', 'success');
        }
      }
    } else {
      log('⚠️ No event cards found', 'warning');
    }
    
    // Test venues page
    await page.goto(`${BASE_URL}/venues`, { waitUntil: 'networkidle2' });
    const venueCards = await page.$$('.card, [data-test="venue-card"], .venue-card');
    
    if (venueCards.length > 0) {
      log(`✅ Found ${venueCards.length} venue cards`, 'success');
    } else {
      log('⚠️ No venue cards found', 'warning');
    }
    
    // Test performers page
    await page.goto(`${BASE_URL}/performers`, { waitUntil: 'networkidle2' });
    const performerCards = await page.$$('.card, [data-test="performer-card"], .performer-card');
    
    if (performerCards.length > 0) {
      log(`✅ Found ${performerCards.length} performer cards`, 'success');
    } else {
      log('⚠️ No performer cards found', 'warning');
    }
    
  } catch (error) {
    log(`❌ Database data test failed: ${error.message}`, 'error');
  }
}

async function testMagicPatternsComparison(page) {
  log('Testing Magic Patterns UI comparison', 'info');
  
  try {
    // Test our app
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const ourScreenshot = await takeScreenshot(page, 'our_app_homepage');
    
    // Test Magic Patterns reference
    await page.goto(MAGIC_PATTERNS_URL, { waitUntil: 'networkidle2' });
    const magicPatternsScreenshot = await takeScreenshot(page, 'magic_patterns_reference');
    
    log('✅ Magic Patterns UI comparison completed', 'success');
    
    return { ourApp: ourScreenshot, magicPatterns: magicPatternsScreenshot };
  } catch (error) {
    log(`❌ Magic Patterns comparison failed: ${error.message}`, 'error');
    return null;
  }
}

async function testRailwayDeployment(page) {
  log('Testing Railway deployment', 'info');
  
  try {
    const response = await page.goto(RAILWAY_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    if (response && response.status() === 200) {
      log('✅ Railway deployment is accessible', 'success');
      return true;
    } else {
      log(`❌ Railway deployment returned status ${response ? response.status() : 'unknown'}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Railway deployment test failed: ${error.message}`, 'error');
    return false;
  }
}

async function runTests() {
  log('🚀 Starting Comprehensive Test Suite', 'info');
  log(`Base URL: ${BASE_URL}`, 'info');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Create screenshots directory
    if (!fs.existsSync('screenshots')) {
      fs.mkdirSync('screenshots');
    }
    
    // Test core pages
    const corePages = [
      { url: `${BASE_URL}/`, name: 'Homepage' },
      { url: `${BASE_URL}/events`, name: 'Events Listing' },
      { url: `${BASE_URL}/venues`, name: 'Venues Listing' },
      { url: `${BASE_URL}/performers`, name: 'Performers Listing' },
      { url: `${BASE_URL}/communities`, name: 'Communities Listing' },
      { url: `${BASE_URL}/calendars`, name: 'Calendars Listing' },
      { url: `${BASE_URL}/tickets`, name: 'Tickets Marketplace' },
      { url: `${BASE_URL}/shop`, name: 'Shop' },
      { url: `${BASE_URL}/pricing`, name: 'Pricing' },
      { url: `${BASE_URL}/about`, name: 'About' },
      { url: `${BASE_URL}/contact`, name: 'Contact' },
      { url: `${BASE_URL}/faq`, name: 'FAQ' },
      { url: `${BASE_URL}/auth/sign-in`, name: 'Sign In' },
      { url: `${BASE_URL}/auth/sign-up`, name: 'Sign Up' },
      { url: `${BASE_URL}/events/1`, name: 'Event Detail 1' },
      { url: `${BASE_URL}/venues/1`, name: 'Venue Detail 1' },
      { url: `${BASE_URL}/performers/1`, name: 'Performer Detail 1' },
      { url: `${BASE_URL}/c/jazz-lovers`, name: 'Community Detail (Jazz)' },
      { url: `${BASE_URL}/c/rock-music`, name: 'Community Detail (Rock)' },
      { url: `${BASE_URL}/calendars/jazz-events`, name: 'Calendar Detail (Jazz)' },
      { url: `${BASE_URL}/calendars/rock-concerts`, name: 'Calendar Detail (Rock)' }
    ];
    
    // Test each page
    for (const pageConfig of corePages) {
      await testPage(page, pageConfig.url, pageConfig.name);
    }
    
    // Test database integration
    await testDatabaseData(page);
    
    // Test Magic Patterns comparison
    await testMagicPatternsComparison(page);
    
    // Test Railway deployment
    await testRailwayDeployment(page);
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, 'error');
    testResults.summary.errors.push(error.message);
  } finally {
    await browser.close();
  }
  
  // Generate report
  const reportPath = `comprehensive-test-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  
  log('📊 Test Summary:', 'info');
  log(`Total Tests: ${testResults.summary.total}`, 'info');
  log(`Passed: ${testResults.summary.passed}`, 'success');
  log(`Failed: ${testResults.summary.failed}`, testResults.summary.failed > 0 ? 'error' : 'success');
  log(`Report saved to: ${reportPath}`, 'info');
  
  if (testResults.summary.errors.length > 0) {
    log('Errors encountered:', 'error');
    testResults.summary.errors.forEach((error, index) => {
      log(`${index + 1}. ${error}`, 'error');
    });
  }
  
  return testResults;
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
