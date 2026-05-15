import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || '03L130270';
    
    // Test the fuzzy search function
    const { data: fuzzyResults, error: fuzzyError } = await supabase
      .rpc('search_by_reference_base', { search_term: term });
    
    // Also test direct text search
    const { data: directResults, error: directError } = await supabase
      .from('products')
      .select('id, name, compatible_references')
      .filter('compatible_references', 'ilike', `%${term}%`);
    
    // Calculate base pattern
    const basePattern = term.length >= 8 ? term.substring(0, 8) : term;
    
    // Test with base pattern
    const { data: baseResults, error: baseError } = await supabase
      .from('products')
      .select('id, name, compatible_references')
      .filter('compatible_references', 'ilike', `%${basePattern}%`);
    
    interface Product { id: string | number; name: string; compatible_references?: string[] }
    
    return NextResponse.json({
      searchTerm: term,
      basePattern,
      fuzzySearch: {
        count: fuzzyResults?.length || 0,
        error: fuzzyError?.message,
        sample: (fuzzyResults as Product[] | null)?.slice(0, 3).map((p) => ({ id: p.id, name: p.name }))
      },
      directSearch: {
        count: directResults?.length || 0,
        error: directError?.message
      },
      basePatternSearch: {
        count: baseResults?.length || 0,
        error: baseError?.message,
        sample: (baseResults as Product[] | null)?.slice(0, 3).map((p) => ({ 
          id: p.id, 
          name: p.name,
          refs: p.compatible_references 
        }))
      }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
