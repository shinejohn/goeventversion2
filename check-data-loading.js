const puppeteer = require('puppeteer');

async function checkDataLoading() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking data loading on Railway...');
    
    // Check shop page data
    console.log('\n📦 Checking /shop page data...');
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    
    // Check if products are actually visible
    const productCards = await page.$$eval('.grid > div', els => els.map(el => ({
      hasImage: !!el.querySelector('img'),
      hasTitle: !!el.querySelector('h3'),
      hasPrice: !!el.querySelector('[class*="price"], [class*="$"]'),
      textContent: el.textContent?.trim().substring(0, 100)
    })));
    
    console.log('Product cards found:', productCards.length);
    console.log('First product card details:', productCards[0]);
    
    // Check if there are any loading states or error messages
    const loadingElements = await page.$$eval('[class*="loading"], [class*="spinner"], [class*="skeleton"]', els => els.length);
    console.log('Loading elements found:', loadingElements);
    
    // Check console for any data loading errors
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('error') || msg.text().includes('Error')) {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
      }
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    
    if (consoleMessages.length > 0) {
      console.log('❌ Console errors found:', consoleMessages);
    }
    
    // Check hubs page data
    console.log('\n🏘️ Checking /hubs page data...');
    await page.goto('https://goeventversion2-production.up.railway.app/hubs', { waitUntil: 'networkidle0' });
    
    const hubCards = await page.$$eval('.grid > div', els => els.map(el => ({
      hasImage: !!el.querySelector('img'),
      hasTitle: !!el.querySelector('h3'),
      hasDescription: !!el.querySelector('p'),
      textContent: el.textContent?.trim().substring(0, 100)
    })));
    
    console.log('Hub cards found:', hubCards.length);
    console.log('First hub card details:', hubCards[0]);
    
    // Check if the data is actually empty or just not rendering
    const emptyState = await page.$eval('body', el => {
      const text = el.textContent || '';
      return {
        hasProducts: text.includes('T-Shirt') || text.includes('Hoodie') || text.includes('Cap'),
        hasHubs: text.includes('Hub') || text.includes('Community'),
        totalTextLength: text.length,
        hasErrorMessages: text.includes('Error') || text.includes('error') || text.includes('No data')
      };
    });
    
    console.log('Page content analysis:', emptyState);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await browser.close();
}

checkDataLoading();
