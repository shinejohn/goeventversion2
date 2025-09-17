const puppeteer = require('puppeteer');

async function debugShopGrids() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Debugging shop page grids...');
    
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    
    // Find all grids on the page
    const allGrids = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      return grids.map((grid, index) => ({
        index,
        className: grid.className,
        children: grid.children.length,
        textContent: grid.textContent?.substring(0, 200),
        innerHTML: grid.innerHTML.substring(0, 300)
      }));
    });
    
    console.log('All grids found:', allGrids.length);
    allGrids.forEach((grid, i) => {
      console.log(`Grid ${i}:`, {
        className: grid.className,
        children: grid.children,
        textContent: grid.textContent
      });
    });
    
    // Look specifically for product-related content
    const productGrids = allGrids.filter(grid => 
      grid.textContent?.includes('T-Shirt') || 
      grid.textContent?.includes('Hoodie') ||
      grid.textContent?.includes('Cap') ||
      grid.textContent?.includes('Mug')
    );
    
    console.log('Product grids found:', productGrids.length);
    productGrids.forEach((grid, i) => {
      console.log(`Product Grid ${i}:`, grid.textContent);
    });
    
    // Check if there are any product cards
    const productCards = await page.$$eval('[class*="product"], .product-card, [data-test*="product"]', els => 
      els.map(el => ({
        text: el.textContent?.substring(0, 100),
        className: el.className
      }))
    );
    
    console.log('Product cards found:', productCards.length);
    productCards.forEach((card, i) => {
      console.log(`Card ${i}:`, card.text);
    });
    
    // Check the actual structure of the page
    const pageStructure = await page.evaluate(() => {
      const body = document.body;
      const main = body.querySelector('main, [role="main"], .min-h-screen');
      
      return {
        bodyChildren: body.children.length,
        mainChildren: main?.children.length || 0,
        mainHTML: main?.innerHTML.substring(0, 1000) || 'No main found'
      };
    });
    
    console.log('Page structure:', pageStructure);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

debugShopGrids();
