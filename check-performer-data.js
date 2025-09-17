const puppeteer = require('puppeteer');

async function checkPerformerData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🎭 Checking performer pages data loading...\n');
    
    // Check main performers page
    console.log('🎭 Testing /performers page...');
    await page.goto('https://goeventversion2-production.up.railway.app/performers', { waitUntil: 'networkidle0' });
    
    const performerData = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
      const hasPerformerData = {
        hasPerformerListings: document.body.textContent?.includes('performer') || document.body.textContent?.includes('Performer'),
        hasArtistCards: document.querySelectorAll('[class*="card"], [class*="performer"]').length,
        hasBookingButtons: Array.from(document.querySelectorAll('button')).some(btn => 
          btn.textContent?.includes('Book') || btn.textContent?.includes('Hire') || btn.textContent?.includes('Contact')
        ),
        hasPerformerNames: headings.some(h => h.includes('Band') || h.includes('Artist') || h.includes('Musician')),
        hasGenreTags: document.body.textContent?.includes('Jazz') || document.body.textContent?.includes('Rock') || document.body.textContent?.includes('Blues')
      };
      
      const mainContent = document.body.textContent?.substring(0, 1000);
      const pageTitle = document.title;
      
      return {
        headings,
        hasPerformerData,
        mainContent,
        pageTitle,
        url: window.location.href
      };
    });
    
    console.log('Performers Page Analysis:');
    console.log('========================');
    console.log('Performer data elements:', performerData.hasPerformerData);
    console.log('Headings found:', performerData.headings);
    console.log('Page title:', performerData.pageTitle);
    console.log('Main content sample:', performerData.mainContent.substring(0, 400));
    
    // Check if there are any performer profile links
    const performerLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/performer"], a[href*="/artist"]'));
      return links.map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim()
      }));
    });
    
    console.log('Performer profile links found:', performerLinks);
    
    // Test a performer profile page if available
    if (performerLinks.length > 0) {
      const performerUrl = performerLinks[0].href;
      console.log(`\n🎭 Testing performer profile page: ${performerUrl}`);
      
      await page.goto(`https://goeventversion2-production.up.railway.app${performerUrl}`, { waitUntil: 'networkidle0' });
      
      const profileData = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
        const hasProfileUI = {
          hasPerformerName: headings.some(h => h.includes('Band') || h.includes('Artist')),
          hasBio: document.body.textContent?.includes('bio') || document.body.textContent?.includes('about'),
          hasBookingInfo: document.body.textContent?.includes('book') || document.body.textContent?.includes('hire'),
          hasPortfolio: document.body.textContent?.includes('portfolio') || document.body.textContent?.includes('gallery')
        };
        
        return {
          headings,
          hasProfileUI,
          pageTitle: document.title,
          mainContent: document.body.textContent?.substring(0, 500)
        };
      });
      
      console.log('Performer Profile Page Analysis:');
      console.log('================================');
      console.log('Profile UI elements:', profileData.hasProfileUI);
      console.log('Headings found:', profileData.headings);
      console.log('Page title:', profileData.pageTitle);
      console.log('Main content sample:', profileData.mainContent.substring(0, 300));
    }
    
  } catch (error) {
    console.error('Error checking performers:', error.message);
  }
  
  await browser.close();
}

checkPerformerData();
