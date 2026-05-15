import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if compatible_references column exists and has data
    const { data, error } = await supabase
      .from('products')
      .select('id, name, reference, supplier_reference, compatible_references')
      .limit(5);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Search for products with 03L130277B (what we have in DB)
    const { data: results277, error: error277 } = await supabase
      .from('products')
      .select('id, name, reference, compatible_references')
      .or(`reference.ilike.%03L130277%,name.ilike.%03L130277%,compatible_references.cs.{"03L130277B"}`)
      .limit(20);
    
    // Search for products with 03L130270B (what user searches for)
    const { data: results270, error: error270 } = await supabase
      .from('products')
      .select('id, name, reference, compatible_references')
      .or(`reference.ilike.%03L130270%,name.ilike.%03L130270%,compatible_references.cs.{"03L130270B"}`)
      .limit(20);
    
    // Count products that have any compatible_references
    const { count: withRefs, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('compatible_references', 'is', null);
    
    return NextResponse.json({
      sampleProducts: data,
      search03L130277B: { results: results277, error: error277?.message, count: results277?.length },
      search03L130270B: { results: results270, error: error270?.message, count: results270?.length },
      columnExists: data && data.length > 0 && 'compatible_references' in (data[0] || {}),
      totalProductsWithRefs: withRefs
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
