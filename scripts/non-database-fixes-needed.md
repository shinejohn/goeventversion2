# Non-Database Fixes Needed

Based on the comprehensive analysis of 172 database queries across 533 files, here are the non-database fixes that need code changes:

## 1. Column Name Mismatches

### Events Table
- **Issue**: UI uses `start_date` but database has `start_datetime`
- **Solution**: Added generated column `start_date` in database (FIXED)
- **Alternative**: Could update all UI references from `start_date` to `start_datetime`

### Performers Table  
- **Issue**: Some routes expect `average_rating` while others use `rating`
- **Solution**: Use consistent field name across all routes
- **Files affected**: 
  - `/performers/$performerId.tsx`
  - `/performers/index.tsx`

## 2. Missing RPC Functions

Several routes call RPC functions that don't exist:

### `get_account_invitations`
- **Used in**: `/home/$account/settings/team/invitations.tsx`
- **Solution**: Create the RPC function or use direct table query

### `get_account_members` 
- **Used in**: Multiple team account routes
- **Solution**: Function was created in migration but may need adjustment

## 3. Table Name Inconsistencies

### Artists vs Performers
- **Issue**: Some routes use 'artists' table, others use 'performers'
- **Solution**: Created view `artists` that maps to `performers` table (FIXED)

### Post Comments/Likes
- **Issue**: Routes use both `social_comments` and `post_comments`
- **Solution**: Created views to map both names (FIXED)

## 4. Complex Queries Need Adjustment

### Hub Events Relationship
- **File**: `/hub/$slug/events.tsx`
- **Issue**: Expects hub-event relationships that aren't defined
- **Solution**: Add `hub_events` junction table or adjust query

### User Account Workspace
- **File**: `/home/user/index.tsx`
- **Issue**: Complex queries expecting specific account structures
- **Solution**: May need to adjust query or add missing columns

## 5. Missing Event-Performer Relationships

### Event Performers Join
- **Issue**: Different join table names used (`performers_events` vs `event_performers`)
- **Solution**: Both tables created, but queries should use consistent name

## 6. Community Integration

### Events Community Relationship
- **Issue**: Events table has `community_id` that's required
- **Solution**: Either make it nullable or ensure all events have communities

## 7. Status Field Values

### Event Status
- **Issue**: Homepage looks for 'published' but we were using 'upcoming'
- **Solution**: Updated existing events to 'published' (FIXED)
- **Better solution**: Standardize status values across codebase

## Priority Fixes

1. **High Priority**: Fix community_id requirement in events table
2. **Medium Priority**: Standardize performer rating field names
3. **Low Priority**: Clean up duplicate table references

## Recommendations

1. **Use TypeScript Types**: Generate types from database and use consistently
2. **Standardize Naming**: Pick either snake_case or camelCase and stick to it
3. **Document Relationships**: Clear documentation of all table relationships
4. **Add Validation**: Ensure required fields are validated before insert