const puppeteer = require('puppeteer');

const BASE_URL = 'https://goeventversion2-production.up.railway.app';

async function testEventsData() {
  console.log('🔍 Testing events data structure...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'log' && msg.text().includes('DEBUG')) {
      console.log('📊 Browser Console:', msg.text());
    }
  });
  
  try {
    console.log('📄 Loading events page...');
    await page.goto(`${BASE_URL}/events`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if there are any event cards
    const eventCards = await page.$$('[data-test="event-card"], .event-card, article');
    console.log(`📊 Found ${eventCards.length} event cards`);
    
    // Check if there's a "No events found" message
    const noEventsMessage = await page.$('text="No events found for the selected criteria"');
    if (noEventsMessage) {
      console.log('❌ Page shows "No events found" message');
    }
    
    // Get the page content to see what's actually rendered
    const content = await page.content();
    
    // Look for specific patterns
    if (content.includes('No events found for the selected criteria')) {
      console.log('❌ No events found message detected');
    } else if (content.includes('event-card') || content.includes('EventCard')) {
      console.log('✅ Event card components detected in HTML');
    } else {
      console.log('❓ No clear event card indicators found');
    }
    
    // Check for any JavaScript errors
    const errors = await page.evaluate(() => {
      return window.console.error ? window.console.error.toString() : 'No errors';
    });
    
    console.log('🔍 Page analysis complete');
    
  } catch (error) {
    console.error('❌ Error testing events data:', error.message);
  } finally {
    await browser.close();
  }
}

testEventsData().catch(console.error);
