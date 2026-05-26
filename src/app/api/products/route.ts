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
      // e.g., searching "03L130270" will match "03L130277B" (same base "03L13027")
      const { data: searchResults } = await supabase
        .rpc('search_by_reference_base', { search_term: search });

      products = searchResults || [];
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
