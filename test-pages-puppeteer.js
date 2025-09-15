const puppeteer = require('puppeteer');
const fs = require('fs');

// Test configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5174';
const RAILWAY_URL = 'https://goeventversion2-production.up.railway.app';

// Pages to test
const PAGES_TO_TEST = [
  // Main report pages
  { path: '/', name: 'Homepage' },
  { path: '/events', name: 'Events Report' },
  { path: '/performers', name: 'Performers Report' },
  { path: '/venues', name: 'Venues Report' },
  { path: '/calendars', name: 'Calendars Report' },
  { path: '/shop', name: 'Shop/Marketplace' },
  { path: '/tickets', name: 'Tickets Report' },
  
  // Community pages
  { path: '/c/jazz-lovers', name: 'Community Hub - Jazz Lovers' },
  { path: '/c/rock-music', name: 'Community Hub - Rock Music' },
  { path: '/c/art-gallery', name: 'Community Hub - Art Gallery' },
  
  // Calendar pages
  { path: '/calendars/marketplace', name: 'Calendar Marketplace' },
  { path: '/calendars/jazz-events', name: 'Calendar Detail - Jazz Events' },
  { path: '/calendars/rock-concerts', name: 'Calendar Detail - Rock Concerts' },
  
  // Event detail pages
  { path: '/events/1', name: 'Event Detail - ID 1' },
  { path: '/events/2', name: 'Event Detail - ID 2' },
  { path: '/events/3', name: 'Event Detail - ID 3' },
  
  // Performer detail pages
  { path: '/performers/1', name: 'Performer Detail - ID 1' },
  { path: '/performers/2', name: 'Performer Detail - ID 2' },
  { path: '/performers/3', name: 'Performer Detail - ID 3' },
  
  // Venue detail pages
  { path: '/venues/1', name: 'Venue Detail - ID 1' },
  { path: '/venues/2', name: 'Venue Detail - ID 2' },
  { path: '/venues/3', name: 'Venue Detail - ID 3' },
  
  // Ticket pages
  { path: '/tickets/my-tickets', name: 'My Tickets' },
  { path: '/tickets/purchase/1', name: 'Ticket Purchase - Event 1' },
  { path: '/tickets/purchase/2', name: 'Ticket Purchase - Event 2' },
  
  // Management pages
  { path: '/management/performer', name: 'Performer Management' },
  { path: '/management/venue', name: 'Venue Management' },
  { path: '/management/influencer', name: 'Influencer Management' },
];

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  totalPages: PAGES_TO_TEST.length,
  passed: 0,
  failed: 0,
  errors: [],
  results: []
};

