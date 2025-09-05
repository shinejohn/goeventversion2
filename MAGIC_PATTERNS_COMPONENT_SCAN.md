# Magic Patterns Components - Complete Scan Report

## Overview
This is a comprehensive scan of ALL Magic Patterns components showing their data requirements, functionality, and database connections.

## 1. EVENT COMPONENTS

### EventsPage.tsx
**Data Expected:**
```typescript
- events: Array<{
    id, title, date, time, venue, image, category, 
    price, attendees, slug
  }>
- categories: string[]
- dateFilter, categoryFilter, sortBy
```
**Functionality:** Event discovery, filtering, grid/list view
**Database:** events table

### EventDetailPage.tsx  
**Data Expected:**
```typescript
- event: {
    id, title, description, date, time, price,
    venue: { name, address, city, state },
    category, image, attendees, capacity,
    lineup: Performer[],
    amenities, ticketInfo
  }
```
**Functionality:** Display full event details, ticket purchase, social sharing
**Actions:** Buy tickets, share event, add to calendar
**Database:** events, venues, performers, event_performers tables

### Components/events/
- **EventHero.tsx**: Hero banner with event image, title, CTA buttons
- **EventSuggestionModal.tsx**: Form to suggest new events
- **RelatedEvents.tsx**: Shows similar events based on category/venue

## 2. VENUE COMPONENTS

### VenuesPage.tsx
**Data Expected:**
```typescript
- venues: Array<{
    id, name, address, venueType, capacity, 
    pricePerHour, rating, reviewCount, image,
    distance, responseTimeHours, amenities
  }>
- filters: { venueType, priceRange, capacity, amenities }
```
**Functionality:** Venue discovery, map view, filtering, sorting
**Database:** venues table

### VenueDetailPage.tsx
**Data Expected:**
```typescript
- venue: {
    id, name, description, images[], amenities[],
    capacity, pricePerHour, rating, reviews,
    availabilityCalendar, location: {lat, lng}
  }
```
**Forms:** Booking request form with date, time, event details
**Actions:** Submit booking request, view availability
**Database:** venues, bookings tables

### Components/venue-detail/
- **BookingWidget.tsx**: Date picker, guest count, calculate pricing
- **AvailabilityCalendar.tsx**: Shows available/booked dates
- **ReviewsSection.tsx**: Display and submit reviews
- **ImageGallery.tsx**: Photo carousel with lightbox

## 3. PERFORMER COMPONENTS

### PerformersPage.tsx
**Data Expected:**
```typescript
- performers: Array<{
    id, name, image, genre, location, rating,
    priceRange, verified, availableForBooking,
    upcomingGigs, lastActive
  }>
```
**Functionality:** Performer discovery, filtering by genre/location
**Database:** performers table

### PerformerProfilePage.tsx
**Data Expected:**
```typescript
- performer: {
    id, name, bio, genres[], images[], videos[],
    rating, reviews, basePrice, availability,
    socialLinks, upcomingEvents[]
  }
```
**Forms:** Booking inquiry form
**Actions:** Book performer, follow, message
**Database:** performers, bookings, event_performers

## 4. BOOKING SYSTEM COMPONENTS

### BookingFormProgress.tsx
**Multi-step form with:**
1. **EventDetailsForm**: Event name, type, date/time, guest count
2. **SpaceSetupForm**: Setup requirements, layout preferences  
3. **ServicesAddonsForm**: Catering, equipment, staff
4. **ContactPaymentForm**: Contact info, payment method
5. **ReviewSubmitForm**: Review and confirm all details

**Data Collected:**
```typescript
{
  eventName, eventType, eventDate, startTime, endTime,
  guestCount, setupRequirements, services[],
  contactPerson: { name, email, phone },
  specialRequests, totalPrice, paymentMethod
}
```
**Database:** bookings table

## 5. COMMUNITY HUB COMPONENTS

### Hub Pages Structure:
- **hub/[slug]/index.tsx**: Hub homepage with overview
- **hub/[slug]/events.tsx**: Hub's events listing
- **hub/[slug]/gallery.tsx**: Photo/video gallery
- **hub/[slug]/members.tsx**: Member directory
- **hub/[slug]/analytics.tsx**: Hub analytics dashboard

### HubBuilderWizard Components:
**SetupWizard.tsx** - Multi-step hub creation:
```typescript
{
  name, description, category, visibility,
  membershipType, features[], customDomain
}
```
**Database:** community_hubs, hub_memberships

## 6. CALENDAR SYSTEM

