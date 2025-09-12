const puppeteer = require('puppeteer');

async function debugReactError() {
  const browser = await puppeteer.launch({ headless: false }); // Set to false to see what's happening
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging React error #418...');
    
    // Listen for console messages
    page.on('console', msg => {
      console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log(`🚨 Page Error: ${error.message}`);
    });
    
    // Listen for network errors
    page.on('requestfailed', request => {
      console.log(`🌐 Request Failed: ${request.url()} - ${request.failure().errorText}`);
    });
    
    await page.goto('https://goeventversion2-production.up.railway.app/events', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Get page content analysis
    const analysis = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.textContent,
        bodyLength: document.body.textContent.length,
        
        // Check for React errors
        hasReactError: document.body.textContent.includes('Minified React error'),
        hasHydrationError: document.body.textContent.includes('hydration'),
        hasMismatchError: document.body.textContent.includes('mismatch'),
        
        // Check for specific error patterns
        hasError418: document.body.textContent.includes('418'),
        hasErrorText: document.body.textContent.toLowerCase().includes('error'),
        
        // Get all text content to see what's actually there
        allText: document.body.textContent.substring(0, 2000)
      };
    });
    
    console.log('\n📊 React Error Analysis:');
    console.log(`   Title: ${analysis.title}`);
    console.log(`   Body Length: ${analysis.bodyLength} characters`);
    console.log(`   Has React Error: ${analysis.hasReactError}`);
    console.log(`   Has Hydration Error: ${analysis.hasHydrationError}`);
    console.log(`   Has Mismatch Error: ${analysis.hasMismatchError}`);
    console.log(`   Has Error 418: ${analysis.hasError418}`);
    console.log(`   Has Error Text: ${analysis.hasErrorText}`);
    console.log(`   First 2000 chars: ${analysis.allText}`);
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

debugReactError().catch(console.error);
