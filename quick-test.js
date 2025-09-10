const { chromium } = require('playwright');

async function quickTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseUrl = 'https://goeventversion2-production.up.railway.app';
  const results = [];

  async function testPage(url, name) {
    try {
      console.log(`Testing ${name}...`);
      const response = await page.goto(url, { timeout: 15000 });
      const status = response.status();
      
      if (status >= 400) {
        results.push({ name, url, status: 'FAILED', error: `HTTP ${status}` });
        return;
      }
      
      await page.waitForTimeout(2000);
      
      // Check for content
      const content = await page.content();
      const hasError = content.includes('null is not an object') || 
                      content.includes('Cannot read properties of null') ||
                      content.includes('Error boundary') ||
                      content.includes('Something went wrong');
      
      const hasHeader = await page.$('header') !== null;
      const hasNav = await page.$('nav') !== null;
      
      if (hasError) {
        results.push({ name, url, status: 'FAILED', error: 'Runtime error detected', hasHeader, hasNav });
      } else {
        results.push({ name, url, status: 'PASSED', hasHeader, hasNav });
      }
      
    } catch (error) {
      results.push({ name, url, status: 'ERROR', error: error.message });
    }
  }

  // Test key pages
  await testPage(baseUrl, 'Homepage');
  await testPage(`${baseUrl}/events`, 'Events List');
  await testPage(`${baseUrl}/venues`, 'Venues List');
  await testPage(`${baseUrl}/performers`, 'Performers List');
  await testPage(`${baseUrl}/book-it`, 'Book-it Page');
  await testPage(`${baseUrl}/hubs`, 'Hubs Page');
  await testPage(`${baseUrl}/calendars`, 'Calendars Page');
  
  // Test some specific detail pages that might exist
  await testPage(`${baseUrl}/events/1`, 'Event Detail (ID 1)');
  await testPage(`${baseUrl}/venues/1`, 'Venue Detail (ID 1)');
  await testPage(`${baseUrl}/performers/1`, 'Performer Detail (ID 1)');

  console.log('\n=== QUICK TEST RESULTS ===');
  const passed = results.filter(r => r.status === 'PASSED');
  const failed = results.filter(r => r.status === 'FAILED');
  const errors = results.filter(r => r.status === 'ERROR');
  
  console.log(`\n✅ PASSED (${passed.length}):`);
  passed.forEach(r => console.log(`  - ${r.name}: Header ${r.hasHeader?'✓':'✗'} Nav ${r.hasNav?'✓':'✗'}`));
  
  console.log(`\n❌ FAILED (${failed.length}):`);
  failed.forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  
  console.log(`\n⚠️  ERRORS (${errors.length}):`);
  errors.forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  
  console.log(`\nSUMMARY: ${passed.length}/${results.length} pages working (${Math.round(passed.length/results.length*100)}%)`);
  
  await browser.close();
  return { passed: passed.length, failed: failed.length, errors: errors.length, total: results.length };
}

quickTest().catch(console.error);