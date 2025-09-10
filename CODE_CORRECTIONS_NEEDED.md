# Code Corrections Needed - Use Existing Database Fields

This document lists all the places in the code where we need to update field names to use the existing database columns instead of non-existent ones.

## Events Table Corrections

### 1. `age_restrictions` → `age_restriction` (singular)
**Files to update:**
- `/apps/web/app/routes/events/$id.tsx` - Line ~171
- Any event creation/edit forms
- Event list components that might filter by age

**Current code:**
```typescript
age_restriction: event.age_restrictions || 'All Ages',
```

**Should be:**
```typescript
age_restriction: event.age_restriction || 'All Ages',
```

### 2. `ticket_price` → `price_min`
**Files to update:**
- `/apps/web/app/routes/events/$id.tsx` - Line ~167
- Event cards/list items showing pricing
- Any price filtering logic

**Current code:**
```typescript
ticket_price: event.ticket_price || event.price_min,
```

**Should be:**
```typescript
ticket_price: event.price_min,
```

## Venues Table Corrections

### 3. `profile_image_url` → `image_url`
**Already fixed in:**
- `/apps/web/app/routes/venues/$venueId.tsx` ✅

**Still needs fixing in:**
- Any venue card components
- Venue list views
- Admin venue edit forms

### 4. `base_hourly_rate` → `pricePerHour`
**Already fixed in:**
- `/apps/web/app/routes/venues/$venueId.tsx` ✅
- `/apps/web/app/lib/magic-patterns/data-transformers.ts` ✅

**Still needs fixing in:**
- Venue pricing displays
- Booking calculation components

### 5. `capacity` → `max_capacity`
**Already fixed in:**
- `/apps/web/app/routes/venues/$venueId.tsx` ✅

**Still needs fixing in:**
- Venue filter components
- Search/filter queries
- Capacity display in venue cards

## Performers Table Corrections

### 6. `profile_image_url` → `image`
**Already fixed in:**
- `/apps/web/app/routes/performers/$performerId.tsx` ✅
- `/apps/web/app/lib/magic-patterns/data-transformers.ts` ✅

**Still needs fixing in:**
- Performer card components
- Performer list views
- Any performer profile displays

### 7. `social_media` → `social_links`
**Already fixed in:**
- `/apps/web/app/routes/performers/$performerId.tsx` ✅
- `/apps/web/app/lib/magic-patterns/data-transformers.ts` ✅

### 8. `base_rate` → `base_price`
**Already fixed in:**
- `/apps/web/app/routes/performers/$performerId.tsx` ✅
- `/apps/web/app/lib/magic-patterns/data-transformers.ts` ✅

**Still needs fixing in:**
- Performer pricing displays
- Booking forms

### 9. `total_performances` → `shows_played`
**Already fixed in:**
- `/apps/web/app/routes/performers/$performerId.tsx` ✅

### 10. `years_experience` → `years_active`
**Already fixed in:**
- `/apps/web/app/routes/performers/$performerId.tsx` ✅

### 11. `average_response_time` → `responseTime`
**Already fixed in:**
- `/apps/web/app/routes/performers/$performerId.tsx` ✅

## Search Pattern for Finding All Instances

To find all instances of incorrect field names in the codebase, run these commands:

```bash
# Events table corrections needed
grep -r "age_restrictions" --include="*.ts" --include="*.tsx" apps/web
grep -r "ticket_price" --include="*.ts" --include="*.tsx" apps/web

# Venues table corrections needed  
grep -r "profile_image_url" --include="*.ts" --include="*.tsx" apps/web
grep -r "base_hourly_rate" --include="*.ts" --include="*.tsx" apps/web
grep -r '\.capacity[^:]' --include="*.ts" --include="*.tsx" apps/web

# Performers table corrections needed
grep -r "profile_image_url" --include="*.ts" --include="*.tsx" apps/web | grep -i performer
grep -r "social_media" --include="*.ts" --include="*.tsx" apps/web | grep -v social_links
grep -r "base_rate" --include="*.ts" --include="*.tsx" apps/web | grep -v base_price
```

## Components Likely Needing Updates

Based on typical app structure, check these components:

### Event Components
- `EventCard` or `EventListItem`
- `EventFilters` or `EventSearch`  
- `EventBookingForm`
- `CreateEventForm` or `EditEventForm`

### Venue Components
- `VenueCard` or `VenueListItem`
- `VenueFilters` or `VenueSearch`
- `VenueBookingForm`
- `CreateVenueForm` or `EditVenueForm`

### Performer Components
- `PerformerCard` or `PerformerListItem`
- `PerformerFilters` or `PerformerSearch`
- `BookPerformerForm`
- `PerformerProfileEdit`

## Quick Fix Script

Here's a script to help identify all files that need updates:

```bash
#!/bin/bash

echo "=== Files with incorrect field names ==="
echo ""
echo "Events - age_restrictions (should be age_restriction):"
grep -l "age_restrictions" --include="*.ts" --include="*.tsx" -r apps/web

echo ""
echo "Events - ticket_price (should be price_min):"
grep -l "ticket_price" --include="*.ts" --include="*.tsx" -r apps/web | grep -v "price_min"

echo ""
echo "Venues - profile_image_url (should be image_url):"
grep -l "profile_image_url" --include="*.ts" --include="*.tsx" -r apps/web

echo ""
echo "Venues - base_hourly_rate (should be pricePerHour):"
grep -l "base_hourly_rate" --include="*.ts" --include="*.tsx" -r apps/web

echo ""
echo "Venues - accessing .capacity (should be .max_capacity):"
grep -l '\.capacity[^:]' --include="*.ts" --include="*.tsx" -r apps/web
```

## Priority Order

1. **High Priority** - User-facing components that display data
   - Event/Venue/Performer cards and lists
   - Detail pages (mostly done ✅)
   - Search and filter components

2. **Medium Priority** - Forms and data entry
   - Create/Edit forms
   - Booking forms
   - Admin panels

3. **Low Priority** - Backend/utility functions
   - Data validation functions
   - Export/import utilities
   - Analytics/reporting

## Testing After Corrections

After making these corrections:
1. Test all list views load correctly
2. Test all detail pages show correct data
3. Test search/filter functionality works
4. Test create/edit forms save correctly
5. Test booking flows complete successfully