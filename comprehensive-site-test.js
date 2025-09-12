const puppeteer = require('puppeteer');

// Test configuration
const BASE_URL = 'https://goeventversion2-production.up.railway.app';

// Comprehensive test results
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  totalTests: 0,
  passed: 0,
  failed: 0,
  results: []
};

async function testPage(browser, page, testConfig) {
  const result = {
    name: testConfig.name,
    url: testConfig.url,
    status: 'unknown',
    loadTime: 0,
    issues: [],
    links: [],
    buttons: [],
    forms: [],
    navigation: [],
    errors: []
  };

  try {
    console.log(`\n🔍 Testing: ${testConfig.name}`);
    console.log(`   URL: ${testConfig.url}`);
    
    const startTime = Date.now();
    
    // Navigate to page
    const response = await page.goto(testConfig.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    result.loadTime = Date.now() - startTime;
    
    if (response.status() >= 400) {
      result.status = 'error';
      result.issues.push(`HTTP ${response.status()}`);
      return result;
    }
    
    result.status = 'success';
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Test all links on the page
    const links = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a[href]');
      return Array.from(linkElements).map(link => ({
        text: link.textContent.trim(),
        href: link.href,
        isExternal: link.hostname !== window.location.hostname,
        hasTarget: link.target === '_blank',
        isVisible: link.offsetParent !== null
      }));
    });
    
    result.links = links;
    console.log(`   📎 Found ${links.length} links`);
    
    // Test all buttons
    const buttons = await page.evaluate(() => {
      const buttonElements = document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]');
      return Array.from(buttonElements).map(button => ({
        text: button.textContent?.trim() || button.value || 'No text',
        type: button.type || 'button',
        isDisabled: button.disabled,
        isVisible: button.offsetParent !== null,
        hasClickHandler: button.onclick !== null
      }));
    });
    
    result.buttons = buttons;
    console.log(`   🔘 Found ${buttons.length} buttons`);
    
    // Test all forms
    const forms = await page.evaluate(() => {
      const formElements = document.querySelectorAll('form');
      return Array.from(formElements).map(form => ({
        action: form.action,
        method: form.method,
        hasInputs: form.querySelectorAll('input, textarea, select').length,
        isVisible: form.offsetParent !== null
      }));
    });
    
    result.forms = forms;
    console.log(`   📝 Found ${forms.length} forms`);
    
    // Test navigation elements
    const navigation = await page.evaluate(() => {
      const navElements = document.querySelectorAll('nav, [role="navigation"], .navbar, .menu, .nav');
      return Array.from(navElements).map(nav => ({
        role: nav.getAttribute('role') || 'navigation',
        hasLinks: nav.querySelectorAll('a').length,
        isVisible: nav.offsetParent !== null
      }));
    });
    
    result.navigation = navigation;
    console.log(`   🧭 Found ${navigation.length} navigation elements`);
    
    // Test for JavaScript errors
    const errors = await page.evaluate(() => {
      return window.errors || [];
    });
    
    result.errors = errors;
    if (errors.length > 0) {
      console.log(`   ⚠️  Found ${errors.length} JavaScript errors`);
    }
    
    // Test specific functionality based on page type
    if (testConfig.name.includes('Homepage')) {
      await testHomepageFunctionality(page, result);
    } else if (testConfig.name.includes('Events')) {
      await testEventsFunctionality(page, result);
    } else if (testConfig.name.includes('Performers')) {
      await testPerformersFunctionality(page, result);
    } else if (testConfig.name.includes('Venues')) {
      await testVenuesFunctionality(page, result);
    } else if (testConfig.name.includes('Tickets')) {
      await testTicketsFunctionality(page, result);
    } else if (testConfig.name.includes('Management')) {
      await testManagementFunctionality(page, result);
    }
    
    // Test interactive elements
    await testInteractiveElements(page, result);
    
  } catch (error) {
    result.status = 'error';
    result.issues.push(`Test error: ${error.message}`);
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  return result;
}

