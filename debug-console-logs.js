const puppeteer = require('puppeteer');

async function debugConsoleLogs() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging console logs from events loader...');
    
    // Listen for ALL console messages
    page.on('console', msg => {
      console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
    });
    
    await page.goto('https://goeventversion2-production.up.railway.app/events', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Try to get the events data directly from the page
    const eventsData = await page.evaluate(() => {
      // Look for any global variables or data that might contain event information
      const windowData = {
        hasReactRouterContext: !!window.__reactRouterContext,
        hasReactRouterManifest: !!window.__reactRouterManifest,
        hasGlobalEvents: !!window.events,
        hasGlobalData: !!window.data,
        bodyTextLength: document.body.textContent.length,
        hasEventElements: document.querySelectorAll('[class*="event"], [class*="Event"]').length
      };
      
      // Try to find any script tags that might contain event data
      const scriptTags = Array.from(document.querySelectorAll('script')).map(script => {
        const content = script.textContent || script.innerHTML;
        if (content.includes('event') || content.includes('Event')) {
          return content.substring(0, 200);
        }
        return null;
      }).filter(Boolean);
      
      return {
        windowData,
        scriptTags: scriptTags.slice(0, 3) // First 3 script tags with event content
      };
    });
    
    console.log('\n📊 Page Analysis:');
    console.log(`   Has React Router Context: ${eventsData.windowData.hasReactRouterContext}`);
    console.log(`   Has React Router Manifest: ${eventsData.windowData.hasReactRouterManifest}`);
    console.log(`   Has Global Events: ${eventsData.windowData.hasGlobalEvents}`);
    console.log(`   Has Global Data: ${eventsData.windowData.hasGlobalData}`);
    console.log(`   Body Text Length: ${eventsData.windowData.bodyTextLength}`);
    console.log(`   Event Elements: ${eventsData.windowData.hasEventElements}`);
    
    if (eventsData.scriptTags.length > 0) {
      console.log('\n📝 Script Tags with Event Content:');
      eventsData.scriptTags.forEach((script, i) => {
        console.log(`   ${i + 1}. ${script}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

debugConsoleLogs().catch(console.error);
