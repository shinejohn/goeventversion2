#!/usr/bin/env node

/**
 * Booking Workflow System Analyzer
 * 
 * Analyzes the booking directory as a complete workflow system
 * and identifies the React Router 7 integration needs
 */

const fs = require('fs');
const path = require('path');

class BookingWorkflowAnalyzer {
  constructor() {
    this.bookingComponents = new Map();
    this.workflowSteps = [];
    this.formComponents = [];
    this.routeNeeds = new Map();
  }

  async analyze() {
    console.log('🔄 Booking Workflow System Analysis\n');
    
    // 1. Analyze booking directory structure
    await this.analyzeBookingDirectory();
    
    // 2. Analyze booking-form directory
    await this.analyzeBookingFormDirectory();
    
    // 3. Analyze bookings management directory  
    await this.analyzeBookingsDirectory();
    
    // 4. Map workflow sequence
    this.mapWorkflowSequence();
    
    // 5. Generate React Router 7 integration plan
    this.generateRouterIntegrationPlan();
  }

  async analyzeBookingDirectory() {
    console.log('📋 Analyzing booking workflow steps...\n');
    
    const bookingDir = 'apps/web/app/components/magic-patterns/components/booking';
    if (!fs.existsSync(bookingDir)) {
      console.log('❌ Booking directory not found');
      return;
    }
    
    const files = fs.readdirSync(bookingDir);
    
    for (const file of files) {
      if (file.endsWith('.tsx') && !file.includes('.ssr-backup')) {
        const filePath = path.join(bookingDir, file);
        await this.analyzeBookingStep(filePath, 'workflow-step');
      }
    }
  }

  async analyzeBookingFormDirectory() {
    console.log('📋 Analyzing booking form components...\n');
    
    const formDir = 'apps/web/app/components/magic-patterns/components/booking-form';
    if (!fs.existsSync(formDir)) {
      console.log('❌ Booking-form directory not found');
      return;
    }
    
    const files = fs.readdirSync(formDir);
    
    for (const file of files) {
      if (file.endsWith('.tsx') && !file.includes('.ssr-backup')) {
        const filePath = path.join(formDir, file);
        await this.analyzeBookingStep(filePath, 'form-component');
      }
    }
  }

  async analyzeBookingsDirectory() {
    console.log('📋 Analyzing booking management components...\n');
    
    const bookingsDir = 'apps/web/app/components/magic-patterns/components/bookings';
    if (!fs.existsSync(bookingsDir)) {
      console.log('❌ Bookings directory not found');
      return;
    }
    
    const files = fs.readdirSync(bookingsDir);
    
    for (const file of files) {
      if (file.endsWith('.tsx') && !file.includes('.ssr-backup')) {
        const filePath = path.join(bookingsDir, file);
        await this.analyzeBookingStep(filePath, 'management-component');
      }
    }
  }

  async analyzeBookingStep(filePath, category) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const componentName = path.basename(filePath, '.tsx');
      
      const analysis = {
        name: componentName,
        category: category,
        filePath: filePath,
        
        // Form analysis
        hasFormElements: this.hasFormElements(content),
        hasFormSubmission: this.hasFormSubmission(content),
        hasValidation: this.hasValidation(content),
        
        // State management
        hasState: content.includes('useState'),
        hasEffects: content.includes('useEffect'),
        hasContext: content.includes('useContext') || content.includes('Context'),
        
        // Data needs
        needsLoader: this.needsLoader(content, componentName),
        needsAction: this.needsAction(content, componentName),
        dataRequirements: this.analyzeDataRequirements(content, componentName),
        
        // Workflow position
        workflowStep: this.determineWorkflowStep(componentName),
        
        // Props and dependencies
        propRequirements: this.analyzeProps(content),
        dependencies: this.extractDependencies(content),
        
        // Route integration needs
        routeType: this.determineRouteType(componentName, content),
        suggestedRoute: this.suggestRoute(componentName)
      };
      
      this.bookingComponents.set(componentName, analysis);
      
