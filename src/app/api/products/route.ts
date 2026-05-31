import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Category name patterns (filter by product name)
// These are used ONLY for categories that don't have a dedicated category_name in the DB
const CATEGORY_PATTERNS: Record<string, string[]> = {
  'turbos': ['turbo'],
  'injecteurs': ['injecteur', 'injector'],
  'kit-turbo-chra': ['chra'],
  'pompes-hp': ['pompe']
};

// Exclusion patterns to prevent cross-contamination between categories
const CATEGORY_EXCLUSIONS: Record<string, string[]> = {
  'turbos': ['pompe', 'injecteur'],
  'injecteurs': ['pompe', 'turbo'],
  'kit-turbo-chra': ['pompe', 'injecteur'],
  'pompes-hp': ['turbo', 'injecteur']
};

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: string;
  reference: string | null;
  supplier_reference: string | null;
  compatible_references: string[] | null;
  link_rewrite: string | null;
  id_default_image: string | null;
  id_category_default: string | null;
  category_name: string | null;
  images: Array<{ id: string }>;
}

// Helper to fetch all rows from a query (bypassing Supabase 1000 row limit)
async function fetchAllProducts(query: ReturnType<ReturnType<typeof supabase.from>['select']>) {
  const PAGE_SIZE = 1000;
  let allData: Product[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await query.range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (data && data.length > 0) {
      allData = allData.concat(data as Product[]);
      from += PAGE_SIZE;
      hasMore = data.length === PAGE_SIZE;
    } else {
      hasMore = false;
    }
  }

  return allData;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const countOnly = searchParams.get('count') === 'true';

    // If only requesting total count
    if (countOnly && !search && !category && !brand) {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      return NextResponse.json({ total: count ?? 0 });
    }

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

    let products: Product[] = [];

    if (search) {
      // Use fuzzy search function that matches base reference patterns
      const { data: searchResults } = await supabase
        .rpc('search_by_reference_base', { search_term: search });

      products = searchResults || [];
    } else if (category && category !== 'Tous') {
      // For pompes-hp, use the category_name field directly (most efficient)
      if (category === 'pompes-hp') {
        const query = supabase.from('products').select('*').eq('category_name', 'Pompes HP');
        products = await fetchAllProducts(query);
      } else {
        // For other categories, fetch by name pattern with pagination
        const patterns = CATEGORY_PATTERNS[category];
        if (patterns && patterns.length > 0) {
          // Build OR filter for name patterns
          const orFilter = patterns.map(pat => `name.ilike.%${pat}%`).join(',');
          const query = supabase.from('products').select('*').or(orFilter);
          products = await fetchAllProducts(query);
          
          // Exclude products that belong to other categories
          const exclusions = CATEGORY_EXCLUSIONS[category];
          if (exclusions) {
            products = products.filter(p => {
              const nameLower = p.name.toLowerCase();
              // If product has category_name set and it doesn't match this category, exclude it
              if (p.category_name && p.category_name === 'Pompes HP' && category !== 'pompes-hp') {
                return false;
              }
              // For turbos category: exclude products whose name starts with excluded terms
              if (category === 'turbos') {
                if (nameLower.startsWith('pompe') || nameLower.startsWith('injecteur')) {
                  return false;
                }
              }
              if (category === 'kit-turbo-chra') {
                // CHRA products should have 'chra' prominently in the name
                if (!nameLower.includes('chra')) {
                  return false;
                }
              }
              return true;
            });
          }
        }
      }
    } else {
      // No category filter - fetch all products with pagination
      const query = supabase.from('products').select('*');
      products = await fetchAllProducts(query);
    }

    // Apply brand filter
    if (brand && brand !== 'Toutes') {
      products = products.filter(p => 
        p.name.toLowerCase().includes(brand.toLowerCase())
      );
    }

    // Transform products to match frontend interface
    const transformedProducts = products.map(p => ({
      id: String(p.id),
      name: p.name || 'Produit sans nom',
      description: p.description || '',
      price: p.price ? String(p.price) : '0.00',
      reference: p.reference || '',
      supplier_reference: p.supplier_reference || null,
      compatible_references: p.compatible_references || null,
      link_rewrite: p.link_rewrite || null,
      id_default_image: p.id_default_image ? String(p.id_default_image) : null,
      id_category_default: p.id_category_default ? String(p.id_category_default) : null,
      category_name: p.category_name || null,
      images: p.images || []
    }));

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [] },
      { status: 500 }
    );
  }
}
