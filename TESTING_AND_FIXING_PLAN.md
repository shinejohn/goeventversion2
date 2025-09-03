# Testing and Fixing Plan - When's The Fun

## Overview
Systematic page-by-page testing and fixing plan to resolve navigation, authentication, and mock data issues.

## Prerequisites
**CRITICAL: Start Supabase locally for authentication to work:**
```bash
pnpm supabase:web:start
```

## Testing Plan by Category

### 🔐 Authentication Pages (PRIORITY 1 - BLOCKS ALL CREATE FUNCTIONALITY)

#### `/auth/sign-in` - Login Page
**Status**: ❌ Not working - blocks all create functionality  
**Issues**: 
- Requires local Supabase instance running
- May have form submission issues

**Tests**:
- [ ] Page loads without errors
- [ ] Email/password form visible and functional
- [ ] Form validation works
- [ ] Successful login redirects to dashboard
- [ ] Google OAuth buttons display (even if not functional)
- [ ] "New here? Sign up" link works

**Fixes Needed**:
- [ ] Ensure Supabase connection works
- [ ] Test form submission flow
- [ ] Verify redirect after login

#### `/auth/sign-up` - Registration Page
**Status**: ❌ Not working - blocks user onboarding  
**Issues**:
- Requires local Supabase instance running
- May have form submission issues

**Tests**:
- [ ] Page loads without errors
- [ ] Registration form visible and functional
- [ ] Form validation works
- [ ] Email confirmation flow works
- [ ] Successful registration creates account

**Fixes Needed**:
- [ ] Ensure Supabase connection works
- [ ] Test registration flow end-to-end

---

### 🏠 Main Navigation & Homepage

#### `/` - Homepage
**Status**: ✅ Working  
**Tests**:
- [ ] Page loads with header/footer
- [ ] All navigation links work
- [ ] Hero section displays
- [ ] Featured events show
- [ ] Location selector works

#### Header Navigation
**Status**: ✅ Recently fixed  
**Tests**:
- [ ] Events → `/events` ✅
- [ ] Venues → `/venues` ✅ 
- [ ] Performers → `/performers` ✅
- [ ] Communities → `/hubs` ✅
- [ ] Calendars → `/calendars` ✅
- [ ] Social → `/social` ✅
- [ ] Tickets → `/tickets/buy` ✅
- [ ] Book It → `/book` ✅
- [ ] Shop → `/gear` ✅
- [ ] Advertise → `/advertise` ✅
- [ ] Login → `/auth/sign-in` ✅
- [ ] Sign Up → `/auth/sign-up` ✅

---

### 📅 Event Pages

#### `/events` - Events Listing
**Status**: ✅ Working  
**Tests**:
- [ ] Page loads with events list
- [ ] Event cards display properly
- [ ] Clicking event cards navigates to detail
- [ ] Search and filters work

#### `/events/:id` - Event Detail Pages
**Status**: ❌ All show "Clearwater Jazz Holiday" (mock data issue)  
**Issues**:
- Hardcoded event data instead of dynamic lookup
- Same content regardless of event ID

**Tests**:
- [ ] `/events/event-1` shows "Clearwater Jazz Holiday"
- [ ] `/events/event-2` should show "Downtown Food Festival" (currently shows same)
- [ ] `/events/event-3` should show "Art Walk Gallery Night" (currently shows same)
- [ ] Event images change based on ID
- [ ] Event details are dynamic

**Fixes Needed**:
- [ ] Replace hardcoded eventData with dynamic lookup from mockEvents
- [ ] Update EventDetailPage to use eventId prop
- [ ] Ensure different events show different content

---

### 🎭 Performer Pages

#### `/performers` - Performers Listing  
**Status**: ✅ Working  
**Tests**:
- [ ] Page loads with performers list
- [ ] Performer cards display properly
- [ ] Clicking performer cards navigates to detail

#### `/performers/:id` - Performer Detail Pages
**Status**: ⚠️ Working but header images don't change  
**Issues**:
- Header/profile images static across different performers
- Content may be correct but visual elements don't update