async function testPage(browser, page, testPage) {
  const result = {
    name: testPage.name,
    path: testPage.path,
    url: `${BASE_URL}${testPage.path}`,
    status: 'unknown',
    statusCode: null,
    loadTime: 0,
    hasContent: false,
    hasData: false,
    errorMessage: null,
    issues: []
  };

  try {
    console.log(`Testing: ${testPage.name} (${testPage.path})`);
    
    const startTime = Date.now();
    
    // Navigate to page
    const response = await page.goto(result.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    result.statusCode = response.status();
    result.loadTime = Date.now() - startTime;
    
    // Check for 404 or error status
    if (response.status() >= 400) {
      result.status = 'error';
      result.errorMessage = `HTTP ${response.status()}`;
      result.issues.push(`HTTP Error: ${response.status()}`);
      return result;
    }
    
    // Check if page loaded successfully
    result.status = 'success';
    
    // Check for content indicators
    const contentChecks = await page.evaluate(() => {
      try {
        const checks = {
          hasTitle: document.title && document.title !== 'GoEventCity',
          hasMainContent: document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('.container') || document.querySelector('body > div') || document.querySelector('#root'),
          hasCards: document.querySelectorAll('[class*="card"], [class*="Card"]').length > 0,
          hasEvents: document.querySelectorAll('[class*="event"], [class*="Event"]').length > 0,
          hasPerformers: document.querySelectorAll('[class*="performer"], [class*="Performer"]').length > 0,
          hasVenues: document.querySelectorAll('[class*="venue"], [class*="Venue"]').length > 0,
          hasCalendars: document.querySelectorAll('[class*="calendar"], [class*="Calendar"]').length > 0,
          hasTickets: document.querySelectorAll('[class*="ticket"], [class*="Ticket"]').length > 0,
          hasErrorMessages: document.querySelectorAll('[class*="error"], [class*="Error"], [class*="not-found"], [class*="Not Found"]').length > 0,
          hasLoadingStates: document.querySelectorAll('[class*="loading"], [class*="Loading"], [class*="spinner"]').length > 0,
          hasEmptyStates: document.querySelectorAll('[class*="empty"], [class*="Empty"], [class*="no-data"]').length > 0,
          hasMockData: document.body.textContent.includes('mock') || document.body.textContent.includes('Mock'),
          hasRealData: document.querySelectorAll('[data-testid], [data-id]').length > 0,
          bodyTextLength: document.body.textContent.length,
          hasImages: document.querySelectorAll('img').length,
          hasButtons: document.querySelectorAll('button').length,
          hasLinks: document.querySelectorAll('a').length
        };
        
        return checks;
      } catch (error) {
        return {
          hasTitle: false,
          hasMainContent: false,
          hasCards: false,
          hasEvents: false,
          hasPerformers: false,
          hasVenues: false,
          hasCalendars: false,
          hasTickets: false,
          hasErrorMessages: false,
          hasLoadingStates: false,
          hasEmptyStates: false,
          hasMockData: false,
          hasRealData: false,
          bodyTextLength: 0,
          hasImages: 0,
          hasButtons: 0,
          hasLinks: 0
        };
      }
    });
    
    // Analyze content - be more lenient for working sites
    result.hasContent = contentChecks && (contentChecks.hasMainContent || contentChecks.bodyTextLength > 100);
    result.hasData = contentChecks && (contentChecks.hasCards || contentChecks.hasEvents || contentChecks.hasPerformers || 
                    contentChecks.hasVenues || contentChecks.hasCalendars || contentChecks.hasTickets || 
                    contentChecks.bodyTextLength > 500 || contentChecks.hasImages > 0);
    
    // Check for specific issues
    if (contentChecks && contentChecks.hasErrorMessages) {
      result.issues.push('Contains error messages');
    }
    
    if (contentChecks && contentChecks.hasLoadingStates) {
      result.issues.push('Still showing loading states');
    }
    
    if (contentChecks && contentChecks.hasEmptyStates) {
      result.issues.push('Showing empty state');
    }
    
    if (contentChecks && contentChecks.hasMockData) {
      result.issues.push('Contains mock data references');
    }
    
    if (!result.hasContent) {
      result.issues.push('No main content detected');
    }
    
    if (!result.hasData) {
      result.issues.push('No data/cards detected');
    }
    
    if (contentChecks && contentChecks.bodyTextLength < 100) {
      result.issues.push('Very little content');
    }
    
    if (contentChecks && contentChecks.hasImages === 0) {
      result.issues.push('No images found');
    }
    
    if (contentChecks && contentChecks.hasButtons === 0) {
      result.issues.push('No interactive elements');
    }
    
    // Take screenshot for failed pages
    if (result.issues.length > 0) {
      const screenshotPath = `screenshots/${testPage.path.replace(/\//g, '_')}_${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
    }
    
  } catch (error) {
    result.status = 'error';
    result.errorMessage = error.message;
    result.issues.push(`Navigation error: ${error.message}`);
    console.error(`Error testing ${testPage.name}:`, error.message);
  }
  
  return result;
}

async function runTests() {
  console.log(`🚀 Starting page tests on ${BASE_URL}`);
  console.log(`📋 Testing ${PAGES_TO_TEST.length} pages...\n`);
  
  // Create screenshots directory
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 720 });
  
  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  
  for (const pageConfig of PAGES_TO_TEST) {
    const result = await testPage(browser, page, pageConfig);
    testResults.results.push(result);
    
    if (result.status === 'success' && result.issues.length === 0) {
      testResults.passed++;
      console.log(`✅ ${pageConfig.name}: PASSED`);
    } else {
      testResults.failed++;
      console.log(`❌ ${pageConfig.name}: FAILED`);
      if (result.issues.length > 0) {
        console.log(`   Issues: ${result.issues.join(', ')}`);
      }
      if (result.errorMessage) {
        console.log(`   Error: ${result.errorMessage}`);
      }
    }
  }
  
  await browser.close();
  
  // Generate report
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.totalPages) * 100).toFixed(1)}%`);
  
  // Save detailed report
  const reportPath = `test-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Show failed pages
  const failedPages = testResults.results.filter(r => r.status !== 'success' || r.issues.length > 0);
  if (failedPages.length > 0) {
    console.log('\n❌ Failed Pages:');
    failedPages.forEach(page => {
      console.log(`   ${page.name} (${page.path})`);
      if (page.issues.length > 0) {
        console.log(`     Issues: ${page.issues.join(', ')}`);
      }
      if (page.errorMessage) {
        console.log(`     Error: ${page.errorMessage}`);
      }
    });
  }
  
  return testResults;
}

// Run tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, PAGES_TO_TEST };
