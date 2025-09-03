#!/usr/bin/env node

/**
 * Complete Magic Patterns Component System Analyzer
 * 
 * Analyzes the COMPLETE component hierarchy and internal usage patterns
 * Based on the organized directory structure by service category
 */

const fs = require('fs');
const path = require('path');

class CompleteComponentSystemAnalyzer {
  constructor() {
    this.components = new Map();
    this.categories = new Map();
    this.componentUsage = new Map(); // Component A uses Component B
    this.usedByComponents = new Map(); // Component B is used by Component A
    this.analysis = {};
  }

  async analyze() {
    console.log('🔍 Complete Magic Patterns Component System Analysis\n');
    
    // 1. Scan the organized directory structure
    await this.scanComponentSystem();
    
    // 2. Analyze internal component dependencies
    await this.analyzeInternalUsage();
    
    // 3. Create service category mapping
    this.createServiceCategoryMap();
    
    // 4. Generate complete system guide
    this.generateCompleteSystemGuide();
  }

  async scanComponentSystem() {
    console.log('📋 Scanning organized Magic Patterns component system...\n');
    
    const basePath = 'apps/web/app/components/magic-patterns';
    
    // Scan organized component directories
    await this.scanServiceDirectory(path.join(basePath, 'components'));
    await this.scanServiceDirectory(path.join(basePath, 'pages'));
    
    console.log(`Found ${this.components.size} components organized by service category\n`);
  }