**Tests**:
- [ ] `/performers/performer-1` shows "The Sunset Vibes"
- [ ] `/performers/performer-2` shows "DJ Coastal" 
- [ ] `/performers/performer-3` shows "Sarah Johnson"
- [ ] Profile images change based on performer ID
- [ ] Performance history is different per performer

**Fixes Needed**:
- [ ] Investigate why header images don't update
- [ ] Verify performer data lookup is working correctly

---

### 🏢 Venue Pages

#### `/venues` - Venues Listing
**Status**: ✅ Working  
**Tests**:
- [ ] Page loads with venues list
- [ ] Venue cards display properly
- [ ] Clicking venue cards navigates to detail

#### `/venues/:id` - Venue Detail Pages  
**Status**: ❓ Needs testing
**Tests**:
- [ ] Venue detail pages load
- [ ] Venue information displays correctly
- [ ] Booking widgets work
- [ ] Image galleries function

---

### 🏘️ Community/Hub Pages

#### `/hubs` - Communities/Hubs Listing
**Status**: ✅ Working
**Tests**:
- [ ] Page loads with communities list
- [ ] Community cards display properly
- [ ] Navigation to community details works

#### `/c/:communitySlug` - Community Detail Pages
**Status**: ❌ 404 errors  
**Issues**:
- Community detail pages return 404
- May be missing community data or route issues

**Tests**:
- [ ] Try various community URLs
- [ ] Check if any community slugs work
- [ ] Verify community data exists

**Fixes Needed**:
- [ ] Investigate why community detail pages 404
- [ ] Check data service connections
- [ ] May need mock community data

---

### 📅 Calendar Pages

#### `/calendars` - Calendar Main Page
**Status**: ✅ Working
**Tests**:
- [ ] Calendar page loads
- [ ] Calendar grid displays
- [ ] Navigation works

#### `/calendars/marketplace` - Shared Calendars
**Status**: ✅ Recently created
**Tests**:
- [ ] Marketplace page loads
- [ ] Shared calendars functionality works
- [ ] User can browse shared calendars

---

### 🎫 Ticket Pages  

#### `/tickets` - Tickets Main
**Status**: ✅ Working
**Tests**:
- [ ] Tickets page loads
- [ ] Ticket listings display

#### `/tickets/buy` - Ticket Purchasing
**Status**: ✅ Working
**Tests**:
- [ ] Buy tickets page loads
- [ ] Purchase flow initiates

#### `/tickets/:id` - Ticket Detail
**Status**: ❓ Needs testing  
**Tests**:
- [ ] Individual ticket details load
- [ ] Ticket information displays correctly

---

### 📝 Book It Pages

#### `/book` - Book It Main Page
**Status**: ✅ Working
**Tests**:
- [ ] Book It page loads
- [ ] All category buttons work

#### `/book/performer` - Book Performers  
**Status**: ✅ Recently fixed
**Tests**:
- [ ] Book performer page loads (was previously going nowhere)
- [ ] Performer booking flow works

#### `/book-it/venues` - Book Venues
**Status**: ⚠️ "Kind of works" but venue details don't work
**Tests**:
- [ ] Venue booking page loads
- [ ] Venue listings display
- [ ] Individual venue booking pages work

**Fixes Needed**:
- [ ] Fix venue detail pages from booking flow

---

### 🛒 Shop Pages

#### `/gear` - Shop Main
**Status**: ✅ Working (may be mock data)
**Tests**:
- [ ] Shop page loads
- [ ] Products display
- [ ] Product categories work

#### Shop Product Detail Pages
**Status**: ❌ Product detail pages don't work
**Tests**:
- [ ] Clicking products navigates to detail pages
- [ ] Product detail pages load
- [ ] Product information displays

**Fixes Needed**:
- [ ] Create product detail routes
- [ ] Implement product detail pages

---

### 📢 Advertise Pages

#### `/advertise` - Advertise Main
**Status**: ✅ Working
**Tests**:
- [ ] Advertise page loads
- [ ] Service categories display

#### `/advertise/packages` - Ad Packages  
**Status**: ✅ Working
**Tests**:
- [ ] Packages page loads
- [ ] Package options display

