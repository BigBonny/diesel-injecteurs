-- Create a function to search for compatible references
-- Run this in your Supabase SQL Editor

-- Drop existing function if exists
DROP FUNCTION IF EXISTS search_compatible_references(text);

-- Create function to search compatible_references JSONB array
CREATE OR REPLACE FUNCTION search_compatible_references(search_term text)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM products
  WHERE compatible_references::text ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql;

-- Grant access
GRANT EXECUTE ON FUNCTION search_compatible_references(text) TO anon;
GRANT EXECUTE ON FUNCTION search_compatible_references(text) TO authenticated;
