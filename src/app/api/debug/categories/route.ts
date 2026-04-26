import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all products and count categories
    const { data, error } = await supabase
      .from('products')
      .select('id_category_default');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Count products per category
    const categoryCounts: Record<number, number> = {};
    data?.forEach((p: { id_category_default: number }) => {
      const cat = p.id_category_default || 0;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Convert to array and sort by count
    const categories = Object.entries(categoryCounts)
      .map(([id, count]) => ({ id: parseInt(id), count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ categories });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
