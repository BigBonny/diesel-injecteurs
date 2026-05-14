import { NextRequest, NextResponse } from 'next/server';

// Use server IP directly to avoid SSL and DNS issues
const PRESTASHOP_API_URL = 'http://192.162.69.186/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const [productId, imageId] = path;
    
    // PrestaShop front-end serves images publicly at: /{image_id}/{product_name}.jpg
    // We'll try to fetch the product first to get the name, then construct the image URL
    const productUrl = `${PRESTASHOP_API_URL}/products/${productId}?ws_key=${PRESTASHOP_API_KEY}`;
    const productResponse = await fetch(productUrl);
    
    if (productResponse.ok) {
      const productText = await productResponse.text();
      // Try to extract the rewrite URL (product name) from the XML
      const rewriteMatch = productText.match(/<link_rewrite>([^<]+)<\/link_rewrite>/);
      if (rewriteMatch) {
        const productName = rewriteMatch[1];
        const imageUrl = `http://192.162.69.186/${imageId}/${productName}.jpg`;
        
        const imageResponse = await fetch(imageUrl);
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
          
          return new NextResponse(imageBuffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      }
    }
    
    // Fallback: try direct image ID path
    const fallbackUrl = `http://192.162.69.186/${imageId}/${productId}.jpg`;
    const fallbackResponse = await fetch(fallbackUrl);
    
    if (fallbackResponse.ok) {
      const imageBuffer = await fallbackResponse.arrayBuffer();
      const contentType = fallbackResponse.headers.get('content-type') || 'image/jpeg';
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
    
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching product image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product image' },
      { status: 500 }
    );
  }
}
