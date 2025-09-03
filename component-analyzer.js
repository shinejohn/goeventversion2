#!/usr/bin/env node

/**
 * Magic Patterns Component Analyzer
 * 
 * Analyzes each component to understand what it actually does
 * and creates a comprehensive reference guide
 */

const fs = require('fs');
const path = require('path');

class ComponentAnalyzer {
  constructor() {
    this.components = [];
    this.analysis = {
      pages: [],
      components: [],
      ui: [],
      layout: [],
      statistics: {}
    };
  }

  async analyze() {
    console.log('🔍 Magic Patterns Component Analyzer\n');
    
    // 1. Scan all components
    await this.scanComponents();
    
    // 2. Analyze component functionality
    await this.analyzeComponents();
    
    // 3. Generate reference guide
    this.generateReferenceGuide();
    
    // 4. Create component mapping suggestions
    this.createMappingSuggestions();
  }

  async scanComponents() {
    console.log('📋 Scanning Magic Patterns components...\n');
    
    const basePath = 'apps/web/app/components/magic-patterns';
    
    // Scan different component categories
    await this.scanDirectory(path.join(basePath, 'pages'), 'page');
    await this.scanDirectory(path.join(basePath, 'components'), 'component');
  }

  async scanDirectory(dir, type, category = '') {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      return;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const newCategory = category ? `${category}/${file}` : file;
        await this.scanDirectory(fullPath, type, newCategory);
      } else if (file.endsWith('.tsx') && !file.includes('.ssr-backup') && !file.includes('.disabled')) {
        await this.analyzeComponent(fullPath, type, category);
      }
    }
  }

  async analyzeComponent(filePath, type, category) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative('apps/web/app/components/magic-patterns', filePath);
      const componentName = path.basename(filePath, '.tsx');
      
      const analysis = {
        name: componentName,
        filePath: relativePath,
        fullPath: filePath,
        type: type,
        category: category || 'uncategorized',
        
        // Basic analysis
        size: content.length,
        hasDefaultExport: content.includes('export default'),
        hasNamedExports: /export\s+(const|function|class)\s+/.test(content),
        
        // Functionality analysis
        purpose: this.analyzePurpose(content, componentName),
        features: this.analyzeFeatures(content),
        dependencies: this.analyzeDependencies(content),
        props: this.analyzeProps(content),
        ui_elements: this.analyzeUIElements(content),
        
        // Route/navigation analysis
        usedInRoutes: [],
        
        // Quality indicators
        complexity: this.calculateComplexity(content),
        maintainability: this.assessMaintainability(content)
      };
      
      this.components.push(analysis);
      
    } catch (error) {
      console.log(`❌ Error analyzing ${filePath}: ${error.message}`);
    }
  }

  analyzePurpose(content, componentName) {
    const purposes = [];
    
    // Analyze component name patterns
    if (componentName.includes('Page')) purposes.push('Full page component');
    if (componentName.includes('Modal')) purposes.push('Modal/popup component');
    if (componentName.includes('Form')) purposes.push('Form component');
    if (componentName.includes('Card')) purposes.push('Card display component');
    if (componentName.includes('List')) purposes.push('List display component');
    if (componentName.includes('Grid')) purposes.push('Grid layout component');
    if (componentName.includes('Dashboard')) purposes.push('Dashboard/analytics component');
    if (componentName.includes('Profile')) purposes.push('User profile component');
    if (componentName.includes('Settings')) purposes.push('Settings/configuration component');
    if (componentName.includes('Auth')) purposes.push('Authentication component');
    if (componentName.includes('Booking')) purposes.push('Booking/reservation component');
    if (componentName.includes('Calendar')) purposes.push('Calendar/scheduling component');
    if (componentName.includes('Event')) purposes.push('Event-related component');
    if (componentName.includes('Venue')) purposes.push('Venue-related component');
    if (componentName.includes('Performer')) purposes.push('Performer-related component');
    if (componentName.includes('Ticket')) purposes.push('Ticket-related component');
    if (componentName.includes('Social')) purposes.push('Social features component');
    if (componentName.includes('Message')) purposes.push('Messaging component');
    if (componentName.includes('Notification')) purposes.push('Notification component');
    if (componentName.includes('Search')) purposes.push('Search component');
    if (componentName.includes('Filter')) purposes.push('Filtering component');
    if (componentName.includes('Navigation')) purposes.push('Navigation component');
    if (componentName.includes('Header')) purposes.push('Header component');
    if (componentName.includes('Footer')) purposes.push('Footer component');
    if (componentName.includes('Sidebar')) purposes.push('Sidebar component');
    
    // Analyze content for additional clues
    const contentLower = content.toLowerCase();
    if (contentLower.includes('useState') || contentLower.includes('useEffect')) {
      purposes.push('Stateful/interactive component');
    }
    if (contentLower.includes('form') && contentLower.includes('submit')) {
      purposes.push('Form submission component');
    }
    if (contentLower.includes('api') || contentLower.includes('fetch')) {
      purposes.push('Data fetching component');
    }
    if (contentLower.includes('upload')) {
      purposes.push('File upload component');
    }
    if (contentLower.includes('payment') || contentLower.includes('checkout')) {
      purposes.push('Payment/checkout component');
    }
    
    return purposes.length > 0 ? purposes : ['General UI component'];
  }

  analyzeFeatures(content) {
    const features = [];
    
    // UI features
    if (content.includes('useState')) features.push('State management');
    if (content.includes('useEffect')) features.push('Side effects');
    if (content.includes('useQuery') || content.includes('useMutation')) features.push('Data fetching');
    if (content.includes('useForm')) features.push('Form handling');
    if (content.includes('toast')) features.push('Notifications');
    if (content.includes('Modal')) features.push('Modal dialogs');
    if (content.includes('Dropdown')) features.push('Dropdown menus');
    if (content.includes('Tabs')) features.push('Tab navigation');
    if (content.includes('Pagination')) features.push('Pagination');
    if (content.includes('Search')) features.push('Search functionality');
    if (content.includes('Filter')) features.push('Filtering');
    if (content.includes('Sort')) features.push('Sorting');
    if (content.includes('Calendar')) features.push('Calendar functionality');
    if (content.includes('Map')) features.push('Map integration');
    if (content.includes('Chart')) features.push('Data visualization');
    if (content.includes('Upload')) features.push('File upload');
    if (content.includes('Download')) features.push('File download');
    if (content.includes('Share')) features.push('Social sharing');
    if (content.includes('Comment')) features.push('Comments system');
    if (content.includes('Rating')) features.push('Rating system');
    if (content.includes('Review')) features.push('Review system');
    if (content.includes('Booking')) features.push('Booking system');
    if (content.includes('Payment')) features.push('Payment processing');
    if (content.includes('Authentication') || content.includes('Login')) features.push('Authentication');
    if (content.includes('Permission')) features.push('Access control');
    if (content.includes('Responsive')) features.push('Responsive design');
    if (content.includes('Animation')) features.push('Animations');
    if (content.includes('Lazy')) features.push('Lazy loading');
    if (content.includes('Infinite')) features.push('Infinite scroll');
    if (content.includes('Real-time') || content.includes('WebSocket')) features.push('Real-time updates');
    
    return features;
  }

  analyzeDependencies(content) {
    const dependencies = [];
    
    // Extract imports
    const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const dep = match.match(/from\s+['"]([^'"]+)['"]/)[1];
        if (!dep.startsWith('.') && !dep.startsWith('~')) {
          dependencies.push(dep);
        }
      });
    }
    
    return [...new Set(dependencies)];
  }

  analyzeProps(content) {
    const props = [];
    
    // Look for prop types or interfaces
    const propMatches = content.match(/interface\s+\w*Props\s*{([^}]+)}/gs);
    if (propMatches) {
      propMatches.forEach(match => {
        const propContent = match.match(/{([^}]+)}/s);
        if (propContent) {
          const propLines = propContent[1].split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('//'));
          props.push(...propLines);
        }
      });
    }
    
    // Look for destructured props
    const destructuredMatch = content.match(/function\s+\w+\s*\(\s*{\s*([^}]+)\s*}/);
    if (destructuredMatch) {
      const propsStr = destructuredMatch[1];
      const propNames = propsStr.split(',').map(p => p.trim().split(':')[0].trim());
      props.push(...propNames);
    }
    
    return [...new Set(props)];
  }

  analyzeUIElements(content) {
    const elements = [];
    
    // Common UI elements
    const uiPatterns = [
      'Button', 'Input', 'Form', 'Card', 'Modal', 'Dropdown', 'Table', 'List',
      'Grid', 'Tabs', 'Accordion', 'Carousel', 'Slider', 'Progress', 'Badge',
      'Alert', 'Toast', 'Tooltip', 'Popover', 'Menu', 'Breadcrumb', 'Pagination',
      'Avatar', 'Image', 'Video', 'Audio', 'Chart', 'Map', 'Calendar', 'DatePicker',
      'TimePicker', 'ColorPicker', 'FileUpload', 'TextEditor', 'CodeEditor'
    ];
    
    uiPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        elements.push(pattern);
      }
    });
    
    return elements;
  }

  calculateComplexity(content) {
    let complexity = 0;
    
    // Count various complexity indicators
    complexity += (content.match(/if\s*\(/g) || []).length;
    complexity += (content.match(/else/g) || []).length;
    complexity += (content.match(/switch/g) || []).length;
    complexity += (content.match(/case/g) || []).length;
    complexity += (content.match(/for\s*\(/g) || []).length;
    complexity += (content.match(/while\s*\(/g) || []).length;
    complexity += (content.match(/&&/g) || []).length;
    complexity += (content.match(/\|\|/g) || []).length;
    complexity += (content.match(/\?/g) || []).length; // ternary operators
    complexity += (content.match(/useEffect/g) || []).length;
    complexity += (content.match(/useState/g) || []).length;
    
    if (complexity <= 5) return 'low';
    if (complexity <= 15) return 'medium';
    return 'high';
  }

  assessMaintainability(content) {
    let score = 100;
    
    // Deduct for long files
    if (content.length > 2000) score -= 10;
    if (content.length > 5000) score -= 20;
    
    // Deduct for lack of comments
    const commentCount = (content.match(/\/\//g) || []).length + (content.match(/\/\*[\s\S]*?\*\//g) || []).length;
    if (commentCount === 0 && content.length > 500) score -= 15;
    
    // Deduct for deeply nested code
    const maxIndentation = Math.max(...content.split('\n').map(line => 
      line.length - line.trimStart().length
    ));
    if (maxIndentation > 20) score -= 10;
    
    // Add points for good practices
    if (content.includes('interface') || content.includes('type')) score += 10;
    if (content.includes('export default')) score += 5;
    
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'needs improvement';
  }

  analyzeComponents() {
    console.log(`📊 Analyzing ${this.components.length} components...\n`);
    
    // Find route usage
    this.findRouteUsage();
    
    // Categorize components
    this.categorizeComponents();
  }

  findRouteUsage() {
    const routesDir = 'apps/web/app/routes';
    
    if (!fs.existsSync(routesDir)) return;
    
    // Scan route files to see which components are used
    this.scanRouteFiles(routesDir);
  }

  scanRouteFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('_')) {
        this.scanRouteFiles(fullPath);
      } else if (file.endsWith('.tsx') && !file.startsWith('_')) {
        this.findComponentUsageInRoute(fullPath);
      }
    }
  }

  findComponentUsageInRoute(routeFile) {
    try {
      const content = fs.readFileSync(routeFile, 'utf8');
      const routePath = path.relative('apps/web/app/routes', routeFile);
      
      // Find magic patterns imports
      const importMatches = content.match(/from\s+['"][^'"]*magic-patterns[^'"]*['"]/g);
      if (importMatches) {
        importMatches.forEach(importMatch => {
          const componentPath = importMatch.match(/magic-patterns\/(.+)['"]/)?.[1];
          if (componentPath) {
            // Find the component that matches this import
            const component = this.components.find(c => 
              c.filePath.includes(componentPath) || 
              c.name === componentPath ||
              c.filePath.endsWith(`${componentPath}.tsx`)
            );
            
            if (component) {
              component.usedInRoutes.push(routePath);
            }
          }
        });
      }
    } catch (error) {
      // Ignore errors
    }
  }

  categorizeComponents() {
    this.analysis.pages = this.components.filter(c => c.type === 'page');
    this.analysis.components = this.components.filter(c => c.type === 'component');
    
    // Further categorize by functionality
    this.analysis.ui = this.components.filter(c => 
      c.category.includes('ui') || 
      c.purpose.some(p => p.includes('UI'))
    );
    
    this.analysis.layout = this.components.filter(c =>
      c.category.includes('layout') ||
      c.name.includes('Header') ||
      c.name.includes('Footer') ||
      c.name.includes('Sidebar') ||
      c.name.includes('Navigation')
    );
    
    // Generate statistics
    this.analysis.statistics = {
      total: this.components.length,
      pages: this.analysis.pages.length,
      components: this.analysis.components.length,
      byComplexity: {
        low: this.components.filter(c => c.complexity === 'low').length,
        medium: this.components.filter(c => c.complexity === 'medium').length,
        high: this.components.filter(c => c.complexity === 'high').length
      },
      byMaintainability: {
        excellent: this.components.filter(c => c.maintainability === 'excellent').length,
        good: this.components.filter(c => c.maintainability === 'good').length,
        fair: this.components.filter(c => c.maintainability === 'fair').length,
        'needs improvement': this.components.filter(c => c.maintainability === 'needs improvement').length
      },
      usedInRoutes: this.components.filter(c => c.usedInRoutes.length > 0).length,
      unused: this.components.filter(c => c.usedInRoutes.length === 0).length
    };
  }

  generateReferenceGuide() {
    console.log('\n' + '='.repeat(80));
    console.log('📚 MAGIC PATTERNS COMPONENT REFERENCE GUIDE');
    console.log('='.repeat(80));

    console.log('\n📊 OVERVIEW:');
    console.log(`Total Components: ${this.analysis.statistics.total}`);
    console.log(`Pages: ${this.analysis.statistics.pages}`);
    console.log(`Components: ${this.analysis.statistics.components}`);
    console.log(`Used in Routes: ${this.analysis.statistics.usedInRoutes}`);
    console.log(`Unused: ${this.analysis.statistics.unused}`);

    // Show most important/commonly used components first
    const sortedComponents = [...this.components]
      .sort((a, b) => {
        // Prioritize by route usage, then by type (pages first), then alphabetically
        if (a.usedInRoutes.length !== b.usedInRoutes.length) {
          return b.usedInRoutes.length - a.usedInRoutes.length;
        }
        if (a.type !== b.type) {
          return a.type === 'page' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

    // Group by functionality for better organization
    const groupedComponents = this.groupComponentsByFunction(sortedComponents);

    for (const [groupName, components] of Object.entries(groupedComponents)) {
      if (components.length === 0) continue;
      
      console.log(`\n🏷️  ${groupName.toUpperCase()} COMPONENTS:`);
      console.log('-'.repeat(50));

      components.slice(0, 20).forEach(component => { // Show top 20 per group
        console.log(`\n📄 ${component.name}`);
        console.log(`   Path: ${component.filePath}`);
        console.log(`   Purpose: ${component.purpose.join(', ')}`);
        if (component.features.length > 0) {
          console.log(`   Features: ${component.features.slice(0, 5).join(', ')}${component.features.length > 5 ? '...' : ''}`);
        }
        if (component.usedInRoutes.length > 0) {
          console.log(`   Used in: ${component.usedInRoutes.slice(0, 3).join(', ')}${component.usedInRoutes.length > 3 ? '...' : ''}`);
        } else {
          console.log(`   Status: ⚠️  Not used in any routes`);
        }
        console.log(`   Complexity: ${component.complexity} | Maintainability: ${component.maintainability}`);
      });

      if (components.length > 20) {
        console.log(`\n   ... and ${components.length - 20} more ${groupName} components`);
      }
    }

    // Save detailed analysis
    const reportData = {
      timestamp: new Date().toISOString(),
      statistics: this.analysis.statistics,
      components: this.components,
      recommendations: this.generateRecommendations()
    };

    fs.writeFileSync('component-analysis-report.json', JSON.stringify(reportData, null, 2));
    
    console.log('\n📄 Detailed analysis saved to: component-analysis-report.json');
  }

  groupComponentsByFunction(components) {
    const groups = {
      'Pages': [],
      'Authentication': [],
      'Booking & Events': [],
      'Social & Communication': [],
      'Venues & Performers': [],
      'Tickets & Payment': [],
      'Calendar & Scheduling': [],
      'Forms & Input': [],
      'Layout & Navigation': [],
      'UI Components': [],
      'Dashboard & Analytics': [],
      'Other': []
    };

    components.forEach(component => {
      const purposes = component.purpose.join(' ').toLowerCase();
      const name = component.name.toLowerCase();
      
      if (component.type === 'page') {
        groups['Pages'].push(component);
      } else if (purposes.includes('auth') || name.includes('auth') || name.includes('login')) {
        groups['Authentication'].push(component);
      } else if (purposes.includes('booking') || purposes.includes('event') || name.includes('booking') || name.includes('event')) {
        groups['Booking & Events'].push(component);
      } else if (purposes.includes('social') || purposes.includes('message') || purposes.includes('notification') || name.includes('social') || name.includes('message')) {
        groups['Social & Communication'].push(component);
      } else if (purposes.includes('venue') || purposes.includes('performer') || name.includes('venue') || name.includes('performer')) {
        groups['Venues & Performers'].push(component);
      } else if (purposes.includes('ticket') || purposes.includes('payment') || name.includes('ticket') || name.includes('payment')) {
        groups['Tickets & Payment'].push(component);
      } else if (purposes.includes('calendar') || name.includes('calendar')) {
        groups['Calendar & Scheduling'].push(component);
      } else if (purposes.includes('form') || name.includes('form')) {
        groups['Forms & Input'].push(component);
      } else if (purposes.includes('header') || purposes.includes('footer') || purposes.includes('navigation') || component.category.includes('layout')) {
        groups['Layout & Navigation'].push(component);
      } else if (purposes.includes('dashboard') || purposes.includes('analytics') || name.includes('dashboard')) {
        groups['Dashboard & Analytics'].push(component);
      } else if (component.type === 'component') {
        groups['UI Components'].push(component);
      } else {
        groups['Other'].push(component);
      }
    });

    return groups;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Find unused components
    const unused = this.components.filter(c => c.usedInRoutes.length === 0);
    if (unused.length > 0) {
      recommendations.push({
        type: 'cleanup',
        message: `${unused.length} components are not used in any routes - consider removing or documenting why they exist`,
        components: unused.map(c => c.name)
      });
    }

    // Find complex components
    const complex = this.components.filter(c => c.complexity === 'high');
    if (complex.length > 0) {
      recommendations.push({
        type: 'refactor',
        message: `${complex.length} components have high complexity - consider breaking them down`,
        components: complex.map(c => c.name)
      });
    }

    // Find duplicate functionality
    const nameGroups = {};
    this.components.forEach(c => {
      const baseName = c.name.replace(/(Page|Component|Form|Card|Modal)$/i, '');
      if (!nameGroups[baseName]) nameGroups[baseName] = [];
      nameGroups[baseName].push(c);
    });
    
    const duplicates = Object.entries(nameGroups).filter(([_, comps]) => comps.length > 1);
    if (duplicates.length > 0) {
      recommendations.push({
        type: 'consolidate',
        message: 'Found potential duplicate functionality in components with similar names',
        groups: duplicates.map(([name, comps]) => ({
          baseName: name,
          components: comps.map(c => c.name)
        }))
      });
    }

    return recommendations;
  }

  createMappingSuggestions() {
    console.log('\n🎯 COMPONENT MAPPING SUGGESTIONS:');
    console.log('='.repeat(60));
    
    // Suggest correct components for common route patterns
    const routePatterns = {
      'auth/sign-in': ['LoginPage', 'AuthPage'],
      'auth/sign-up': ['RegisterPage', 'SignUpPage'],
      'events': ['EventsPage', 'EventDiscoveryPage'],
      'events/$id': ['EventDetailPage'],
      'venues': ['VenuesPage'],
      'venues/$id': ['VenueDetailPage'],
      'performers': ['PerformersPage', 'PerformerDiscoveryPage'],
      'performers/$id': ['PerformerProfilePage'],
      'tickets': ['TicketsPage'],
      'calendar': ['CalendarPage'],
      'social': ['SocialFeedPage'],
      'messages': ['MessagesPage'],
      'notifications': ['NotificationsPage'],
      'dashboard': ['DashboardPage', 'FanDashboardPage']
    };

    console.log('\n📋 Route → Component Mapping Suggestions:');
    for (const [route, suggestions] of Object.entries(routePatterns)) {
      const availableComponents = suggestions.filter(name => 
        this.components.find(c => c.name === name)
      );
      
      if (availableComponents.length > 0) {
        console.log(`\n   /${route} →`);
        availableComponents.forEach(name => {
          const component = this.components.find(c => c.name === name);
          console.log(`      ✅ ${name} (${component.filePath})`);
          console.log(`         Purpose: ${component.purpose[0]}`);
          console.log(`         Used: ${component.usedInRoutes.length > 0 ? 'Yes' : 'No'}`);
        });
      }
    }

    console.log('\n🔧 Next steps:');
    console.log('1. Review the component analysis report');
    console.log('2. Use the mapping suggestions to fix route imports');
    console.log('3. Consider consolidating similar components');
    console.log('4. Remove or document unused components');
  }
}

// Main execution
if (require.main === module) {
  const analyzer = new ComponentAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = ComponentAnalyzer;