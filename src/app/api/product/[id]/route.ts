import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error || !product) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform to match expected format
    const productData = {
      id: String(product.id),
      name: product.name || 'Product',
      description: product.description || '',
      price: product.price ? String(product.price) : '0.00',
      reference: product.reference || '',
      link_rewrite: product.link_rewrite || '',
      id_default_image: product.id_default_image ? String(product.id_default_image) : null,
      id_category_default: product.id_category_default ? String(product.id_category_default) : null,
      category_name: product.category_name || null,
      supplier_reference: product.supplier_reference || null,
      associations: {
        images: product.images || []
      },
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
