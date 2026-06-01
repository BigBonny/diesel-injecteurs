import { NextResponse } from 'next/server';

const PS_BASE_URL = process.env.PS_BASE_URL || 'http://192.162.69.186';
const BLOG_SECRET = process.env.PS_BLOG_SECRET || 'DIESEL_BLOG_SECRET_2024';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page  = searchParams.get('page')  || '1';
    const limit = searchParams.get('limit') || '12';

    const url = `${PS_BASE_URL}/ps_blog.php?token=${BLOG_SECRET}&page=${page}&limit=${limit}&id_lang=1`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`PS blog script returned ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || 'Unknown error from PS blog script');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', posts: [], total: 0 },
      { status: 500 }
    );
  }
}
