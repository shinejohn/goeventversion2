const puppeteer = require('puppeteer');

async function getRealEventIds() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Getting real event IDs...');
    
    await page.goto('https://goeventversion2-production.up.railway.app/events', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get event data and try to extract IDs from the page
    const eventData = await page.evaluate(() => {
      const eventElements = document.querySelectorAll('[class*="event"], [class*="Event"], .grid > div');
      const events = [];
      
      eventElements.forEach((el, index) => {
        // Try to find clickable elements that might contain event IDs
        const clickableEl = el.querySelector('a, button, [onclick]');
        const href = clickableEl?.getAttribute('href');
        const onclick = clickableEl?.getAttribute('onclick');
        
        // Extract ID from href or onclick
        let eventId = null;
        if (href && href.includes('/events/')) {
          eventId = href.split('/events/')[1];
        } else if (onclick && onclick.includes('/events/')) {
          eventId = onclick.split('/events/')[1].split("'")[0];
        }
        
        const title = el.querySelector('h4, h3, h2, [class*="title"]')?.textContent || 'No title';
        
        if (eventId && title !== 'No title') {
          events.push({
            id: eventId,
            title: title.substring(0, 50),
            index
          });
        }
      });
      
      return events;
    });
    
    console.log(`\n📊 Found ${eventData.length} events with IDs:`);
    eventData.forEach((event, i) => {
      console.log(`   ${i + 1}. ID: ${event.id} - ${event.title}`);
    });
    
    // Test the first few event IDs
    if (eventData.length > 0) {
      console.log(`\n🔍 Testing first event ID: ${eventData[0].id}`);
      
      await page.goto(`https://goeventversion2-production.up.railway.app/events/${eventData[0].id}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const eventDetailData = await page.evaluate(() => {
        return {
          title: document.title,
          hasEventNotFound: document.body.textContent.includes('Event Not Found'),
          hasEventTitle: document.querySelector('h1, h2, h3')?.textContent || 'No title found',
          bodyLength: document.body.textContent.length
        };
      });
      
      console.log(`\n📊 Event Detail Page Analysis for ID ${eventData[0].id}:`);
      console.log(`   Title: ${eventDetailData.title}`);
      console.log(`   Has Event Not Found: ${eventDetailData.hasEventNotFound}`);
      console.log(`   Event Title: ${eventDetailData.hasEventTitle}`);
      console.log(`   Body Length: ${eventDetailData.bodyLength}`);
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

getRealEventIds().catch(console.error);
