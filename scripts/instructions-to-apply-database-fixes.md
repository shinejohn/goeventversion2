# Instructions to Apply Database Fixes

## Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/bkkukfyfqbmfvwjxqmrp/sql/new

## Step 2: Copy and Run the SQL Script
Copy the entire contents of `scripts/fix-database-schema.sql` and paste it into the SQL Editor.

## Step 3: Execute the Script
Click "Run" to execute all the SQL commands.

## Step 4: Expected Results
The script will:
1. Fix all column mismatches between UI and database
2. Create missing tables (performers, bookings, calendars, social features, etc.)
3. Add sponsor and organizer tables for non-performer events
4. Add meeting-specific tables for government meetings
5. Add event activities and schedules for complex events like fairs
6. Create common public venues (parks, beaches, streets)
7. Ensure every event has a venue (enforced by constraint)
8. Enable RLS on all new tables with basic policies
9. Create necessary indexes for performance

## Step 5: Run Test Data Script
After the schema is fixed, run:
```bash
cd /users/johnshine/Dropbox/Fibonacco/goeventcity/Version2-GEC/when-the-fun
npm run tsx scripts/add-comprehensive-test-data.ts
```

This will add:
- Venues (theaters, outdoor spaces, clubs, etc.)
- Performers (bands, solo artists, DJs, comedians)
- Events with performers (concerts, shows)
- Events without performers (City Commission Meeting, Library Book Sale)
- Sponsors and organizers
- Meeting details for government events
- Reviews and other test data

## Step 6: Verify Data Access
After both scripts complete, all pages should display data correctly:
- Homepage will show upcoming events
- Venues page will show all venues
- Performers page will show all performers
- Event details will show proper relationships
- Events without performers will show sponsors/organizers instead

## Business Rules Enforced:
1. Every event MUST be at a venue (parks, streets are venues too)
2. Events may or may not have performers
3. Events without performers should have sponsors or organizers
4. Events can have multiple performers
5. Events can be meetings with agendas and documents
6. Events can be complex (fairs with multiple stages and activities)