const puppeteer = require('puppeteer');

async function debugShopPage() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging shop page data loading...');
    
    // Listen for console messages
    page.on('console', msg => {
      const text = msg.text();
      if (text && (text.includes('products') || text.includes('Loaded') || text.includes('mock') || text.includes('error'))) {
        console.log('Console:', text);
      }
    });
    
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    
    // Check if the products are actually being passed to the component
    const shopContent = await page.evaluate(() => {
      // Look for any script tags that might contain the data
      const scripts = Array.from(document.querySelectorAll('script'));
      const dataScript = scripts.find(script => 
        script.textContent?.includes('products') || 
        script.textContent?.includes('GoEventCity Classic T-Shirt')
      );
      
      return {
        hasDataScript: !!dataScript,
        scriptContent: dataScript?.textContent?.substring(0, 500),
        bodyText: document.body.textContent?.substring(0, 1000)
      };
    });
    
    console.log('Shop page analysis:', shopContent);
    
    // Check what's actually in the grid
    const gridContent = await page.evaluate(() => {
      const grid = document.querySelector('.grid');
      if (!grid) return { found: false };
      
      return {
        found: true,
        children: grid.children.length,
        firstChild: grid.firstElementChild?.textContent?.substring(0, 200),
        allText: Array.from(grid.children).map(child => child.textContent?.trim().substring(0, 100))
      };
    });
    
    console.log('Grid content:', gridContent);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

debugShopPage();
