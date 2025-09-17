const puppeteer = require('puppeteer');

async function checkShopProductsLocation() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking where products are located on the shop page...\n');
    
    await page.goto('https://goeventversion2-production.up.railway.app/shop', { waitUntil: 'networkidle0' });
    
    // Check for different sections that might contain products
    const sections = await page.evaluate(() => {
      const results = {};
      
      // Look for "Featured Products" section
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const featuredHeading = headings.find(h => h.textContent?.includes('Featured Products'));
      if (featuredHeading) {
        const parent = featuredHeading.closest('div');
        results.featuredProducts = {
          found: true,
          title: featuredHeading.textContent?.trim(),
          parentClass: parent?.className,
          children: parent?.children.length || 0,
          content: parent?.textContent?.substring(0, 200)
        };
      } else {
        results.featuredProducts = { found: false };
      }
      
      // Look for any grid containing products
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const productGrids = grids.filter(grid => {
        const text = grid.textContent?.toLowerCase() || '';
        return text.includes('tshirt') || text.includes('hoodie') || text.includes('cap') || 
               text.includes('mug') || text.includes('sticker') || text.includes('poster') ||
               text.includes('$') || text.includes('price');
      });
      
      results.productGrids = productGrids.map((grid, index) => ({
        index,
        className: grid.className,
        children: grid.children.length,
        textContent: grid.textContent?.substring(0, 200),
        hasImages: Array.from(grid.querySelectorAll('img')).length,
        hasPrices: Array.from(grid.querySelectorAll('[class*="price"], [class*="$"]')).length
      }));
      
      // Look for any product cards
      const productCards = Array.from(document.querySelectorAll('[class*="product"], .product-card, [data-test*="product"]'));
      results.productCards = productCards.map((card, index) => ({
        index,
        className: card.className,
        textContent: card.textContent?.substring(0, 100),
        hasImage: !!card.querySelector('img'),
        hasPrice: !!card.querySelector('[class*="price"], [class*="$"]')
      }));
      
      // Check the main content structure
      const mainContent = document.querySelector('main, [role="main"], .min-h-screen');
      if (mainContent) {
        results.mainContent = {
          children: mainContent.children.length,
          sections: Array.from(mainContent.children).map((child, index) => ({
            index,
            tagName: child.tagName,
            className: child.className,
            textContent: child.textContent?.substring(0, 100)
          }))
        };
      }
      
      return results;
    });
    
    console.log('📊 Shop page analysis:');
    console.log('====================');
    
    console.log('\n🎯 Featured Products Section:');
    console.log(JSON.stringify(sections.featuredProducts, null, 2));
    
    console.log('\n📦 Product Grids Found:');
    sections.productGrids.forEach((grid, i) => {
      console.log(`Grid ${i}:`, {
        className: grid.className,
        children: grid.children,
        hasImages: grid.hasImages,
        hasPrices: grid.hasPrices,
        sampleText: grid.textContent
      });
    });
    
    console.log('\n🛍️ Product Cards Found:');
    sections.productCards.forEach((card, i) => {
      console.log(`Card ${i}:`, {
        className: card.className,
        hasImage: card.hasImage,
        hasPrice: card.hasPrice,
        sampleText: card.textContent
      });
    });
    
    console.log('\n🏗️ Main Content Structure:');
    if (sections.mainContent) {
      console.log(`Total children: ${sections.mainContent.children}`);
      sections.mainContent.sections.forEach((section, i) => {
        console.log(`Section ${i} (${section.tagName}): ${section.textContent}`);
      });
    }
    
    // Take a screenshot to see the current state
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: 'shop-page-current-state.png', fullPage: true });
    console.log('Screenshot saved as shop-page-current-state.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

checkShopProductsLocation();
