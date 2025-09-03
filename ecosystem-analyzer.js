#!/usr/bin/env node

/**
 * Magic Patterns Ecosystem Analyzer
 * 
 * Analyzes related component directories as complete business ecosystems
 * booking + booking-form + bookings = Complete Booking Ecosystem
 * profile + performers = Performer/Profile Ecosystem  
 * hub + hub-builder + hubs = Community Hub Ecosystem
 */

const fs = require('fs');
const path = require('path');

class EcosystemAnalyzer {
  constructor() {
    this.ecosystems = new Map();
    this.componentData = new Map();
  }

  async analyze() {
    console.log('🏗️  Magic Patterns Ecosystem Analysis\n');
    
    // Define the ecosystems based on related directories
    const ecosystemDefinitions = [
      {
        name: 'Booking Ecosystem',
        description: 'Complete booking workflow, forms, and management system',
        directories: ['booking', 'booking-form', 'bookings'],
        businessDomain: 'Event & Venue Reservations'
      },
      {
        name: 'Profile & Performer Ecosystem', 
        description: 'User profiles and performer management system',
        directories: ['profile', 'performers'],
        businessDomain: 'User & Talent Management'
      },
      {
        name: 'Community Hub Ecosystem',
        description: 'Community creation, building, and discovery system',
        directories: ['hub', 'hub-builder', 'hubs'],
        businessDomain: 'Community Management'
      },
      {
        name: 'Event Management Ecosystem',
        description: 'Event creation, management, and discovery system',
        directories: ['events', 'calendar', 'calendars'],
        businessDomain: 'Event & Schedule Management'
      },
      {
        name: 'Venue Ecosystem',
        description: 'Venue discovery, details, and marketplace system',
        directories: ['venue-detail', 'venue-marketplace', 'venue-profile'],
        businessDomain: 'Venue Management'
      },
      {
        name: 'Commerce Ecosystem',
        description: 'Ticketing, payments, and subscription system',
        directories: ['tickets', 'checkout', 'subscription'],
        businessDomain: 'Commerce & Payments'
      },
      {
        name: 'Social Ecosystem',
        description: 'Social features, messaging, and community interaction',
        directories: ['social', 'sharing', 'directory'],
        businessDomain: 'Social & Communication'
      },
      {
        name: 'Admin & Analytics Ecosystem',
        description: 'Administration, settings, and analytics system',
        directories: ['dashboard', 'settings', 'ads'],
        businessDomain: 'Administration & Business Intelligence'
      }
    ];

    // Analyze each ecosystem
    for (const ecosystem of ecosystemDefinitions) {
      await this.analyzeEcosystem(ecosystem);
    }

    this.generateEcosystemReport();
  }

  async analyzeEcosystem(ecosystemDef) {
    console.log(`📊 Analyzing ${ecosystemDef.name}...`);
    
    const ecosystem = {
      ...ecosystemDef,
      components: new Map(),
      workflows: [],
      dataFlows: [],
      routeNeeds: new Map(),
      totalComponents: 0
    };

    const basePath = 'apps/web/app/components/magic-patterns/components';
    const pagesPath = 'apps/web/app/components/magic-patterns/pages';

    // Analyze components for each directory in the ecosystem
    for (const dir of ecosystemDef.directories) {
      const componentDir = path.join(basePath, dir);
      const pageDir = path.join(pagesPath, dir);
      
      if (fs.existsSync(componentDir)) {
        await this.scanDirectory(componentDir, dir, 'component', ecosystem);
      }
      
      if (fs.existsSync(pageDir)) {
        await this.scanDirectory(pageDir, dir, 'page', ecosystem);
      }
    }

    // Analyze the ecosystem patterns
    this.analyzeEcosystemPatterns(ecosystem);
    
    this.ecosystems.set(ecosystemDef.name, ecosystem);
    console.log(`   Found ${ecosystem.totalComponents} components\n`);
  }

