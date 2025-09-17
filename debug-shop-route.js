const puppeteer = require('puppeteer');

async function debugShopRoute() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging shop route resolution...');
    
    // Check the actual HTML structure
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    
    // Get the full HTML to see what's actually being rendered
    const html = await page.content();
    
    // Look for the ShopPage component or any product-related content
    const hasShopPage = html.includes('GoEventCity Classic T-Shirt') || 
                       html.includes('Event Lover Hoodie') ||
                       html.includes('Local Music Supporter Cap');
    
    console.log('Has ShopPage product content:', hasShopPage);
    
    // Look for the actual grid content
    const gridMatch = html.match(/<div[^>]*class="[^"]*grid[^"]*"[^>]*>(.*?)<\/div>/s);
    if (gridMatch) {
      console.log('Grid content found:', gridMatch[1].substring(0, 500));
    }
    
    // Check if there are any script tags with data
    const scriptMatches = html.match(/<script[^>]*>(.*?)<\/script>/gs);
    if (scriptMatches) {
      const dataScript = scriptMatches.find(script => 
        script.includes('products') || 
        script.includes('GoEventCity Classic T-Shirt')
      );
      if (dataScript) {
        console.log('Data script found:', dataScript.substring(0, 500));
      }
    }
    
    // Check the actual page content more carefully
    const bodyText = await page.evaluate(() => {
      return document.body.textContent;
    });
    
    const hasProductNames = bodyText.includes('GoEventCity Classic T-Shirt') || 
                           bodyText.includes('Event Lover Hoodie') ||
                           bodyText.includes('Local Music Supporter Cap');
    
    console.log('Has product names in body:', hasProductNames);
    
    // Check what's actually in the main content area
    const mainContent = await page.evaluate(() => {
      const main = document.querySelector('main, [role="main"], .min-h-screen');
      if (!main) return null;
      
      return {
        innerHTML: main.innerHTML.substring(0, 1000),
        textContent: main.textContent?.substring(0, 500)
      };
    });
    
    console.log('Main content:', mainContent);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

debugShopRoute();
