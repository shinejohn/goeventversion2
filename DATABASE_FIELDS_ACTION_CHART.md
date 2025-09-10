# Database Fields Action Chart

## Legend
- 🟢 **CREATE**: Field needs to be added to database
- 🔄 **RENAME**: Field exists with different name - update code instead
- 🗃️ **JSON**: Should be stored as JSON/JSONB field
- 📊 **CALCULATE**: Can be calculated from existing data
- ❌ **SKIP**: Not needed or redundant
- 🔗 **RELATION**: Should be in a separate related table

## Events Table

| Field | Action | Current State | Recommendation |
|-------|--------|---------------|----------------|
| `latitude` | 🟢 CREATE | Missing | Add as DECIMAL for geolocation |
| `longitude` | 🟢 CREATE | Missing | Add as DECIMAL for geolocation |
| `base_hourly_rate` | ❌ SKIP | Missing | Not applicable to events |
| `highlights` | 🟢 CREATE | Missing | Add as TEXT[] array |
| `ticket_url` | 🟢 CREATE | Missing | Add as TEXT for external ticketing |
| `series_id` | 🟢 CREATE | Missing | Add as UUID with FK to event_series table |
| `age_restrictions` | 🔄 RENAME | Exists as `age_restriction` | Update code to use existing field |
| `ticket_price` | 🔄 RENAME | Exists as `price_min` | Update code to use existing field |

## Venues Table

| Field | Action | Current State | Recommendation |
|-------|--------|---------------|----------------|
| `latitude` | 🟢 CREATE | Missing (have location_data) | Add as DECIMAL or extract from location_data |
| `longitude` | 🟢 CREATE | Missing (have location_data) | Add as DECIMAL or extract from location_data |
| `profile_image_url` | 🔄 RENAME | Exists as `image_url` | Update code to use existing field |
| `base_hourly_rate` | 🔄 RENAME | Exists as `pricePerHour` | Update code to use existing field |
| `capacity` | 🔄 RENAME | Exists as `max_capacity` | Update code to use existing field |
| `parking_info` | 🗃️ JSON | Missing | Add as JSONB with structure |
| `transit_options` | 🗃️ JSON | Missing | Add as JSONB array |
| `nearby_amenities` | 🗃️ JSON | Missing | Add as JSONB array |
| `floor_plans` | 🗃️ JSON | Missing | Add as JSONB array of URLs |
| `virtual_tour_url` | 🟢 CREATE | Missing | Add as TEXT |
| `rules_and_restrictions` | 🟢 CREATE | Missing | Add as TEXT |
| `operating_hours` | 🗃️ JSON | Might exist | Verify or add as JSONB |
| `blackout_dates` | 🗃️ JSON | Missing | Add as DATE[] or JSONB |
| `minimum_notice_hours` | 🟢 CREATE | Missing | Add as INTEGER (default 48) |
| `rentable_amenities` | 🗃️ JSON | Missing | Add as JSONB array |
| `minimum_booking_hours` | 🟢 CREATE | Missing | Add as INTEGER (default 2) |
| `deposit_percentage` | 🟢 CREATE | Missing | Add as INTEGER (default 25) |
| `cancellation_policy` | 🟢 CREATE | Missing | Add as TEXT or ENUM |
| `insurance_required` | 🟢 CREATE | Missing | Add as BOOLEAN (default false) |
| `security_deposit` | 🟢 CREATE | Missing | Add as DECIMAL (default 0) |
| `seated_capacity` | 🟢 CREATE | Missing | Add as INTEGER |
| `cocktail_capacity` | 🟢 CREATE | Missing | Add as INTEGER |
| `total_events` | 📊 CALCULATE | Exists | Already in DB |
| `occupancy_rate` | 📊 CALCULATE | Missing | Calculate from bookings |
| `repeat_booking_rate` | 📊 CALCULATE | Missing | Calculate from bookings |

## Performers Table

| Field | Action | Current State | Recommendation |
|-------|--------|---------------|----------------|
| `profile_image_url` | 🔄 RENAME | Exists as `image` | Update code to use existing field |
| `social_media` | 🔄 RENAME | Exists as `social_links` | Update code to use existing field |
| `base_rate` | 🔄 RENAME | Exists as `base_price` | Update code to use existing field |
| `total_performances` | 🔄 RENAME | Exists as `shows_played` | Update code to use existing field |
| `years_experience` | 🔄 RENAME | Exists as `years_active` | Update code to use existing field |
| `average_response_time` | 🔄 RENAME | Exists as `responseTime` | Update code to use existing field |
| `media_gallery` | 🗃️ JSON | Missing | Add as JSONB array of media objects |
| `technical_requirements` | 🟢 CREATE | Missing | Add as TEXT or JSONB |
| `availability` | 🗃️ JSON | Missing | Add as JSONB schedule object |
| `min_booking_hours` | 🟢 CREATE | Missing | Add as INTEGER |
| `max_travel_distance` | 🟢 CREATE | Missing | Add as INTEGER (miles) |
| `setup_time_required` | 🟢 CREATE | Missing | Add as INTEGER (minutes) |
| `equipment_provided` | 🟢 CREATE | Missing | Add as BOOLEAN |
| `insurance_coverage` | 🟢 CREATE | Missing | Add as BOOLEAN |
| `repeat_booking_rate` | 📊 CALCULATE | Missing | Calculate from bookings |
| `monthly_bookings` | 📊 CALCULATE | Missing | Calculate from bookings |
| `performer_reviews` | 🔗 RELATION | Reviews in JSON | Consider separate table for better querying |

