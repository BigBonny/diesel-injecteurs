import { NextResponse } from 'next/server';

const PRESTASHOP_API_URL = 'http://192.162.69.186/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '7181';
    
    const url = `${PRESTASHOP_API_URL}/products/${id}?ws_key=${PRESTASHOP_API_KEY}&display=full`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'API failed', status: response.status }, { status: 500 });
    }
    
    const xmlText = await response.text();
    
    // Extract key fields
    const reference = xmlText.match(/<reference>\s*<!\[CDATA\[\s*(.*?)\s*\]\]>\s*<\/reference>/)?.[1] || 
                     xmlText.match(/<reference>(.*?)<\/reference>/)?.[1] || '';
    const supplierReference = xmlText.match(/<supplier_reference>\s*<!\[CDATA\[\s*(.*?)\s*\]\]>\s*<\/supplier_reference>/)?.[1] || 
                             xmlText.match(/<supplier_reference>(.*?)<\/supplier_reference>/)?.[1] || '';
    const ean13 = xmlText.match(/<ean13>(.*?)<\/ean13>/)?.[1] || '';
    const upc = xmlText.match(/<upc>(.*?)<\/upc>/)?.[1] || '';
    
    // Check for features/attributes
    const hasFeatures = xmlText.includes('<product_features>');
    const hasAssociations = xmlText.includes('<associations>');
    
    return NextResponse.json({
      id,
      reference,
      supplier_reference: supplierReference,
      ean13,
      upc,
      hasFeatures,
      hasAssociations,
      preview: xmlText.substring(0, 500)
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
