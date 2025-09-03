#!/usr/bin/env node

/**
 * Magic Patterns Component Connector
 * 
 * Connects all existing Magic Patterns components to our newly created route files
 * and creates additional routes for any remaining unused components
 */

const fs = require('fs');
const path = require('path');

class MagicPatternsComponentConnector {
  constructor() {
    this.magicPatternsComponents = new Map();
    this.existingRoutes = new Set();
    this.createdConnections = [];
    this.errors = [];
  }

  async connect() {
    console.log('🔗 MAGIC PATTERNS COMPONENT CONNECTOR');
    console.log('=====================================');
    console.log('🎯 Connecting all Magic Patterns components to routes...\n');
    
    // 1. Discover all Magic Patterns components
    await this.discoverMagicPatternsComponents();
    
    // 2. Discover existing routes
    await this.discoverExistingRoutes();
    
    // 3. Connect components to existing routes
    await this.connectComponentsToRoutes();
    
    // 4. Create routes for remaining components
    await this.createMissingRoutes();
    
    // 5. Update routes configuration
    await this.updateRoutesConfiguration();
    
    // 6. Generate completion report
    this.generateCompletionReport();
  }

  async discoverMagicPatternsComponents() {
    console.log('🔍 Discovering Magic Patterns components...');
    
    const componentsDir = 'apps/web/app/components/magic-patterns';
    await this.scanDirectory(componentsDir, '');
    
    console.log(`   ✅ Found ${this.magicPatternsComponents.size} Magic Patterns components\n`);
  }

