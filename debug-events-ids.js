const puppeteer = require('puppeteer');

async function debugEventsIds() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging events IDs...');
    
    // Listen for console messages to see the actual data being loaded
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
    
    // Try to extract event data from the page by looking at the actual DOM structure
    const eventData = await page.evaluate(() => {
      // Look for event cards in the grid
      const eventCards = document.querySelectorAll('.grid > div');
      const events = [];
      
      eventCards.forEach((card, index) => {
        // Try to find any data attributes or text that might contain event IDs
        const dataEventId = card.getAttribute('data-event-id');
        const dataId = card.getAttribute('data-id');
        
        // Look for any text that might be an event ID (UUID format)
        const textContent = card.textContent;
        const uuidMatch = textContent.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
        const uuid = uuidMatch ? uuidMatch[1] : null;
        
        // Look for numeric IDs
        const numericIdMatch = textContent.match(/ID[:\s]*(\d+)/i);
        const numericId = numericIdMatch ? numericIdMatch[1] : null;
        
        // Get the title
        const title = card.querySelector('h4, h3, h2, [class*="title"]')?.textContent || 'No title';
        
        // Check if this looks like an event card (has title and some content)
        if (title !== 'No title' && title.length > 3) {
          events.push({
            index,
            title: title.substring(0, 50),
            dataEventId,
            dataId,
            uuid,
            numericId,
            hasClickable: card.querySelector('a, button, [onclick]') !== null,
            textContent: textContent.substring(0, 200)
          });
        }
      });
      
      return events;
    });
    
    console.log(`\n📊 Found ${eventData.length} event cards:`);
    eventData.forEach((event, i) => {
      console.log(`   ${i + 1}. Title: ${event.title}`);
      console.log(`       Data Event ID: ${event.dataEventId || 'None'}`);
      console.log(`       Data ID: ${event.dataId || 'None'}`);
      console.log(`       UUID: ${event.uuid || 'None'}`);
      console.log(`       Numeric ID: ${event.numericId || 'None'}`);
      console.log(`       Has Clickable: ${event.hasClickable}`);
      console.log(`       Text: ${event.textContent}`);
      console.log('');
    });
    
    // If we found any event with an ID, test it
    const eventWithId = eventData.find(e => e.dataEventId || e.dataId || e.uuid || e.numericId);
    if (eventWithId) {
      const testId = eventWithId.dataEventId || eventWithId.dataId || eventWithId.uuid || eventWithId.numericId;
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
      console.log('\n❌ No event IDs found in the event cards. The events might not have proper IDs or the data structure is different.');
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

debugEventsIds().catch(console.error);