async function testHomepageFunctionality(page, result) {
  console.log(`   🏠 Testing homepage functionality...`);
  
  // Test search functionality
  try {
    const searchInput = await page.$('input[type="search"], input[placeholder*="search" i], input[placeholder*="find" i]');
    if (searchInput) {
      await searchInput.type('test search');
      await page.waitForTimeout(500);
      result.issues.push('Search input found and functional');
    }
  } catch (e) {
    result.issues.push('Search functionality not found or not working');
  }
  
  // Test category filters
  try {
    const categoryButtons = await page.$$('button[class*="category"], button[class*="filter"]');
    if (categoryButtons.length > 0) {
      await categoryButtons[0].click();
      await page.waitForTimeout(1000);
      result.issues.push(`Found ${categoryButtons.length} category/filter buttons`);
    }
  } catch (e) {
    result.issues.push('Category filters not found or not working');
  }
  
  // Test event cards
  try {
    const eventCards = await page.$$('[class*="event"], [class*="card"]');
    if (eventCards.length > 0) {
      await eventCards[0].click();
      await page.waitForTimeout(1000);
      result.issues.push(`Found ${eventCards.length} event cards, clicked first one`);
    }
  } catch (e) {
    result.issues.push('Event cards not clickable');
  }
}

async function testEventsFunctionality(page, result) {
  console.log(`   🎫 Testing events functionality...`);
  
  // Test event filtering
  try {
    const filterButtons = await page.$$('button[class*="filter"], select, input[type="checkbox"]');
    if (filterButtons.length > 0) {
      for (let i = 0; i < Math.min(3, filterButtons.length); i++) {
        await filterButtons[i].click();
        await page.waitForTimeout(500);
      }
      result.issues.push(`Tested ${filterButtons.length} filter options`);
    }
  } catch (e) {
    result.issues.push('Event filters not working');
  }
  
  // Test event details
  try {
    const eventLinks = await page.$$('a[href*="/events/"]');
    if (eventLinks.length > 0) {
      await eventLinks[0].click();
      await page.waitForTimeout(2000);
      result.issues.push(`Clicked event link, navigated to event detail`);
    }
  } catch (e) {
    result.issues.push('Event detail links not working');
  }
}

async function testPerformersFunctionality(page, result) {
  console.log(`   🎤 Testing performers functionality...`);
  
  // Test performer cards
  try {
    const performerCards = await page.$$('[class*="performer"], [class*="artist"]');
    if (performerCards.length > 0) {
      await performerCards[0].click();
      await page.waitForTimeout(2000);
      result.issues.push(`Found ${performerCards.length} performer cards`);
    }
  } catch (e) {
    result.issues.push('Performer cards not clickable');
  }
  
  // Test booking buttons
  try {
    const bookButtons = await page.$$('button[class*="book"], button:has-text("Book"), a[class*="book"]');
    if (bookButtons.length > 0) {
      await bookButtons[0].click();
      await page.waitForTimeout(1000);
      result.issues.push(`Found ${bookButtons.length} booking buttons`);
    }
  } catch (e) {
    result.issues.push('Booking buttons not found');
  }
}

async function testVenuesFunctionality(page, result) {
  console.log(`   🏟️  Testing venues functionality...`);
  
  // Test venue cards
  try {
    const venueCards = await page.$$('[class*="venue"], [class*="location"]');
    if (venueCards.length > 0) {
      await venueCards[0].click();
      await page.waitForTimeout(2000);
      result.issues.push(`Found ${venueCards.length} venue cards`);
    }
  } catch (e) {
    result.issues.push('Venue cards not clickable');
  }
  
  // Test venue booking
  try {
    const bookButtons = await page.$$('button[class*="book"], button:has-text("Book Venue")');
    if (bookButtons.length > 0) {
      await bookButtons[0].click();
      await page.waitForTimeout(1000);
      result.issues.push(`Found ${bookButtons.length} venue booking buttons`);
    }
  } catch (e) {
    result.issues.push('Venue booking buttons not found');
  }
}