## Communities/Hubs Table

| Field | Action | Current State | Recommendation |
|-------|--------|---------------|----------------|
| ALL FIELDS | ❓ INVESTIGATE | Unknown table structure | Need to check if table exists |
| `name` | 🟢 CREATE | Unknown | Basic required field |
| `description` | 🟢 CREATE | Unknown | Basic required field |
| `image_url` | 🟢 CREATE | Unknown | Basic required field |
| `member_count` | 📊 CALCULATE | Unknown | Calculate from memberships |
| `event_count` | 📊 CALCULATE | Unknown | Calculate from events |
| `location` | 🟢 CREATE | Unknown | Add as TEXT or separate fields |
| `category` | 🟢 CREATE | Unknown | Add as TEXT or ENUM |
| `is_verified` | 🟢 CREATE | Unknown | Add as BOOLEAN |

## Calendar-Specific Fields (Events Table Extensions)

| Field | Action | Current State | Recommendation |
|-------|--------|---------------|----------------|
| `recurring_pattern` | 🗃️ JSON | Missing | Add as JSONB with RRULE format |
| `recurring_end_date` | 🟢 CREATE | Missing | Add as TIMESTAMP |
| `timezone` | 🟢 CREATE | Missing | Add as TEXT (IANA timezone) |
| `reminder_settings` | 🗃️ JSON | Missing | Add as JSONB user preferences |

## Tickets/Bookings Table

| Field | Action | Current State | Recommendation |
|-------|--------|---------------|----------------|
| `qr_code` | 📊 CALCULATE | Missing | Generate on demand, don't store |
| `seat_numbers` | 🗃️ JSON | Missing | Add as JSONB array |
| `ticket_tier` | 🟢 CREATE | Missing | Add as TEXT or ENUM |
| `special_instructions` | 🟢 CREATE | Missing | Add as TEXT |
| `checked_in_at` | 🟢 CREATE | Missing | Add as TIMESTAMP |

## Summary by Priority

### Priority 1: Code Changes Only (No DB Changes Needed)
These can be fixed immediately by updating the code:
- Events: `age_restrictions` → `age_restriction`
- Events: `ticket_price` → `price_min`
- Venues: `profile_image_url` → `image_url`
- Venues: `base_hourly_rate` → `pricePerHour`
- Venues: `capacity` → `max_capacity`
- Performers: `profile_image_url` → `image`
- Performers: `social_media` → `social_links`
- Performers: `base_rate` → `base_price`
- Performers: `total_performances` → `shows_played`
- Performers: `years_experience` → `years_active`
- Performers: `average_response_time` → `responseTime`

### Priority 2: Essential Missing Fields
Critical for core functionality:
- Events: `latitude`, `longitude` (for maps)
- Events: `ticket_url` (for external ticketing)
- Venues: `latitude`, `longitude` (or extract from location_data)
- Venues: `parking_info`, `transit_options` (as JSONB)
- Venues: `minimum_booking_hours`, `deposit_percentage`
- Performers: `technical_requirements`
- Bookings: `checked_in_at`

### Priority 3: Enhanced Features
Nice to have for better UX:
- Events: `highlights`, `series_id`
- Venues: `virtual_tour_url`, `floor_plans`
- Venues: `seated_capacity`, `cocktail_capacity`
- Performers: `media_gallery`, `availability`
- Calendar: `recurring_pattern`, `timezone`

### Priority 4: Analytics & Calculated Fields
Can be computed from existing data:
- Venues: `occupancy_rate`, `repeat_booking_rate`
- Performers: `monthly_bookings`, `repeat_booking_rate`
- Communities: `member_count`, `event_count`

## Recommended Migration SQL

```sql
-- Priority 2: Essential fields for Events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS ticket_url TEXT,
ADD COLUMN IF NOT EXISTS highlights TEXT[];

-- Priority 2: Essential fields for Venues
ALTER TABLE venues
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS parking_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS transit_options JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS minimum_booking_hours INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS deposit_percentage INTEGER DEFAULT 25;

-- Priority 2: Essential fields for Performers
ALTER TABLE performers
ADD COLUMN IF NOT EXISTS technical_requirements TEXT;

-- Priority 2: Essential fields for Bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP;
```