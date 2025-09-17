const puppeteer = require('puppeteer');

const RAILWAY_APP_URL = 'https://goeventversion2-production.up.railway.app';

async function checkAllPagesData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = {
    community: { working: false, dataCount: 0, errors: [] },
    shop: { working: false, dataCount: 0, errors: [] },
    calendar: { working: false, dataCount: 0, errors: [] },
    tickets: { working: false, dataCount: 0, errors: [] },
    bookit: { working: false, dataCount: 0, errors: [] },
    performer: { working: false, dataCount: 0, errors: [] },
    venues: { working: false, dataCount: 0, errors: [] }
  };

  try {
    console.log('🔍 Comprehensive data loading check for all pages...\n');

    // Check Community/Hubs pages
    console.log('🏘️ Checking Community/Hubs pages...');
    await page.goto(`${RAILWAY_APP_URL}/hubs`, { waitUntil: 'networkidle0' });
    const hubCards = await page.$$eval('.grid > div', els => els.length);
    const hubTitles = await page.$$eval('.grid > div h3', els => els.map(el => el.textContent?.trim()));
    results.community.dataCount = hubCards;
    results.community.working = hubCards > 0 && hubTitles.some(title => title && title.length > 0);
    console.log(`  - Hub cards found: ${hubCards}`);
    console.log(`  - Hub titles: ${JSON.stringify(hubTitles.slice(0, 3))}`);

    // Check Shop page
    console.log('\n📦 Checking Shop page...');
    await page.goto(`${RAILWAY_APP_URL}/shop`, { waitUntil: 'networkidle0' });
    const shopCards = await page.$$eval('.grid > div', els => els.length);
    const shopTitles = await page.$$eval('.grid > div h3', els => els.map(el => el.textContent?.trim()));
    const shopPrices = await page.$$eval('.grid > div [class*="price"], .grid > div [class*="$"]', els => els.map(el => el.textContent?.trim()));
    results.shop.dataCount = shopCards;
    results.shop.working = shopCards > 0 && shopTitles.some(title => title && title.length > 0);
    console.log(`  - Shop cards found: ${shopCards}`);
    console.log(`  - Shop titles: ${JSON.stringify(shopTitles.slice(0, 3))}`);
    console.log(`  - Shop prices: ${JSON.stringify(shopPrices.slice(0, 3))}`);

    // Check Calendar pages
    console.log('\n📅 Checking Calendar pages...');
    await page.goto(`${RAILWAY_APP_URL}/calendars`, { waitUntil: 'networkidle0' });
    const calendarCards = await page.$$eval('.grid > div, .calendar-card, [class*="calendar"]', els => els.length);
    const calendarTitles = await page.$$eval('.grid > div h3, .calendar-card h3, [class*="calendar"] h3', els => els.map(el => el.textContent?.trim()));
    results.calendar.dataCount = calendarCards;
    results.calendar.working = calendarCards > 0 && calendarTitles.some(title => title && title.length > 0);
    console.log(`  - Calendar cards found: ${calendarCards}`);
    console.log(`  - Calendar titles: ${JSON.stringify(calendarTitles.slice(0, 3))}`);

    // Check Tickets pages
    console.log('\n🎫 Checking Tickets pages...');
    await page.goto(`${RAILWAY_APP_URL}/tickets`, { waitUntil: 'networkidle0' });
    const ticketCards = await page.$$eval('.grid > div, .ticket-card, [class*="ticket"]', els => els.length);
    const ticketTitles = await page.$$eval('.grid > div h3, .ticket-card h3, [class*="ticket"] h3', els => els.map(el => el.textContent?.trim()));
    results.tickets.dataCount = ticketCards;
    results.tickets.working = ticketCards > 0 && ticketTitles.some(title => title && title.length > 0);
    console.log(`  - Ticket cards found: ${ticketCards}`);
    console.log(`  - Ticket titles: ${JSON.stringify(ticketTitles.slice(0, 3))}`);

    // Check Book-It pages
    console.log('\n📖 Checking Book-It pages...');
    await page.goto(`${RAILWAY_APP_URL}/book-it`, { waitUntil: 'networkidle0' });
    const bookitCards = await page.$$eval('.grid > div, .venue-card, [class*="venue"]', els => els.length);
    const bookitTitles = await page.$$eval('.grid > div h3, .venue-card h3, [class*="venue"] h3', els => els.map(el => el.textContent?.trim()));
    results.bookit.dataCount = bookitCards;
    results.bookit.working = bookitCards > 0 && bookitTitles.some(title => title && title.length > 0);
    console.log(`  - Book-It cards found: ${bookitCards}`);
    console.log(`  - Book-It titles: ${JSON.stringify(bookitTitles.slice(0, 3))}`);

    // Check Performer pages
    console.log('\n🎭 Checking Performer pages...');
    await page.goto(`${RAILWAY_APP_URL}/performers`, { waitUntil: 'networkidle0' });
    const performerCards = await page.$$eval('.grid > div, .performer-card, [class*="performer"]', els => els.length);
    const performerTitles = await page.$$eval('.grid > div h3, .performer-card h3, [class*="performer"] h3', els => els.map(el => el.textContent?.trim()));
    results.performer.dataCount = performerCards;
    results.performer.working = performerCards > 0 && performerTitles.some(title => title && title.length > 0);
    console.log(`  - Performer cards found: ${performerCards}`);
    console.log(`  - Performer titles: ${JSON.stringify(performerTitles.slice(0, 3))}`);

    // Check Venues pages
    console.log('\n🏢 Checking Venues pages...');
    await page.goto(`${RAILWAY_APP_URL}/venues`, { waitUntil: 'networkidle0' });
    const venueCards = await page.$$eval('.grid > div, .venue-card, [class*="venue"]', els => els.length);
    const venueTitles = await page.$$eval('.grid > div h3, .venue-card h3, [class*="venue"] h3', els => els.map(el => el.textContent?.trim()));
    results.venues.dataCount = venueCards;
    results.venues.working = venueCards > 0 && venueTitles.some(title => title && title.length > 0);
    console.log(`  - Venue cards found: ${venueCards}`);
    console.log(`  - Venue titles: ${JSON.stringify(venueTitles.slice(0, 3))}`);

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('===========');
    Object.entries(results).forEach(([page, result]) => {
      const status = result.working ? '✅ WORKING' : '❌ BROKEN';
      console.log(`${page.toUpperCase()}: ${status} (${result.dataCount} items)`);
    });

    const workingPages = Object.values(results).filter(r => r.working).length;
    const totalPages = Object.keys(results).length;
    console.log(`\nOverall: ${workingPages}/${totalPages} pages working`);

  } catch (error) {
    console.error('❌ Error during check:', error.message);
  }
  
  await browser.close();
  return results;
}

checkAllPagesData();
