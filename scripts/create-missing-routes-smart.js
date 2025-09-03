#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Enhanced route mappings with component path info
const routeMappings = {
  'AboutPage.tsx': 'about/index.tsx',
  'ContactUsPage.tsx': 'contact/index.tsx',
  'advertise/AdPackagesPage.tsx': 'advertise/packages/index.tsx',
  'advertise/EmailCampaignsPage.tsx': 'advertise/email-campaigns/index.tsx',
  'advertise/EventPromotionPage.tsx': 'advertise/event-promotion/index.tsx',
  'advertise/FeaturedListingsPage.tsx': 'advertise/featured-listings/index.tsx',
  'advertise/HomepageShowcasePage.tsx': 'advertise/homepage-showcase/index.tsx',
  'AdvertisePage.tsx': 'advertise/index.tsx',
  'AdvertisingSolutionsPage.tsx': 'advertising-solutions/index.tsx',
  'booking/BookItPage.tsx': 'book-it/index.tsx',
  'booking/GigsPage.tsx': 'book-it/gigs/index.tsx',
  'booking/BookVenuePage.tsx': 'book-it/venues/index.tsx',
  'booking/VenueBookingPage.tsx': 'book-it/venues/$id/book/index.tsx',
  'booking/BookingsPage.tsx': 'bookings/index.tsx',
  'booking/ConfirmationPage.tsx': 'bookings/confirmation/index.tsx',
  'CalendarsPage.tsx': 'calendars/index.tsx',
  'CareersPage.tsx': 'careers/index.tsx',
  'CommunityImpactPage.tsx': 'community-impact/index.tsx',
  'EventsPage.tsx': 'events/index.tsx',
  'GearPage.tsx': 'gear/index.tsx',
  'help.tsx': 'help/index.tsx',
  'HowItWorksPage.tsx': 'how-it-works/index.tsx',
  'social/MessagesPage.tsx': 'messages/index.tsx',
  'social/NotificationsPage.tsx': 'notifications/index.tsx',
  'PartnerPage.tsx': 'partner/index.tsx',
  'PerformersPage.tsx': 'performers.tsx',
  'PressPage.tsx': 'press/index.tsx',
  'SuccessStoriesPage.tsx': 'success-stories/index.tsx',
  'tickets/TicketsPage.tsx': 'tickets/index.tsx',
  'tickets/TicketDetailPage.tsx': 'tickets/$id/index.tsx',
  'tickets/TicketMarketplacePage.tsx': 'tickets/marketplace/index.tsx',
  'VenuesPage.tsx': 'venues.tsx',
  'venues/VenueDetailPage.tsx': 'venues.$id.tsx'
};

