const puppeteer = require('puppeteer');

// Test configuration
const BASE_URL = 'https://goeventversion2-production.up.railway.app';

// Test results
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  totalTests: 0,
  passed: 0,
  failed: 0,
  results: []
};

async function testPageData(browser, page, testConfig) {
  const result = {
    name: testConfig.name,
    url: testConfig.url,
    status: 'unknown',
    loadTime: 0,
    hasContent: false,
    hasData: false,
    dataCount: 0,
    issues: [],
    errors: [],
    contentAnalysis: {}
  };

  try {
    console.log(`\n🔍 Testing: ${testConfig.name}`);
    console.log(`   URL: ${testConfig.url}`);
    
    const startTime = Date.now();
    
    // Navigate to page
    const response = await page.goto(testConfig.url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    result.loadTime = Date.now() - startTime;
    
    if (response.status() >= 400) {
      result.status = 'error';
      result.issues.push(`HTTP ${response.status()}`);
      return result;
    }
    
    result.status = 'success';
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Analyze page content for actual data
    const contentAnalysis = await page.evaluate(() => {
      const analysis = {
        title: document.title,
        bodyText: document.body.textContent,
        bodyLength: document.body.textContent.length,
        
        // Check for main content areas
        hasMainContent: !!(
          document.querySelector('main') || 
          document.querySelector('[role="main"]') || 
          document.querySelector('.container') ||
          document.querySelector('#root') ||
          document.querySelector('body > div')
        ),
        
        // Count actual data items - look for more specific patterns
        eventCards: document.querySelectorAll('[class*="event"], [class*="Event"], [data-testid*="event"], .grid > div').length,
        performerCards: document.querySelectorAll('[class*="performer"], [class*="Performer"], [data-testid*="performer"]').length,
        venueCards: document.querySelectorAll('[class*="venue"], [class*="Venue"], [data-testid*="venue"]').length,
        calendarCards: document.querySelectorAll('[class*="calendar"], [class*="Calendar"], [data-testid*="calendar"]').length,
        ticketCards: document.querySelectorAll('[class*="ticket"], [class*="Ticket"], [data-testid*="ticket"]').length,
        productCards: document.querySelectorAll('[class*="product"], [class*="Product"], [data-testid*="product"]').length,
        
        // Check for any cards or data containers - look for grid items
        allCards: document.querySelectorAll('[class*="card"], [class*="Card"], [data-testid*="card"], .grid > div, .grid div[class*="bg-"]').length,
        
        // Check for images
        images: document.querySelectorAll('img').length,
        
        // Check for interactive elements
        buttons: document.querySelectorAll('button').length,
        links: document.querySelectorAll('a[href]').length,
        
        // Check for error states
        errorMessages: document.querySelectorAll('[class*="error"], [class*="Error"], [class*="not-found"], [class*="Not Found"]').length,
        loadingStates: document.querySelectorAll('[class*="loading"], [class*="Loading"], [class*="spinner"]').length,
        emptyStates: document.querySelectorAll('[class*="empty"], [class*="Empty"], [class*="no-data"]').length,
        
        // Check for specific content
        hasEvents: document.body.textContent.toLowerCase().includes('event'),
        hasPerformers: document.body.textContent.toLowerCase().includes('performer') || document.body.textContent.toLowerCase().includes('artist'),
        hasVenues: document.body.textContent.toLowerCase().includes('venue') || document.body.textContent.toLowerCase().includes('location'),
        hasTickets: document.body.textContent.toLowerCase().includes('ticket'),
        hasProducts: document.body.textContent.toLowerCase().includes('product') || document.body.textContent.toLowerCase().includes('shop'),
        
        // Check for mock data indicators
        hasMockData: document.body.textContent.toLowerCase().includes('mock') || 
                    document.body.textContent.toLowerCase().includes('sample') ||
                    document.body.textContent.toLowerCase().includes('placeholder'),
        
        // Check for real data indicators
        hasRealData: document.querySelectorAll('[data-testid], [data-id], [data-key]').length > 0,
        
        // Check for specific error patterns
        has404Error: document.body.textContent.toLowerCase().includes('404') || 
                    document.body.textContent.toLowerCase().includes('not found'),
        has500Error: document.body.textContent.toLowerCase().includes('500') || 
                    document.body.textContent.toLowerCase().includes('server error'),
        
        // Check for React errors
        hasReactError: document.body.textContent.includes('Minified React error') ||
                      document.body.textContent.includes('React error'),
        
        // Check for navigation
        hasNavigation: document.querySelectorAll('nav, [role="navigation"], .navbar, .menu').length > 0,
        
        // Check for forms
        hasForms: document.querySelectorAll('form').length > 0,
        
        // Check for search functionality
        hasSearch: document.querySelectorAll('input[type="search"], input[placeholder*="search" i]').length > 0,
        
        // Check for filters
        hasFilters: document.querySelectorAll('select, input[type="checkbox"], button[class*="filter"]').length > 0
      };
      
      return analysis;
    });
    
    result.contentAnalysis = contentAnalysis;
    
    // Determine if page has meaningful content
    result.hasContent = contentAnalysis.bodyLength > 1000 && contentAnalysis.hasMainContent;
    
    // Determine if page has actual data (not just empty states)
    result.hasData = (
      contentAnalysis.eventCards > 0 ||
      contentAnalysis.performerCards > 0 ||
      contentAnalysis.venueCards > 0 ||
      contentAnalysis.calendarCards > 0 ||
      contentAnalysis.ticketCards > 0 ||
      contentAnalysis.productCards > 0 ||
      contentAnalysis.allCards > 0
    );
    
    result.dataCount = contentAnalysis.eventCards + contentAnalysis.performerCards + 
                      contentAnalysis.venueCards + contentAnalysis.calendarCards + 
                      contentAnalysis.ticketCards + contentAnalysis.productCards;
    
    // Check for specific issues
    if (contentAnalysis.hasReactError) {
      result.issues.push('React errors detected');
    }
    
    if (contentAnalysis.has404Error) {
      result.issues.push('404 error content detected');
    }
    
    if (contentAnalysis.has500Error) {
      result.issues.push('500 error content detected');
    }
    
    if (contentAnalysis.errorMessages > 0) {
      result.issues.push(`${contentAnalysis.errorMessages} error messages found`);
    }
    
    if (contentAnalysis.loadingStates > 0) {
      result.issues.push('Still showing loading states');
    }
    
    if (contentAnalysis.emptyStates > 0) {
      result.issues.push('Showing empty state');
    }
    
    if (contentAnalysis.hasMockData) {
      result.issues.push('Contains mock/sample data');
    }
    
    if (!result.hasContent) {
      result.issues.push('Very little content or no main content area');
    }
    
    if (!result.hasData) {
      result.issues.push('No data cards or content items found');
    }
    
    if (contentAnalysis.bodyLength < 500) {
      result.issues.push('Page content too short');
    }
    
    if (contentAnalysis.images === 0) {
      result.issues.push('No images found');
    }
    
    if (contentAnalysis.buttons === 0) {
      result.issues.push('No interactive buttons found');
    }
    
    // Log detailed analysis
    console.log(`   📊 Content Analysis:`);
    console.log(`      Title: ${contentAnalysis.title}`);
    console.log(`      Body Length: ${contentAnalysis.bodyLength} characters`);
    console.log(`      Main Content: ${contentAnalysis.hasMainContent ? 'Yes' : 'No'}`);
    console.log(`      Data Cards: Events(${contentAnalysis.eventCards}) Performers(${contentAnalysis.performerCards}) Venues(${contentAnalysis.venueCards}) Products(${contentAnalysis.productCards})`);
    console.log(`      Total Cards: ${contentAnalysis.allCards}`);
    console.log(`      Images: ${contentAnalysis.images}, Buttons: ${contentAnalysis.buttons}, Links: ${contentAnalysis.links}`);
    console.log(`      Errors: ${contentAnalysis.errorMessages}, Loading: ${contentAnalysis.loadingStates}, Empty: ${contentAnalysis.emptyStates}`);
    
    if (result.issues.length > 0) {
      console.log(`      Issues: ${result.issues.join(', ')}`);
    }
    
  } catch (error) {
    result.status = 'error';
    result.issues.push(`Test error: ${error.message}`);
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  return result;
}

async function runDataContentTests() {
  console.log(`🚀 Starting comprehensive data and content testing on ${BASE_URL}`);
  console.log(`🔍 Testing actual data presentation and content quality...\n`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`   🚨 Console Error: ${msg.text()}`);
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log(`   🚨 Page Error: ${error.message}`);
  });
  
  // Test all major pages
  const pagesToTest = [
    { name: 'Homepage', url: `${BASE_URL}/` },
    { name: 'Events Report', url: `${BASE_URL}/events` },
    { name: 'Performers Report', url: `${BASE_URL}/performers` },
    { name: 'Venues Report', url: `${BASE_URL}/venues` },
    { name: 'Calendars Report', url: `${BASE_URL}/calendars` },
    { name: 'Tickets Report', url: `${BASE_URL}/tickets` },
    { name: 'Shop/Marketplace', url: `${BASE_URL}/shop` },
    { name: 'My Tickets', url: `${BASE_URL}/tickets/my-tickets` },
    { name: 'Performer Management', url: `${BASE_URL}/management/performer` },
    { name: 'Venue Management', url: `${BASE_URL}/management/venue` },
    { name: 'Influencer Management', url: `${BASE_URL}/management/influencer` },
    { name: 'Event Detail 1', url: `${BASE_URL}/events/1` },
    { name: 'Performer Detail 1', url: `${BASE_URL}/performers/1` },
    { name: 'Venue Detail 1', url: `${BASE_URL}/venues/1` },
    { name: 'Ticket Purchase 1', url: `${BASE_URL}/tickets/purchase/1` },
    { name: 'Community Hub Jazz', url: `${BASE_URL}/c/jazz-lovers` },
    { name: 'Community Hub Rock', url: `${BASE_URL}/c/rock-music` },
    { name: 'Calendar Detail Jazz', url: `${BASE_URL}/calendars/jazz-events` }
  ];
  
  for (const pageConfig of pagesToTest) {
    const result = await testPageData(browser, page, pageConfig);
    testResults.results.push(result);
    testResults.totalTests++;
    
    if (result.status === 'success' && result.hasContent && result.hasData && result.issues.length === 0) {
      testResults.passed++;
      console.log(`✅ ${pageConfig.name}: PASSED - Has content and data`);
    } else if (result.status === 'success' && result.hasContent && result.issues.length === 0) {
      testResults.passed++;
      console.log(`⚠️  ${pageConfig.name}: PARTIAL - Has content but no data`);
    } else {
      testResults.failed++;
      console.log(`❌ ${pageConfig.name}: FAILED`);
    }
  }
  
  await browser.close();
  
  // Generate comprehensive report
  console.log('\n📊 Data Content Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.totalTests) * 100).toFixed(1)}%`);
  
  // Show pages with no data
  const noDataPages = testResults.results.filter(r => r.status === 'success' && !r.hasData);
  if (noDataPages.length > 0) {
    console.log('\n📭 Pages with NO DATA:');
    noDataPages.forEach(result => {
      console.log(`   ${result.name}: ${result.dataCount} data items, ${result.contentAnalysis.bodyLength} chars`);
    });
  }
  
  // Show pages with errors
  const errorPages = testResults.results.filter(r => r.issues.length > 0);
  if (errorPages.length > 0) {
    console.log('\n🚨 Pages with ISSUES:');
    errorPages.forEach(result => {
      console.log(`   ${result.name}: ${result.issues.join(', ')}`);
    });
  }
  
  // Save detailed report
  const reportPath = `data-content-test-report-${Date.now()}.json`;
  require('fs').writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

runDataContentTests().catch(console.error);
