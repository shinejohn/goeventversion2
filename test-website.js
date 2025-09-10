const { chromium } = require('playwright');

async function testGoeventVersion2() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseUrl = 'https://goeventversion2-production.up.railway.app';
  const results = {
    passed: [],
    failed: [],
    errors: []
  };

  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Helper function to test a page
  async function testPage(url, description) {
    console.log(`\nTesting: ${description}`);
    console.log(`URL: ${url}`);
    
    try {
      const response = await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Check response status
      if (!response || response.status() >= 400) {
        results.failed.push({
          page: description,
          url: url,
          error: `HTTP ${response ? response.status() : 'No response'}`,
          type: 'http_error'
        });
        console.log(`❌ FAILED: ${description} - HTTP ${response ? response.status() : 'No response'}`);
        return false;
      }

      // Wait a bit for any React hydration
      await page.waitForTimeout(3000);

      // Check for header/footer
      const hasHeader = await page.$('header') !== null;
      const hasFooter = await page.$('footer') !== null;
      const hasNav = await page.$('nav') !== null;
      
      // Check for common error indicators
      const pageContent = await page.content();
      const hasErrorBoundary = pageContent.includes('Something went wrong') || 
                              pageContent.includes('Error boundary') ||
                              pageContent.includes('An error occurred');
      
      const hasNullError = pageContent.includes('null is not an object') ||
                          pageContent.includes('Cannot read properties of null') ||
                          pageContent.includes('TypeError');

      const hasReactError = pageContent.includes('Error: ') ||
                           pageContent.includes('ReferenceError') ||
                           pageContent.includes('SyntaxError');

      // Check if page loaded with content
      const hasMainContent = await page.$('main') !== null || 
                            await page.$('[data-testid="main-content"]') !== null ||
                            await page.$('.main') !== null;

      if (hasErrorBoundary || hasNullError || hasReactError) {
        results.failed.push({
          page: description,
          url: url,
          error: hasNullError ? 'Null reference error detected' : 
                 hasErrorBoundary ? 'React Error Boundary triggered' : 
                 hasReactError ? 'JavaScript runtime error' :
                 'Unknown error',
          consoleErrors: consoleErrors.slice(),
          hasHeader,
          hasFooter,
          hasNav,
          hasMainContent,
          type: 'runtime_error'
        });
        console.log(`❌ FAILED: ${description} - Runtime Error`);
        return false;
      }

      results.passed.push({
        page: description,
        url: url,
        hasHeader,
        hasFooter,
        hasNav,
        hasMainContent
      });
      console.log(`✅ PASSED: ${description}`);
      return true;

    } catch (error) {
      results.errors.push({
        page: description,
        url: url,
        error: error.message,
        type: 'exception'
      });
      console.log(`⚠️ ERROR: ${description} - ${error.message}`);
      return false;
    }
  }

  // Helper to get links from a list page
  async function getDetailLinks(selector, limit = 3) {
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
      const links = await page.$$eval(selector, (elements, limit) => {
        return elements.slice(0, limit).map(el => {
          const href = el.href || el.getAttribute('href');
          return {
            href: href?.startsWith('http') ? href : `https://goeventversion2-production.up.railway.app${href}`,
            text: el.textContent?.trim() || 'No text'
          };
        });
      }, limit);
      return links.filter(link => link.href && link.href.includes('goeventversion2'));
    } catch {
      console.log('No links found with selector:', selector);
      return [];
    }
  }

  console.log('🚀 Starting comprehensive test of goeventversion2...\n');

  // Test 1: Homepage
  await testPage(baseUrl, 'Homepage');

  // Test 2: Events List Page
  if (await testPage(`${baseUrl}/events`, 'Events List Page')) {
    // Get event detail links
    const eventSelectors = [
      'a[href^="/events/"]',
      'a[href*="/events/"]',
      '.event-card a',
      '[data-testid="event-link"]'
    ];
    
    let eventLinks = [];
    for (const selector of eventSelectors) {
      eventLinks = await getDetailLinks(selector, 2);
      if (eventLinks.length > 0) break;
    }
    
    console.log(`Found ${eventLinks.length} event links to test`);
    
    // Test event detail pages
    for (const link of eventLinks) {
      await testPage(link.href, `Event Detail: ${link.text.substring(0, 50)}...`);
    }
  }

  // Test 3: Venues List Page
  if (await testPage(`${baseUrl}/venues`, 'Venues List Page')) {
    // Get venue detail links
    const venueSelectors = [
      'a[href^="/venues/"]',
      'a[href*="/venues/"]',
      '.venue-card a',
      '[data-testid="venue-link"]'
    ];
    
    let venueLinks = [];
    for (const selector of venueSelectors) {
      venueLinks = await getDetailLinks(selector, 2);
      if (venueLinks.length > 0) break;
    }
    
    console.log(`Found ${venueLinks.length} venue links to test`);
    
    // Test venue detail pages
    for (const link of venueLinks) {
      await testPage(link.href, `Venue Detail: ${link.text.substring(0, 50)}...`);
    }
  }

  // Test 4: Performers List Page
  if (await testPage(`${baseUrl}/performers`, 'Performers List Page')) {
    // Get performer detail links
    const performerSelectors = [
      'a[href^="/performers/"]',
      'a[href*="/performers/"]',
      '.performer-card a',
      '[data-testid="performer-link"]'
    ];
    
    let performerLinks = [];
    for (const selector of performerSelectors) {
      performerLinks = await getDetailLinks(selector, 2);
      if (performerLinks.length > 0) break;
    }
    
    console.log(`Found ${performerLinks.length} performer links to test`);
    
    // Test performer detail pages
    for (const link of performerLinks) {
      await testPage(link.href, `Performer Detail: ${link.text.substring(0, 50)}...`);
    }
  }

  // Test 5: Book-it Flow
  await testPage(`${baseUrl}/book-it`, 'Book-it Page');

  // Test 6: Communities/Hubs
  await testPage(`${baseUrl}/hubs`, 'Hubs/Communities Page');
  
  // Test 7: Calendars
  await testPage(`${baseUrl}/calendars`, 'Calendars Page');

  // Test 8: Additional important pages
  await testPage(`${baseUrl}/about`, 'About Page');
  await testPage(`${baseUrl}/contact`, 'Contact Page');
  await testPage(`${baseUrl}/pricing`, 'Pricing Page');

  // Generate Report
  console.log('\n' + '='.repeat(80));
  console.log('🎯 TEST RESULTS SUMMARY');
  console.log('='.repeat(80));
  
  console.log(`\n✅ PASSED (${results.passed.length} pages):`);
  results.passed.forEach(r => {
    console.log(`  ✓ ${r.page}`);
    console.log(`    🌐 ${r.url}`);
    console.log(`    📋 Layout: Header ${r.hasHeader ? '✓' : '✗'} | Footer ${r.hasFooter ? '✓' : '✗'} | Nav ${r.hasNav ? '✓' : '✗'} | Main ${r.hasMainContent ? '✓' : '✗'}`);
  });

  console.log(`\n❌ FAILED (${results.failed.length} pages):`);
  results.failed.forEach(r => {
    console.log(`  ✗ ${r.page}`);
    console.log(`    🌐 ${r.url}`);
    console.log(`    ⚠️  ${r.error}`);
    console.log(`    📋 Layout: Header ${r.hasHeader ? '✓' : '✗'} | Footer ${r.hasFooter ? '✓' : '✗'} | Nav ${r.hasNav ? '✓' : '✗'} | Main ${r.hasMainContent ? '✓' : '✗'}`);
    if (r.consoleErrors?.length > 0) {
      console.log(`    🔍 Console Errors:`);
      r.consoleErrors.slice(0, 3).forEach(e => console.log(`      - ${e.substring(0, 100)}...`));
    }
  });

  console.log(`\n⚠️  EXCEPTIONS (${results.errors.length} pages):`);
  results.errors.forEach(r => {
    console.log(`  ⚠️  ${r.page}`);
    console.log(`    🌐 ${r.url}`);
    console.log(`    💥 ${r.error}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('🚨 CRITICAL ISSUES ANALYSIS');
  console.log('='.repeat(80));

  // Identify critical patterns
  const detailPageErrors = [...results.failed, ...results.errors].filter(r => 
    r.url.includes('/events/') || r.url.includes('/venues/') || r.url.includes('/performers/')
  );
  
  const nullErrors = results.failed.filter(r => r.error && r.error.includes('Null reference'));
  const httpErrors = results.failed.filter(r => r.type === 'http_error');
  const runtimeErrors = results.failed.filter(r => r.type === 'runtime_error');
  const missingLayout = [...results.passed, ...results.failed].filter(r => !r.hasHeader || !r.hasFooter);

  if (detailPageErrors.length > 0) {
    console.log(`\n🔴 1. DETAIL PAGES BROKEN (${detailPageErrors.length} pages):`);
    detailPageErrors.forEach(r => console.log(`   ⚠️  ${r.page}: ${r.error || 'Unknown error'}`));
    console.log('   📝 Priority: HIGH - Core functionality broken');
  }

  if (httpErrors.length > 0) {
    console.log(`\n🔴 2. HTTP ERRORS (${httpErrors.length} pages):`);
    httpErrors.forEach(r => console.log(`   ⚠️  ${r.page}: ${r.error}`));
    console.log('   📝 Priority: HIGH - Pages not loading at all');
  }

  if (runtimeErrors.length > 0) {
    console.log(`\n🔴 3. RUNTIME ERRORS (${runtimeErrors.length} pages):`);
    runtimeErrors.forEach(r => console.log(`   ⚠️  ${r.page}: ${r.error}`));
    console.log('   📝 Priority: HIGH - JavaScript/React errors');
  }

  if (nullErrors.length > 0) {
    console.log(`\n🟡 4. NULL REFERENCE ERRORS (${nullErrors.length} pages):`);
    nullErrors.forEach(r => console.log(`   ⚠️  ${r.page}`));
    console.log('   📝 Priority: MEDIUM - Likely data access issues');
  }

  if (missingLayout.length > 0) {
    console.log(`\n🟡 5. MISSING HEADER/FOOTER (${missingLayout.length} pages):`);
    missingLayout.forEach(r => console.log(`   ⚠️  ${r.page}: Header ${r.hasHeader ? '✓' : 'Missing'}, Footer ${r.hasFooter ? '✓' : 'Missing'}`));
    console.log('   📝 Priority: MEDIUM - Layout/navigation issues');
  }

  // Summary stats
  const total = results.passed.length + results.failed.length + results.errors.length;
  const passRate = Math.round((results.passed.length / total) * 100);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(80));
  console.log(`📈 Pass Rate: ${passRate}% (${results.passed.length}/${total} pages working)`);
  console.log(`🔴 Critical Issues: ${detailPageErrors.length + httpErrors.length + runtimeErrors.length}`);
  console.log(`🟡 Minor Issues: ${nullErrors.length + missingLayout.length}`);
  
  if (passRate < 60) {
    console.log('🚨 CRITICAL: Many core pages are broken - immediate action required!');
  } else if (passRate < 80) {
    console.log('⚠️  WARNING: Several issues need attention before production');
  } else {
    console.log('✅ GOOD: Most pages working, only minor fixes needed');
  }

  await browser.close();
  
  return {
    summary: {
      total,
      passed: results.passed.length,
      failed: results.failed.length,
      errors: results.errors.length,
      passRate
    },
    detailPageErrors: detailPageErrors.length,
    criticalIssues: detailPageErrors.length + httpErrors.length + runtimeErrors.length
  };
}

// Run the test
testGoeventVersion2()
  .then(summary => {
    console.log('\n🎉 Test completed!');
    console.log('Summary:', summary);
  })
  .catch(console.error);