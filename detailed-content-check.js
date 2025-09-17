const puppeteer = require('puppeteer');

const RAILWAY_APP_URL = 'https://goeventversion2-production.up.railway.app';

async function checkDetailedContent() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Detailed content analysis...\n');

    // Check Shop page in detail
    console.log('📦 SHOP PAGE DETAILED CHECK:');
    await page.goto(`${RAILWAY_APP_URL}/shop`, { waitUntil: 'networkidle0' });
    
    // Get all text content to see what's actually there
    const shopContent = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.grid > div'));
      return cards.map((card, index) => ({
        index,
        text: card.textContent?.trim().substring(0, 200),
        hasImage: !!card.querySelector('img'),
        hasPrice: !!card.querySelector('[class*="price"], [class*="$"]'),
        hasButton: !!card.querySelector('button'),
        innerHTML: card.innerHTML.substring(0, 300)
      }));
    });
    
    console.log('Shop cards content:');
    shopContent.forEach((card, i) => {
      console.log(`  Card ${i}: ${card.text}`);
      console.log(`    Has image: ${card.hasImage}, Has price: ${card.hasPrice}, Has button: ${card.hasButton}`);
    });

    // Check if there are any actual product names
    const hasProductNames = shopContent.some(card => 
      card.text?.includes('T-Shirt') || 
      card.text?.includes('Hoodie') || 
      card.text?.includes('Cap') ||
      card.text?.includes('Mug')
    );
    console.log(`\nHas actual product names: ${hasProductNames}`);

    // Check Hubs page in detail
    console.log('\n🏘️ HUBS PAGE DETAILED CHECK:');
    await page.goto(`${RAILWAY_APP_URL}/hubs`, { waitUntil: 'networkidle0' });
    
    const hubContent = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.grid > div'));
      return cards.map((card, index) => ({
        index,
        text: card.textContent?.trim().substring(0, 200),
        hasImage: !!card.querySelector('img'),
        hasDescription: !!card.querySelector('p'),
        innerHTML: card.innerHTML.substring(0, 300)
      }));
    });
    
    console.log('Hub cards content:');
    hubContent.slice(0, 3).forEach((card, i) => {
      console.log(`  Card ${i}: ${card.text}`);
      console.log(`    Has image: ${card.hasImage}, Has description: ${card.hasDescription}`);
    });

    // Check if there are any actual hub names
    const hasHubNames = hubContent.some(card => 
      card.text?.includes('Community') || 
      card.text?.includes('Hub') ||
      card.text?.includes('Creator')
    );
    console.log(`\nHas actual hub names: ${hasHubNames}`);

    // Check Events page
    console.log('\n🎪 EVENTS PAGE DETAILED CHECK:');
    await page.goto(`${RAILWAY_APP_URL}/events`, { waitUntil: 'networkidle0' });
    
    const eventContent = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.grid > div, .event-card, [class*="event"]'));
      return cards.map((card, index) => ({
        index,
        text: card.textContent?.trim().substring(0, 200),
        hasImage: !!card.querySelector('img'),
        hasDate: !!card.querySelector('[class*="date"], [class*="time"]'),
        innerHTML: card.innerHTML.substring(0, 300)
      }));
    });
    
    console.log('Event cards content:');
    eventContent.slice(0, 3).forEach((card, i) => {
      console.log(`  Card ${i}: ${card.text}`);
      console.log(`    Has image: ${card.hasImage}, Has date: ${card.hasDate}`);
    });

    // Check if there are any actual event names
    const hasEventNames = eventContent.some(card => 
      card.text?.includes('Concert') || 
      card.text?.includes('Festival') ||
      card.text?.includes('Show') ||
      card.text?.includes('Event')
    );
    console.log(`\nHas actual event names: ${hasEventNames}`);

  } catch (error) {
    console.error('❌ Error during detailed check:', error.message);
  }
  
  await browser.close();
}

checkDetailedContent();
