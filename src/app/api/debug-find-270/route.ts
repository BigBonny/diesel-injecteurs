import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Search ALL products for ANY containing "03L130270" in compatible_references
    // Using text search on JSONB
    const { data, error } = await supabase
      .from('products')
      .select('id, name, reference, compatible_references')
      .filter('compatible_references', 'ilike', '%03L130270%');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Also get total count of products with compatible_references
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('compatible_references', 'is', null);
    
    // Get a sample of products that have 03L130277 to compare
    const { data: with277 } = await supabase
      .from('products')
      .select('id, name, compatible_references')
      .filter('compatible_references', 'ilike', '%03L130277%')
      .limit(10);
    
    return NextResponse.json({
      productsWith03L130270: data || [],
      count03L130270: data?.length || 0,
      totalProductsWithRefs: count,
      productsWith03L130277: with277 || [],
      error: error?.message,
      countError: countError?.message
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
