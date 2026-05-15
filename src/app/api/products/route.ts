import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Category name patterns (filter by product name)
const CATEGORY_PATTERNS: Record<string, string[]> = {
  'turbos': ['turbo', 'turbos'],
  'injecteurs': ['injecteur', 'injecteurs', 'injector', 'injecteurs'],
  'kit-turbo-chra': ['chra', 'kit chra', 'cartouche chra', 'kit turbo chra']
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

    let products: Product[] = [];

    if (search) {
      // When searching, we need to search in multiple places and merge results
      const escapedSearch = search.replace(/[%_]/g, '\\$&');

      // Search 1: Regular text fields (name, reference, supplier_reference)
      const { data: textSearchResults } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${escapedSearch}%,reference.ilike.%${escapedSearch}%,supplier_reference.ilike.%${escapedSearch}%`);

      // Search 2: Compatible references using RPC function
      const { data: compatibleRefsResults } = await supabase
        .rpc('search_compatible_references', { search_term: search });

      // Merge results and remove duplicates by id
      const productMap = new Map<string | number, Product>();
      
      (textSearchResults || []).forEach((p: Product) => productMap.set(p.id, p));
      (compatibleRefsResults || []).forEach((p: Product) => productMap.set(p.id, p));
      
      products = Array.from(productMap.values());
    } else {
      // No search - just fetch all products
      const { data } = await supabase.from('products').select('*');
      products = data || [];
    }

    // Apply category filter
    if (category && category !== 'Tous') {
      const patterns = CATEGORY_PATTERNS[category];
      if (patterns && patterns.length > 0) {
        products = products.filter(p => 
          patterns.some(pat => p.name.toLowerCase().includes(pat.toLowerCase()))
        );
      }
    }

    // Apply brand filter
    if (brand && brand !== 'Toutes') {
      products = products.filter(p => 
        p.name.toLowerCase().includes(brand.toLowerCase())
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [] },
      { status: 500 }
    );
  }
}
