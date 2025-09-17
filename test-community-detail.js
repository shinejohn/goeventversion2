const puppeteer = require('puppeteer');

async function testCommunityDetail() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Testing community detail page...\n');
    
    // Test the jazz-lovers community detail page
    console.log('🎷 Testing /communities/jazz-lovers page...');
    await page.goto('https://goeventversion2-production.up.railway.app/communities/jazz-lovers', { waitUntil: 'networkidle0' });
    
    const communityDetailData = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
      
      // Check for Magic Patterns UI elements
      const magicPatternsElements = {
        hasCommunityTitle: headings.some(h => h.includes('Community') || h.includes('Jazz') || h.includes('Collective')),
        hasMemberCount: document.body.textContent?.includes('members') || document.body.textContent?.includes('Members'),
        hasThreads: document.body.textContent?.includes('thread') || document.body.textContent?.includes('Thread'),
        hasStartThreadButton: !!Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent?.includes('Start') || btn.textContent?.includes('Thread')
        ),
        hasCommunityStats: document.body.textContent?.includes('Stats') || document.body.textContent?.includes('Active'),
        hasGuidelines: document.body.textContent?.includes('Guidelines') || document.body.textContent?.includes('rules'),
        hasPopularTags: document.body.textContent?.includes('Tags') || document.body.textContent?.includes('Popular'),
        hasSearchBar: !!document.querySelector('input[type="search"], input[placeholder*="search"]'),
        hasFilterButtons: document.querySelectorAll('button, [class*="filter"]').length
      };
      
      // Get the actual content structure
      const mainContent = document.body.textContent?.substring(0, 1500);
      const pageTitle = document.title;
      const url = window.location.href;
      
      // Check for specific Magic Patterns components
      const components = {
        hasCardLayout: document.querySelectorAll('[class*="card"]').length,
        hasSidebar: !!document.querySelector('[class*="sidebar"], [class*="stats"]'),
        hasNavigationTabs: document.querySelectorAll('[class*="tab"], [class*="nav"]').length,
        hasThreadList: document.body.textContent?.includes('Looking for') || document.body.textContent?.includes('jam session')
      };
      
      return {
        headings,
        magicPatternsElements,
        components,
        mainContent,
        pageTitle,
        url
      };
    });
    
    console.log('Community Detail Page Analysis:');
    console.log('==============================');
    console.log('Magic Patterns UI Elements:', communityDetailData.magicPatternsElements);
    console.log('Components found:', communityDetailData.components);
    console.log('Headings found:', communityDetailData.headings);
    console.log('Page title:', communityDetailData.pageTitle);
    console.log('URL:', communityDetailData.url);
    console.log('\nMain content sample:');
    console.log(communityDetailData.mainContent.substring(0, 500));
    
    // Take screenshot
    await page.screenshot({ path: 'jazz-lovers-community-detail.png', fullPage: true });
    console.log('\n📸 Screenshot saved as jazz-lovers-community-detail.png');
    
    // Test another community
    console.log('\n🏢 Testing /communities/hub-7 page...');
    await page.goto('https://goeventversion2-production.up.railway.app/communities/hub-7', { waitUntil: 'networkidle0' });
    
    const hub7Data = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
      const mainContent = document.body.textContent?.substring(0, 500);
      
      return {
        headings,
        mainContent,
        pageTitle: document.title,
        url: window.location.href
      };
    });
    
    console.log('Hub-7 Community Analysis:');
    console.log('=========================');
    console.log('Headings found:', hub7Data.headings);
    console.log('Page title:', hub7Data.pageTitle);
    console.log('URL:', hub7Data.url);
    console.log('Main content sample:', hub7Data.mainContent.substring(0, 300));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

testCommunityDetail();