async function testTicketsFunctionality(page, result) {
  console.log(`   🎫 Testing tickets functionality...`);
  
  // Test ticket purchase
  try {
    const buyButtons = await page.$$('button[class*="buy"], button[class*="purchase"], button:has-text("Buy")');
    if (buyButtons.length > 0) {
      await buyButtons[0].click();
      await page.waitForTimeout(2000);
      result.issues.push(`Found ${buyButtons.length} ticket purchase buttons`);
    }
  } catch (e) {
    result.issues.push('Ticket purchase buttons not found');
  }
  
  // Test ticket management
  try {
    const manageButtons = await page.$$('button[class*="manage"], button:has-text("Manage")');
    if (manageButtons.length > 0) {
      await manageButtons[0].click();
      await page.waitForTimeout(1000);
      result.issues.push(`Found ${manageButtons.length} ticket management buttons`);
    }
  } catch (e) {
    result.issues.push('Ticket management buttons not found');
  }
}

async function testManagementFunctionality(page, result) {
  console.log(`   ⚙️  Testing management functionality...`);
  
  // Test management dashboard elements
  try {
    const dashboardElements = await page.$$('[class*="dashboard"], [class*="management"], [class*="admin"]');
    if (dashboardElements.length > 0) {
      result.issues.push(`Found ${dashboardElements.length} management dashboard elements`);
    }
  } catch (e) {
    result.issues.push('Management dashboard elements not found');
  }
  
  // Test action buttons
  try {
    const actionButtons = await page.$$('button[class*="action"], button[class*="create"], button[class*="edit"]');
    if (actionButtons.length > 0) {
      result.issues.push(`Found ${actionButtons.length} management action buttons`);
    }
  } catch (e) {
    result.issues.push('Management action buttons not found');
  }
}

async function testInteractiveElements(page, result) {
  console.log(`   🖱️  Testing interactive elements...`);
  
  // Test all clickable elements
  try {
    const clickableElements = await page.$$('button, a, [role="button"], [onclick], input[type="button"], input[type="submit"]');
    let clickableCount = 0;
    
    for (let i = 0; i < Math.min(5, clickableElements.length); i++) {
      try {
        const element = clickableElements[i];
        const isVisible = await element.isVisible();
        if (isVisible) {
          await element.click();
          await page.waitForTimeout(500);
          clickableCount++;
        }
      } catch (e) {
        // Element might not be clickable, continue
      }
    }
    
    result.issues.push(`Tested ${clickableCount} interactive elements`);
  } catch (e) {
    result.issues.push('Interactive elements testing failed');
  }
}

async function runComprehensiveTests() {
  console.log(`🚀 Starting comprehensive site testing on ${BASE_URL}`);
  console.log(`🔍 Testing every link, button, icon, and interactive element...\n`);
  
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
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
    { name: 'Calendar Detail Jazz', url: `${BASE_URL}/calendars/jazz-events` },
    { name: 'Shop/Marketplace', url: `${BASE_URL}/shop` }
  ];
  
  for (const pageConfig of pagesToTest) {
    const result = await testPage(browser, page, pageConfig);
    testResults.results.push(result);
    testResults.totalTests++;
    
    if (result.status === 'success' && result.issues.length === 0) {
      testResults.passed++;
      console.log(`✅ ${pageConfig.name}: PASSED`);
    } else {
      testResults.failed++;
      console.log(`❌ ${pageConfig.name}: FAILED`);
      if (result.issues.length > 0) {
        console.log(`   Issues: ${result.issues.join(', ')}`);
      }
    }
  }
  
  await browser.close();
  
  // Generate comprehensive report
  console.log('\n📊 Comprehensive Test Results Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.totalTests) * 100).toFixed(1)}%`);
  
  // Save detailed report
  const reportPath = `comprehensive-test-report-${Date.now()}.json`;
  require('fs').writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Show detailed breakdown
  console.log('\n🔍 Detailed Results:');
  testResults.results.forEach(result => {
    console.log(`\n📄 ${result.name}:`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Load Time: ${result.loadTime}ms`);
    console.log(`   Links: ${result.links.length}`);
    console.log(`   Buttons: ${result.buttons.length}`);
    console.log(`   Forms: ${result.forms.length}`);
    console.log(`   Navigation: ${result.navigation.length}`);
    console.log(`   Errors: ${result.errors.length}`);
    if (result.issues.length > 0) {
      console.log(`   Issues: ${result.issues.join(', ')}`);
    }
  });
}

runComprehensiveTests().catch(console.error);