#### Advertise Purchase Pages
**Status**: ❌ No purchase/checkout flow
**Tests**:
- [ ] Purchase buttons work
- [ ] Checkout flow exists
- [ ] Payment processing (at least mock)

**Fixes Needed**:
- [ ] Create advertise purchase/checkout pages

---

### 👤 User Profile & Settings (REQUIRES AUTHENTICATION)

#### `/home` - User Dashboard
**Status**: ❌ Requires login
**Tests** (After fixing auth):
- [ ] Dashboard loads for logged-in users
- [ ] User information displays
- [ ] Quick actions work

#### `/home/settings` - User Settings  
**Status**: ❌ Requires login
**Tests** (After fixing auth):
- [ ] Settings page loads
- [ ] Profile update forms work
- [ ] Password change works
- [ ] Preferences save correctly

---

### ➕ Create Pages (ALL REQUIRE AUTHENTICATION)

#### Create Event
**Status**: ❌ Requires login
**Tests** (After fixing auth):
- [ ] Create event page loads
- [ ] Event form submits
- [ ] Image uploads work
- [ ] Event validation works

#### Create Performer Profile
**Status**: ❌ Requires login  
**Tests** (After fixing auth):
- [ ] Performer profile creation works
- [ ] Media uploads function
- [ ] Profile goes live after creation

#### Create Venue Listing
**Status**: ❌ Requires login
**Tests** (After fixing auth):
- [ ] Venue creation form works
- [ ] Venue photos upload
- [ ] Pricing and availability setup works

#### Create Community/Hub
**Status**: ❌ Requires login
**Tests** (After fixing auth):
- [ ] Community creation works
- [ ] Hub customization options work
- [ ] Member management functions

#### Create Calendar
**Status**: ❌ Requires login
**Tests** (After fixing auth):
- [ ] Calendar creation works
- [ ] Sharing options function
- [ ] Calendar becomes discoverable

---

### 🔧 Error & Utility Pages

#### 404 Pages
**Status**: ✅ Recently fixed with header/footer
**Tests**:
- [ ] 404 pages include header/footer
- [ ] Navigation menu works from 404 pages
- [ ] "Go Home" button works

---

## Implementation Priority

### Phase 1: Critical Fixes (Blocks Everything)
1. **Fix Authentication** - Enable login/signup by starting Supabase
2. **Fix Event Detail Mock Data** - Make events show different content

### Phase 2: Core Functionality  
3. **Fix Performer Header Images** - Make images dynamic
4. **Fix Community Detail 404s** - Get community pages working
5. **Fix Shop Product Details** - Create product detail pages

### Phase 3: Enhanced Features
6. **Create Advertise Purchase Flow** - Enable ad purchasing
7. **Fix Book-It Venue Details** - Complete booking flow
8. **Test All Create Functionality** - Once auth is working

### Phase 4: Polish & Edge Cases
9. **Test Error Handling** - Ensure graceful failures
10. **Performance Testing** - Check page load times
11. **Mobile Responsiveness** - Test on different screen sizes

---

## Automated Testing Plan

### Puppeteer Test Scripts Needed
1. **Navigation Test** - Test all header links work
2. **Authentication Test** - Test login/signup flows  
3. **Dynamic Content Test** - Verify event/performer pages show different content
4. **Form Submission Test** - Test all create/edit forms
5. **Error Handling Test** - Test 404s and error states
6. **Mobile Responsive Test** - Test mobile navigation and layouts

### Success Metrics
- ✅ All navigation links work (no 404s)
- ✅ Login/signup functional 
- ✅ Event details show different content per event
- ✅ Performer images change per performer
- ✅ All create functionality works after login
- ✅ Shop product details accessible
- ✅ Community pages load without 404s
- ✅ Ad purchase flow complete

---

## Next Steps

1. **Start Supabase locally**: `pnpm supabase:web:start`
2. **Test authentication** - Verify login/signup work
3. **Fix event detail pages** - Implement dynamic content
4. **Run systematic page testing** - Use Puppeteer to validate fixes
5. **Fix remaining issues** based on test results

This plan provides a structured approach to fixing all identified issues systematically.