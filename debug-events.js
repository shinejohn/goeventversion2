const puppeteer = require('puppeteer');

async function debugEvents() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging events page...');
    
    await page.goto('https://goeventversion2-production.up.railway.app/events', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get page content analysis
    const analysis = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.textContent,
        bodyLength: document.body.textContent.length,
        
        // Check for events data
        eventElements: document.querySelectorAll('[class*="event"], [class*="Event"]').length,
        cardElements: document.querySelectorAll('[class*="card"], [class*="Card"]').length,
        
        // Check for specific content
        hasEventText: document.body.textContent.toLowerCase().includes('event'),
        hasDateText: document.body.textContent.toLowerCase().includes('date'),
        hasTimeText: document.body.textContent.toLowerCase().includes('time'),
        
        // Check for error messages
        hasErrorText: document.body.textContent.toLowerCase().includes('error'),
        hasNotFoundText: document.body.textContent.toLowerCase().includes('not found'),
        hasLoadingText: document.body.textContent.toLowerCase().includes('loading'),
        
        // Check for React errors
        hasReactError: document.body.textContent.includes('Minified React error'),
        
        // Get all text content to see what's actually there
        allText: document.body.textContent.substring(0, 1000)
      };
    });
    
    console.log('📊 Events Page Analysis:');
    console.log(`   Title: ${analysis.title}`);
    console.log(`   Body Length: ${analysis.bodyLength} characters`);
    console.log(`   Event Elements: ${analysis.eventElements}`);
    console.log(`   Card Elements: ${analysis.cardElements}`);
    console.log(`   Has Event Text: ${analysis.hasEventText}`);
    console.log(`   Has Date Text: ${analysis.hasDateText}`);
    console.log(`   Has Time Text: ${analysis.hasTimeText}`);
    console.log(`   Has Error Text: ${analysis.hasErrorText}`);
    console.log(`   Has Not Found Text: ${analysis.hasNotFoundText}`);
    console.log(`   Has Loading Text: ${analysis.hasLoadingText}`);
    console.log(`   Has React Error: ${analysis.hasReactError}`);
    console.log(`   First 1000 chars: ${analysis.allText}`);
    
    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    console.log(`\n🚨 Console Errors: ${consoleErrors.length}`);
    consoleErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

debugEvents().catch(console.error);
