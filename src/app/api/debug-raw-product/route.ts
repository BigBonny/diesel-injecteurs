import { NextResponse } from 'next/server';

const PRESTASHOP_API_URL = 'http://192.162.69.186/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '21463';
    
    const url = `${PRESTASHOP_API_URL}/products/${id}?ws_key=${PRESTASHOP_API_KEY}&display=full`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'API failed', status: response.status }, { status: 500 });
    }
    
    const xmlText = await response.text();
    
    // Extract ALL reference-like patterns from the XML
    const allRefs = xmlText.match(/[A-Z0-9]{5,20}/g) || [];
    
    // Look for specific patterns
    const has270 = xmlText.includes('03L130270');
    const has277 = xmlText.includes('03L130277');
    
    // Extract description field fully
    const descMatch = xmlText.match(/<description>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/);
    const description = descMatch ? descMatch[1].substring(0, 1000) : '';
    
    // Check for features that might contain refs
    const featuresMatch = xmlText.match(/<product_features>[\s\S]*?<\/product_features>/);
    
    return NextResponse.json({
      id,
      has03L130270: has270,
      has03L130277: has277,
      allReferenceLikePatterns: [...new Set(allRefs)].slice(0, 50),
      descriptionPreview: description,
      hasProductFeatures: !!featuresMatch,
      featuresSection: featuresMatch ? featuresMatch[0].substring(0, 1000) : null
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
