import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, amount, currency, customerEmail, customerName, returnURL, cancelURL } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Simple redirect to PrestaShop checkout
    // User will need to add products manually in PrestaShop
    const checkoutUrl = 'https://diesel-injecteurs.com/commande';

    return NextResponse.json({
      success: true,
      checkoutUrl,
    });
  } catch (error) {
    console.error('PrestaShop checkout redirect error:', error);
    return NextResponse.json(
      { error: 'Failed to generate checkout URL' },
      { status: 500 }
    );
  }
}
