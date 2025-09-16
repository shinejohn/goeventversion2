const puppeteer = require('puppeteer');

async function testHubPages() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Testing hub listing page...');
    await page.goto('http://localhost:3000/hubs', { waitUntil: 'networkidle0' });
    
    // Check if the page loads
    const title = await page.title();
    console.log('Hub listing page title:', title);
    
    // Check if there are any hub cards
    const hubCards = await page.$$('[data-test="hub-card"]');
    console.log('Found hub cards:', hubCards.length);
    
    // If there are hub cards, click on the first one
    if (hubCards.length > 0) {
      console.log('Clicking on first hub card...');
      await hubCards[0].click();
      
      // Wait for navigation
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      const currentUrl = page.url();
      console.log('Navigated to:', currentUrl);
      
      // Check if we're on a hub detail page
      if (currentUrl.includes('/hub/')) {
        console.log('✅ Successfully navigated to hub detail page');
        
        // Check if the page has content
        const hubContent = await page.$('[data-test="hub-content"]');
        if (hubContent) {
          console.log('✅ Hub detail page has content');
        } else {
          console.log('❌ Hub detail page missing content');
        }
      } else {
        console.log('❌ Failed to navigate to hub detail page');
      }
    } else {
      console.log('❌ No hub cards found on listing page');
    }
    
  } catch (error) {
    console.error('Error testing hub pages:', error);
  } finally {
    await browser.close();
  }
}

testHubPages();
