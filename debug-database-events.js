const puppeteer = require('puppeteer');

async function debugDatabaseEvents() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging database events...');
    
    // Listen for console messages to see what data is being loaded
    page.on('console', msg => {
      if (msg.text().includes('Events query result') || msg.text().includes('Raw loader data') || msg.text().includes('Transformed props')) {
        console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
      }
    });
    
    await page.goto('https://goeventversion2-production.up.railway.app/events', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Try to extract event data from the page
    const eventData = await page.evaluate(() => {
      // Look for any data attributes or hidden elements that might contain event IDs
      const eventElements = document.querySelectorAll('[class*="event"], [class*="Event"], .grid > div');
      const events = [];
      
      eventElements.forEach((el, index) => {
        // Check for data attributes
        const eventId = el.getAttribute('data-event-id') || el.getAttribute('data-id');
        
        // Check for any text that looks like an ID
        const textContent = el.textContent;
        const idMatch = textContent.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
        const uuid = idMatch ? idMatch[1] : null;
        
        // Check for numeric IDs
        const numericIdMatch = textContent.match(/ID[:\s]*(\d+)/i);
        const numericId = numericIdMatch ? numericIdMatch[1] : null;
        
        const title = el.querySelector('h4, h3, h2, [class*="title"]')?.textContent || 'No title';
        
        if (title !== 'No title' && (eventId || uuid || numericId)) {
          events.push({
            index,
            title: title.substring(0, 50),
            eventId: eventId || uuid || numericId,
            textContent: textContent.substring(0, 100)
          });
        }
      });
      
      return events;
    });
    
    console.log(`\n📊 Found ${eventData.length} events with potential IDs:`);
    eventData.forEach((event, i) => {
      console.log(`   ${i + 1}. ID: ${event.eventId} - ${event.title}`);
      console.log(`       Text: ${event.textContent}`);
    });
    
    // If we found any event IDs, test the first one
    if (eventData.length > 0) {
      const testId = eventData[0].eventId;
      console.log(`\n🔍 Testing event detail page with ID: ${testId}`);
      
      await page.goto(`https://goeventversion2-production.up.railway.app/events/${testId}`, {
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
      
      console.log(`\n📊 Event Detail Page Analysis for ID ${testId}:`);
      console.log(`   Title: ${eventDetailData.title}`);
      console.log(`   Has Event Not Found: ${eventDetailData.hasEventNotFound}`);
      console.log(`   Event Title: ${eventDetailData.hasEventTitle}`);
      console.log(`   Body Length: ${eventDetailData.bodyLength}`);
    } else {
      console.log('\n❌ No event IDs found. The events might not have proper IDs or the data structure is different.');
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

debugDatabaseEvents().catch(console.error);