  async scanDirectory(dir, categoryName, type, ecosystem) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await this.scanDirectory(fullPath, `${categoryName}/${file}`, type, ecosystem);
      } else if (file.endsWith('.tsx') && !file.includes('.ssr-backup') && !file.includes('.disabled')) {
        await this.analyzeComponent(fullPath, categoryName, type, ecosystem);
      }
    }
  }

  async analyzeComponent(filePath, category, type, ecosystem) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const componentName = path.basename(filePath, '.tsx');
      const relativePath = path.relative('apps/web/app/components/magic-patterns', filePath);
      
      const analysis = {
        name: componentName,
        filePath: relativePath,
        category: category,
        type: type,
        
        // Business function analysis
        businessFunction: this.determineBusinessFunction(componentName, category, content),
        ecosystemRole: this.determineEcosystemRole(componentName, category, content),
        
        // Technical requirements
        needsLoader: this.needsLoader(content, componentName),
        needsAction: this.needsAction(content, componentName),
        needsSession: this.needsSession(content, componentName),
        needsAuth: this.needsAuth(content, componentName),
        
        // Data requirements
        dataRequirements: this.analyzeDataRequirements(content, componentName, category),
        apiRequirements: this.analyzeApiRequirements(content, componentName),
        
        // Form analysis
        isForm: this.isFormComponent(content),
        isWorkflowStep: this.isWorkflowStep(componentName),
        isPage: type === 'page',
        isDashboard: componentName.includes('Dashboard'),
        isModal: componentName.includes('Modal'),
        
        // Integration needs
        suggestedRoutes: this.suggestRoutes(componentName, category, ecosystem.name),
        dependencies: this.findEcosystemDependencies(content, ecosystem.directories),
        
        // Complexity
        complexity: this.calculateComplexity(content),
        features: this.extractFeatures(content)
      };
      
      ecosystem.components.set(componentName, analysis);
      ecosystem.totalComponents++;
      this.componentData.set(componentName, analysis);
      
    } catch (error) {
      console.log(`❌ Error analyzing ${filePath}: ${error.message}`);
    }
  }

  determineBusinessFunction(componentName, category, content) {
    const functions = [];
    
    // Category-based business functions
    const categoryFunctions = {
      'booking': ['Reservation workflow', 'Booking management', 'Availability tracking'],
      'booking-form': ['Data collection', 'Form validation', 'User input processing'],
      'bookings': ['Booking administration', 'Status management', 'History tracking'],
      
      'profile': ['User identity management', 'Personal settings', 'Account management'],
      'performers': ['Talent profiles', 'Performance booking', 'Artist portfolio'],
      
      'hub': ['Community management', 'Content organization', 'Member interaction'],
      'hub-builder': ['Community creation', 'Customization tools', 'Hub configuration'],
      'hubs': ['Community discovery', 'Hub marketplace', 'Community browsing'],
      
      'events': ['Event display', 'Event interaction', 'Event management'],
      'calendar': ['Schedule management', 'Date selection', 'Time management'],
      'calendars': ['Calendar administration', 'Schedule publishing', 'Calendar sharing'],
      
      'venue-detail': ['Venue information display', 'Facility showcase', 'Booking interface'],
      'venue-marketplace': ['Venue discovery', 'Search and filtering', 'Comparison tools'],
      'venue-profile': ['Venue management', 'Profile customization', 'Availability management'],
      
      'tickets': ['Ticket sales', 'Access control', 'Revenue management'],
      'checkout': ['Payment processing', 'Transaction management', 'Purchase completion'],
      'subscription': ['Recurring billing', 'Plan management', 'Member benefits']
    };
    
    // Find matching functions
    Object.entries(categoryFunctions).forEach(([cat, funcs]) => {
      if (category.includes(cat)) {
        functions.push(...funcs);
      }
    });
    
    // Component-specific functions
    if (componentName.includes('Dashboard')) functions.push('Analytics and reporting');
    if (componentName.includes('Modal')) functions.push('User interaction dialogs');
    if (componentName.includes('Form')) functions.push('Data input and validation');
    if (componentName.includes('Card')) functions.push('Information display');
    if (componentName.includes('List') || componentName.includes('Grid')) functions.push('Data presentation');
    
    return functions.length > 0 ? functions : ['UI component'];
  }

  determineEcosystemRole(componentName, category, content) {
    // Determine role within the ecosystem
    if (componentName.includes('Page')) return 'Primary interface';
    if (componentName.includes('Dashboard')) return 'Management interface';
    if (componentName.includes('Modal')) return 'Interactive dialog';
    if (componentName.includes('Form')) return 'Data collection';
    if (componentName.includes('Step')) return 'Workflow component';
    if (componentName.includes('Widget')) return 'Embeddable component';
    if (componentName.includes('Card')) return 'Display component';
    if (componentName.includes('List') || componentName.includes('Grid')) return 'Collection display';
    
    return 'Supporting component';
  }

  needsLoader(content, componentName) {
    const loaderIndicators = [
      'useQuery', 'useEffect', 'fetch', 'api', 'load', 'get', 'retrieve'
    ];
    
    return loaderIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    ) || componentName.includes('Page') || componentName.includes('Dashboard');
  }

  needsAction(content, componentName) {
    const actionIndicators = [
      'onSubmit', 'handleSubmit', 'post', 'put', 'delete',
      'create', 'update', 'save', 'confirm', 'submit'
    ];
    
    return actionIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    ) || this.isFormComponent(content);
  }

  needsSession(content, componentName) {
    return content.includes('session') || 
           componentName.includes('Booking') ||
           componentName.includes('Profile') ||
           content.includes('currentUser');
  }

  needsAuth(content, componentName) {
    return content.includes('auth') ||
           content.includes('login') ||
           componentName.includes('Dashboard') ||
           componentName.includes('Profile');
  }

  analyzeDataRequirements(content, componentName, category) {
    const requirements = [];
    
    // Category-based data needs
    if (category.includes('booking')) {
      requirements.push('booking_data', 'venue_data', 'event_data', 'user_data');
    }
    if (category.includes('profile')) {
      requirements.push('user_profile', 'preferences', 'activity_history');
    }
    if (category.includes('performer')) {
      requirements.push('performer_profile', 'portfolio', 'availability', 'reviews');
    }
    if (category.includes('hub')) {
      requirements.push('community_data', 'member_list', 'content', 'permissions');
    }
    if (category.includes('event')) {
      requirements.push('event_details', 'schedule', 'attendees', 'venue_info');
    }
    if (category.includes('venue')) {
      requirements.push('venue_details', 'amenities', 'pricing', 'availability');
    }
    
    // Component-specific data needs
    if (componentName.includes('Dashboard')) {
      requirements.push('analytics_data', 'metrics', 'reports');
    }
    if (componentName.includes('Calendar')) {
      requirements.push('schedule_data', 'events', 'availability');
    }
    if (componentName.includes('Payment') || componentName.includes('Checkout')) {
      requirements.push('payment_methods', 'pricing', 'transaction_history');
    }
    
    return [...new Set(requirements)];
  }

  analyzeApiRequirements(content, componentName) {
    const apis = [];
    
    if (content.includes('booking') || componentName.includes('Booking')) {
      apis.push('bookings_api', 'availability_api');
    }
    if (content.includes('payment') || componentName.includes('Payment')) {
      apis.push('payments_api', 'stripe_api');
    }
    if (content.includes('calendar') || componentName.includes('Calendar')) {
      apis.push('calendar_api', 'events_api');
    }
    if (content.includes('profile') || componentName.includes('Profile')) {
      apis.push('users_api', 'profiles_api');
    }
    if (content.includes('venue') || componentName.includes('Venue')) {
      apis.push('venues_api', 'locations_api');
    }
    
    return apis;
  }

  isFormComponent(content) {
    return content.includes('form') || content.includes('onSubmit') || 
           content.includes('input') || content.includes('textarea');
  }

  isWorkflowStep(componentName) {
    return componentName.includes('Step') || 
           componentName.includes('Wizard') ||
           /\d/.test(componentName); // Contains numbers suggesting sequence
  }

  suggestRoutes(componentName, category, ecosystemName) {
    const routes = [];
    
    // Ecosystem-based route suggestions
    if (ecosystemName.includes('Booking')) {
      if (componentName.includes('Step') || componentName.includes('Form')) {
        routes.push(`/book/${componentName.toLowerCase().replace(/step|form|page/g, '')}`);
      } else if (componentName.includes('Dashboard')) {
        routes.push('/dashboard/bookings');
      } else {
        routes.push(`/bookings/${componentName.toLowerCase()}`);
      }
    } else if (ecosystemName.includes('Profile')) {
      if (componentName.includes('Page')) {
        routes.push(`/profile/${componentName.toLowerCase().replace('page', '')}`);
      } else {
        routes.push(`/profile/component/${componentName.toLowerCase()}`);
      }
    } else if (ecosystemName.includes('Hub')) {
      if (componentName.includes('Builder')) {
        routes.push('/create-hub');
      } else if (componentName.includes('Page')) {
        routes.push(`/hubs/${componentName.toLowerCase().replace('page', '')}`);
      } else {
        routes.push(`/hubs/component/${componentName.toLowerCase()}`);
      }
    }
    
    return routes;
  }

  findEcosystemDependencies(content, directories) {
    const dependencies = [];
    
    // Look for imports from other directories in the same ecosystem
    directories.forEach(dir => {
      const regex = new RegExp(`/${dir}/`, 'g');
      if (regex.test(content)) {
        dependencies.push(dir);
      }
    });
    
    return dependencies;
  }

  calculateComplexity(content) {
    let score = 0;
    score += (content.match(/useState/g) || []).length * 2;
    score += (content.match(/useEffect/g) || []).length * 3;
    score += (content.match(/if\s*\(/g) || []).length;
    score += (content.match(/map\s*\(/g) || []).length;
    
    if (score <= 5) return 'Simple';
    if (score <= 15) return 'Moderate';
    return 'Complex';
  }

  extractFeatures(content) {
    const features = [];
    
    if (content.includes('useState')) features.push('State Management');
    if (content.includes('useEffect')) features.push('Side Effects');
    if (content.includes('form')) features.push('Form Handling');
    if (content.includes('modal')) features.push('Modal Display');
    if (content.includes('api')) features.push('API Integration');
    if (content.includes('payment')) features.push('Payment Processing');
    if (content.includes('calendar')) features.push('Calendar Features');
    if (content.includes('map')) features.push('Location Services');
    if (content.includes('upload')) features.push('File Upload');
    if (content.includes('search')) features.push('Search');
    
    return features;
  }

  analyzeEcosystemPatterns(ecosystem) {
    const components = Array.from(ecosystem.components.values());
    
    // Identify workflows
    const workflowComponents = components.filter(c => c.isWorkflowStep);
    if (workflowComponents.length > 0) {
      ecosystem.workflows.push({
        type: 'Multi-step workflow',
        components: workflowComponents.map(c => c.name),
        needsRouting: true
      });
    }
    
    // Identify forms
    const formComponents = components.filter(c => c.isForm);
    if (formComponents.length > 0) {
      ecosystem.workflows.push({
        type: 'Form collection system',
        components: formComponents.map(c => c.name),
        needsActions: true
      });
    }
    
    // Identify dashboards
    const dashboardComponents = components.filter(c => c.isDashboard);
    if (dashboardComponents.length > 0) {
      ecosystem.workflows.push({
        type: 'Management dashboard',
        components: dashboardComponents.map(c => c.name),
        needsAuth: true,
        needsData: true
      });
    }
    
    // Identify page hierarchies
    const pageComponents = components.filter(c => c.isPage);
    if (pageComponents.length > 0) {
      ecosystem.workflows.push({
        type: 'Page navigation system',
        components: pageComponents.map(c => c.name),
        needsRoutes: true
      });
    }
  }

  generateEcosystemReport() {
    console.log('\n' + '='.repeat(100));
    console.log('🏗️  MAGIC PATTERNS ECOSYSTEM ARCHITECTURE REPORT');
    console.log('='.repeat(100));

    console.log(`\n📊 DISCOVERED ${this.ecosystems.size} COMPLETE BUSINESS ECOSYSTEMS:\n`);

    for (const [name, ecosystem] of this.ecosystems.entries()) {
      console.log(`🌟 ${name.toUpperCase()}`);
      console.log(`   Business Domain: ${ecosystem.businessDomain}`);
      console.log(`   Description: ${ecosystem.description}`);
      console.log(`   Directories: ${ecosystem.directories.join(', ')}`);
      console.log(`   Components: ${ecosystem.totalComponents}`);
      
      // Show key patterns
      if (ecosystem.workflows.length > 0) {
        console.log(`   Patterns Found:`);
        ecosystem.workflows.forEach(workflow => {
          console.log(`     • ${workflow.type} (${workflow.components.length} components)`);
        });
      }

      // Show route requirements
      const needsLoaders = Array.from(ecosystem.components.values()).filter(c => c.needsLoader).length;
      const needsActions = Array.from(ecosystem.components.values()).filter(c => c.needsAction).length;
      const needsAuth = Array.from(ecosystem.components.values()).filter(c => c.needsAuth).length;
      
      console.log(`   Integration Needs:`);
      console.log(`     • ${needsLoaders} components need loaders`);
      console.log(`     • ${needsActions} components need actions`);
      console.log(`     • ${needsAuth} components need authentication`);

      // Show key components
      const keyComponents = Array.from(ecosystem.components.values())
        .filter(c => c.isPage || c.isDashboard || c.isWorkflowStep)
        .slice(0, 5);
      
      if (keyComponents.length > 0) {
        console.log(`   Key Components:`);
        keyComponents.forEach(comp => {
          console.log(`     • ${comp.name} (${comp.ecosystemRole})`);
        });
      }
      
      console.log('');
    }

    console.log('\n🎯 ECOSYSTEM INTEGRATION PRIORITIES:');
    console.log('='.repeat(50));

    const priorities = Array.from(this.ecosystems.entries())
      .map(([name, eco]) => ({
        name,
        ecosystem: eco,
        priority: this.calculateEcosystemPriority(eco)
      }))
      .sort((a, b) => b.priority - a.priority);

    priorities.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name}`);
      console.log(`   Priority Score: ${item.priority}/100`);
      console.log(`   Why: ${this.explainPriority(item.ecosystem)}`);
      console.log(`   Implementation: ${this.suggestImplementation(item.ecosystem)}`);
    });

    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Start with highest priority ecosystem');
    console.log('2. Create route structure for the ecosystem');
    console.log('3. Implement loaders and actions');
    console.log('4. Connect components to routes');
    console.log('5. Test complete ecosystem functionality');
    console.log('6. Repeat for next ecosystem');

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      ecosystems: Object.fromEntries(
        Array.from(this.ecosystems.entries()).map(([name, eco]) => [
          name,
          {
            ...eco,
            components: Object.fromEntries(eco.components)
          }
        ])
      ),
      priorities: priorities
    };

    fs.writeFileSync('ecosystem-architecture-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Detailed ecosystem report saved to: ecosystem-architecture-report.json');
  }

  calculateEcosystemPriority(ecosystem) {
    let score = 0;
    
    // Business impact
    if (ecosystem.name.includes('Booking')) score += 30; // Core business function
    if (ecosystem.name.includes('Commerce')) score += 25; // Revenue generation
    if (ecosystem.name.includes('Profile')) score += 20; // User experience
    if (ecosystem.name.includes('Hub')) score += 15; // Community building
    if (ecosystem.name.includes('Event')) score += 20; // Core functionality
    
    // Technical readiness
    const components = Array.from(ecosystem.components.values());
    const pagesCount = components.filter(c => c.isPage).length;
    const formsCount = components.filter(c => c.isForm).length;
    const workflowCount = components.filter(c => c.isWorkflowStep).length;
    
    score += Math.min(pagesCount * 5, 20); // More pages = more complete
    score += Math.min(formsCount * 3, 15); // Forms indicate business logic
    score += Math.min(workflowCount * 4, 16); // Workflows indicate sophistication
    
    return Math.min(score, 100);
  }

  explainPriority(ecosystem) {
    const reasons = [];
    
    if (ecosystem.name.includes('Booking')) {
      reasons.push('Core revenue-generating functionality');
    }
    if (ecosystem.name.includes('Commerce')) {
      reasons.push('Direct monetization capability');
    }
    if (ecosystem.totalComponents > 15) {
      reasons.push('Large, comprehensive system');
    }
    
    const components = Array.from(ecosystem.components.values());
    if (components.filter(c => c.isWorkflowStep).length > 3) {
      reasons.push('Complex multi-step workflow ready for implementation');
    }
    
    return reasons.join(', ') || 'Standard business functionality';
  }

  suggestImplementation(ecosystem) {
    const suggestions = [];
    
    const components = Array.from(ecosystem.components.values());
    const hasWorkflow = components.some(c => c.isWorkflowStep);
    const hasPages = components.some(c => c.isPage);
    const hasDashboards = components.some(c => c.isDashboard);
    
    if (hasWorkflow) {
      suggestions.push('Implement multi-step routing with progress tracking');
    }
    if (hasPages) {
      suggestions.push('Create main page routes with loaders');
    }
    if (hasDashboards) {
      suggestions.push('Build authenticated dashboard routes');
    }
    
    return suggestions.join(', ') || 'Standard component integration';
  }
}

// Main execution
if (require.main === module) {
  const analyzer = new EcosystemAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = EcosystemAnalyzer;