      if (category === 'workflow-step') {
        this.workflowSteps.push(analysis);
      } else if (category === 'form-component') {
        this.formComponents.push(analysis);
      }
      
    } catch (error) {
      console.log(`❌ Error analyzing ${filePath}: ${error.message}`);
    }
  }

  hasFormElements(content) {
    const formElements = [
      'input', 'select', 'textarea', 'button[type="submit"]',
      'form', '<Form', 'useForm', 'formData', 'onSubmit'
    ];
    
    return formElements.some(element => 
      content.toLowerCase().includes(element.toLowerCase())
    );
  }

  hasFormSubmission(content) {
    const submissionPatterns = [
      'onSubmit', 'handleSubmit', 'submit', 'post', 'put', 
      'fetch', 'api', 'action', 'mutation'
    ];
    
    return submissionPatterns.some(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  hasValidation(content) {
    const validationPatterns = [
      'validation', 'validate', 'error', 'required', 'schema',
      'yup', 'zod', 'joi', 'formik', 'react-hook-form'
    ];
    
    return validationPatterns.some(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  needsLoader(content, componentName) {
    // Components that need to load data
    const loaderIndicators = [
      'useQuery', 'useEffect', 'fetch', 'api', 'load',
      'get', 'retrieve', 'data', 'props'
    ];
    
    const needsData = loaderIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    );
    
    // Step components typically need data about the booking in progress
    const isStep = componentName.includes('Step');
    
    return needsData || isStep;
  }

  needsAction(content, componentName) {
    // Components that need to handle form submissions or mutations
    const actionIndicators = [
      'onSubmit', 'handleSubmit', 'post', 'put', 'delete',
      'create', 'update', 'save', 'confirm', 'submit'
    ];
    
    return actionIndicators.some(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    ) || this.hasFormSubmission(content);
  }

  analyzeDataRequirements(content, componentName) {
    const requirements = [];
    
    // Common booking data needs
    if (content.includes('booking') || componentName.includes('Booking')) {
      requirements.push('Current booking data');
    }
    
    if (content.includes('venue') || componentName.includes('Venue')) {
      requirements.push('Venue information');
    }
    
    if (content.includes('event') || componentName.includes('Event')) {
      requirements.push('Event details');
    }
    
    if (content.includes('user') || content.includes('profile')) {
      requirements.push('User profile data');
    }
    
    if (content.includes('payment') || componentName.includes('Payment')) {
      requirements.push('Payment methods', 'Pricing information');
    }
    
    if (content.includes('calendar') || content.includes('availability')) {
      requirements.push('Availability data');
    }
    
    if (componentName.includes('Confirmation')) {
      requirements.push('Booking confirmation details');
    }
    
    if (componentName.includes('Review')) {
      requirements.push('Complete booking summary');
    }
    
    return requirements;
  }

  determineWorkflowStep(componentName) {
    const stepMap = {
      'EventDetailsStep': 1,
      'RequirementsStep': 2,
      'ReviewStep': 3,
      'ConfirmationStep': 4,
      'SubmitStep': 5,
      'ProgressIndicator': 0, // Used across all steps
      
      // Form components
      'EventDetailsForm': 1,
      'SpaceSetupForm': 2,
      'ServicesAddonsForm': 2,
      'ContactPaymentForm': 3,
      'ReviewSubmitForm': 4,
      'BookingConfirmation': 5
    };
    
    return stepMap[componentName] || 0;
  }

  analyzeProps(content) {
    const props = [];
    
    // Look for prop destructuring
    const propMatch = content.match(/function\s+\w+\s*\(\s*{\s*([^}]+)\s*}/);
    if (propMatch) {
      const propString = propMatch[1];
      const propNames = propString.split(',')
        .map(p => p.trim().split(':')[0].trim())
        .filter(p => p && !p.includes('...'));
      props.push(...propNames);
    }
    
    // Look for common booking props
    const commonProps = [
      'bookingId', 'venueId', 'eventId', 'userId',
      'currentStep', 'onNextStep', 'onPrevStep',
      'formData', 'onFormChange', 'onSubmit',
      'booking', 'venue', 'event', 'user'
    ];
    
    commonProps.forEach(prop => {
      if (content.includes(prop)) {
        props.push(prop);
      }
    });
    
    return [...new Set(props)];
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

  determineRouteType(componentName, content) {
    if (componentName.includes('Page')) {
      return 'page-route';
    } else if (componentName.includes('Step')) {
      return 'step-route';
    } else if (this.hasFormSubmission(content)) {
      return 'action-route';
    } else {
      return 'component';
    }
  }

  suggestRoute(componentName) {
    const routeMap = {
      'EventDetailsStep': '/book/event-details',
      'RequirementsStep': '/book/requirements', 
      'ReviewStep': '/book/review',
      'ConfirmationStep': '/book/confirmation',
      'SubmitStep': '/book/submit',
      
      'EventDetailsForm': '/book/event-details',
      'ContactPaymentForm': '/book/payment',
      'ReviewSubmitForm': '/book/submit',
      'BookingConfirmation': '/book/success',
      
      'VenueOwnerDashboard': '/dashboard/bookings',
      'OrganizerDashboard': '/dashboard/events',
      'BookingConfirmationPage': '/bookings/confirmation/:id'
    };
    
    return routeMap[componentName] || `/book/${componentName.toLowerCase().replace(/step|form|page/, '')}`;
  }

  mapWorkflowSequence() {
    console.log('\n📈 Mapping booking workflow sequence...\n');
    
    // Sort workflow steps by step number
    this.workflowSteps.sort((a, b) => a.workflowStep - b.workflowStep);
    
    console.log('Booking Workflow Steps:');
    this.workflowSteps.forEach(step => {
      console.log(`  ${step.workflowStep}: ${step.name}`);
      if (step.dataRequirements.length > 0) {
        console.log(`     Data needs: ${step.dataRequirements.join(', ')}`);
      }
      if (step.needsLoader) {
        console.log(`     ⚡ Needs loader`);
      }
      if (step.needsAction) {
        console.log(`     🎬 Needs action`);
      }
    });
  }

  generateRouterIntegrationPlan() {
    console.log('\n' + '='.repeat(80));
    console.log('🛣️  REACT ROUTER 7 BOOKING WORKFLOW INTEGRATION PLAN');
    console.log('='.repeat(80));

    console.log('\n📊 ANALYSIS SUMMARY:');
    console.log(`Total booking components: ${this.bookingComponents.size}`);
    console.log(`Workflow steps: ${this.workflowSteps.length}`);
    console.log(`Form components: ${this.formComponents.length}`);
    console.log(`Components needing loaders: ${Array.from(this.bookingComponents.values()).filter(c => c.needsLoader).length}`);
    console.log(`Components needing actions: ${Array.from(this.bookingComponents.values()).filter(c => c.needsAction).length}`);

    console.log('\n🎯 REQUIRED ROUTES WITH LOADERS & ACTIONS:');
    console.log('='.repeat(50));

    const routeComponents = Array.from(this.bookingComponents.values())
      .filter(c => c.routeType !== 'component')
      .sort((a, b) => a.workflowStep - b.workflowStep);

    routeComponents.forEach(component => {
      console.log(`\n📄 ${component.suggestedRoute}`);
      console.log(`   Component: ${component.name}`);
      console.log(`   Category: ${component.category}`);
      console.log(`   Workflow Step: ${component.workflowStep || 'N/A'}`);
      
      if (component.needsLoader) {
        console.log(`   🔄 NEEDS LOADER:`);
        component.dataRequirements.forEach(req => {
          console.log(`      - ${req}`);
        });
      }
      
      if (component.needsAction) {
        console.log(`   📝 NEEDS ACTION:`);
        if (component.hasFormSubmission) {
          console.log(`      - Form submission handling`);
        }
        if (component.name.includes('Submit') || component.name.includes('Confirm')) {
          console.log(`      - Booking persistence`);
        }
        if (component.name.includes('Payment')) {
          console.log(`      - Payment processing`);
        }
      }
      
      if (component.propRequirements.length > 0) {
        console.log(`   Props: ${component.propRequirements.slice(0, 5).join(', ')}`);
      }
    });

    console.log('\n🏗️  IMPLEMENTATION STRATEGY:');
    console.log('='.repeat(40));
    
    console.log('\n1. CREATE BOOKING WORKFLOW ROUTES:');
    console.log('```typescript');
    console.log('// apps/web/app/routes.ts');
    console.log('export const routes: RouteConfig = [');
    console.log('  // Booking workflow');
    console.log('  {');
    console.log('    path: "/book",');
    console.log('    file: "routes/book/layout.tsx", // Progress indicator');
    console.log('    children: [');
    console.log('      { path: "event-details", file: "routes/book/event-details.tsx" },');
    console.log('      { path: "requirements", file: "routes/book/requirements.tsx" },');
    console.log('      { path: "payment", file: "routes/book/payment.tsx" },');
    console.log('      { path: "review", file: "routes/book/review.tsx" },');
    console.log('      { path: "confirmation", file: "routes/book/confirmation.tsx" },');
    console.log('      { path: "success", file: "routes/book/success.tsx" },');
    console.log('    ]');
    console.log('  },');
    console.log('  // Booking management');
    console.log('  { path: "/bookings/:id", file: "routes/bookings.$id.tsx" },');
    console.log('  { path: "/dashboard/bookings", file: "routes/dashboard.bookings.tsx" },');
    console.log('];');
    console.log('```');

    console.log('\n2. EXAMPLE ROUTE WITH LOADER & ACTION:');
    console.log('```typescript');
    console.log('// apps/web/app/routes/book/event-details.tsx');
    console.log('import type { Route } from "~/types/app/routes/book/event-details/+types";');
    console.log('import { EventDetailsStep } from "~/components/magic-patterns/components/booking/EventDetailsStep";');
    console.log('');
    console.log('export const loader = async ({ request, params }: Route.LoaderArgs) => {');
    console.log('  const url = new URL(request.url);');
    console.log('  const eventId = url.searchParams.get("eventId");');
    console.log('  const venueId = url.searchParams.get("venueId");');
    console.log('  ');
    console.log('  // Load required data');
    console.log('  const [event, venue, currentBooking] = await Promise.all([');
    console.log('    eventId ? loadEventData(eventId) : null,');
    console.log('    venueId ? loadVenueData(venueId) : null,');
    console.log('    loadCurrentBookingData(request), // from session/cookie');
    console.log('  ]);');
    console.log('  ');
    console.log('  return { event, venue, currentBooking };');
    console.log('};');
    console.log('');
    console.log('export const action = async ({ request }: Route.ActionArgs) => {');
    console.log('  const formData = await request.formData();');
    console.log('  ');
    console.log('  // Update booking with event details');
    console.log('  const bookingData = {');
    console.log('    eventTitle: formData.get("eventTitle"),');
    console.log('    eventDate: formData.get("eventDate"),');
    console.log('    attendeeCount: formData.get("attendeeCount"),');
    console.log('    // ... other form fields');
    console.log('  };');
    console.log('  ');
    console.log('  await updateBookingSession(request, bookingData);');
    console.log('  ');
    console.log('  return redirect("/book/requirements");');
    console.log('};');
    console.log('');
    console.log('export default function EventDetailsRoute(props: Route.ComponentProps) {');
    console.log('  const { event, venue, currentBooking } = useLoaderData<typeof loader>();');
    console.log('  ');
    console.log('  return (');
    console.log('    <EventDetailsStep');
    console.log('      event={event}');
    console.log('      venue={venue}');
    console.log('      currentBooking={currentBooking}');
    console.log('    />');
    console.log('  );');
    console.log('}');
    console.log('```');

    console.log('\n3. LAYOUT WITH PROGRESS INDICATOR:');
    console.log('```typescript');
    console.log('// apps/web/app/routes/book/layout.tsx');
    console.log('import { Outlet } from "react-router";');
    console.log('import { ProgressIndicator } from "~/components/magic-patterns/components/booking/ProgressIndicator";');
    console.log('');
    console.log('export default function BookingLayout() {');
    console.log('  return (');
    console.log('    <div className="booking-workflow">');
    console.log('      <ProgressIndicator />');
    console.log('      <main>');
    console.log('        <Outlet />');
    console.log('      </main>');
    console.log('    </div>');
    console.log('  );');
    console.log('}');
    console.log('```');

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Create the booking workflow routes structure');
    console.log('2. Implement loaders for data fetching');
    console.log('3. Implement actions for form submissions');
    console.log('4. Connect the Magic Patterns booking components');
    console.log('5. Add proper TypeScript types for each route');
    console.log('6. Test the complete booking flow');

    // Save detailed plan
    const planData = {
      timestamp: new Date().toISOString(),
      components: Object.fromEntries(this.bookingComponents),
      workflowSteps: this.workflowSteps,
      formComponents: this.formComponents,
      requiredRoutes: routeComponents.map(c => ({
        route: c.suggestedRoute,
        component: c.name,
        needsLoader: c.needsLoader,
        needsAction: c.needsAction,
        dataRequirements: c.dataRequirements
      }))
    };

    fs.writeFileSync('booking-workflow-integration-plan.json', JSON.stringify(planData, null, 2));
    console.log('\n📄 Detailed integration plan saved to: booking-workflow-integration-plan.json');
  }
}

// Main execution
if (require.main === module) {
  const analyzer = new BookingWorkflowAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = BookingWorkflowAnalyzer;