# Missing Database Fields Log

This document logs all database fields that UI components expect but don't exist in the production database. These fields should be added to the database schema in the future.

## Events Table

### Currently Missing Fields
- `latitude` - Expected for location mapping
- `longitude` - Expected for location mapping  
- `base_hourly_rate` - Expected for pricing display
- `highlights` - Expected as array for event highlights
- `ticket_url` - Expected for external ticketing
- `series_id` - Expected for event series grouping
- `age_restrictions` - Expected for age verification (using `age_restriction` in UI)

### Fields That Exist With Different Names
- UI expects `ticket_price` → DB has `price_min`
- UI expects `imageUrl` → DB has `image_url`

## Venues Table

### Currently Missing Fields
- `latitude` - Expected for venue location (currently could be extracted from `location_data` JSON)
- `longitude` - Expected for venue location (currently could be extracted from `location_data` JSON)
- `profile_image_url` - Expected but DB has `image_url`
- `base_hourly_rate` - Expected but DB has `pricePerHour`
- `parking_info` - Expected as JSON object with type, capacity, cost, distance
- `transit_options` - Expected as array of transit options
- `nearby_amenities` - Expected as array of nearby amenities
- `capacity` - Expected but DB has `max_capacity`
- `floor_plans` - Expected as array of floor plan images
- `virtual_tour_url` - Expected for virtual tours
- `rules_and_restrictions` - Expected as text
- `operating_hours` - Expected as JSON (may exist, needs verification)
- `blackout_dates` - Expected as array of dates
- `minimum_notice_hours` - Expected as number (default 48)
- `rentable_amenities` - Expected as array for amenities available for rent
- `minimum_booking_hours` - Expected as number (default 2)
- `deposit_percentage` - Expected as number (default 25)
- `cancellation_policy` - Expected as string (default 'Standard')
- `insurance_required` - Expected as boolean (default false)
- `security_deposit` - Expected as number (default 0)
- `seated_capacity` - Expected for seated events
- `cocktail_capacity` - Expected for cocktail-style events
- `total_events` - Expected for venue statistics
- `occupancy_rate` - Expected for venue analytics
- `repeat_booking_rate` - Expected for venue analytics

### Fields That Exist With Different Names
- UI expects `profile_image_url` → DB has `image_url`
- UI expects `capacity` → DB has `max_capacity`
- UI expects `base_hourly_rate` → DB has `pricePerHour`

## Performers Table

### Currently Missing Fields
- `profile_image_url` - Expected but DB has `image` 
- `social_media` - Expected as JSON (DB has `social_links`)
- `media_gallery` - Expected as array of media items
- `technical_requirements` - Expected as text or JSON
- `availability` - Expected as JSON schedule
- `base_rate` - Expected for pricing (DB has `base_price`)
- `min_booking_hours` - Expected as number
- `max_travel_distance` - Expected as number  
- `setup_time_required` - Expected as number (minutes)
- `equipment_provided` - Expected as boolean
- `insurance_coverage` - Expected as boolean
- `total_performances` - Expected for stats (DB has `shows_played`)
- `years_experience` - Expected (DB has `years_active`)
- `repeat_booking_rate` - Expected as percentage
- `monthly_bookings` - Expected for analytics
- `average_response_time` - Expected (DB has `responseTime`)
- `performer_reviews` - Expected table doesn't exist

### Fields That Exist With Different Names
- UI expects `profile_image_url` → DB has `image`
- UI expects `social_media` → DB has `social_links`
- UI expects `base_rate` → DB has `base_price`
- UI expects `total_performances` → DB has `shows_played`
- UI expects `years_experience` → DB has `years_active`
- UI expects `average_response_time` → DB has `responseTime`

## Communities/Hubs Table

### Currently Missing Fields
- Table structure needs investigation
- Expected fields based on UI components:
  - `name`
  - `description`
  - `image_url`
  - `member_count`
  - `event_count`
  - `location`
  - `category`
  - `is_verified`

## Calendar-Specific Fields

### Events Table Extensions Needed
- `recurring_pattern` - For recurring events
- `recurring_end_date` - For recurring event series
- `timezone` - For proper time zone handling
- `reminder_settings` - For user reminders

## Tickets/Bookings Table

### Currently Missing Fields
- `qr_code` - For ticket validation
- `seat_numbers` - For assigned seating
- `ticket_tier` - For different ticket levels
- `special_instructions` - For attendee notes
- `checked_in_at` - For event check-in tracking

## Recommended Schema Updates

### Priority 1 (Critical for Basic Functionality)
1. Add location fields to venues and events tables
2. Standardize image field names across all tables
3. Add pricing fields consistently

### Priority 2 (Enhanced Features)
1. Add analytics fields (ratings, counts, rates)
2. Add booking configuration fields
3. Add social/community features

### Priority 3 (Advanced Features)
1. Add virtual tour and media galleries
2. Add complex scheduling and recurring events
3. Add detailed technical requirements

## Migration Strategy

1. Create migration to add missing fields with sensible defaults
2. Backfill data where possible (e.g., calculate ratings from reviews)
3. Update UI components to handle both old and new field names during transition
4. Gradually deprecate old field names

## Notes

- Many of these fields can be added as nullable initially to avoid breaking changes
- Some fields might be better stored in separate tables (e.g., amenities, technical requirements)
- Consider using JSONB columns for flexible data like operating_hours, parking_info
- Location data should be properly indexed for geospatial queries