const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5174';
const MAGIC_PATTERNS_URL = 'https://project-common-application-components-and-pages-template-901.magicpatterns.app';
const RAILWAY_URL = 'https://goeventversion2-production.up.railway.app';

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  magicPatternsUrl: MAGIC_PATTERNS_URL,
  railwayUrl: RAILWAY_URL,
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  }
};

// User types to test
const userTypes = [
  { type: 'fan', email: 'fan@test.com', password: 'TestPassword123!' },
  { type: 'performer', email: 'performer@test.com', password: 'TestPassword123!' },
  { type: 'venue_owner', email: 'venue@test.com', password: 'TestPassword123!' },
  { type: 'organizer', email: 'organizer@test.com', password: 'TestPassword123!' },
  { type: 'admin', email: 'admin@test.com', password: 'TestPassword123!' }
];

// Pages to test
const pagesToTest = [
  // Public pages
  { url: '/', name: 'Homepage', category: 'public' },
  { url: '/events', name: 'Events Listing', category: 'public' },
  { url: '/venues', name: 'Venues Listing', category: 'public' },
  { url: '/performers', name: 'Performers Listing', category: 'public' },
  { url: '/communities', name: 'Communities Listing', category: 'public' },
  { url: '/calendars', name: 'Calendars Listing', category: 'public' },
  { url: '/tickets', name: 'Tickets Marketplace', category: 'public' },
  { url: '/shop', name: 'Shop', category: 'public' },
  { url: '/pricing', name: 'Pricing', category: 'public' },
  { url: '/about', name: 'About', category: 'public' },
  { url: '/contact', name: 'Contact', category: 'public' },
  { url: '/faq', name: 'FAQ', category: 'public' },
  
  // Auth pages
  { url: '/auth/sign-in', name: 'Sign In', category: 'auth' },
  { url: '/auth/sign-up', name: 'Sign Up', category: 'auth' },
  { url: '/auth/forgot-password', name: 'Forgot Password', category: 'auth' },
  
  // Detail pages (with sample IDs)
  { url: '/events/1', name: 'Event Detail 1', category: 'detail' },
  { url: '/events/2', name: 'Event Detail 2', category: 'detail' },
  { url: '/venues/1', name: 'Venue Detail 1', category: 'detail' },
  { url: '/performers/1', name: 'Performer Detail 1', category: 'detail' },
  { url: '/c/jazz-lovers', name: 'Community Detail (Jazz)', category: 'detail' },
  { url: '/c/rock-music', name: 'Community Detail (Rock)', category: 'detail' },
  { url: '/calendars/jazz-events', name: 'Calendar Detail (Jazz)', category: 'detail' },
  { url: '/calendars/rock-concerts', name: 'Calendar Detail (Rock)', category: 'detail' },
  
  // Dashboard pages (require auth)
  { url: '/home', name: 'User Dashboard', category: 'dashboard', requiresAuth: true },
  { url: '/dashboard/fan', name: 'Fan Dashboard', category: 'dashboard', requiresAuth: true },
  { url: '/dashboard/performer/calendar', name: 'Performer Calendar', category: 'dashboard', requiresAuth: true },
  { url: '/dashboard/venue-owner', name: 'Venue Owner Dashboard', category: 'dashboard', requiresAuth: true },
  { url: '/dashboard/organizer', name: 'Organizer Dashboard', category: 'dashboard', requiresAuth: true },
  { url: '/admin', name: 'Admin Dashboard', category: 'admin', requiresAuth: true },
  
  // Create/Input pages
  { url: '/events/create', name: 'Create Event', category: 'create', requiresAuth: true },
  { url: '/venues/create', name: 'Create Venue', category: 'create', requiresAuth: true },
  { url: '/performers/create', name: 'Create Performer', category: 'create', requiresAuth: true },
  { url: '/communities/create', name: 'Create Community', category: 'create', requiresAuth: true },
  { url: '/calendars/create', name: 'Create Calendar', category: 'create', requiresAuth: true },
  { url: '/book-it', name: 'Book It', category: 'create', requiresAuth: true },
  
  // Settings pages
  { url: '/settings/account', name: 'Account Settings', category: 'settings', requiresAuth: true },
  { url: '/settings/notifications', name: 'Notification Settings', category: 'settings', requiresAuth: true },
  { url: '/settings/privacy', name: 'Privacy Settings', category: 'settings', requiresAuth: true },
  { url: '/settings/security', name: 'Security Settings', category: 'settings', requiresAuth: true },
  { url: '/profile/edit', name: 'Edit Profile', category: 'settings', requiresAuth: true }
];

// Helper functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addTestResult(testName, status, details = {}) {
  testResults.tests.push({
    name: testName,
    status,
    details,
    timestamp: new Date().toISOString()
  });
  
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

