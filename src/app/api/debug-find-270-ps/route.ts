import { NextResponse } from 'next/server';

const PRESTASHOP_API_URL = 'http://192.162.69.186/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

export async function GET() {
  try {
    // Fetch product list with full display
    const url = `${PRESTASHOP_API_URL}/products?ws_key=${PRESTASHOP_API_KEY}&display=full&limit=0,100`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(30000)
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'API failed', status: response.status }, { status: 500 });
    }
    
    const xmlText = await response.text();
    
    // Check if 03L130270 exists anywhere in the XML
    const has270 = xmlText.includes('03L130270');
    const has277 = xmlText.includes('03L130277');
    
    // Find all products that contain these references
    const productMatches270: Array<{id: string, name: string, snippet: string}> = [];
    const productMatches277: Array<{id: string, name: string, snippet: string}> = [];
    
    // Split by product tags and check each
    const productRegex = /<product[^>]*>[\s\S]*?<\/product>/g;
    const products = xmlText.match(productRegex) || [];
    
    for (const productXml of products.slice(0, 100)) {
      const idMatch = productXml.match(/<id>\s*<!\[CDATA\[(\d+)\]\]>\s*<\/id>/) || 
                      productXml.match(/<id>(\d+)<\/id>/);
      const nameMatch = productXml.match(/<name>\s*<language[^>]*>\s*<!\[CDATA\[(.*?)\]\]>/) ||
                        productXml.match(/<name[^>]*>\s*<!\[CDATA\[(.*?)\]\]>/);
      
      const id = idMatch ? idMatch[1] : 'unknown';
      const name = nameMatch ? nameMatch[1] : 'Unknown';
      
      if (productXml.includes('03L130270')) {
        // Get surrounding context
        const idx = productXml.indexOf('03L130270');
        const snippet = productXml.substring(Math.max(0, idx - 100), Math.min(productXml.length, idx + 100));
        productMatches270.push({ id, name, snippet: snippet.replace(/\s+/g, ' ') });
      }
      
      if (productXml.includes('03L130277')) {
        const idx = productXml.indexOf('03L130277');
        const snippet = productXml.substring(Math.max(0, idx - 100), Math.min(productXml.length, idx + 100));
        productMatches277.push({ id, name, snippet: snippet.replace(/\s+/g, ' ') });
      }
    }
    
    return NextResponse.json({
      has03L130270: has270,
      has03L130277: has277,
      totalProductsScanned: products.length,
      productsWith03L130270: productMatches270.slice(0, 10),
      productsWith03L130277: productMatches277.slice(0, 5),
      sampleXmlSnippet: xmlText.substring(xmlText.indexOf('<product>'), xmlText.indexOf('<product>') + 500)
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
