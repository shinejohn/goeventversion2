const puppeteer = require('puppeteer');

async function checkTicketsAndVenues() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking tickets section and venues...\n');
    
    // Check tickets page
    console.log('🎫 Checking /tickets page...');
    await page.goto('https://goeventversion2-production.up.railway.app/tickets', { waitUntil: 'networkidle0' });
    
    const ticketsData = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const ticketGrid = grids.find(grid => 
        grid.textContent?.includes('ticket') || 
        grid.textContent?.includes('event') ||
        grid.textContent?.includes('$')
      );
      
      if (!ticketGrid) return { found: false };
      
      const ticketCards = Array.from(ticketGrid.children).map(card => ({
        hasImage: !!card.querySelector('img'),
        hasTitle: !!card.querySelector('h3'),
        hasPrice: !!card.querySelector('[class*="price"], [class*="$"]'),
        textContent: card.textContent?.trim().substring(0, 200)
      }));
      
      return {
        found: true,
        totalCards: ticketCards.length,
        cards: ticketCards.slice(0, 3)
      };
    });
    
    console.log('Tickets data:', ticketsData);
    
    // Check venues page
    console.log('\n🏢 Checking /venues page...');
    await page.goto('https://goeventversion2-production.up.railway.app/venues', { waitUntil: 'networkidle0' });
    
    const venuesData = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const venueGrid = grids.find(grid => 
        grid.textContent?.includes('venue') || 
        grid.textContent?.includes('location') ||
        grid.textContent?.includes('capacity')
      );
      
      if (!venueGrid) return { found: false };
      
      const venueCards = Array.from(venueGrid.children).map(card => ({
        hasImage: !!card.querySelector('img'),
        hasTitle: !!card.querySelector('h3'),
        hasLocation: !!card.querySelector('[class*="location"], [class*="address"]'),
        textContent: card.textContent?.trim().substring(0, 200)
      }));
      
      return {
        found: true,
        totalCards: venueCards.length,
        cards: venueCards.slice(0, 3)
      };
    });
    
    console.log('Venues data:', venuesData);
    
    // Check book-it/venues page (the one in your image)
    console.log('\n📖 Checking /book-it page...');
    await page.goto('https://goeventversion2-production.up.railway.app/book-it', { waitUntil: 'networkidle0' });
    
    const bookItData = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const bookItGrid = grids.find(grid => 
        grid.textContent?.includes('venue') || 
        grid.textContent?.includes('book') ||
        grid.textContent?.includes('space')
      );
      
      if (!bookItGrid) return { found: false };
      
      const bookItCards = Array.from(bookItGrid.children).map(card => ({
        hasImage: !!card.querySelector('img'),
        hasTitle: !!card.querySelector('h3'),
        hasButton: !!card.querySelector('button'),
        textContent: card.textContent?.trim().substring(0, 200)
      }));
      
      return {
        found: true,
        totalCards: bookItCards.length,
        cards: bookItCards.slice(0, 3)
      };
    });
    
    console.log('Book-It data:', bookItData);
    
    // Check if there are any "No venues found" messages
    const noResultsMessage = await page.evaluate(() => {
      const noResults = document.querySelector('[class*="no-results"], [class*="empty"], [class*="not-found"]');
      return {
        found: !!noResults,
        message: noResults?.textContent?.trim()
      };
    });
    
    console.log('No results message:', noResultsMessage);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

checkTicketsAndVenues();
