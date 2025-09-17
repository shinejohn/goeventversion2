const puppeteer = require('puppeteer');

async function checkVenuesData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🏢 Checking venues pages data loading...\n');
    
    // Check main venues page
    console.log('🏢 Testing /venues page...');
    await page.goto('https://goeventversion2-production.up.railway.app/venues', { waitUntil: 'networkidle0' });
    
    const venuesData = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
      const hasVenueData = {
        hasVenueListings: document.body.textContent?.includes('venue') || document.body.textContent?.includes('Venue'),
        hasLocationCards: document.querySelectorAll('[class*="card"], [class*="venue"]').length,
        hasBookingButtons: Array.from(document.querySelectorAll('button')).some(btn => 
          btn.textContent?.includes('Book') || btn.textContent?.includes('Reserve') || btn.textContent?.includes('Contact')
        ),
        hasVenueNames: headings.some(h => h.includes('Theater') || h.includes('Hall') || h.includes('Center')),
        hasLocationInfo: document.body.textContent?.includes('address') || document.body.textContent?.includes('location')
      };
      
      const mainContent = document.body.textContent?.substring(0, 1000);
      const pageTitle = document.title;
      
      return {
        headings,
        hasVenueData,
        mainContent,
        pageTitle,
        url: window.location.href
      };
    });
    
    console.log('Venues Page Analysis:');
    console.log('====================');
    console.log('Venue data elements:', venuesData.hasVenueData);
    console.log('Headings found:', venuesData.headings);
    console.log('Page title:', venuesData.pageTitle);
    console.log('Main content sample:', venuesData.mainContent.substring(0, 400));
    
    // Check if there are any venue detail links
    const venueLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/venue"], a[href*="/location"]'));
      return links.map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim()
      }));
    });
    
    console.log('Venue detail links found:', venueLinks);
    
    // Test a venue detail page if available
    if (venueLinks.length > 0) {
      const venueUrl = venueLinks[0].href;
      console.log(`\n🏢 Testing venue detail page: ${venueUrl}`);
      
      await page.goto(`https://goeventversion2-production.up.railway.app${venueUrl}`, { waitUntil: 'networkidle0' });
      
      const venueDetailData = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
        const hasVenueDetailUI = {
          hasVenueName: headings.some(h => h.includes('Theater') || h.includes('Hall') || h.includes('Center')),
          hasAddress: document.body.textContent?.includes('address') || document.body.textContent?.includes('street'),
          hasCapacity: document.body.textContent?.includes('capacity') || document.body.textContent?.includes('seats'),
          hasAmenities: document.body.textContent?.includes('amenities') || document.body.textContent?.includes('features')
        };
        
        return {
          headings,
          hasVenueDetailUI,
          pageTitle: document.title,
          mainContent: document.body.textContent?.substring(0, 500)
        };
      });
      
      console.log('Venue Detail Page Analysis:');
      console.log('===========================');
      console.log('Venue detail UI elements:', venueDetailData.hasVenueDetailUI);
      console.log('Headings found:', venueDetailData.headings);
      console.log('Page title:', venueDetailData.pageTitle);
      console.log('Main content sample:', venueDetailData.mainContent.substring(0, 300));
    }
    
  } catch (error) {
    console.error('Error checking venues:', error.message);
  }
  
  await browser.close();
}

checkVenuesData();
