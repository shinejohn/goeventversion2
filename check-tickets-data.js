const puppeteer = require('puppeteer');

async function checkTicketsData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🎫 Checking tickets pages data loading...\n');
    
    // Check main tickets page
    console.log('🎫 Testing /tickets page...');
    await page.goto('https://goeventversion2-production.up.railway.app/tickets', { waitUntil: 'networkidle0' });
    
    const ticketsData = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
      const hasTicketData = {
        hasTicketListings: document.body.textContent?.includes('ticket') || document.body.textContent?.includes('Ticket'),
        hasEventCards: document.querySelectorAll('[class*="card"], [class*="event"]').length,
        hasPurchaseButtons: Array.from(document.querySelectorAll('button')).some(btn => 
          btn.textContent?.includes('Buy') || btn.textContent?.includes('Purchase') || btn.textContent?.includes('Ticket')
        ),
        hasEventTitles: headings.some(h => h.includes('Event') || h.includes('Concert') || h.includes('Show'))
      };
      
      const mainContent = document.body.textContent?.substring(0, 1000);
      const pageTitle = document.title;
      
      return {
        headings,
        hasTicketData,
        mainContent,
        pageTitle,
        url: window.location.href
      };
    });
    
    console.log('Tickets Page Analysis:');
    console.log('====================');
    console.log('Ticket data elements:', ticketsData.hasTicketData);
    console.log('Headings found:', ticketsData.headings);
    console.log('Page title:', ticketsData.pageTitle);
    console.log('Main content sample:', ticketsData.mainContent.substring(0, 400));
    
    // Check if there are any ticket purchase links
    const ticketLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/tickets/"], a[href*="/purchase/"]'));
      return links.map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim()
      }));
    });
    
    console.log('Ticket purchase links found:', ticketLinks);
    
    // Test a ticket purchase page if available
    if (ticketLinks.length > 0) {
      const ticketUrl = ticketLinks[0].href;
      console.log(`\n🎫 Testing ticket purchase page: ${ticketUrl}`);
      
      await page.goto(`https://goeventversion2-production.up.railway.app${ticketUrl}`, { waitUntil: 'networkidle0' });
      
      const purchaseData = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
        const hasPurchaseUI = {
          hasEventDetails: document.body.textContent?.includes('Event') || document.body.textContent?.includes('Date'),
          hasTicketOptions: document.body.textContent?.includes('ticket') || document.body.textContent?.includes('price'),
          hasPurchaseForm: !!document.querySelector('form, button[type="submit"]'),
          hasPaymentInfo: document.body.textContent?.includes('payment') || document.body.textContent?.includes('card')
        };
        
        return {
          headings,
          hasPurchaseUI,
          pageTitle: document.title,
          mainContent: document.body.textContent?.substring(0, 500)
        };
      });
      
      console.log('Ticket Purchase Page Analysis:');
      console.log('==============================');
      console.log('Purchase UI elements:', purchaseData.hasPurchaseUI);
      console.log('Headings found:', purchaseData.headings);
      console.log('Page title:', purchaseData.pageTitle);
      console.log('Main content sample:', purchaseData.mainContent.substring(0, 300));
    }
    
  } catch (error) {
    console.error('Error checking tickets:', error.message);
  }
  
  await browser.close();
}

checkTicketsData();
