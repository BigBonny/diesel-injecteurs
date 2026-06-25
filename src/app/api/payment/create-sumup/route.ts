import { NextResponse } from 'next/server';
import { createSumUpCheckout } from '@/lib/sumup';
import { supabase } from '@/lib/supabase';
import { createPrestashopOrder } from '@/lib/prestashop';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, orderId, customerEmail, customerName, cartItems } = body;

    if (!amount || !orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    console.log('Creating SumUp payment:', {
      amount,
      orderId,
      customerEmail,
      baseUrl,
    });

    // Create order in PrestaShop BEFORE payment (same as Sogecommerce flow)
    const psOrderId = await createPrestashopOrder(orderId, amount, customerEmail, customerName || 'Client');

    const paymentResponse = await createSumUpCheckout({
      amount,
      currency: currency || 'EUR',
      orderId,
      customerEmail,
      customerName: customerName || 'Client',
      returnURL: `${baseUrl}/payment/success?orderId=${orderId}`,
      cancelURL: `${baseUrl}/payment/cancel?orderId=${orderId}`,
      notificationURL: `${baseUrl}/api/payment/sumup-webhook`,
      cartItems: cartItems || [],
    });

    // Store order in Supabase
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      amount,
      currency: currency || 'EUR',
      customer_email: customerEmail,
      customer_name: customerName || 'Client',
      status: 'pending',
      payment_method: 'sumup',
      prestashop_order_id: psOrderId ? parseInt(psOrderId) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (orderError) {
      console.error('Error storing SumUp order:', orderError);
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: paymentResponse.checkoutUrl,
      checkoutId: paymentResponse.checkoutId,
    });
  } catch (error) {
    console.error('SumUp payment creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create SumUp payment';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
