#!/usr/bin/env node

/**
 * Unused Components Analyzer
 * 
 * Analyzes Magic Patterns components that haven't been integrated yet
 * to identify missing features and functionality gaps
 */

const fs = require('fs');
const path = require('path');

class UnusedComponentsAnalyzer {
  constructor() {
    this.integratedComponents = new Set();
    this.allComponents = new Map();
    this.unusedComponents = new Map();
    this.missingFeatures = new Map();
  }

  async analyze() {
    console.log('🔍 Analyzing Unused Magic Patterns Components\n');
    console.log('📊 Identifying missing features and functionality gaps...\n');
    
    // 1. Load integrated components from our routes
    await this.loadIntegratedComponents();
    
    // 2. Analyze all Magic Patterns components
    await this.analyzeAllComponents();
    
    // 3. Identify unused components and missing features
    await this.identifyUnusedComponents();
    
    // 4. Generate missing features report
    this.generateMissingFeaturesReport();
  }

  async loadIntegratedComponents() {
    console.log('📋 Loading integrated components from routes...');
    
    // Components we've integrated in our routes
    this.integratedComponents = new Set([
      // Phase 1: Core Booking Experience
      'EventDetailsStep',
      'RequirementsStep', 
      'ReviewStep',
      'ConfirmationStep',
      'ServicesAddonsForm',
      'ContactPaymentForm',
      'BookingConfirmation',
      'ConfettiCelebration',
      'BookingSummaryCard',
      'ActionButtons',
      'VenueInformation',
      'FinancialBreakdown',
      'ProgressIndicator',
      
      // Phase 2: Event Discovery
      'EventsPage',
      'EventDetailPage',
      'VenuesPage', 
      'VenueDetailPage',
      
      // Phase 3: Community Features
      'HubsDiscoveryPage',
      'SetupWizard',
      'PerformersPage',
      'SocialFeedPage'
    ]);
    
    console.log(`   ✅ Found ${this.integratedComponents.size} integrated components\n`);
  }

  async analyzeAllComponents() {
    console.log('🔍 Analyzing all Magic Patterns components...');
    
    const componentsPath = 'apps/web/app/components/magic-patterns/components';
    const pagesPath = 'apps/web/app/components/magic-patterns/pages';
    
    await this.scanDirectory(componentsPath, 'component');
    await this.scanDirectory(pagesPath, 'page');
    
    console.log(`   ✅ Analyzed ${this.allComponents.size} total components\n`);
  }

