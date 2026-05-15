import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Category name patterns (filter by product name)
const CATEGORY_PATTERNS: Record<string, string[]> = {
  'turbos': ['turbo', 'turbos'],
  'injecteurs': ['injecteur', 'injecteurs', 'injector', 'injecteurs'],
  'kit-turbo-chra': ['chra', 'kit chra', 'cartouche chra', 'kit turbo chra']
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // If requesting a single product
    if (productId) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        return NextResponse.json({ products: [] });
      }

      return NextResponse.json({ products: [data] });
    }

    // Build Supabase query
    let query = supabase.from('products').select('*');

    // Filter by search query if specified
    // Search in name, reference, supplier_reference, and compatible_references (JSONB)
    if (search) {
      // Escape special characters for safe SQL usage
      const escapedSearch = search.replace(/[%_]/g, '\\$&');
      
      // Use ilike for text fields
      query = query.or(`name.ilike.%${escapedSearch}%,reference.ilike.%${escapedSearch}%,supplier_reference.ilike.%${escapedSearch}%`);
      
      // Also filter for compatible_references using JSONB text search
      // This checks if the JSONB array contains the search term (case-insensitive)
      query = query.or(`compatible_references::text.ilike.%${escapedSearch}%`);
    }

    // Filter by category if specified (using name patterns)
    if (category && category !== 'Tous') {
      const patterns = CATEGORY_PATTERNS[category];
      if (patterns && patterns.length > 0) {
        // Build OR condition for category patterns
        const patternFilters = patterns.map(p => `name.ilike.%${p}%`);
        query = query.or(patternFilters.join(','));
      }
    }

    // Filter by brand if specified (using ILIKE for case-insensitive search)
    if (brand && brand !== 'Toutes') {
      query = query.ilike('name', `%${brand}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products', products: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: data || [] });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [] },
      { status: 500 }
    );
  }
}