  async scanDirectory(dir, relativePath) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !entry.startsWith('.')) {
        await this.scanDirectory(fullPath, path.join(relativePath, entry));
      } else if (entry.endsWith('.tsx') && !entry.includes('.ssr-backup') && entry !== 'index.tsx') {
        await this.analyzeComponent(fullPath, relativePath);
      }
    }
  }

  async analyzeComponent(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.tsx');
      
      // Extract component name and export info
      const exportMatch = content.match(/export\s+(?:const|function)\s+(\w+)/);
      const componentName = exportMatch ? exportMatch[1] : fileName;
      
      const componentInfo = {
        name: componentName,
        fileName: fileName,
        filePath: path.relative('apps/web/app', filePath),
        relativePath: relativePath,
        category: this.categorizeComponent(relativePath, fileName),
        hasState: content.includes('useState'),
        hasEffects: content.includes('useEffect'),
        hasForm: this.hasFormElements(content),
        complexity: this.assessComplexity(content),
        isPage: fileName.includes('Page') || fileName.includes('page'),
        isModal: fileName.includes('Modal') || fileName.includes('modal'),
        isDashboard: fileName.includes('Dashboard') || fileName.includes('dashboard'),
        needsRoute: this.needsRoute(componentName, content, relativePath)
      };
      
      this.magicPatternsComponents.set(componentName, componentInfo);
      
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
    }
  }

  categorizeComponent(relativePath, fileName) {
    const pathLower = relativePath.toLowerCase();
    const nameLower = fileName.toLowerCase();
    
    // Authentication
    if (pathLower.includes('auth') || nameLower.includes('auth') || nameLower.includes('login') || 
        nameLower.includes('signup') || nameLower.includes('password')) {
      return 'authentication';
    }
    
    // Payment & Billing
    if (pathLower.includes('billing') || pathLower.includes('payment') || pathLower.includes('checkout') ||
        nameLower.includes('billing') || nameLower.includes('payment') || nameLower.includes('invoice') ||
        nameLower.includes('subscription') || nameLower.includes('pricing')) {
      return 'payment-financial';
    }
    
    // Dashboards
    if (nameLower.includes('dashboard')) {
      if (nameLower.includes('venue') || nameLower.includes('owner')) return 'venue-owner-dashboard';
      if (nameLower.includes('performer') || nameLower.includes('artist') || nameLower.includes('fan')) return 'performer-dashboard';
      if (nameLower.includes('organizer') || nameLower.includes('coordinator')) return 'coordinator-dashboard';
      if (nameLower.includes('admin') || nameLower.includes('management')) return 'admin-dashboard';
      return 'general-dashboard';
    }
    
    // Profile & Settings
    if (pathLower.includes('profile') || pathLower.includes('settings') || 
        nameLower.includes('profile') || nameLower.includes('settings') || 
        nameLower.includes('preferences') || nameLower.includes('privacy')) {
      return 'user-profile-settings';
    }
    
    // Booking
    if (pathLower.includes('booking') || nameLower.includes('booking') || 
        nameLower.includes('reservation') || nameLower.includes('calendar')) {
      return 'booking-system';
    }
    
    // Events & Venues
    if (pathLower.includes('events') || pathLower.includes('venues') || 
        nameLower.includes('event') || nameLower.includes('venue')) {
      return 'event-venue-management';
    }
    
    // Hub & Community
    if (pathLower.includes('hub') || pathLower.includes('community') || 
        nameLower.includes('hub') || nameLower.includes('community')) {
      return 'community-hub';
    }
    
    return 'general-ui';
  }

  hasFormElements(content) {
    const formElements = ['input', 'textarea', 'select', 'form', 'onSubmit', 'FormData'];
    return formElements.some(element => content.includes(element));
  }

  assessComplexity(content) {
    let score = 0;
    score += (content.match(/useState/g) || []).length * 2;
    score += (content.match(/useEffect/g) || []).length * 3;
    score += (content.match(/useContext/g) || []).length * 2;
    score += (content.match(/fetch|api|axios/g) || []).length * 2;
    score += (content.match(/if\s*\(/g) || []).length;
    score += (content.match(/map\s*\(/g) || []).length;
    
    if (score <= 5) return 'Simple';
    if (score <= 15) return 'Moderate'; 
    if (score <= 30) return 'Complex';
    return 'Very Complex';
  }

  needsRoute(componentName, content, relativePath) {
    return componentName.includes('Page') || 
           componentName.includes('Dashboard') || 
           componentName.includes('Editor') ||
           content.includes('useLoaderData') ||
           (content.includes('Form') && content.includes('action')) ||
           relativePath.includes('pages/');
  }

  async discoverExistingRoutes() {
    console.log('📋 Discovering existing routes...');
    
    const routesDir = 'apps/web/app/routes';
    await this.scanRoutesDirectory(routesDir);
    
    console.log(`   ✅ Found ${this.existingRoutes.size} existing route files\n`);
  }

  async scanRoutesDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await this.scanRoutesDirectory(fullPath);
      } else if (entry.endsWith('.tsx')) {
        const routePath = path.relative('apps/web/app/routes', fullPath);
        this.existingRoutes.add(routePath);
      }
    }
  }

  async connectComponentsToRoutes() {
    console.log('🔗 Connecting components to existing routes...');
    
    let connectionsCount = 0;
    
    for (const [componentName, componentInfo] of this.magicPatternsComponents.entries()) {
      const matchingRoute = this.findMatchingRoute(componentName, componentInfo);
      
      if (matchingRoute) {
        await this.updateRouteFile(matchingRoute, componentInfo);
        connectionsCount++;
        this.createdConnections.push({
          component: componentName,
          route: matchingRoute,
          category: componentInfo.category
        });
      }
    }
    
    console.log(`   ✅ Connected ${connectionsCount} components to existing routes\n`);
  }

  findMatchingRoute(componentName, componentInfo) {
    // Try to find exact matches first
    for (const routePath of this.existingRoutes) {
      const routeName = path.basename(routePath, '.tsx');
      
      // Direct name matches
      if (routeName.toLowerCase().includes(componentName.toLowerCase()) ||
          componentName.toLowerCase().includes(routeName.toLowerCase())) {
        return routePath;
      }
      
      // Category-based matches
      if (this.categoryMatches(componentInfo.category, routePath)) {
        return routePath;
      }
    }
    
    return null;
  }

  categoryMatches(category, routePath) {
    const pathLower = routePath.toLowerCase();
    
    switch (category) {
      case 'authentication':
        return pathLower.includes('auth');
      case 'payment-financial':
        return pathLower.includes('billing') || pathLower.includes('payment') || pathLower.includes('checkout');
      case 'venue-owner-dashboard':
        return pathLower.includes('dashboard/venue-owner');
      case 'performer-dashboard':
        return pathLower.includes('dashboard/performer') || pathLower.includes('dashboard/fan');
      case 'coordinator-dashboard':
        return pathLower.includes('dashboard/organizer');
      case 'admin-dashboard':
        return pathLower.includes('admin');
      case 'user-profile-settings':
        return pathLower.includes('profile') || pathLower.includes('settings');
      case 'booking-system':
        return pathLower.includes('booking') || pathLower.includes('book/');
      case 'event-venue-management':
        return pathLower.includes('events') || pathLower.includes('venues');
      default:
        return false;
    }
  }

  async updateRouteFile(routePath, componentInfo) {
    try {
      const fullPath = `apps/web/app/routes/${routePath}`;
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if component is already imported
      const componentImport = `import { ${componentInfo.name} } from '~/${componentInfo.filePath.replace('.tsx', '')}';`;
      
      if (!content.includes(`import { ${componentInfo.name} }`)) {
        // Add import after existing imports
        const importInsertPoint = content.lastIndexOf('import ');
        if (importInsertPoint !== -1) {
          const lineEnd = content.indexOf('\n', importInsertPoint);
          content = content.slice(0, lineEnd + 1) + componentImport + '\n' + content.slice(lineEnd + 1);
        }
      }
      
      // Replace placeholder component with actual Magic Patterns component
      if (content.includes('TODO: Pass proper props from loader data')) {
        const returnStatementRegex = /return\s+<div className="p-8">[\s\S]*?<\/div>;/;
        content = content.replace(returnStatementRegex, `return <${componentInfo.name} />;`);
      } else if (content.includes('return (')) {
        // Update return statement to use the component
        content = content.replace(
          /return \(\s*<div[^>]*>[\s\S]*?<\/div>\s*\);/,
          `return <${componentInfo.name} />;`
        );
      }
      
      fs.writeFileSync(fullPath, content);
      
    } catch (error) {
      this.errors.push({
        component: componentInfo.name,
        route: routePath,
        error: error.message
      });
    }
  }

  async createMissingRoutes() {
    console.log('📝 Creating routes for remaining components...');
    
    const unconnectedComponents = [];
    
    for (const [componentName, componentInfo] of this.magicPatternsComponents.entries()) {
      const isConnected = this.createdConnections.some(conn => conn.component === componentName);
      
      if (!isConnected && componentInfo.needsRoute) {
        unconnectedComponents.push(componentInfo);
      }
    }
    
    console.log(`   📊 Found ${unconnectedComponents.length} components needing new routes`);
    
    for (const componentInfo of unconnectedComponents) {
      await this.createNewRoute(componentInfo);
    }
    
    console.log(`   ✅ Created routes for remaining components\n`);
  }

  async createNewRoute(componentInfo) {
    try {
      const routePath = this.generateRoutePath(componentInfo);
      const fullPath = `apps/web/app/routes/${routePath}`;
      
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const content = this.generateRouteContent(componentInfo, routePath);
      fs.writeFileSync(fullPath, content);
      
      this.createdConnections.push({
        component: componentInfo.name,
        route: routePath,
        category: componentInfo.category,
        isNewRoute: true
      });
      
    } catch (error) {
      this.errors.push({
        component: componentInfo.name,
        error: error.message
      });
    }
  }

  generateRoutePath(componentInfo) {
    const { name, category, isDashboard, isModal } = componentInfo;
    
    // Generate route path based on category and component type
    let routePath = '';
    
    if (isDashboard) {
      routePath = `dashboard/${name.toLowerCase().replace('dashboard', '').replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
    } else if (isModal) {
      routePath = `modals/${name.toLowerCase().replace('modal', '').replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
    } else {
      switch (category) {
        case 'authentication':
          routePath = `auth/${name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
          break;
        case 'payment-financial':
          routePath = `billing/${name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
          break;
        case 'user-profile-settings':
          routePath = `profile/${name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
          break;
        case 'booking-system':
          routePath = `booking/${name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
          break;
        case 'event-venue-management':
          routePath = `events/${name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
          break;
        case 'community-hub':
          routePath = `hubs/${name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
          break;
        default:
          routePath = `misc/${name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}.tsx`;
      }
    }
    
    return routePath.replace(/^-/, '');
  }

  generateRouteContent(componentInfo, routePath) {
    const { name, filePath, category, hasForm } = componentInfo;
    
    const loaderCode = `
export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // TODO: Implement data loading for ${name}
  return { data: {} };
};`;

    const actionCode = hasForm ? `

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // TODO: Implement form handling for ${name}
  return { success: true };
};` : '';

    return `import type { Route } from '~/types/app/routes/${routePath.replace('.tsx', '').replace(/\$/g, '$').replace(/\//g, '/')}';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ${name} } from '~/${filePath.replace('.tsx', '')}';
${loaderCode}${actionCode}

export default function ${name}Page() {
  return <${name} />;
}`;
  }

  async updateRoutesConfiguration() {
    console.log('🔄 Updating routes configuration with new routes...');
    
    const newRoutes = this.createdConnections
      .filter(conn => conn.isNewRoute)
      .map(conn => {
        const routeName = conn.route.replace('.tsx', '').replace('$', ':');
        return `  route('${routeName}', '${conn.route}'), // ${conn.component}`;
      });
    
    if (newRoutes.length > 0) {
      try {
        const routesPath = 'apps/web/app/routes.ts';
        const routesContent = fs.readFileSync(routesPath, 'utf8');
        
        const insertPoint = routesContent.indexOf('  route(\'booking/manage\', \'routes/booking/manage.tsx\'),');
        if (insertPoint !== -1) {
          const lineEnd = routesContent.indexOf('\n', insertPoint) + 1;
          const beforeInsert = routesContent.substring(0, lineEnd);
          const afterInsert = routesContent.substring(lineEnd);
          
          const updatedContent = beforeInsert + 
            '\n  // ADDITIONAL MAGIC PATTERNS ROUTES\n' +
            newRoutes.join('\n') + '\n' +
            afterInsert;
          
          fs.writeFileSync(routesPath, updatedContent);
          console.log(`   ✅ Added ${newRoutes.length} new routes to configuration`);
        }
      } catch (error) {
        console.error('   ❌ Failed to update routes configuration:', error.message);
      }
    }
  }

  generateCompletionReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🎉 MAGIC PATTERNS COMPONENT CONNECTION COMPLETE');
    console.log('='.repeat(80));
    
    const totalComponents = this.magicPatternsComponents.size;
    const connectedComponents = this.createdConnections.length;
    const connectionPercentage = (connectedComponents / totalComponents * 100).toFixed(1);
    
    console.log(`\n📊 CONNECTION STATISTICS:`);
    console.log(`   Total Magic Patterns Components: ${totalComponents}`);
    console.log(`   Connected Components: ${connectedComponents}`);
    console.log(`   Connection Rate: ${connectionPercentage}%`);
    console.log(`   New Routes Created: ${this.createdConnections.filter(c => c.isNewRoute).length}`);
    console.log(`   Errors: ${this.errors.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 CONNECTION ERRORS:');
      this.errors.forEach(error => {
        console.log(`   • ${error.component}: ${error.error}`);
      });
    }
    
    console.log('\n📋 CONNECTIONS BY CATEGORY:');
    const byCategory = {};
    this.createdConnections.forEach(conn => {
      byCategory[conn.category] = (byCategory[conn.category] || 0) + 1;
    });
    
    Object.entries(byCategory).forEach(([category, count]) => {
      console.log(`   • ${category}: ${count} components`);
    });
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      totalComponents: totalComponents,
      connectedComponents: connectedComponents,
      connectionPercentage: parseFloat(connectionPercentage),
      connections: this.createdConnections,
      errors: this.errors,
      byCategory: byCategory
    };
    
    fs.writeFileSync('magic-patterns-connection-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: magic-patterns-connection-report.json');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('   1. Test all connected components and routes');
    console.log('   2. Implement proper data loading in loaders');
    console.log('   3. Add authentication and authorization');
    console.log('   4. Create database schema and migrations');
    console.log('   5. Test complete user workflows');
  }
}

// Main execution
if (require.main === module) {
  const connector = new MagicPatternsComponentConnector();
  connector.connect().catch(console.error);
}

module.exports = MagicPatternsComponentConnector;