// Function to analyze component export pattern
function analyzeExportPattern(componentPath) {
  const fullPath = path.join(process.cwd(), 'apps/web/app/components/magic-patterns/pages', componentPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Component not found: ${fullPath}`);
    return { hasDefault: false, hasNamed: false, componentName: null };
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Extract component name from file path
  const fileName = path.basename(componentPath, '.tsx');
  let componentName = fileName;
  
  // Handle special cases
  if (fileName === 'help') {
    componentName = 'HelpPage'; // We know this from our fixes
  }
  
  // Check for export patterns
  const hasDefaultExport = content.includes('export default');
  const hasNamedExport = content.includes(`export const ${componentName}`) || 
                        content.includes(`export function ${componentName}`) ||
                        content.includes(`export { ${componentName} }`);
  
  // Try to detect actual component name from export const pattern
  const namedExportMatch = content.match(/export const (\w+)\s*=/);
  if (namedExportMatch) {
    componentName = namedExportMatch[1];
  }
  
  return {
    hasDefault: hasDefaultExport,
    hasNamed: hasNamedExport,
    componentName,
    fullPath
  };
}

// Function to generate import statement based on export pattern
function generateImportStatement(componentPath, routePath) {
  const analysis = analyzeExportPattern(componentPath);
  const { hasDefault, hasNamed, componentName } = analysis;
  
  const importPath = `~/components/magic-patterns/pages/${componentPath.replace('.tsx', '')}`;
  
  if (hasDefault && !hasNamed) {
    // Default export only
    return `import ${componentName} from '${importPath}';`;
  } else if (hasNamed && !hasDefault) {
    // Named export only
    return `import { ${componentName} } from '${importPath}';`;
  } else if (hasDefault && hasNamed) {
    // Both - prefer named for consistency
    return `import { ${componentName} } from '${importPath}';`;
  } else {
    // Neither found - fallback to named (safer)
    console.log(`⚠️  No clear export pattern for ${componentPath}, using named import`);
    return `import { ${componentName} } from '${importPath}';`;
  }
}

// Enhanced route template generator
function createRouteTemplate(componentPath, routePath) {
  const analysis = analyzeExportPattern(componentPath);
  const { componentName } = analysis;
  const importStatement = generateImportStatement(componentPath, routePath);
  
  // Extract route name from path for meta title
  const routeName = routePath.replace(/\/index\.tsx$/, '').replace(/\$/, '').replace(/\//g, ' ');
  const title = routeName.charAt(0).toUpperCase() + routeName.slice(1).replace(/-/g, ' ');
  
  return `${importStatement}
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes${routePath.replace('index.tsx', '').replace('.tsx', '')}/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Future: Add data fetching logic here
  return {
    title: '${title} - GoEventCity',
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
export default function ${componentName}Route(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <${componentName} />;
}
`;
}

// Main execution
console.log('🔍 Smart Route Generator - Analyzing Magic Patterns components...\n');

let createdCount = 0;
let skippedCount = 0;
let analysisReport = [];

for (const [componentPath, routePath] of Object.entries(routeMappings)) {
  const routeDir = path.dirname(routePath);
  const routeFileName = path.basename(routePath);
  const fullRouteDir = path.join(process.cwd(), 'apps/web/app/routes', routeDir);
  const fullRoutePath = path.join(fullRouteDir, routeFileName);
  
  // Analyze the component
  const analysis = analyzeExportPattern(componentPath);
  analysisReport.push({
    component: componentPath,
    route: routePath,
    ...analysis
  });
  
  // Check if route already exists
  if (fs.existsSync(fullRoutePath)) {
    console.log(`⏭️  Skipped: ${routePath} (already exists)`);
    skippedCount++;
    continue;
  }
  
  // Create directory if it doesn't exist
  if (routeDir !== '.' && !fs.existsSync(fullRouteDir)) {
    fs.mkdirSync(fullRouteDir, { recursive: true });
    console.log(`📁 Created directory: ${routeDir}`);
  }
  
  // Generate and write route file
  const routeContent = createRouteTemplate(componentPath, routePath);
  fs.writeFileSync(fullRoutePath, routeContent);
  
  console.log(`✅ Created: ${routePath} → imports ${analysis.componentName} (${analysis.hasDefault ? 'default' : 'named'})`);
  createdCount++;
}

// Summary report
console.log(`\n📊 Summary:`);
console.log(`   Created: ${createdCount} routes`);
console.log(`   Skipped: ${skippedCount} routes (already existed)`);

console.log(`\n🔍 Export Pattern Analysis:`);
const defaultExports = analysisReport.filter(r => r.hasDefault && !r.hasNamed).length;
const namedExports = analysisReport.filter(r => r.hasNamed && !r.hasDefault).length; 
const bothExports = analysisReport.filter(r => r.hasDefault && r.hasNamed).length;
const neitherExports = analysisReport.filter(r => !r.hasDefault && !r.hasNamed).length;

console.log(`   Default only: ${defaultExports}`);
console.log(`   Named only: ${namedExports}`);
console.log(`   Both: ${bothExports}`);
console.log(`   Neither detected: ${neitherExports}`);

if (neitherExports > 0) {
  console.log(`\n⚠️  Components with unclear export patterns:`);
  analysisReport
    .filter(r => !r.hasDefault && !r.hasNamed)
    .forEach(r => console.log(`   ${r.component}`));
}

console.log(`\n✨ Smart route generation complete!`);