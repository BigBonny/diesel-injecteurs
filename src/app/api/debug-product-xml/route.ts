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
    
    // Check for various reference patterns
    const has270 = xmlText.includes('03L130270');
    const has277 = xmlText.includes('03L130277');
    
    // Extract reference fields
    const reference = xmlText.match(/<reference>\s*<!\[CDATA\[\s*(.*?)\s*\]\]>\s*<\/reference>/)?.[1] || 
                     xmlText.match(/<reference>(.*?)<\/reference>/)?.[1] || '';
    const supplierRef = xmlText.match(/<supplier_reference>\s*<!\[CDATA\[\s*(.*?)\s*\]\]>\s*<\/supplier_reference>/)?.[1] || 
                       xmlText.match(/<supplier_reference>(.*?)<\/supplier_reference>/)?.[1] || '';
    const ean13 = xmlText.match(/<ean13>\s*<!\[CDATA\[\s*(.*?)\s*\]\]>\s*<\/ean13>/)?.[1] || 
                  xmlText.match(/<ean13>(.*?)<\/ean13>/)?.[1] || '';
    
    // Extract all text content and look for refs
    const allTextRefs = xmlText.match(/Ref\.\s+[A-Z0-9-]+/gi) || [];
    
    // Find the positions of 270 and 277
    const pos270 = xmlText.indexOf('03L130270');
    const pos277 = xmlText.indexOf('03L130277');
    
    return NextResponse.json({
      id,
      has03L130270: has270,
      has03L130277: has277,
      pos03L130270: pos270 > -1 ? pos270 : null,
      pos03L130277: pos277 > -1 ? pos277 : null,
      reference,
      supplier_reference: supplierRef,
      ean13,
      allTextRefs: [...new Set(allTextRefs)],
      // Show XML around 270 if found
      context270: pos270 > -1 ? xmlText.substring(Math.max(0, pos270 - 200), pos270 + 200) : null,
      // Show XML around 277 if found
      context277: pos277 > -1 ? xmlText.substring(Math.max(0, pos277 - 200), pos277 + 200) : null,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
