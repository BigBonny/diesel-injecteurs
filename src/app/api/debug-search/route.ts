import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // Check if compatible_references column exists and has data
    const { data, error } = await supabase
      .from('products')
      .select('id, name, reference, supplier_reference, compatible_references')
      .limit(5);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Search for products with specific reference
    const searchTerm = '03L130277'; // Try partial match
    const { data: searchResults, error: searchError } = await supabase
      .from('products')
      .select('id, name, reference, compatible_references')
      .or(`reference.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
      .limit(10);
    
    return NextResponse.json({
      sampleProducts: data,
      searchResults: searchResults,
      searchError: searchError?.message,
      columnExists: data && data.length > 0 && 'compatible_references' in (data[0] || {})
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
