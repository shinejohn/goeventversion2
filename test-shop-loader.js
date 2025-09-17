const puppeteer = require('puppeteer');

async function testShopLoader() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Testing shop loader data...');
    
    // Listen for console messages from the loader
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('products') || text.includes('Loaded') || text.includes('mock') || text.includes('database')) {
        consoleMessages.push(text);
      }
    });
    
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    
    console.log('Console messages from loader:');
    consoleMessages.forEach(msg => console.log('  -', msg));
    
    // Check if the page title is correct
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if there are any error messages
    const errorElements = await page.$$eval('[class*="error"], [class*="Error"]', els => 
      els.map(el => el.textContent?.trim())
    );
    
    if (errorElements.length > 0) {
      console.log('Error elements found:', errorElements);
    }
    
    // Check the actual content structure
    const contentStructure = await page.evaluate(() => {
      const mainContent = document.querySelector('main, [role="main"], .min-h-screen');
      if (!mainContent) return { found: false };
      
      return {
        found: true,
        children: mainContent.children.length,
        firstChild: mainContent.firstElementChild?.tagName,
        textContent: mainContent.textContent?.substring(0, 500)
      };
    });
    
    console.log('Content structure:', contentStructure);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

testShopLoader();
