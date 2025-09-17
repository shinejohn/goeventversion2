const puppeteer = require('puppeteer');

async function checkCalendarData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking calendar pages data loading...\n');
    
    // Check calendars listing page
    console.log('📅 Checking /calendars page...');
    await page.goto('https://goeventversion2-production.up.railway.app/calendars', { waitUntil: 'networkidle0' });
    
    const calendarsData = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const calendarGrid = grids.find(grid => 
        grid.textContent?.includes('Calendar') || 
        grid.textContent?.includes('Event') ||
        grid.textContent?.includes('Schedule')
      );
      
      if (!calendarGrid) return { found: false };
      
      const calendarCards = Array.from(calendarGrid.children).map(card => ({
        hasImage: !!card.querySelector('img'),
        hasTitle: !!card.querySelector('h3'),
        hasDescription: !!card.querySelector('p'),
        textContent: card.textContent?.trim().substring(0, 200)
      }));
      
      return {
        found: true,
        totalCards: calendarCards.length,
        cards: calendarCards.slice(0, 3)
      };
    });
    
    console.log('Calendars data:', calendarsData);
    
    // Check calendar marketplace page
    console.log('\n🏪 Checking /calendars/marketplace page...');
    await page.goto('https://goeventversion2-production.up.railway.app/calendars/marketplace', { waitUntil: 'networkidle0' });
    
    const marketplaceData = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const marketplaceGrid = grids.find(grid => 
        grid.textContent?.includes('Calendar') || 
        grid.textContent?.includes('Event') ||
        grid.textContent?.includes('Subscribe')
      );
      
      if (!marketplaceGrid) return { found: false };
      
      const marketplaceCards = Array.from(marketplaceGrid.children).map(card => ({
        hasImage: !!card.querySelector('img'),
        hasTitle: !!card.querySelector('h3'),
        hasDescription: !!card.querySelector('p'),
        textContent: card.textContent?.trim().substring(0, 200)
      }));
      
      return {
        found: true,
        totalCards: marketplaceCards.length,
        cards: marketplaceCards.slice(0, 3)
      };
    });
    
    console.log('Marketplace data:', marketplaceData);
    
    // Check if we can navigate to a specific calendar
    if (marketplaceData.found && marketplaceData.totalCards > 0) {
      console.log('\n🔗 Testing calendar detail page navigation...');
      
      // Try to find a calendar link and click it
      const calendarLink = await page.$('a[href*="/calendars/"]');
      if (calendarLink) {
        const href = await calendarLink.getAttribute('href');
        console.log('Found calendar link:', href);
        
        // Navigate to the calendar detail page
        await page.goto(`https://goeventversion2-production.up.railway.app${href}`, { waitUntil: 'networkidle0' });
        
        const calendarDetailData = await page.evaluate(() => {
          const title = document.querySelector('h1')?.textContent?.trim();
          const description = document.querySelector('p')?.textContent?.trim();
          const hasImage = !!document.querySelector('img');
          
          return {
            title,
            description,
            hasImage,
            pageTitle: document.title
          };
        });
        
        console.log('Calendar detail data:', calendarDetailData);
      } else {
        console.log('No calendar links found');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

checkCalendarData();
