import { NextResponse } from 'next/server';
import { createAfonePayment } from '@/lib/afonepaiement';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, orderId, customerEmail, customerName, cartItems } = body;

    if (!amount || !currency || !orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Check credentials are configured
    const mode = process.env.AFONE_MODE || 'TEST';
    const siteId = mode === 'PRODUCTION' 
      ? process.env.AFONE_PROD_SITE_ID 
      : process.env.AFONE_TEST_SITE_ID;
    
    if (!siteId) {
      console.error('Afone Paiement credentials not configured');
      return NextResponse.json(
        { error: 'Payment provider not configured' },
        { status: 500 }
      );
    }

    console.log('Creating Afone payment:', { 
      amount, 
      orderId, 
      customerEmail,
      mode,
      baseUrl 
    });

    console.log('Creating payment with cart items:', cartItems);
    
    const paymentResponse = await createAfonePayment({
      amount,
      currency,
      orderId,
      customerEmail,
      customerName: customerName || 'Client',
      returnURL: `${baseUrl}/payment/success?orderId=${orderId}`,
      cancelURL: `${baseUrl}/payment/cancel?orderId=${orderId}`,
      notificationURL: `${baseUrl}/api/payment/notification`,
      cartItems: cartItems || [],
    });
    
    // Log the full payment URL for debugging
    console.log('Full payment URL:', paymentResponse.formToken);

    console.log('Payment URL generated successfully');

    // Store order in Supabase with full details
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      amount,
      currency,
      customer_email: customerEmail,
      customer_name: customerName || 'Client',
      status: 'pending',
      payment_method: 'afone',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (orderError) {
      console.error('Error storing order:', orderError);
    }

    return NextResponse.json({
      success: true,
      formToken: paymentResponse.formToken,
      publicKey: paymentResponse.publicKey,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create payment';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
