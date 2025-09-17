const puppeteer = require('puppeteer');

async function checkCommunityDetailPages() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Checking community detail pages...\n');
    
    // First, get a community ID from the hubs page
    console.log('🏘️ Getting community ID from hubs page...');
    await page.goto('https://goeventversion2-production.up.railway.app/hubs', { waitUntil: 'networkidle0' });
    
    const hubData = await page.evaluate(() => {
      const hubLinks = Array.from(document.querySelectorAll('a[href*="/hub/"]'));
      return hubLinks.map(link => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim()
      }));
    });
    
    console.log('Hub links found:', hubData);
    
    if (hubData.length > 0) {
      const hubId = hubData[0].href.replace('/hub/', '');
      console.log(`\n🔗 Testing community detail page with ID: ${hubId}`);
      
      // Try to navigate to the community detail page
      await page.goto(`https://goeventversion2-production.up.railway.app/hub/${hubId}`, { waitUntil: 'networkidle0' });
      
      const communityDetailData = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.textContent?.trim());
        const hasMagicPatternsUI = {
          hasCommunityTitle: headings.some(h => h.includes('Community') || h.includes('Hub')),
          hasMemberCount: document.body.textContent?.includes('members') || document.body.textContent?.includes('Members'),
          hasThreads: document.body.textContent?.includes('thread') || document.body.textContent?.includes('Thread'),
          hasStartThreadButton: !!document.querySelector('button:contains("Start"), button:contains("Thread")'),
          hasCommunityStats: document.body.textContent?.includes('Stats') || document.body.textContent?.includes('Active'),
          hasGuidelines: document.body.textContent?.includes('Guidelines') || document.body.textContent?.includes('rules'),
          hasPopularTags: document.body.textContent?.includes('Tags') || document.body.textContent?.includes('Popular')
        };
        
        const mainContent = document.body.textContent?.substring(0, 1000);
        const pageTitle = document.title;
        
        return {
          headings,
          hasMagicPatternsUI,
          mainContent,
          pageTitle,
          url: window.location.href
        };
      });
      
      console.log('Community Detail Page Analysis:');
      console.log('==============================');
      console.log('Magic Patterns UI Elements:', communityDetailData.hasMagicPatternsUI);
      console.log('Headings found:', communityDetailData.headings);
      console.log('Page title:', communityDetailData.pageTitle);
      console.log('URL:', communityDetailData.url);
      console.log('Main content sample:', communityDetailData.mainContent.substring(0, 300));
      
      // Take screenshot
      await page.screenshot({ path: 'community-detail-page.png', fullPage: true });
      console.log('Screenshot saved as community-detail-page.png');
      
    } else {
      console.log('❌ No hub links found - cannot test community detail pages');
    }
    
    // Also check if there are any community routes defined
    console.log('\n🔍 Checking for community routes...');
    await page.goto('https://goeventversion2-production.up.railway.app/communities', { waitUntil: 'networkidle0' });
    
    const communityRoutesData = await page.evaluate(() => {
      const communityLinks = Array.from(document.querySelectorAll('a[href*="/community/"], a[href*="/communities/"]'));
      return {
        communityLinks: communityLinks.map(link => ({
          href: link.getAttribute('href'),
          text: link.textContent?.trim()
        })),
        hasCommunityDetailUI: document.body.textContent?.includes('Community') && 
                             document.body.textContent?.includes('members') &&
                             document.body.textContent?.includes('thread')
      };
    });
    
    console.log('Community Routes Analysis:');
    console.log('=========================');
    console.log('Community links found:', communityRoutesData.communityLinks);
    console.log('Has community detail UI:', communityRoutesData.hasCommunityDetailUI);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

checkCommunityDetailPages();
