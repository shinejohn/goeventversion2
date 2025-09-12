const puppeteer = require('puppeteer');

// Test configuration
const BASE_URL = 'https://goeventversion2-production.up.railway.app';

// Key pages to test
const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/events', name: 'Events Report' },
  { path: '/performers', name: 'Performers Report' },
  { path: '/venues', name: 'Venues Report' },
  { path: '/calendars', name: 'Calendars Report' },
  { path: '/shop', name: 'Shop/Marketplace' },
  { path: '/tickets', name: 'Tickets Report' },
  { path: '/events/1', name: 'Event Detail - ID 1' },
  { path: '/performers/1', name: 'Performer Detail - ID 1' },
  { path: '/venues/1', name: 'Venue Detail - ID 1' },
  { path: '/tickets/my-tickets', name: 'My Tickets' },
  { path: '/management/performer', name: 'Performer Management' },
  { path: '/management/venue', name: 'Venue Management' },
  { path: '/management/influencer', name: 'Influencer Management' },
];

async function testPage(browser, page, pageConfig) {
  const result = {
    name: pageConfig.name,
    path: pageConfig.path,
    url: `${BASE_URL}${pageConfig.path}`,
    status: 'unknown',
    statusCode: null,
    loadTime: 0,
    hasContent: false,
    hasData: false,
    errorMessage: null,
    issues: []
  };

  try {
    console.log(`Testing: ${pageConfig.name} (${pageConfig.path})`);
    
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
    
    // Simple content check - just see if there's meaningful content
    const pageContent = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.textContent,
        bodyLength: document.body.textContent.length,
        hasMainElements: document.querySelector('main, [role="main"], .container, #root, body > div') !== null,
        hasImages: document.querySelectorAll('img').length,
        hasButtons: document.querySelectorAll('button').length,
        hasLinks: document.querySelectorAll('a').length,
        hasCards: document.querySelectorAll('[class*="card"], [class*="Card"]').length,
        hasEvents: document.querySelectorAll('[class*="event"], [class*="Event"]').length,
        hasPerformers: document.querySelectorAll('[class*="performer"], [class*="Performer"]').length,
        hasVenues: document.querySelectorAll('[class*="venue"], [class*="Venue"]').length,
        hasErrorMessages: document.querySelectorAll('[class*="error"], [class*="Error"], [class*="not-found"]').length,
        hasLoadingStates: document.querySelectorAll('[class*="loading"], [class*="Loading"], [class*="spinner"]').length
      };
    });
    
    // Analyze content - be very lenient
    result.hasContent = pageContent.bodyLength > 100;
    result.hasData = pageContent.hasCards > 0 || pageContent.hasEvents > 0 || pageContent.hasPerformers > 0 || 
                    pageContent.hasVenues > 0 || pageContent.bodyLength > 500;
    
    // Check for specific issues
    if (pageContent.hasErrorMessages > 0) {
      result.issues.push('Contains error messages');
    }
    
    if (pageContent.hasLoadingStates > 0) {
      result.issues.push('Still showing loading states');
    }
    
    if (!result.hasContent) {
      result.issues.push('Very little content');
    }
    
    if (!result.hasData) {
      result.issues.push('No data/cards detected');
    }
    
    // Log what we found for debugging
    console.log(`  Title: ${pageContent.title}`);
    console.log(`  Body length: ${pageContent.bodyLength}`);
    console.log(`  Has main elements: ${pageContent.hasMainElements}`);
    console.log(`  Cards: ${pageContent.hasCards}, Events: ${pageContent.hasEvents}, Performers: ${pageContent.hasPerformers}, Venues: ${pageContent.hasVenues}`);
    
  } catch (error) {
    result.status = 'error';
    result.errorMessage = error.message;
    result.issues.push(`Navigation error: ${error.message}`);
  }
  
  return result;
}

async function runTests() {
  console.log(`🚀 Starting simple page tests on ${BASE_URL}`);
  console.log(`📋 Testing ${PAGES_TO_TEST.length} pages...\n`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (const pageConfig of PAGES_TO_TEST) {
    const result = await testPage(browser, page, pageConfig);
    results.push(result);
    
    if (result.status === 'success' && result.issues.length === 0) {
      passed++;
      console.log(`✅ ${pageConfig.name}: PASSED`);
    } else {
      failed++;
      console.log(`❌ ${pageConfig.name}: FAILED`);
      if (result.issues.length > 0) {
        console.log(`   Issues: ${result.issues.join(', ')}`);
      }
      if (result.errorMessage) {
        console.log(`   Error: ${result.errorMessage}`);
      }
    }
    console.log(''); // Add spacing
  }
  
  await browser.close();
  
  // Generate report
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / PAGES_TO_TEST.length) * 100).toFixed(1)}%`);
  
  // Save detailed report
  const reportPath = `simple-test-report-${Date.now()}.json`;
  require('fs').writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalPages: PAGES_TO_TEST.length,
    passed,
    failed,
    results
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Pages:');
    results.filter(r => r.status !== 'success' || r.issues.length > 0).forEach(result => {
      console.log(`   ${result.name} (${result.path})`);
      if (result.issues.length > 0) {
        console.log(`     Issues: ${result.issues.join(', ')}`);
      }
      if (result.errorMessage) {
        console.log(`     Error: ${result.errorMessage}`);
      }
    });
  }
}

runTests().catch(console.error);