  async scanServiceDirectory(dir, parentCategory = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // This is a service category (e.g., "ads", "check-in", "hubs")
        const serviceCategory = parentCategory ? `${parentCategory}/${item}` : item;
        await this.scanServiceDirectory(fullPath, serviceCategory);
      } else if (item.endsWith('.tsx') && !item.includes('.ssr-backup') && !item.includes('.disabled')) {
        await this.analyzeServiceComponent(fullPath, parentCategory || 'root');
      }
    }
  }

  async analyzeServiceComponent(filePath, serviceCategory) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative('apps/web/app/components/magic-patterns', filePath);
      const componentName = path.basename(filePath, '.tsx');
      
      const componentData = {
        name: componentName,
        filePath: relativePath,
        fullPath: filePath,
        serviceCategory: serviceCategory,
        
        // Service analysis
        serviceType: this.determineServiceType(serviceCategory, componentName),
        functionality: this.analyzeFunctionality(content, componentName, serviceCategory),
        
        // Component relationships
        imports: this.extractComponentImports(content),
        exports: this.extractExports(content),
        
        // Usage context
        contextDescription: this.generateContextDescription(serviceCategory, componentName, content),
        
        // Technical details
        complexity: this.calculateComplexity(content),
        dependencies: this.extractDependencies(content),
        features: this.extractFeatures(content)
      };
      
      this.components.set(componentName, componentData);
      
      // Track service categories
      if (!this.categories.has(serviceCategory)) {
        this.categories.set(serviceCategory, []);
      }
      this.categories.get(serviceCategory).push(componentData);
      
    } catch (error) {
      console.log(`❌ Error analyzing ${filePath}: ${error.message}`);
    }
  }

  determineServiceType(category, name) {
    const serviceTypes = {
      'ads': 'Advertisement & Promotion System',
      'booking-form': 'Booking Form System',
      'booking': 'Booking Workflow System', 
      'bookings': 'Booking Management System',
      'calendar': 'Calendar & Scheduling System',
      'calendars': 'Calendar Management System',
      'check-in': 'Event Check-in System',
      'checkout': 'Payment Checkout System',
      'dashboard': 'Analytics Dashboard System',
      'directory': 'Member Directory System',
      'events': 'Event Management System',
      'home': 'Home Page System',
      'hub-builder': 'Hub Creation System',
      'hub': 'Community Hub System',
      'hubs': 'Hub Discovery System',
      'layout': 'Layout & Navigation System',
      'navigation': 'Navigation System',
      'performers': 'Performer Management System',
      'profile': 'User Profile System',
      'settings': 'Settings & Configuration System',
      'sharing': 'Social Sharing System',
      'subscription': 'Subscription Management System',
      'tickets': 'Ticketing System',
      'ui': 'Core UI Components System',
      'venue-detail': 'Venue Detail Display System',
      'venue-marketplace': 'Venue Discovery System',
      'venue-profile': 'Venue Profile System'
    };
    
    return serviceTypes[category] || `${category.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} System`;
  }

  analyzeFunctionality(content, componentName, serviceCategory) {
    const functions = [];
    
    // Service-specific functionality analysis
    const categoryFunctions = {
      'ads': ['Display advertisements', 'Track ad performance', 'Manage ad placement'],
      'booking-form': ['Collect booking information', 'Validate form data', 'Submit booking requests'],
      'booking': ['Handle booking workflow', 'Process booking steps', 'Manage booking state'],
      'bookings': ['Manage existing bookings', 'Display booking history', 'Handle booking modifications'],
      'calendar': ['Display calendar views', 'Handle date selection', 'Show event scheduling'],
      'check-in': ['Handle event check-ins', 'Verify attendee status', 'Track attendance'],
      'checkout': ['Process payments', 'Handle purchase flow', 'Generate receipts'],
      'events': ['Display event information', 'Handle event interactions', 'Manage event data'],
      'hubs': ['Community hub functionality', 'Hub discovery', 'Hub management'],
      'performers': ['Show performer profiles', 'Handle performer booking', 'Manage performer data'],
      'tickets': ['Handle ticket sales', 'Display ticket information', 'Manage ticket inventory'],
      'venues': ['Show venue details', 'Handle venue booking', 'Display venue availability']
    };
    
    // Add category-specific functions
    Object.entries(categoryFunctions).forEach(([cat, funcs]) => {
      if (serviceCategory.includes(cat)) {
        functions.push(...funcs);
      }
    });
    
    // Analyze content for specific functionality
    const contentLower = content.toLowerCase();
    if (contentLower.includes('usestate')) functions.push('Manages component state');
    if (contentLower.includes('useeffect')) functions.push('Handles side effects');
    if (contentLower.includes('form')) functions.push('Form handling');
    if (contentLower.includes('modal')) functions.push('Modal dialog display');
    if (contentLower.includes('api')) functions.push('API data fetching');
    if (contentLower.includes('payment')) functions.push('Payment processing');
    if (contentLower.includes('calendar')) functions.push('Calendar functionality');
    if (contentLower.includes('map')) functions.push('Map integration');
    if (contentLower.includes('search')) functions.push('Search functionality');
    if (contentLower.includes('filter')) functions.push('Data filtering');
    
    return functions.length > 0 ? functions : ['UI display component'];
  }

  extractComponentImports(content) {
    const imports = [];
    
    // Find all component imports (both local and external)
    const importRegex = /import\s+(?:{[^}]*}|\w+|[{][^}]*[}])\s+from\s+['"`]([^'"`]+)['"`]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Focus on local component imports
      if (importPath.startsWith('./') || importPath.startsWith('../') || importPath.includes('magic-patterns')) {
        imports.push({
          path: importPath,
          fullMatch: match[0]
        });
      }
    }
    
    return imports;
  }

  extractExports(content) {
    const exports = [];
    
    if (content.includes('export default')) {
      exports.push('default');
    }
    
    const namedExportMatches = content.match(/export\s+(const|function|class)\s+(\w+)/g);
    if (namedExportMatches) {
      namedExportMatches.forEach(match => {
        const name = match.split(/\s+/).pop();
        exports.push(name);
      });
    }
    
    return exports;
  }

  generateContextDescription(serviceCategory, componentName, content) {
    const descriptions = [];
    
    // Category-based context
    const categoryContexts = {
      'ads': 'Part of the advertising and promotional system. Handles ad display, tracking, and user engagement with advertisements.',
      'booking-form': 'Component of the booking form workflow. Collects and validates user information for venue/performer bookings.',
      'booking': 'Part of the step-by-step booking process. Manages booking workflow states and user progress.',
      'bookings': 'Part of the booking management system. Handles existing bookings, modifications, and booking history.',
      'calendar': 'Component of the calendar and scheduling system. Provides calendar views, date selection, and event scheduling.',
      'check-in': 'Part of the event check-in system. Handles attendee verification and attendance tracking.',
      'checkout': 'Component of the payment and purchase system. Processes payments and handles transaction flow.',
      'events': 'Part of the event management and display system. Shows event information and handles event interactions.',
      'hubs': 'Component of the community hub system. Handles hub discovery, creation, and management.',
      'performers': 'Part of the performer management system. Displays performer profiles and handles performer-related interactions.',
      'tickets': 'Component of the ticketing system. Handles ticket sales, display, and inventory management.',
      'venues': 'Part of the venue system. Shows venue details, availability, and booking options.',
      'layout': 'Core layout component. Provides consistent page structure and navigation.',
      'ui': 'Reusable UI component. Used throughout the application for consistent interface elements.'
    };
    
    // Find matching context
    for (const [cat, context] of Object.entries(categoryContexts)) {
      if (serviceCategory.includes(cat)) {
        descriptions.push(context);
        break;
      }
    }
    
    // Add specific component context based on name
    if (componentName.includes('Modal')) descriptions.push('Displays as a modal dialog overlay.');
    if (componentName.includes('Form')) descriptions.push('Handles user input and form submission.');
    if (componentName.includes('Card')) descriptions.push('Displays information in a card format.');
    if (componentName.includes('List')) descriptions.push('Renders list of items.');
    if (componentName.includes('Grid')) descriptions.push('Displays items in a grid layout.');
    if (componentName.includes('Widget')) descriptions.push('Embeddable widget component.');
    if (componentName.includes('Dashboard')) descriptions.push('Shows analytics and management interface.');
    if (componentName.includes('Page')) descriptions.push('Full page component with complete functionality.');
    
    return descriptions.join(' ');
  }

  calculateComplexity(content) {
    let score = 0;
    score += (content.match(/useState/g) || []).length * 2;
    score += (content.match(/useEffect/g) || []).length * 3;
    score += (content.match(/if\s*\(/g) || []).length;
    score += (content.match(/map\s*\(/g) || []).length;
    score += (content.match(/filter\s*\(/g) || []).length;
    
    if (score <= 5) return 'Simple';
    if (score <= 15) return 'Moderate';
    return 'Complex';
  }

  extractDependencies(content) {
    const deps = [];
    const importMatches = content.match(/from\s+['"`]([^'"`]+)['"`]/g);
    
    if (importMatches) {
      importMatches.forEach(match => {
        const dep = match.match(/['"`]([^'"`]+)['"`]/)[1];
        if (!dep.startsWith('.') && !dep.startsWith('~')) {
          deps.push(dep);
        }
      });
    }
    
    return [...new Set(deps)];
  }

  extractFeatures(content) {
    const features = [];
    
    if (content.includes('useState')) features.push('State Management');
    if (content.includes('useEffect')) features.push('Side Effects');
    if (content.includes('form')) features.push('Form Handling');
    if (content.includes('modal')) features.push('Modal Display');
    if (content.includes('api') || content.includes('fetch')) features.push('Data Fetching');
    if (content.includes('payment')) features.push('Payment Processing');
    if (content.includes('calendar')) features.push('Calendar Integration');
    if (content.includes('map')) features.push('Map Integration');
    if (content.includes('search')) features.push('Search Functionality');
    if (content.includes('filter')) features.push('Filtering');
    if (content.includes('upload')) features.push('File Upload');
    if (content.includes('download')) features.push('File Download');
    if (content.includes('share')) features.push('Social Sharing');
    if (content.includes('notification')) features.push('Notifications');
    
    return features;
  }

  async analyzeInternalUsage() {
    console.log('🔗 Analyzing internal component relationships...\n');
    
    // For each component, find which other components it uses
    for (const [componentName, componentData] of this.components.entries()) {
      const usedComponents = [];
      
      componentData.imports.forEach(imp => {
        // Try to resolve the import to a component name
        const resolvedComponent = this.resolveImportToComponent(imp.path, componentData.filePath);
        if (resolvedComponent) {
          usedComponents.push(resolvedComponent);
        }
      });
      
      this.componentUsage.set(componentName, usedComponents);
      
      // Build reverse mapping (what uses this component)
      usedComponents.forEach(usedComp => {
        if (!this.usedByComponents.has(usedComp)) {
          this.usedByComponents.set(usedComp, []);
        }
        this.usedByComponents.get(usedComp).push(componentName);
      });
    }
  }

  resolveImportToComponent(importPath, currentFile) {
    // Try to resolve relative imports to actual component names
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      const currentDir = path.dirname(currentFile);
      const resolvedPath = path.resolve('apps/web/app/components/magic-patterns', currentDir, importPath);
      
      // Check if it's a direct .tsx file
      if (fs.existsSync(resolvedPath + '.tsx')) {
        return path.basename(resolvedPath);
      }
      
      // Check if it's a directory with index.tsx
      if (fs.existsSync(path.join(resolvedPath, 'index.tsx'))) {
        return path.basename(resolvedPath);
      }
    }
    
    // Check if it's a magic-patterns import
    if (importPath.includes('magic-patterns')) {
      const componentPath = importPath.split('magic-patterns/')[1];
      if (componentPath) {
        const componentName = path.basename(componentPath);
        if (this.components.has(componentName)) {
          return componentName;
        }
      }
    }
    
    return null;
  }

  createServiceCategoryMap() {
    console.log('🗂️  Creating service category mapping...\n');
    
    this.analysis.serviceCategories = {};
    
    for (const [category, components] of this.categories.entries()) {
      this.analysis.serviceCategories[category] = {
        name: category,
        serviceType: components[0]?.serviceType || 'Unknown Service',
        componentCount: components.length,
        components: components.map(c => ({
          name: c.name,
          functionality: c.functionality,
          complexity: c.complexity,
          contextDescription: c.contextDescription
        }))
      };
    }
  }

  generateCompleteSystemGuide() {
    console.log('\n' + '='.repeat(80));
    console.log('🏗️  COMPLETE MAGIC PATTERNS COMPONENT SYSTEM GUIDE');
    console.log('='.repeat(80));

    console.log('\n📊 SYSTEM OVERVIEW:');
    console.log(`Total Components: ${this.components.size}`);
    console.log(`Service Categories: ${this.categories.size}`);
    console.log(`Internal Component Dependencies: ${Array.from(this.componentUsage.values()).flat().length}`);

    console.log('\n🗂️  SERVICE CATEGORIES & THEIR COMPONENTS:');
    console.log('='.repeat(60));

    // Sort categories by importance and component count
    const sortedCategories = Array.from(this.categories.entries())
      .sort(([a, componentsA], [b, componentsB]) => {
        // Prioritize key service categories
        const priorities = ['layout', 'pages', 'events', 'booking', 'venues', 'performers'];
        const priorityA = priorities.indexOf(a);
        const priorityB = priorities.indexOf(b);
        
        if (priorityA !== -1 && priorityB !== -1) return priorityA - priorityB;
        if (priorityA !== -1) return -1;
        if (priorityB !== -1) return 1;
        
        return componentsB.length - componentsA.length;
      });

    for (const [categoryName, components] of sortedCategories) {
      if (components.length === 0) continue;
      
      const serviceType = components[0].serviceType;
      console.log(`\n📁 ${categoryName.toUpperCase()} - ${serviceType}`);
      console.log(`   (${components.length} components)`);
      console.log('-'.repeat(50));
      
      // Show key components in this category
      components.slice(0, 10).forEach(component => {
        console.log(`\n   🧩 ${component.name}`);
        console.log(`      Path: ${component.filePath}`);
        console.log(`      Purpose: ${component.contextDescription}`);
        console.log(`      Functionality: ${component.functionality.slice(0, 3).join(', ')}`);
        console.log(`      Complexity: ${component.complexity}`);
        
        // Show what this component uses
        const uses = this.componentUsage.get(component.name) || [];
        if (uses.length > 0) {
          console.log(`      Uses: ${uses.slice(0, 3).join(', ')}${uses.length > 3 ? '...' : ''}`);
        }
        
        // Show what uses this component
        const usedBy = this.usedByComponents.get(component.name) || [];
        if (usedBy.length > 0) {
          console.log(`      Used by: ${usedBy.slice(0, 3).join(', ')}${usedBy.length > 3 ? '...' : ''}`);
        }
      });
      
      if (components.length > 10) {
        console.log(`\n   ... and ${components.length - 10} more ${categoryName} components`);
      }
    }

    // Show most interconnected components
    console.log('\n🔗 MOST CONNECTED COMPONENTS:');
    console.log('-'.repeat(40));
    
    const connectionCounts = Array.from(this.components.entries()).map(([name, data]) => ({
      name,
      uses: this.componentUsage.get(name)?.length || 0,
      usedBy: this.usedByComponents.get(name)?.length || 0,
      total: (this.componentUsage.get(name)?.length || 0) + (this.usedByComponents.get(name)?.length || 0)
    })).sort((a, b) => b.total - a.total);

    connectionCounts.slice(0, 15).forEach(comp => {
      console.log(`${comp.name}: Uses ${comp.uses} components, Used by ${comp.usedBy} components`);
    });

    // Save complete analysis
    const reportData = {
      timestamp: new Date().toISOString(),
      totalComponents: this.components.size,
      serviceCategories: this.analysis.serviceCategories,
      componentUsage: Object.fromEntries(this.componentUsage),
      usedByComponents: Object.fromEntries(this.usedByComponents),
      allComponents: Object.fromEntries(this.components)
    };

    fs.writeFileSync('complete-component-system-analysis.json', JSON.stringify(reportData, null, 2));
    
    console.log('\n📄 Complete system analysis saved to: complete-component-system-analysis.json');
    
    console.log('\n🎯 HOW TO USE THIS GUIDE:');
    console.log('1. Find the service category you need (ads, booking, events, etc.)');
    console.log('2. Look at the components in that category');
    console.log('3. Check the "Uses" and "Used by" relationships to understand dependencies');
    console.log('4. Use the contextDescription to understand what each component does');
    console.log('5. The system is organized by SERVICE, not by route usage');
  }
}

// Main execution
if (require.main === module) {
  const analyzer = new CompleteComponentSystemAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = CompleteComponentSystemAnalyzer;