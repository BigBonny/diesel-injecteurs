import { NextResponse } from 'next/server';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || 'https://diesel-turbo-injection.com/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const display = searchParams.get('display') || 'full';
    const limit = searchParams.get('limit') || '1000';

    // Build PrestaShop API URL for categories
    const apiUrl = `${PRESTASHOP_API_URL}/categories?ws_key=${PRESTASHOP_API_KEY}&display=${display}&limit=${limit}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`PrestaShop API error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    console.log('Raw categories XML response length:', text.length);
    
    // Parse XML response
    const categoriesMatch = text.match(/<categories>([\s\S]*?)<\/categories>/);
    if (!categoriesMatch) {
      console.log('No categories found in XML');
      return NextResponse.json({ categories: [] });
    }

    const categoriesXml = categoriesMatch[1];
    const categoryMatches = categoriesXml.matchAll(/<category>([\s\S]*?)<\/category>/g);
    
    const categories = [];
    for (const match of categoryMatches) {
      const categoryXml = match[1];
      
      const extractValue = (tag: string) => {
        const cdataMatch = categoryXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
        if (cdataMatch) return cdataMatch[1];
        const simpleMatch = categoryXml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
        return simpleMatch ? simpleMatch[1] : null;
      };

      const extractLanguageValue = (tag: string) => {
        const tagMatch = categoryXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
        if (tagMatch) {
          const tagContent = tagMatch[1];
          const cdataMatch = tagContent.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
          if (cdataMatch) return cdataMatch[1];
        }
        return null;
      };

      const category = {
        id: extractValue('id'),
        id_parent: extractValue('id_parent'),
        name: extractLanguageValue('name') || extractValue('name'),
        level_depth: extractValue('level_depth'),
        active: extractValue('active'),
      };

      if (category.id) {
        categories.push(category);
      }
    }
    
    console.log('Extracted categories:', categories.length);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories from PrestaShop:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories from PrestaShop', categories: [] },
      { status: 500 }
    );
  }
}