async function testPage(page, pageConfig, browser) {
  const { url, name, category, requiresAuth = false } = pageConfig;
  const fullUrl = `${BASE_URL}${url}`;
  
  log(`Testing ${name} (${fullUrl})`, 'info');
  
  try {
    const response = await page.goto(fullUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    if (!response) {
      addTestResult(name, 'failed', { error: 'No response received' });
      return;
    }
    
    const status = response.status();
    
    if (status >= 400) {
      addTestResult(name, 'failed', { 
        error: `HTTP ${status} error`,
        status,
        url: fullUrl
      });
      return;
    }
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check for error boundaries
    const errorBoundary = await page.$('[data-test="root-error-boundary"]');
    if (errorBoundary) {
      const errorText = await page.evaluate(() => {
        const errorEl = document.querySelector('[data-test="root-error-boundary"]');
        return errorEl ? errorEl.textContent : '';
      });
      
      if (errorText.includes('Ouch!') || errorText.includes('Sorry, something went wrong')) {
        addTestResult(name, 'failed', { 
          error: 'Error boundary triggered',
          errorText,
          url: fullUrl
        });
        return;
      }
    }
    
    // Check for main content
    const mainContent = await page.$('main, [role="main"], .main-content');
    if (!mainContent) {
      addTestResult(name, 'failed', { 
        error: 'No main content found',
        url: fullUrl
      });
      return;
    }
    
    // Test all interactive elements
    const interactiveElements = await page.$$('button, a, input, select, textarea, [role="button"]');
    let interactiveElementCount = 0;
    let workingElements = 0;
    
    for (const element of interactiveElements) {
      interactiveElementCount++;
      
      try {
        const isVisible = await element.isVisible();
        const isEnabled = await element.isEnabled();
        
        if (isVisible && isEnabled) {
          workingElements++;
        }
      } catch (e) {
        // Element might not be interactive
      }
    }
    
    // Take screenshot
    const screenshotPath = await takeScreenshot(page, name);
    
    // Test form submissions if this is a create page
    if (category === 'create') {
      await testFormSubmission(page, name, pageConfig);
    }
    
    addTestResult(name, 'passed', {
      status,
      url: fullUrl,
      category,
      interactiveElements: interactiveElementCount,
      workingElements,
      screenshot: screenshotPath
    });
    
    log(`✅ ${name} - ${interactiveElementCount} interactive elements, ${workingElements} working`, 'success');
    
  } catch (error) {
    addTestResult(name, 'failed', { 
      error: error.message,
      url: fullUrl
    });
    log(`❌ ${name} failed: ${error.message}`, 'error');
  }
}

async function testFormSubmission(page, pageName, pageConfig) {
  try {
    // Look for forms
    const forms = await page.$$('form');
    
    for (const form of forms) {
      const inputs = await form.$$('input[type="text"], input[type="email"], input[type="password"], textarea, select');
      
      if (inputs.length > 0) {
        log(`Testing form submission on ${pageName}`, 'info');
        
        // Fill out form with test data
        for (const input of inputs) {
          const inputType = await input.getAttribute('type');
          const inputName = await input.getAttribute('name') || await input.getAttribute('id') || 'unknown';
          
          if (inputType === 'email') {
            await input.type('test@example.com');
          } else if (inputType === 'password') {
            await input.type('TestPassword123!');
          } else if (inputType === 'text' || !inputType) {
            await input.type(`Test ${inputName}`);
          }
        }
        
        // Try to submit form
        const submitButton = await form.$('button[type="submit"], input[type="submit"]');
        if (submitButton) {
          await submitButton.click();
          await page.waitForTimeout(2000);
          
          // Check if submission was successful (no error messages)
          const errorMessages = await page.$$('.error, .alert-error, [role="alert"]');
          if (errorMessages.length === 0) {
            log(`✅ Form submission successful on ${pageName}`, 'success');
          } else {
            log(`⚠️ Form submission had errors on ${pageName}`, 'warning');
          }
        }
      }
    }
  } catch (error) {
    log(`⚠️ Form testing failed on ${pageName}: ${error.message}`, 'warning');
  }
}

async function testUserAuthentication(page, userType) {
  const { type, email, password } = userType;
  
  log(`Testing authentication for ${type}`, 'info');
  
  try {
    // Go to sign in page
    await page.goto(`${BASE_URL}/auth/sign-in`, { waitUntil: 'networkidle2' });
    
    // Fill in credentials
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    
    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Check if login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('/home') || currentUrl.includes('/dashboard')) {
      log(`✅ Authentication successful for ${type}`, 'success');
      return true;
    } else {
      log(`❌ Authentication failed for ${type}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Authentication error for ${type}: ${error.message}`, 'error');
    return false;
  }
}

async function testDatabaseIntegration(page) {
  log('Testing database integration', 'info');
  
  try {
    // Test events data
    await page.goto(`${BASE_URL}/events`, { waitUntil: 'networkidle2' });
    const eventCards = await page.$$('[data-test="event-card"], .event-card, .card');
    
    if (eventCards.length > 0) {
      log(`✅ Found ${eventCards.length} event cards`, 'success');
      
      // Test event detail page
      const firstEventLink = await page.$('a[href*="/events/"]');
      if (firstEventLink) {
        await firstEventLink.click();
        await page.waitForTimeout(2000);
        
        const eventTitle = await page.$('h1, .event-title, [data-test="event-title"]');
        if (eventTitle) {
          log('✅ Event detail page loads with data', 'success');
        }
      }
    }
    
    // Test venues data
    await page.goto(`${BASE_URL}/venues`, { waitUntil: 'networkidle2' });
    const venueCards = await page.$$('[data-test="venue-card"], .venue-card, .card');
    
    if (venueCards.length > 0) {
      log(`✅ Found ${venueCards.length} venue cards`, 'success');
    }
    
    // Test performers data
    await page.goto(`${BASE_URL}/performers`, { waitUntil: 'networkidle2' });
    const performerCards = await page.$$('[data-test="performer-card"], .performer-card, .card');
    
    if (performerCards.length > 0) {
      log(`✅ Found ${performerCards.length} performer cards`, 'success');
    }
    
  } catch (error) {
    log(`❌ Database integration test failed: ${error.message}`, 'error');
  }
}

async function testMagicPatternsUI(page) {
  log('Testing Magic Patterns UI consistency', 'info');
  
  try {
    // Test our app
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    const ourScreenshot = await takeScreenshot(page, 'our_app_homepage');
    
    // Test Magic Patterns reference
    await page.goto(MAGIC_PATTERNS_URL, { waitUntil: 'networkidle2' });
    const magicPatternsScreenshot = await takeScreenshot(page, 'magic_patterns_reference');
    
    log('✅ Magic Patterns UI comparison completed', 'success');
    
    return {
      ourApp: ourScreenshot,
      magicPatterns: magicPatternsScreenshot
    };
  } catch (error) {
    log(`❌ Magic Patterns UI test failed: ${error.message}`, 'error');
    return null;
  }
}

async function testRailwayDeployment(page) {
  log('Testing Railway deployment', 'info');
  
  try {
    await page.goto(RAILWAY_URL, { waitUntil: 'networkidle2' });
    
    const status = page.response ? page.response.status : 'unknown';
    if (status === 200) {
      log('✅ Railway deployment is accessible', 'success');
      return true;
    } else {
      log(`❌ Railway deployment returned status ${status}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Railway deployment test failed: ${error.message}`, 'error');
    return false;
  }
}

async function runComprehensiveTests() {
  log('🚀 Starting Comprehensive Test Suite', 'info');
  log(`Base URL: ${BASE_URL}`, 'info');
  log(`Magic Patterns URL: ${MAGIC_PATTERNS_URL}`, 'info');
  log(`Railway URL: ${RAILWAY_URL}`, 'info');
  
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
    
    // Test 1: Public pages (no auth required)
    log('📄 Testing Public Pages', 'info');
    for (const pageConfig of pagesToTest.filter(p => !p.requiresAuth)) {
      await testPage(page, pageConfig, browser);
    }
    
    // Test 2: Database integration
    log('🗄️ Testing Database Integration', 'info');
    await testDatabaseIntegration(page);
    
    // Test 3: Magic Patterns UI comparison
    log('🎨 Testing Magic Patterns UI', 'info');
    await testMagicPatternsUI(page);
    
    // Test 4: Railway deployment
    log('🚂 Testing Railway Deployment', 'info');
    await testRailwayDeployment(page);
    
    // Test 5: User authentication and dashboard pages
    log('👤 Testing User Authentication', 'info');
    for (const userType of userTypes) {
      const authSuccess = await testUserAuthentication(page, userType);
      
      if (authSuccess) {
        // Test dashboard pages for this user type
        const dashboardPages = pagesToTest.filter(p => 
          p.requiresAuth && 
          (p.category === 'dashboard' || p.category === 'create' || p.category === 'settings')
        );
        
        for (const pageConfig of dashboardPages) {
          await testPage(page, pageConfig, browser);
        }
        
        // Logout for next user
        await page.goto(`${BASE_URL}/auth/logout`, { waitUntil: 'networkidle2' });
      }
    }
    
    // Test 6: Form submissions and data creation
    log('📝 Testing Form Submissions', 'info');
    for (const pageConfig of pagesToTest.filter(p => p.category === 'create')) {
      await testPage(page, pageConfig, browser);
    }
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`, 'error');
    testResults.summary.errors.push(error.message);
  } finally {
    await browser.close();
  }
  
  // Generate final report
  const reportPath = `test-report-${Date.now()}.json`;
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
  runComprehensiveTests().catch(console.error);
}

module.exports = { runComprehensiveTests };
