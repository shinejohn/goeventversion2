const puppeteer = require('puppeteer');

async function checkRailway() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🔍 Checking Railway deployment...');
  
  try {
    // Check shop page
    console.log('\n📦 Checking /shop page...');
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    const shopTitle = await page.title();
    console.log('Shop page title:', shopTitle);
    
    // Check if products are visible
    const productCount = await page.$$eval('.grid > div', els => els.length);
    console.log('Number of product cards found:', productCount);
    
    // Check if we can see product names
    const productNames = await page.$$eval('.grid h3', els => els.map(el => el.textContent?.trim()).filter(Boolean));
    console.log('Product names found:', productNames.slice(0, 3));
    
    // Check hubs page
    console.log('\n🏘️ Checking /hubs page...');
    await page.goto('https://goeventversion2-production.up.railway.app/hubs', { waitUntil: 'networkidle0' });
    const hubsTitle = await page.title();
    console.log('Hubs page title:', hubsTitle);
    
    // Check if hubs are visible
    const hubCount = await page.$$eval('.grid > div', els => els.length);
    console.log('Number of hub cards found:', hubCount);
    
    // Check if we can see hub names
    const hubNames = await page.$$eval('.grid h3', els => els.map(el => el.textContent?.trim()).filter(Boolean));
    console.log('Hub names found:', hubNames.slice(0, 3));
    
    // Check main page
    console.log('\n🏠 Checking main page...');
    await page.goto('https://goeventversion2-production.up.railway.app/', { waitUntil: 'networkidle0' });
    const mainTitle = await page.title();
    console.log('Main page title:', mainTitle);
    
    // Check if navigation has shop and hubs links
    const navLinks = await page.$$eval('nav a, nav button', els => els.map(el => el.textContent?.trim()).filter(Boolean));
    console.log('Navigation links found:', navLinks);
    
    // Check if there are any error messages
    const errorMessages = await page.$$eval('[class*="error"], [class*="Error"]', els => els.map(el => el.textContent?.trim()).filter(Boolean));
    if (errorMessages.length > 0) {
      console.log('❌ Error messages found:', errorMessages);
    }
    
    // Take a screenshot of the shop page
    console.log('\n📸 Taking screenshot of shop page...');
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'shop-page-screenshot.png', fullPage: true });
    console.log('Screenshot saved as shop-page-screenshot.png');
    
  } catch (error) {
    console.error('❌ Error checking Railway:', error.message);
  }
  
  await browser.close();
}

checkRailway();
