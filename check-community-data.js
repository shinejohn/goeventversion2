const puppeteer = require('puppeteer');

async function checkCommunityData() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking community/hub pages data loading...\n');
    
    // Check hubs listing page
    console.log('🏘️ Checking /hubs page...');
    await page.goto('https://goeventversion2-production.up.railway.app/hubs', { waitUntil: 'networkidle0' });
    
    const hubsData = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const hubGrid = grids.find(grid => 
        grid.textContent?.includes('Hub') || 
        grid.textContent?.includes('Community') ||
        grid.textContent?.includes('Creator')
      );
      
      if (!hubGrid) return { found: false };
      
      const hubCards = Array.from(hubGrid.children).map(card => ({
        hasImage: !!card.querySelector('img'),
        hasTitle: !!card.querySelector('h3'),
        hasDescription: !!card.querySelector('p'),
        textContent: card.textContent?.trim().substring(0, 200)
      }));
      
      return {
        found: true,
        totalCards: hubCards.length,
        cards: hubCards.slice(0, 3)
      };
    });
    
    console.log('Hubs data:', hubsData);
    
    // Check if we can navigate to a specific hub
    if (hubsData.found && hubsData.totalCards > 0) {
      console.log('\n🔗 Testing hub detail page navigation...');
      
      // Try to find a hub link and click it
      const hubLink = await page.$('a[href*="/hub/"]');
      if (hubLink) {
        const href = await hubLink.getAttribute('href');
        console.log('Found hub link:', href);
        
        // Navigate to the hub detail page
        await page.goto(`https://goeventversion2-production.up.railway.app${href}`, { waitUntil: 'networkidle0' });
        
        const hubDetailData = await page.evaluate(() => {
          const title = document.querySelector('h1')?.textContent?.trim();
          const description = document.querySelector('p')?.textContent?.trim();
          const hasImage = !!document.querySelector('img');
          
          return {
            title,
            description,
            hasImage,
            pageTitle: document.title
          };
        });
        
        console.log('Hub detail data:', hubDetailData);
      } else {
        console.log('No hub links found');
      }
    }
    
    // Check communities page (if different from hubs)
    console.log('\n🏘️ Checking /communities page...');
    await page.goto('https://goeventversion2-production.up.railway.app/communities', { waitUntil: 'networkidle0' });
    
    const communitiesData = await page.evaluate(() => {
      const grids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const communityGrid = grids.find(grid => 
        grid.textContent?.includes('Community') || 
        grid.textContent?.includes('Hub') ||
        grid.textContent?.includes('Creator')
      );
      
      if (!communityGrid) return { found: false };
      
      const communityCards = Array.from(communityGrid.children).map(card => ({
        hasImage: !!card.querySelector('img'),
        hasTitle: !!card.querySelector('h3'),
        hasDescription: !!card.querySelector('p'),
        textContent: card.textContent?.trim().substring(0, 200)
      }));
      
      return {
        found: true,
        totalCards: communityCards.length,
        cards: communityCards.slice(0, 3)
      };
    });
    
    console.log('Communities data:', communitiesData);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

checkCommunityData();
