const puppeteer = require('puppeteer');

async function checkBookItData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📅 Checking book-it pages data loading...\n');
    
    // Check main book-it page
    console.log('📅 Testing /book-it page...');
    await page.goto('https://goeventversion2-production.up.railway.app/book-it', { waitUntil: 'networkidle0' });
    
    const bookItData = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
      const hasBookingData = {
        hasVenueListings: document.body.textContent?.includes('venue') || document.body.textContent?.includes('Venue'),
        hasBookingOptions: document.body.textContent?.includes('book') || document.body.textContent?.includes('Book'),
        hasEventCards: document.querySelectorAll('[class*="card"], [class*="event"]').length,
        hasBookingButtons: Array.from(document.querySelectorAll('button')).some(btn => 
          btn.textContent?.includes('Book') || btn.textContent?.includes('Reserve') || btn.textContent?.includes('Schedule')
        ),
        hasVenueTitles: headings.some(h => h.includes('Venue') || h.includes('Location') || h.includes('Space'))
      };
      
      const mainContent = document.body.textContent?.substring(0, 1000);
      const pageTitle = document.title;
      
      return {
        headings,
        hasBookingData,
        mainContent,
        pageTitle,
        url: window.location.href
      };
    });
    
    console.log('Book-It Page Analysis:');
    console.log('=====================');
    console.log('Booking data elements:', bookItData.hasBookingData);
    console.log('Headings found:', bookItData.headings);
    console.log('Page title:', bookItData.pageTitle);
    console.log('Main content sample:', bookItData.mainContent.substring(0, 400));
    
    // Check if there are any booking links
    const bookingLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/book"], a[href*="/venue"], a[href*="/event"]'));
      return links.map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim()
      }));
    });
    
    console.log('Booking links found:', bookingLinks);
    
  } catch (error) {
    console.error('Error checking book-it:', error.message);
  }
  
  await browser.close();
}

checkBookItData();
