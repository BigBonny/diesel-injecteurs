import { NextRequest, NextResponse } from 'next/server';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || '';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const response = await fetch(`${PRESTASHOP_API_URL}/products/${id}?ws_key=${PRESTASHOP_API_KEY}&display=full`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: response.status }
      );
    }

    const text = await response.text();
    console.log('Raw XML response:', text.substring(0, 1000));
    
    // Parse XML to extract product data
    const productMatch = text.match(/<product>([\s\S]*?)<\/product>/);
    if (!productMatch) {
      console.error('No product match in XML');
      return NextResponse.json(
        { error: 'Failed to parse product data', raw: text.substring(0, 500) },
        { status: 500 }
      );
    }

    const productXml = productMatch[1];
    console.log('Product XML:', productXml.substring(0, 500));
    
    const extractValue = (tag: string) => {
      // Try CDATA first - match everything between <![CDATA[ and ]]>
      const cdataMatch = productXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
      if (cdataMatch) return cdataMatch[1];
      // Fallback to simple tag
      const match = productXml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
      return match ? match[1] : null;
    };

    const extractLanguageValue = (tag: string) => {
      // Try CDATA in language tag first
      const cdataMatch = productXml.match(new RegExp(`<${tag}[^>]*><language[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></language></${tag}>`));
      if (cdataMatch) return cdataMatch[1];
      // Fallback to simple language tag
      const match = productXml.match(new RegExp(`<${tag}[^>]*><language[^>]*>([^<]*)</language></${tag}>`));
      return match ? match[1] : null;
    };

    const extractAssociations = () => {
      const imagesMatch = productXml.match(/<images>([\s\S]*?)<\/images>/);
      if (!imagesMatch) return { images: [] };
      
      const imageMatches = imagesMatch[1].matchAll(/<image>([\s\S]*?)<\/image>/g);
      const images = [];
      for (const match of imageMatches) {
        const idMatch = match[1].match(/<id>([^<]*)<\/id>/);
        if (idMatch) {
          images.push({ id: idMatch[1] });
        }
      }
      return { images };
    };

    const productData = {
      id: extractValue('id'),
      name: extractLanguageValue('name') || extractValue('name'),
      description: extractLanguageValue('description') || extractValue('description'),
      price: extractValue('price'),
      reference: extractValue('reference'),
      link_rewrite: extractLanguageValue('link_rewrite') || extractValue('link_rewrite'),
      id_default_image: extractValue('id_default_image'),
      id_category_default: extractValue('id_category_default'),
      associations: extractAssociations(),
    };

    console.log('Extracted product data:', productData);
    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