  async scanDirectory(dir, type) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        await this.scanDirectory(fullPath, type);
      } else if (entry.endsWith('.tsx') && !entry.includes('.ssr-backup')) {
        await this.analyzeComponent(fullPath, type);
      }
    }
  }

  async analyzeComponent(filePath, type) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const componentName = path.basename(filePath, '.tsx');
      const category = this.getComponentCategory(filePath);
      
      const analysis = {
        name: componentName,
        filePath: path.relative('apps/web/app/components/magic-patterns', filePath),
        type: type,
        category: category,
        isIntegrated: this.integratedComponents.has(componentName),
        
        // Feature analysis
        features: this.extractFeatures(content, componentName),
        businessFunction: this.identifyBusinessFunction(content, componentName, category),
        complexity: this.assessComplexity(content),
        
        // Technical analysis
        hasState: content.includes('useState'),
        hasEffects: content.includes('useEffect'),
        hasForm: this.hasFormElements(content),
        hasApiCall: this.hasApiCalls(content),
        hasNavigation: this.hasNavigationElements(content),
        
        // UI patterns
        uiPatterns: this.identifyUIPatterns(content, componentName),
        
        // Integration requirements
        needsRoute: this.needsRoute(componentName, content),
        needsAuth: this.needsAuth(content, componentName),
        needsData: this.needsDataLoading(content, componentName)
      };
      
      this.allComponents.set(componentName, analysis);
      
      if (!analysis.isIntegrated) {
        this.unusedComponents.set(componentName, analysis);
      }
      
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
    }
  }

  getComponentCategory(filePath) {
    const parts = filePath.split('/');
    const categoryIndex = parts.findIndex(p => p === 'components' || p === 'pages');
    const baseCategory = categoryIndex >= 0 ? parts[categoryIndex + 1] : 'unknown';
    
    // Enhanced categorization based on user insights
    const fileName = parts[parts.length - 1].toLowerCase();
    const componentName = fileName.replace('.tsx', '');
    const fullPath = filePath.toLowerCase();
    
    // User Profile & Authentication (enhanced path checking)
    if (baseCategory === 'auth' || 
        fileName.includes('auth') || fileName.includes('login') || fileName.includes('register') ||
        fileName.includes('signup') || fileName.includes('password') || fileName.includes('forgot') ||
        fullPath.includes('/auth/') || fullPath.includes('authentication')) {
      return 'authentication';
    }
    
    if (baseCategory === 'profile' || baseCategory === 'settings' ||
        fileName.includes('profile') || fileName.includes('settings') || fileName.includes('account') ||
        fileName.includes('preferences') || fileName.includes('privacy') ||
        fullPath.includes('/profile/') || fullPath.includes('/settings/')) {
      return 'user-profile-settings';
    }
    
    // Payment & Financial (enhanced path checking)
    if (baseCategory === 'checkout' || baseCategory === 'payment' ||
        fileName.includes('payment') || fileName.includes('checkout') || fileName.includes('billing') ||
        fileName.includes('invoice') || fileName.includes('subscription') || fileName.includes('pricing') ||
        fullPath.includes('/checkout/') || fullPath.includes('/payment/') || fullPath.includes('/billing/')) {
      return 'payment-financial';
    }
    
    // Dashboard Types - Venue Owners (enhanced detection)
    if ((baseCategory === 'dashboard' && fileName.includes('venue')) ||
        fileName.includes('venueowner') || fileName.includes('venue-owner') ||
        baseCategory === 'venue-profile' || baseCategory === 'venue-dashboard' ||
        componentName.includes('venueowner') || fullPath.includes('venue') && fileName.includes('dashboard')) {
      return 'venue-owner-dashboard';
    }
    
    // Dashboard Types - Performers (enhanced detection)
    if ((baseCategory === 'dashboard' && fileName.includes('performer')) ||
        fileName.includes('performer') || fileName.includes('artist') ||
        baseCategory === 'performer-dashboard' || baseCategory === 'artist-dashboard' ||
        componentName.includes('performer') || componentName.includes('artist') ||
        fullPath.includes('/performer/') || (fullPath.includes('/my/') && fileName.includes('fan'))) {
      return 'performer-dashboard';
    }
    
    // Dashboard Types - Event Coordinators (enhanced detection)
    if ((baseCategory === 'dashboard' && (fileName.includes('coordinator') || fileName.includes('organizer'))) ||
        fileName.includes('coordinator') || fileName.includes('organizer') || fileName.includes('eventmanager') ||
        baseCategory === 'coordinator-dashboard' || baseCategory === 'organizer-dashboard' ||
        componentName.includes('organizer') || componentName.includes('coordinator')) {
      return 'coordinator-dashboard';
    }
    
    // Dashboard Types - System Admin (enhanced detection)
    if ((baseCategory === 'dashboard' && fileName.includes('admin')) ||
        fileName.includes('admin') || fileName.includes('system') || fileName.includes('management') ||
        baseCategory === 'admin' || baseCategory === 'system-admin' ||
        fullPath.includes('/admin/') || componentName.includes('management') ||
        (fullPath.includes('/management/') || componentName.includes('venuemangement'))) {
      return 'admin-dashboard';
    }
    
    // General Dashboard (unspecified type) - enhanced detection
    if (baseCategory === 'dashboard' || fileName.includes('dashboard') ||
        (componentName.includes('dashboard') && !fileName.includes('venue') && !fileName.includes('performer') && 
         !fileName.includes('organizer') && !fileName.includes('admin'))) {
      return 'general-dashboard';
    }
    
    // Hub and Community Features
    if (baseCategory.includes('hub') || fileName.includes('hub') || fullPath.includes('/hub/')) {
      return 'community-hub';
    }
    
    // Event and Venue Management
    if (baseCategory === 'events' || baseCategory === 'venues' || 
        fileName.includes('event') || fileName.includes('venue') ||
        fullPath.includes('/event/') || fullPath.includes('/venue/')) {
      return 'event-venue-management';
    }
    
    // Booking System
    if (baseCategory === 'bookings' || fileName.includes('booking') || 
        fullPath.includes('/booking/') || componentName.includes('booking')) {
      return 'booking-system';
    }
    
    // Return enhanced base category
    return baseCategory || 'unknown';
  }

  extractFeatures(content, componentName) {
    const features = [];
    
    // UI Features
    if (content.includes('modal') || componentName.includes('Modal')) features.push('Modal Dialog');
    if (content.includes('dropdown') || content.includes('select')) features.push('Dropdown Menu');
    if (content.includes('tab') || componentName.includes('Tab')) features.push('Tabbed Interface');
    if (content.includes('accordion')) features.push('Accordion');
    if (content.includes('carousel') || content.includes('slider')) features.push('Carousel/Slider');
    if (content.includes('tooltip')) features.push('Tooltips');
    if (content.includes('notification') || content.includes('toast')) features.push('Notifications');
    if (content.includes('badge')) features.push('Badges');
    if (content.includes('avatar')) features.push('User Avatars');
    if (content.includes('chart') || content.includes('graph')) features.push('Data Visualization');
    if (content.includes('calendar') || content.includes('datepicker')) features.push('Calendar/Date Picker');
    if (content.includes('search') || content.includes('filter')) features.push('Search/Filter');
    if (content.includes('pagination')) features.push('Pagination');
    if (content.includes('drag') || content.includes('drop')) features.push('Drag & Drop');
    
    // Business Features
    if (content.includes('payment') || content.includes('stripe')) features.push('Payment Processing');
    if (content.includes('booking') || content.includes('reservation')) features.push('Booking System');
    if (content.includes('chat') || content.includes('message')) features.push('Messaging');
    if (content.includes('notification')) features.push('Notification System');
    if (content.includes('analytics') || content.includes('metric')) features.push('Analytics');
    if (content.includes('review') || content.includes('rating')) features.push('Reviews & Ratings');
    if (content.includes('favorite') || content.includes('wishlist')) features.push('Favorites/Wishlist');
    if (content.includes('share') || content.includes('social')) features.push('Social Sharing');
    if (content.includes('upload') || content.includes('file')) features.push('File Upload');
    if (content.includes('export') || content.includes('download')) features.push('Export/Download');
    
    // Technical Features  
    if (content.includes('realtime') || content.includes('websocket')) features.push('Real-time Updates');
    if (content.includes('offline') || content.includes('cache')) features.push('Offline Support');
    if (content.includes('lazy') || content.includes('virtual')) features.push('Performance Optimization');
    if (content.includes('accessibility') || content.includes('aria')) features.push('Accessibility');
    if (content.includes('responsive')) features.push('Responsive Design');
    
    return features;
  }

  identifyBusinessFunction(content, componentName, category) {
    const functions = [];
    
    // Enhanced category-based business functions based on user insights
    const categoryFunctions = {
      // Authentication & Registration
      'authentication': ['User login', 'Registration flow', 'Password management', 'Social authentication', 'Multi-factor auth', 'Account verification'],
      
      // User Profile & Settings
      'user-profile-settings': ['Profile management', 'Account customization', 'Privacy settings', 'Preferences', 'Personal data management', 'Account security'],
      
      // Payment & Financial
      'payment-financial': ['Payment processing', 'Billing management', 'Invoice generation', 'Subscription handling', 'Transaction history', 'Revenue tracking'],
      
      // Dashboard Types
      'venue-owner-dashboard': ['Booking management', 'Revenue analytics', 'Venue performance', 'Customer insights', 'Calendar management', 'Property oversight'],
      'performer-dashboard': ['Performance tracking', 'Booking calendar', 'Earnings overview', 'Profile management', 'Fan engagement', 'Portfolio showcase'],
      'coordinator-dashboard': ['Event planning', 'Team coordination', 'Budget tracking', 'Vendor management', 'Timeline oversight', 'Resource allocation'],
      'admin-dashboard': ['System management', 'User oversight', 'Platform analytics', 'Content moderation', 'Financial reporting', 'Security monitoring'],
      'general-dashboard': ['Data visualization', 'Performance metrics', 'Activity overview', 'Status monitoring', 'Quick actions', 'Summary displays'],
      
      // New enhanced categories
      'community-hub': ['Community building', 'Hub management', 'Member interaction', 'Content organization'],
      'event-venue-management': ['Event creation', 'Venue management', 'Facility coordination', 'Resource planning'],
      'booking-system': ['Reservation management', 'Availability tracking', 'Booking workflow', 'Calendar integration'],
      
      // Legacy categories
      'settings': ['Configuration management', 'Preferences', 'Account settings', 'Privacy controls'],
      'profile': ['User identity', 'Personal information', 'Account management', 'Profile customization'],
      'calendar': ['Event scheduling', 'Date management', 'Availability tracking', 'Time organization'],
      'checkout': ['Payment processing', 'Order completion', 'Transaction management', 'Purchase flow'],
      'tickets': ['Ticket management', 'Access control', 'Digital tickets', 'Entry validation'],
      'venue-detail': ['Venue information', 'Facility showcase', 'Booking interface', 'Amenity display'],
      'venue-marketplace': ['Venue discovery', 'Search and filtering', 'Comparison tools', 'Marketplace'],
      'venue-profile': ['Venue management', 'Profile editing', 'Availability management', 'Owner tools'],
      'directory': ['Member discovery', 'Contact management', 'Network building', 'User directory'],
      'sharing': ['Content sharing', 'Social distribution', 'Link sharing', 'Social media'],
      'ads': ['Advertisement display', 'Revenue generation', 'Promotion management', 'Marketing tools'],
      'hub-builder': ['Community creation', 'Customization tools', 'Hub configuration', 'Builder interface'],
      'hub': ['Community management', 'Content organization', 'Member interaction', 'Hub features']
    };
    
    if (categoryFunctions[category]) {
      functions.push(...categoryFunctions[category]);
    }
    
    // Component name-based functions with enhanced detection
    if (componentName.includes('Dashboard')) functions.push('Data overview', 'Management interface');
    if (componentName.includes('Editor')) functions.push('Content editing', 'WYSIWYG editing');
    if (componentName.includes('Builder')) functions.push('Creation tools', 'Configuration interface');
    if (componentName.includes('Wizard')) functions.push('Guided process', 'Step-by-step workflow');
    if (componentName.includes('Marketplace')) functions.push('Discovery', 'Buying/selling platform');
    if (componentName.includes('Analytics')) functions.push('Data analysis', 'Reporting', 'Metrics tracking');
    if (componentName.includes('Settings')) functions.push('Configuration', 'Preferences management');
    if (componentName.includes('Profile')) functions.push('Identity management', 'Personal data');
    
    // Enhanced detection for specific user types
    if (componentName.includes('VenueOwner') || componentName.includes('Venue')) {
      functions.push('Venue management', 'Property oversight', 'Booking coordination');
    }
    if (componentName.includes('Performer') || componentName.includes('Artist')) {
      functions.push('Performance management', 'Portfolio showcase', 'Fan engagement');
    }
    if (componentName.includes('Coordinator') || componentName.includes('Organizer')) {
      functions.push('Event coordination', 'Team management', 'Resource planning');
    }
    if (componentName.includes('Admin') || componentName.includes('Management')) {
      functions.push('System administration', 'User oversight', 'Platform control');
    }
    
    return functions.length > 0 ? functions : ['General UI component'];
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

  hasFormElements(content) {
    const formElements = ['input', 'textarea', 'select', 'form', 'onSubmit'];
    return formElements.some(element => content.includes(element));
  }

  hasApiCalls(content) {
    const apiIndicators = ['fetch', 'api', 'axios', 'query', 'mutation'];
    return apiIndicators.some(indicator => content.includes(indicator));
  }

  hasNavigationElements(content) {
    const navIndicators = ['Link', 'navigate', 'router', 'href', 'redirect'];
    return navIndicators.some(indicator => content.includes(indicator));
  }

  identifyUIPatterns(content, componentName) {
    const patterns = [];
    
    if (componentName.includes('Page')) patterns.push('Full Page Component');
    if (componentName.includes('Modal')) patterns.push('Modal Dialog');
    if (componentName.includes('Card')) patterns.push('Card Layout');
    if (componentName.includes('List') || componentName.includes('Grid')) patterns.push('Collection Display');
    if (componentName.includes('Form')) patterns.push('Form Component');
    if (componentName.includes('Button')) patterns.push('Action Component');
    if (componentName.includes('Widget')) patterns.push('Dashboard Widget');
    if (componentName.includes('Header') || componentName.includes('Footer')) patterns.push('Layout Component');
    if (componentName.includes('Sidebar') || componentName.includes('Navigation')) patterns.push('Navigation Component');
    
    return patterns;
  }

  needsRoute(componentName, content) {
    return componentName.includes('Page') || 
           componentName.includes('Dashboard') || 
           componentName.includes('Editor') ||
           content.includes('useLoaderData') ||
           content.includes('Form') && content.includes('action');
  }

  needsAuth(content, componentName) {
    return content.includes('auth') || 
           content.includes('login') || 
           componentName.includes('Dashboard') ||
           componentName.includes('Profile') ||
           componentName.includes('Settings');
  }

  needsDataLoading(content, componentName) {
    return content.includes('useEffect') || 
           content.includes('fetch') || 
           content.includes('api') ||
           componentName.includes('Page') ||
           componentName.includes('Dashboard') ||
           componentName.includes('List');
  }

  async identifyUnusedComponents() {
    console.log('🔍 Identifying unused components and missing features...\n');
    
    // Group unused components by category
    const categorizedUnused = new Map();
    
    for (const [name, component] of this.unusedComponents.entries()) {
      if (!categorizedUnused.has(component.category)) {
        categorizedUnused.set(component.category, []);
      }
      categorizedUnused.get(component.category).push(component);
    }
    
    // Analyze missing features by category
    for (const [category, components] of categorizedUnused.entries()) {
      const categoryFeatures = {
        category: category,
        componentCount: components.length,
        components: components,
        missingFeatures: this.identifyMissingFeatures(components),
        businessImpact: this.assessBusinessImpact(category, components),
        priority: this.calculatePriority(category, components)
      };
      
      this.missingFeatures.set(category, categoryFeatures);
    }
    
    console.log(`   ✅ Found ${this.unusedComponents.size} unused components in ${categorizedUnused.size} categories\n`);
  }

  identifyMissingFeatures(components) {
    const allFeatures = new Set();
    const businessFunctions = new Set();
    
    components.forEach(comp => {
      comp.features.forEach(feature => allFeatures.add(feature));
      comp.businessFunction.forEach(func => businessFunctions.add(func));
    });
    
    return {
      uiFeatures: Array.from(allFeatures),
      businessFunctions: Array.from(businessFunctions),
      technicalCapabilities: this.identifyTechnicalCapabilities(components)
    };
  }

  identifyTechnicalCapabilities(components) {
    const capabilities = [];
    
    const hasComplexForms = components.some(c => c.hasForm && c.complexity !== 'Simple');
    const hasRealTimeFeatures = components.some(c => c.hasApiCall && c.hasEffects);
    const hasAdvancedUI = components.some(c => c.uiPatterns.length > 2);
    const hasDataVisualization = components.some(c => c.features.includes('Data Visualization'));
    const hasFileHandling = components.some(c => c.features.includes('File Upload'));
    const hasPaymentProcessing = components.some(c => c.features.includes('Payment Processing'));
    
    if (hasComplexForms) capabilities.push('Advanced Form Processing');
    if (hasRealTimeFeatures) capabilities.push('Real-time Data Updates');
    if (hasAdvancedUI) capabilities.push('Advanced UI Patterns');
    if (hasDataVisualization) capabilities.push('Data Visualization & Analytics');
    if (hasFileHandling) capabilities.push('File Upload & Management');
    if (hasPaymentProcessing) capabilities.push('Payment & Transaction Processing');
    
    return capabilities;
  }

  assessBusinessImpact(category, components) {
    const impactScores = {
      // Critical User Areas
      'authentication': 'Critical - User onboarding and access control',
      'payment-financial': 'Critical - Revenue generation and financial operations',
      'user-profile-settings': 'High - User retention and engagement',
      
      // Dashboard Categories
      'venue-owner-dashboard': 'Critical - Primary revenue partner tools',
      'performer-dashboard': 'High - Content creator engagement',
      'coordinator-dashboard': 'High - Event management efficiency',
      'admin-dashboard': 'Critical - Platform operations and control',
      'general-dashboard': 'Medium - Data visualization and monitoring',
      
      // Legacy categories
      'settings': 'Medium - User experience and customization',
      'profile': 'Medium - User engagement and personalization',
      'calendar': 'High - Core event management functionality',
      'checkout': 'Critical - Revenue generation',
      'tickets': 'High - Access control and revenue',
      'venue-detail': 'High - Core discovery and booking',
      'venue-marketplace': 'High - Primary user acquisition',
      'venue-profile': 'Medium - Venue owner tools',
      'directory': 'Medium - Community building',
      'sharing': 'Low - Social engagement',
      'ads': 'Medium - Revenue generation',
      'hub-builder': 'High - Community platform differentiation',
      'hub': 'High - Core community features'
    };
    
    return impactScores[category] || 'Low - Supporting functionality';
  }

  calculatePriority(category, components) {
    const priorityScores = {
      // Critical priorities (9-10)
      'authentication': 10,
      'payment-financial': 10,
      'venue-owner-dashboard': 10,
      'admin-dashboard': 9,
      
      // High priorities (7-8)
      'user-profile-settings': 8,
      'coordinator-dashboard': 8,
      'performer-dashboard': 7,
      'checkout': 10,
      'tickets': 9,
      'calendar': 8,
      'venue-marketplace': 7,
      'venue-detail': 7,
      'hub-builder': 7,
      
      // Medium priorities (5-6)
      'general-dashboard': 6,
      'hub': 6,
      'profile': 5,
      'venue-profile': 5,
      
      // Lower priorities (2-4)
      'directory': 4,
      'settings': 4,
      'ads': 3,
      'sharing': 2
    };
    
    const baseScore = priorityScores[category] || 1;
    const complexityBonus = components.filter(c => c.complexity === 'Complex' || c.complexity === 'Very Complex').length;
    const routeBonus = components.filter(c => c.needsRoute).length;
    
    return Math.min(10, baseScore + complexityBonus + routeBonus);
  }

  generateMissingFeaturesReport() {
    console.log('=' .repeat(120));
    console.log('🔍 UNUSED COMPONENTS & MISSING FEATURES ANALYSIS');
    console.log('=' .repeat(120));
    
    console.log(`\n📊 OVERVIEW:`);
    console.log(`Total Components: ${this.allComponents.size}`);
    console.log(`Integrated Components: ${this.integratedComponents.size}`);
    console.log(`Unused Components: ${this.unusedComponents.size}`);
    console.log(`Missing Feature Categories: ${this.missingFeatures.size}`);
    
    const integrationPercentage = ((this.integratedComponents.size / this.allComponents.size) * 100).toFixed(1);
    console.log(`Integration Progress: ${integrationPercentage}%\n`);
    
    // Sort by priority
    const sortedCategories = Array.from(this.missingFeatures.entries())
      .sort(([,a], [,b]) => b.priority - a.priority);
    
    console.log('🎯 MISSING FEATURES BY PRIORITY:');
    console.log('='.repeat(50));
    
    sortedCategories.forEach(([categoryName, category], index) => {
      console.log(`\n${index + 1}. ${categoryName.toUpperCase()} (Priority: ${category.priority}/10)`);
      console.log(`   Components: ${category.componentCount}`);
      console.log(`   Business Impact: ${category.businessImpact}`);
      
      console.log(`   🎨 Missing UI Features:`);
      category.missingFeatures.uiFeatures.slice(0, 5).forEach(feature => {
        console.log(`     • ${feature}`);
      });
      if (category.missingFeatures.uiFeatures.length > 5) {
        console.log(`     • ... and ${category.missingFeatures.uiFeatures.length - 5} more`);
      }
      
      console.log(`   🏢 Missing Business Functions:`);
      category.missingFeatures.businessFunctions.slice(0, 3).forEach(func => {
        console.log(`     • ${func}`);
      });
      
      if (category.missingFeatures.technicalCapabilities.length > 0) {
        console.log(`   ⚡ Technical Capabilities:`);
        category.missingFeatures.technicalCapabilities.forEach(cap => {
          console.log(`     • ${cap}`);
        });
      }
      
      console.log(`   📋 Key Unused Components:`);
      category.components.slice(0, 3).forEach(comp => {
        console.log(`     • ${comp.name} (${comp.complexity})`);
      });
      if (category.components.length > 3) {
        console.log(`     • ... and ${category.components.length - 3} more components`);
      }
    });
    
    console.log('\n🚀 IMPLEMENTATION RECOMMENDATIONS:');
    console.log('='.repeat(50));
    
    console.log('\n📈 HIGH PRIORITY (Implement Next):');
    const highPriority = sortedCategories.filter(([,cat]) => cat.priority >= 8);
    highPriority.forEach(([name, cat]) => {
      console.log(`   • ${name}: ${cat.businessImpact}`);
    });
    
    console.log('\n⭐ MEDIUM PRIORITY (Phase 2):');
    const mediumPriority = sortedCategories.filter(([,cat]) => cat.priority >= 5 && cat.priority < 8);
    mediumPriority.forEach(([name, cat]) => {
      console.log(`   • ${name}: ${cat.businessImpact}`);
    });
    
    console.log('\n💡 LOW PRIORITY (Future Enhancement):');
    const lowPriority = sortedCategories.filter(([,cat]) => cat.priority < 5);
    lowPriority.forEach(([name, cat]) => {
      console.log(`   • ${name}: ${cat.businessImpact}`);
    });
    
    console.log('\n🎯 TOP MISSING CAPABILITIES:');
    console.log('='.repeat(35));
    
    const allCapabilities = new Map();
    for (const [, category] of this.missingFeatures.entries()) {
      category.missingFeatures.technicalCapabilities.forEach(cap => {
        allCapabilities.set(cap, (allCapabilities.get(cap) || 0) + 1);
      });
    }
    
    Array.from(allCapabilities.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([capability, count]) => {
        console.log(`   • ${capability} (${count} categories)`);
      });
    
    console.log('\n📋 IMMEDIATE NEXT STEPS:');
    console.log('='.repeat(30));
    console.log('1. Implement checkout & tickets system (Critical for revenue)');
    console.log('2. Add calendar & scheduling features (Core functionality)');
    console.log('3. Create dashboard & analytics (Business intelligence)');
    console.log('4. Build venue marketplace features (User acquisition)');
    console.log('5. Enhance hub builder tools (Platform differentiation)');
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalComponents: this.allComponents.size,
        integratedComponents: this.integratedComponents.size,
        unusedComponents: this.unusedComponents.size,
        integrationPercentage: parseFloat(integrationPercentage),
        missingCategories: this.missingFeatures.size
      },
      missingFeatures: Object.fromEntries(this.missingFeatures),
      unusedComponents: Object.fromEntries(this.unusedComponents),
      recommendations: {
        highPriority: highPriority.map(([name]) => name),
        mediumPriority: mediumPriority.map(([name]) => name),
        lowPriority: lowPriority.map(([name]) => name)
      }
    };
    
    fs.writeFileSync('unused-components-analysis.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed analysis saved to: unused-components-analysis.json');
  }
}

// Main execution
if (require.main === module) {
  const analyzer = new UnusedComponentsAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = UnusedComponentsAnalyzer;