const puppeteer = require('puppeteer');

async function checkCalendarUI() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking calendar UI implementation...\n');
    
    // Check calendars page
    console.log('📅 Checking /calendars page...');
    await page.goto('https://goeventversion2-production.up.railway.app/calendars', { waitUntil: 'networkidle0' });
    
    // Check if it's using Magic Patterns UI
    const calendarUI = await page.evaluate(() => {
      // Look for Magic Patterns specific elements
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const magicPatternsElements = {
        hasDiscoverCalendars: headings.some(h => h.textContent?.includes('Discover Calendars')),
        hasFeaturedCalendars: headings.some(h => h.textContent?.includes('Featured Calendars')),
        hasCalendarCards: document.querySelectorAll('[class*="calendar"], [class*="card"]').length,
        hasFilters: !!document.querySelector('[class*="filter"], [class*="sidebar"]'),
        hasSearchBar: !!document.querySelector('input[type="search"], input[placeholder*="search"]'),
        hasCategoryButtons: document.querySelectorAll('button, [class*="category"]').length
      };
      
      // Get actual text content
      const headingTexts = headings.map(h => h.textContent?.trim());
      const mainContent = document.body.textContent?.substring(0, 1000);
      
      return {
        magicPatternsElements,
        headings: headingTexts,
        mainContent,
        pageTitle: document.title
      };
    });
    
    console.log('Calendar UI Analysis:');
    console.log('===================');
    console.log('Magic Patterns Elements:', calendarUI.magicPatternsElements);
    console.log('Headings found:', calendarUI.headings);
    console.log('Page title:', calendarUI.pageTitle);
    console.log('Main content sample:', calendarUI.mainContent.substring(0, 200));
    
    // Check calendar marketplace page
    console.log('\n🏪 Checking /calendars/marketplace page...');
    await page.goto('https://goeventversion2-production.up.railway.app/calendars/marketplace', { waitUntil: 'networkidle0' });
    
    const marketplaceUI = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
      const mainContent = document.body.textContent?.substring(0, 1000);
      const calendarCards = document.querySelectorAll('[class*="calendar"], [class*="card"]');
      
      return {
        headings,
        mainContent,
        calendarCardsCount: calendarCards.length,
        pageTitle: document.title
      };
    });
    
    console.log('Marketplace UI Analysis:');
    console.log('========================');
    console.log('Headings found:', marketplaceUI.headings);
    console.log('Calendar cards found:', marketplaceUI.calendarCardsCount);
    console.log('Page title:', marketplaceUI.pageTitle);
    console.log('Main content sample:', marketplaceUI.mainContent.substring(0, 200));
    
    // Take screenshots
    console.log('\n📸 Taking screenshots...');
    await page.goto('https://goeventversion2-production.up.railway.app/calendars', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'calendars-page-current.png', fullPage: true });
    
    await page.goto('https://goeventversion2-production.up.railway.app/calendars/marketplace', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'calendars-marketplace-current.png', fullPage: true });
    
    console.log('Screenshots saved as calendars-page-current.png and calendars-marketplace-current.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

checkCalendarUI();
