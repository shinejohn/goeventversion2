-- packages/supabase/migrations/20240101000002_geolocation_functions.sql

-- Function to find nearest community
CREATE OR REPLACE FUNCTION find_nearest_community(
  lat FLOAT,
  lng FLOAT,
  max_distance_miles INT DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  city TEXT,
  state TEXT,
  distance_miles FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.slug,
    c.city,
    c.state,
    ST_Distance(
      c.location::geography,
      ST_MakePoint(lng, lat)::geography
    ) * 0.000621371 AS distance_miles
  FROM communities c
  WHERE ST_DWithin(
    c.location::geography,
    ST_MakePoint(lng, lat)::geography,
    max_distance_miles * 1609.34  -- Convert miles to meters
  )
  ORDER BY distance_miles
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Index for performance
CREATE INDEX idx_communities_location 
  ON communities USING GIST (location);