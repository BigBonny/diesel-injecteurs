import { NextResponse } from 'next/server';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || 'http://192.162.69.186/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';
const PRESTASHOP_FRONT_URL = 'http://192.162.69.186';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const [productId, imageIdWithExt] = path;

    if (!productId || !imageIdWithExt) {
      return new NextResponse(null, { status: 404 });
    }

    const imageId = imageIdWithExt.replace(/\.jpg$/i, '');

    // Fetch product XML to get the link_rewrite for the named JPEG URL
    const productUrl = `${PRESTASHOP_API_URL}/products/${productId}?ws_key=${PRESTASHOP_API_KEY}&display=full`;
    const productResponse = await fetch(productUrl, { signal: AbortSignal.timeout(10000) });

    let imageResponse: Response | null = null;

    if (productResponse.ok) {
      const productText = await productResponse.text();
      const rewriteMatch = productText.match(/<link_rewrite>(?:<!\[CDATA\[)?([^\]]+?)(?:\]\])?<\/link_rewrite>/);

      if (rewriteMatch) {
        const productName = rewriteMatch[1].trim();
        const imageUrl = `${PRESTASHOP_FRONT_URL}/${imageId}/${productName}.jpg`;
        imageResponse = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });
      }
    }

    if (!imageResponse || !imageResponse.ok) {
      // Fallback to productId-based JPEG URL
      const fallbackUrl = `${PRESTASHOP_FRONT_URL}/${imageId}/${productId}.jpg`;
      imageResponse = await fetch(fallbackUrl, { signal: AbortSignal.timeout(10000) });
    }

    if (!imageResponse || !imageResponse.ok) {
      return new NextResponse(null, { status: 404 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    let contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!acceptedTypes.includes(contentType.toLowerCase())) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching product image:', error);
    return new NextResponse(null, { status: 500 });
  }
}
