-- Create a function for fuzzy/partial search in compatible references
-- Run this in your Supabase SQL Editor

-- Drop existing function if exists
DROP FUNCTION IF EXISTS search_compatible_references_fuzzy(text);

-- Create function to search compatible_references with partial matching
CREATE OR REPLACE FUNCTION search_compatible_references_fuzzy(search_term text)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM products
  WHERE compatible_references::text ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql;

-- Grant access
GRANT EXECUTE ON FUNCTION search_compatible_references_fuzzy(text) TO anon;
GRANT EXECUTE ON FUNCTION search_compatible_references_fuzzy(text) TO authenticated;

-- Also create a function that searches by base pattern (first 7 chars)
DROP FUNCTION IF EXISTS search_by_reference_base(text);

CREATE OR REPLACE FUNCTION search_by_reference_base(search_term text)
RETURNS SETOF products AS $$
DECLARE
  base_pattern text;
BEGIN
  -- Extract base pattern (e.g., "03L130270" -> "03L13027" to match "03L130277B")
  IF length(search_term) >= 8 THEN
    base_pattern := substring(search_term from 1 for 8);
  ELSE
    base_pattern := search_term;
  END IF;
  
  RETURN QUERY
  SELECT *
  FROM products
  WHERE compatible_references::text ILIKE '%' || base_pattern || '%'
     OR name ILIKE '%' || search_term || '%'
     OR reference ILIKE '%' || search_term || '%'
     OR supplier_reference ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql;

-- Grant access
GRANT EXECUTE ON FUNCTION search_by_reference_base(text) TO anon;
GRANT EXECUTE ON FUNCTION search_by_reference_base(text) TO authenticated;