### CalendarWizard.tsx
**Creates shared calendars with:**
```typescript
{
  name, description, visibility: 'public'|'private',
  contributors[], categories[], color,
  syncSettings, monetization: { 
    subscriptionPrice, oneTimePrice 
  }
}
```
**Database:** calendars table (not in current schema - needs creation)

### Calendar Components:
- **CalendarGrid.tsx**: Month/week/day views
- **EventCard.tsx**: Draggable event cards
- **CalendarSidebar.tsx**: Mini calendar, categories

## 7. SHOPPING/MARKETPLACE

### GearPage.tsx
**Data Expected:**
```typescript
- products: Array<{
    id, name, price, image, seller,
    category, inStock
  }>
- categories: Array<{ title, path, image }>
```
**Database:** products, product_categories tables

### ShoppingCartPage.tsx
**Cart functionality:**
```typescript
- items: Array<{
    product, quantity, price, subtotal
  }>
- shipping, tax, total calculations
```
**Actions:** Update quantity, remove item, checkout
**Database:** orders, order_items tables

## 8. USER PROFILE COMPONENTS

### Profile Pages:
- **UserProfilePage.tsx**: Public profile view
- **UserProfileSettingsPage.tsx**: Edit profile settings
- **FanDashboardPage.tsx**: User's personal dashboard

### Settings Components:
- **ProfileInformation.tsx**: Name, bio, avatar
- **NotificationPreferences.tsx**: Email/push settings
- **PrivacySettings.tsx**: Visibility controls

**Data Structure:**
```typescript
{
  name, email, bio, avatar, location,
  preferences: {
    notifications: { email, push, sms },
    privacy: { profileVisibility, showEmail }
  }
}
```
**Database:** user_preferences table

## 9. SOCIAL FEATURES

### Check-in System:
- **CheckInModal.tsx**: Check in to venues/events
- **CheckInFeed.tsx**: Activity feed of check-ins

### Messaging:
- **MessageCenter.tsx**: Inbox/sent messages
- **Messages structure:**
```typescript
{
  id, from, to, subject, content, 
  timestamp, read, threadId
}
```
**Database:** messages table

### Social Components:
- **SharePopup.tsx**: Share to social media
- **NotificationBell.tsx**: Real-time notifications

## 10. TICKETS SYSTEM

### TicketPurchase Flow:
1. Select tickets (type, quantity)
2. Enter attendee information
3. Payment processing
4. Confirmation with QR code

**Ticket Data:**
```typescript
{
  eventId, ticketType, price, quantity,
  attendees: Array<{ name, email }>,
  purchaseDate, qrCode
}
```
**Database:** tickets table (needs creation)

## 11. ANALYTICS COMPONENTS

### Dashboard Analytics:
- **AnalyticsOverview.tsx**: Key metrics cards
- **ContentPerformance.tsx**: Views, engagement
- **RevenueReports.tsx**: Financial analytics
- **MemberInsights.tsx**: User behavior

**Metrics Tracked:**
```typescript
{
  views, uniqueVisitors, engagement,
  revenue, ticketsSold, conversionRate,
  topContent[], userDemographics
}
```
**Database:** event_analytics table

## 12. FORMS AND INPUTS

### Common Form Components:
- **LocationSelector.tsx**: Autocomplete location picker
- **DateSelector.tsx**: Calendar date picker
- **ImageUploader.tsx**: Drag-drop image upload
- **PasswordInput.tsx**: Show/hide password

### Form Patterns:
- All forms use controlled components
- Validation on submit
- Loading states during submission
- Success/error feedback

## DATA FLOW SUMMARY

### Create Operations:
- Events: `/events/create` form
- Venues: `/venues/create` form  
- Performers: `/performers/create` form
- Bookings: Multi-step booking form
- Reviews: Inline review forms
- Messages: Message compose modal

### Read Operations:
- List views with filtering/sorting
- Detail pages with full information
- Dashboard views with analytics

### Update Operations:
- Profile settings pages
- Hub management dashboards
- Booking status updates

### Delete Operations:
- Cancel bookings
- Remove favorites
- Delete messages

## MISSING IMPLEMENTATIONS

Based on components vs database:

1. **Calendars table** - Components exist, no DB table
2. **Tickets table** - Components exist, no DB table  
3. **Products/Orders** - Basic tables exist, need expansion
4. **Favorites** - DB table exists, needs UI connection
5. **Reviews** - Both exist but need connection

## INTEGRATION REQUIREMENTS

1. Connect forms to React Router actions
2. Implement data loaders for all pages
3. Add proper authentication checks
4. Implement real-time features (notifications, messages)
5. Add image upload to storage
6. Implement payment processing
7. Add email notifications
8. Implement search functionality