const puppeteer = require('puppeteer');

async function debugEventData() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging event data...');
    
    // Listen for console messages
    page.on('console', msg => {
      console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
    });
    
    // Go to events list first to see what events exist
    console.log('📋 Checking events list...');
    await page.goto('https://goeventversion2-production.up.railway.app/events', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get events data from the page
    const eventsData = await page.evaluate(() => {
      const eventElements = document.querySelectorAll('[class*="event"], [class*="Event"], .grid > div');
      const events = [];
      
      eventElements.forEach((el, index) => {
        const title = el.querySelector('h4, h3, h2, [class*="title"]')?.textContent || 'No title';
        const price = el.querySelector('[class*="price"]')?.textContent || 'No price';
        const date = el.querySelector('[class*="date"]')?.textContent || 'No date';
        const venue = el.querySelector('[class*="venue"]')?.textContent || 'No venue';
        
        events.push({
          index,
          title: title.substring(0, 50),
          price,
          date,
          venue: venue.substring(0, 30),
          element: el.outerHTML.substring(0, 200)
        });
      });
      
      return events;
    });
    
    console.log(`\n📊 Found ${eventsData.length} events on the page:`);
    eventsData.forEach((event, i) => {
      console.log(`   ${i + 1}. ${event.title} - ${event.price} - ${event.date} - ${event.venue}`);
    });
    
    // Now try to access event detail page with ID 1
    console.log('\n🔍 Trying to access event detail page with ID 1...');
    await page.goto('https://goeventversion2-production.up.railway.app/events/1', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check what's on the event detail page
    const eventDetailData = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.textContent,
        hasEventNotFound: document.body.textContent.includes('Event Not Found'),
        hasEventTitle: document.querySelector('h1, h2, h3')?.textContent || 'No title found',
        bodyLength: document.body.textContent.length
      };
    });
    
    console.log('\n📊 Event Detail Page Analysis:');
    console.log(`   Title: ${eventDetailData.title}`);
    console.log(`   Has Event Not Found: ${eventDetailData.hasEventNotFound}`);
    console.log(`   Event Title: ${eventDetailData.hasEventTitle}`);
    console.log(`   Body Length: ${eventDetailData.bodyLength}`);
    console.log(`   First 500 chars: ${eventDetailData.bodyText.substring(0, 500)}`);
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

debugEventData().catch(console.error);
