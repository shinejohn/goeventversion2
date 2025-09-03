#!/usr/bin/env node

/**
 * Create Missing Routes for Magic Patterns Pages
 * 
 * This script:
 * 1. Finds all Magic Patterns page components
 * 2. Checks which routes are missing
 * 3. Creates route files with proper SSR structure
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const MAGIC_PATTERNS_DIR = path.join(process.cwd(), 'apps/web/app/components/magic-patterns/pages');
const ROUTES_DIR = path.join(process.cwd(), 'apps/web/app/routes');

// Route mappings for Magic Patterns pages
const routeMappings = {
  // Public pages
  'AboutPage.tsx': 'about/index.tsx',
  'ContactUsPage.tsx': 'contact/index.tsx',
  'HowItWorksPage.tsx': 'how-it-works/index.tsx',
  'CareersPage.tsx': 'careers/index.tsx',
  'PressMediaPage.tsx': 'press/index.tsx',
  'SuccessStoriesPage.tsx': 'success-stories/index.tsx',
  'CommunityImpactPage.tsx': 'community-impact/index.tsx',
  'PartnerWithUsPage.tsx': 'partner/index.tsx',
  
  // Advertise pages
  'AdvertisePage.tsx': 'advertise/index.tsx',
  'AdvertisingSolutionsPage.tsx': 'advertising-solutions/index.tsx',
  'advertise/AdPackagesPage.tsx': 'advertise/packages/index.tsx',
  'advertise/EmailCampaignsPage.tsx': 'advertise/email-campaigns/index.tsx',
  'advertise/EventPromotionPage.tsx': 'advertise/event-promotion/index.tsx',
  'advertise/FeaturedListingsPage.tsx': 'advertise/featured-listings/index.tsx',
  'advertise/HomepageShowcasePage.tsx': 'advertise/homepage-showcase/index.tsx',
  
  // BookIt pages
  'BookItPage.tsx': 'book-it/index.tsx',
  'book-it/VenueMarketplacePage.tsx': 'book-it/venues/index.tsx',
  'book-it/GigMarketplacePage.tsx': 'book-it/gigs/index.tsx',
  'book-it/venues/VenueDetailPage.tsx': 'book-it/venues/$id/index.tsx',
  'book-it/venues/BookingRequestPage.tsx': 'book-it/venues/$id/book/index.tsx',
  
  // Gear/Marketplace
  'GearPage.tsx': 'gear/index.tsx',
  
  // Social pages
  'social/MessagesPage.tsx': 'messages/index.tsx',
  'social/NotificationsPage.tsx': 'notifications/index.tsx',
  
  // Help pages
  'help.tsx': 'help/index.tsx',
  
  // Booking pages
  'BookingMarketplacePage.tsx': 'bookings/index.tsx',
  'bookings/BookingConfirmationPage.tsx': 'bookings/confirmation/index.tsx',
  
  // Calendar pages
  'CalendarPage.tsx': 'calendars/index.tsx',
  'calendars/CalendarSharingSettingsPage.tsx': 'calendars/sharing/index.tsx',
  
  // Tickets
  'TicketsPage.tsx': 'tickets/index.tsx',
  'tickets/TicketDetailPage.tsx': 'tickets/$id/index.tsx',
  'tickets/TicketMarketplacePage.tsx': 'tickets/marketplace/index.tsx',
};

// Route template
function createRouteTemplate(pageName, importPath, routePath) {
  const componentName = pageName.replace('.tsx', '');
  const relativePath = importPath.replace('apps/web/app/components/magic-patterns/pages/', '');
  
  return `import { ${componentName} } from '~/components/magic-patterns/pages/${relativePath}';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/${routePath.replace('/index.tsx', '').replace('.tsx', '')}/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: '${componentName.replace('Page', '')} - GoEventCity',
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events and experiences in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData
export default function ${componentName.replace('Page', '')}Route(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <${componentName} />;
}
`;
}

// Stats
const stats = {
  pagesFound: 0,
  routesCreated: 0,
  routesExist: 0,
  errors: []
};

// Main execution
async function main() {
  console.log('🔍 Finding Magic Patterns pages...\n');
  
  // Find all page components
  const pageFiles = glob.sync(path.join(MAGIC_PATTERNS_DIR, '**/*Page.tsx'))
    .concat(glob.sync(path.join(MAGIC_PATTERNS_DIR, '**/page.tsx')))
    .concat(glob.sync(path.join(MAGIC_PATTERNS_DIR, 'help.tsx')))
    .filter(file => !file.includes('.backup') && !file.includes('.ssr-backup'));
  
  stats.pagesFound = pageFiles.length;
  console.log(`Found ${stats.pagesFound} page components\n`);
  
  // Process each page
  for (const [magicPath, routePath] of Object.entries(routeMappings)) {
    const pageFile = pageFiles.find(f => f.endsWith(magicPath));
    if (!pageFile) continue;
    
    const routeFile = path.join(ROUTES_DIR, routePath);
    const routeDir = path.dirname(routeFile);
    
    // Check if route already exists
    if (fs.existsSync(routeFile)) {
      stats.routesExist++;
      console.log(`✓ Route exists: ${routePath}`);
      continue;
    }
    
    try {
      // Create directory if needed
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      
      // Extract page name
      const pageName = path.basename(pageFile);
      const importPath = pageFile.replace(process.cwd() + '/', '');
      
      // Create route content
      const content = createRouteTemplate(pageName, importPath, routePath);
      
      // Write route file
      fs.writeFileSync(routeFile, content);
      stats.routesCreated++;
      console.log(`✅ Created route: ${routePath}`);
      
    } catch (error) {
      stats.errors.push({ route: routePath, error: error.message });
      console.error(`❌ Error creating ${routePath}: ${error.message}`);
    }
  }
  
  // Summary
  console.log('\n📊 Summary');
  console.log('==========');
  console.log(`Pages found: ${stats.pagesFound}`);
  console.log(`Routes already exist: ${stats.routesExist}`);
  console.log(`Routes created: ${stats.routesCreated}`);
  console.log(`Errors: ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log('\nErrors:');
    stats.errors.forEach(({ route, error }) => {
      console.log(`  - ${route}: ${error}`);
    });
  }
}

main().catch(console.error);