const puppeteer = require('puppeteer');

async function checkDatabaseErrors() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking for database and data loading errors...');
    
    // Listen for all console messages
    const allMessages = [];
    page.on('console', msg => {
      allMessages.push({ type: msg.type(), text: msg.text() });
    });
    
    // Check shop page
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    
    console.log('\n📦 Shop page console messages:');
    allMessages.forEach(msg => {
      if (msg.text.includes('shop') || msg.text.includes('product') || msg.text.includes('database') || msg.text.includes('error') || msg.text.includes('Error') || msg.text.includes('Loaded') || msg.text.includes('mock')) {
        console.log(`[${msg.type}] ${msg.text}`);
      }
    });
    
    // Check if there are any network errors
    const networkErrors = [];
    page.on('response', response => {
      if (!response.ok()) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    
    if (networkErrors.length > 0) {
      console.log('\n❌ Network errors found:', networkErrors);
    }
    
    // Check if the loader is actually being called
    const loaderMessages = allMessages.filter(msg => 
      msg.text.includes('loader') || 
      msg.text.includes('Loaded') || 
      msg.text.includes('products') ||
      msg.text.includes('mock') ||
      msg.text.includes('database')
    );
    
    console.log('\n📊 Loader-related messages:', loaderMessages);
    
    // Check the actual page source for any error messages
    const pageContent = await page.content();
    const hasErrorInHTML = pageContent.includes('Error') || pageContent.includes('error') || pageContent.includes('No data');
    console.log('\n🔍 Error messages in HTML:', hasErrorInHTML);
    
    if (hasErrorInHTML) {
      const errorMatches = pageContent.match(/error[^<]*/gi);
      console.log('Error matches found:', errorMatches?.slice(0, 5));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await browser.close();
}

checkDatabaseErrors();
