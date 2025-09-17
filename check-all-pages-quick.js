const puppeteer = require('puppeteer');

async function checkAllPagesQuick() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const pages = [
    { name: 'Tickets', url: '/tickets' },
    { name: 'Book-It', url: '/book-it' },
    { name: 'Performers', url: '/performers' },
    { name: 'Venues', url: '/venues' },
    { name: 'Events', url: '/events' }
  ];
  
  try {
    console.log('🔍 Quick check of all pages...\n');
    
    for (const pageInfo of pages) {
      console.log(`📄 Checking ${pageInfo.name} page...`);
      await page.goto(`https://goeventversion2-production.up.railway.app${pageInfo.url}`, { waitUntil: 'networkidle0' });
      
      const pageData = await page.evaluate(() => {
        const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
        const mainGrid = grids.find(grid => grid.children.length > 0);
        
        if (!mainGrid) return { found: false, totalCards: 0 };
        
        const cards = Array.from(mainGrid.children).map(card => ({
          hasImage: !!card.querySelector('img'),
          hasTitle: !!card.querySelector('h3'),
          hasDescription: !!card.querySelector('p'),
          textContent: card.textContent?.trim().substring(0, 100)
        }));
        
        return {
          found: true,
          totalCards: cards.length,
          sampleCards: cards.slice(0, 2)
        };
      });
      
      console.log(`  - Cards found: ${pageData.totalCards}`);
      console.log(`  - Sample content: ${JSON.stringify(pageData.sampleCards.map(c => c.textContent))}`);
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

checkAllPagesQuick();
