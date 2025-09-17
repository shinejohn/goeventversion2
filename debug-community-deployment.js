const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const RAILWAY_APP_URL = 'https://when-the-fun-production.up.railway.app';
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCommunityDeployment() {
  console.log('Debugging community detail pages deployment...');
  console.log('='.repeat(50));
  
  // First, get some actual community slugs from database
  const { data: communities } = await supabase
    .from('communities')
    .select('slug, name')
    .limit(5);
  
  console.log('Available communities:', communities);
  
  // Test URLs to check
  const testUrls = [
    '/community/magic-patterns-tech-talks',
    '/community/bayarea-ai-sports-adventures',
    '/community/bayareahikingcycling'
  ];
  
  // Add actual slugs from database
  if (communities && communities.length > 0) {
    communities.forEach(community => {
      if (community.slug) {
        testUrls.push(`/community/${community.slug}`);
      }
    });
  }
  
  // Check each URL
  for (const path of testUrls) {
    await checkCommunityPage(path);
  }
}

async function checkCommunityPage(path) {
  return new Promise((resolve) => {
    const url = `${RAILWAY_APP_URL}${path}`;
    console.log(`\nChecking: ${url}`);
    console.log('-'.repeat(40));
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DeploymentChecker/1.0)',
        'Accept': 'text/html',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      let data = '';
      
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Cache Header: ${res.headers['cache-control']}`);
      console.log(`Last Modified: ${res.headers['last-modified']}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Analyze the response
        const analysis = {
          hasOldError: data.includes('Community Not Found') || data.includes('404'),
          hasMagicPatternsUI: data.includes('Magic Patterns') || data.includes('thread') || data.includes('guidelines'),
          hasThreadsSection: data.includes('Thread Title') || data.includes('threads-section'),
          hasStatsSection: data.includes('Members') && data.includes('Threads'),
          hasGuidelinesSection: data.includes('Community Guidelines'),
          contentLength: data.length
        };
        
        console.log(`Analysis:`, analysis);
        
        // Extract and show title
        const titleMatch = data.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
          console.log(`Page Title: ${titleMatch[1]}`);
        }
        
        // Show a snippet of the content
        const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          const textContent = bodyMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 300);
          console.log(`Content Preview: ${textContent}...`);
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`Error: ${err.message}`);
      resolve();
    });
  });
}

// Run the debug script
debugCommunityDeployment().catch(console.error);
