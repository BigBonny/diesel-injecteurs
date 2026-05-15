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
    
    // Look for custom fields that might contain compatible references
    // Check description or meta fields
    const descriptionMatch = xmlText.match(/<description>\s*<!\[CDATA\[\s*([\s\S]*?)\s*\]\]>\s*<\/description>/);
    const description = descriptionMatch ? descriptionMatch[1].substring(0, 200) : '';
    
    // Check for any field containing "03L130277" pattern
    const compatibleRefPattern = /03L130277[A-Z0-9]*/g;
    const foundRefs = xmlText.match(compatibleRefPattern) || [];
    
    // Look for product_features section (full content, not truncated)
    const featuresMatch = xmlText.match(/<product_features>[\s\S]*?<\/product_features>/);
    const featuresSection = featuresMatch ? featuresMatch[0] : 'No features found';
    
    // Also check for any text containing reference patterns
    const allTextRefs = xmlText.match(/Ref\.\s+[A-Z0-9-]+/gi) || [];
    const rawRefPatterns = xmlText.match(/[A-Z0-9]{5,20}/g) || [];
    
    // Look for associations section  
    const associationsMatch = xmlText.match(/<associations>[\s\S]*?<\/associations>/);
    const associationsSection = associationsMatch ? associationsMatch[0].substring(0, 1000) : 'No associations found';
    
    return NextResponse.json({
      id,
      reference,
      supplier_reference: supplierReference,
      ean13,
      upc,
      hasFeatures,
      hasAssociations,
      foundCompatibleRefs: foundRefs,
      allTextRefs: allTextRefs.slice(0, 20),
      rawRefPatterns: rawRefPatterns.slice(0, 30),
      descriptionPreview: description,
      featuresSection,
      associationsSection,
      fullXmlLength: xmlText.length
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
