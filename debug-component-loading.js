const puppeteer = require('puppeteer');

async function debugComponentLoading() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging component loading...');
    
    // Check shop page
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    
    // Get all h1 elements
    const h1Elements = await page.$$eval('h1', els => els.map(el => ({
      text: el.textContent?.trim(),
      className: el.className,
      id: el.id
    })));
    console.log('All h1 elements on shop page:', h1Elements);
    
    // Check if there are any error messages in the console
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    
    if (consoleMessages.length > 0) {
      console.log('Console messages:', consoleMessages);
    }
    
    // Check the actual content structure
    const mainContent = await page.evaluate(() => {
      const main = document.querySelector('main');
      return main ? main.innerHTML.substring(0, 500) : 'No main element found';
    });
    console.log('Main content preview:', mainContent);
    
    // Check if we can find any shop-specific content
    const shopContent = await page.evaluate(() => {
      const shopElements = document.querySelectorAll('[class*="shop"], [class*="product"], [class*="merchandise"]');
      return Array.from(shopElements).map(el => el.textContent?.trim()).filter(Boolean);
    });
    console.log('Shop-specific content found:', shopContent);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await browser.close();
}

debugComponentLoading();
