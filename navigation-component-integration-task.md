Claude Code Task: Navigation and Component Integration
Task Overview
Objective: Perform comprehensive navigation and component integration verification across the entire GoeventCity React Router 7 application built on the makerkit framework.
Critical Rule: DO NOT USE SCRIPTS. This task requires manual evaluation and human judgment.
Specific Instructions for Claude Code
Primary Mission
Go through each page systematically and evaluate every interactive element to ensure 100% functional navigation and proper component integration in the GoeventCity application.
Evaluation Criteria
1. Interactive Elements to Verify:

All menus (main navigation, dropdowns, context menus)
All links (internal, external, route-based)
All buttons (submit, navigation, action buttons)
All icons (clickable, navigation triggers)

2. Component Integration Verification:

Verify existence and correct location of all referenced components
Ensure component imports match actual file structure
Validate that routes correctly incorporate intended components
Check component export/import alignment

3. Data-Dependent Navigation:

For pages requiring data inputs (IDs, slugs, parameters):

Verify data component exists and functions
Validate data queries are correct for specific routes
Ensure proper data flow for dynamic navigation
Check parameter passing and route matching



Working Methodology
Certainty Threshold: Only make changes when 95% certain they are correct.
Assumption Framework:

Assume most/all original navigation is correct
Assume components exist (likely converted from magic patterns)
Assume there's an appropriate component for each integration need
Note: makerkit UI components exist but are not being used in GoeventCity

Preservation Rules:

NEVER modify look and feel of UI
NEVER change visual styling or layout
ONLY fix functional navigation and component connections

Reference System
Magic Patterns Directory Structure:

components/ads/ - Advertisement components
components/venue-detail/ - Individual venue components
components/venue-marketplace/ - Marketplace listing components
components/venue-profile/ - Venue profile components
Use subdirectory organization as context for component function

Documentation Requirements
Doubt Log System:
When uncertain about any change, document in doubt log with:
DOUBT ENTRY:
- File: [filepath]
- Issue: [specific navigation/component problem]
- Current State: [what exists now]
- Suspected Solution: [what might need to change]
- Reason for Doubt: [why uncertain]
- Priority: [High/Medium/Low]
Change Log System:
For confirmed changes, document:
CHANGE MADE:
- File: [filepath]
- Type: [Navigation/Component/Data Integration]
- Problem: [what was broken]
- Solution: [what was fixed]
- Confidence: [95%+ certainty reasoning]
Systematic Approach
Phase 1: Route Structure Analysis

Map all routes in app/routes/
Identify component dependencies for each route
Verify file existence for all referenced components

Phase 2: Navigation Flow Testing

Start from main entry points (home, business pages, event pages)
Follow every possible navigation path
Test dynamic routes with sample data parameters
Verify back/forward navigation works properly

Phase 3: Component Integration Validation

Check import/export alignment
Verify component props and data flow
Ensure proper error handling for missing data
Validate TypeScript types for component interfaces

Phase 4: Data-Dependent Route Verification

Identify routes requiring parameters (business IDs, event IDs, user profiles, etc.)
Trace data flow from route params to component props
Verify database queries and API calls match route expectations
Test edge cases (missing IDs, invalid parameters)

Prohibited Actions

Do NOT create new pages or components
Do NOT modify existing component logic beyond navigation fixes
Do NOT change UI styling or visual elements
Do NOT use automated scripts or bulk operations

Success Criteria

All navigation elements function correctly in GoeventCity
All component references resolve properly
All data-dependent routes work with appropriate parameters
Zero broken links or missing component errors
Comprehensive doubt log for review of uncertain items

Execute this task with methodical precision, documenting every decision and maintaining the highest standards of functional integrity while preserving the existing GoeventCity design and user experience.