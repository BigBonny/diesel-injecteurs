import { NextResponse } from 'next/server';
import { createSogecommercePayment } from '@/lib/sogecommerce';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, orderId, customerEmail, customerName } = body;

    if (!amount || !currency || !orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const mode = process.env.NEXT_PUBLIC_SOGECOMMERCE_MODE || 'test';
    const publicKey = mode === 'test' 
      ? process.env.SOGECOMMERCE_TEST_PUBLIC_KEY || ''
      : process.env.SOGECOMMERCE_PROD_PUBLIC_KEY || '';
    const hmacKey = mode === 'test' 
      ? process.env.SOGECOMMERCE_TEST_HMAC_KEY || ''
      : process.env.SOGECOMMERCE_PROD_HMAC_KEY || '';

    console.log('Environment check:', { 
      mode, 
      hasPublicKey: !!publicKey, 
      hasHmacKey: !!hmacKey,
      baseUrl 
    });

    console.log('Creating Sogecommerce payment with:', { amount, currency, orderId, customerEmail, customerName });

    const paymentResponse = await createSogecommercePayment({
      amount,
      currency,
      orderId,
      customerEmail,
      customerName,
      returnURL: `${baseUrl}/payment/success?orderId=${orderId}`,
      cancelURL: `${baseUrl}/payment/cancel?orderId=${orderId}`,
      notificationURL: `${baseUrl}/api/payment/notification`,
    });

    console.log('Sogecommerce payment response:', paymentResponse);

    if (!paymentResponse.formToken) {
      throw new Error('No formToken returned from Sogecommerce');
    }

    // Store order in Supabase
    const { error } = await supabase.from('orders').insert({
      id: orderId,
      amount,
      currency,
      customer_email: customerEmail,
      customer_name: customerName,
      status: 'pending',
      payment_method: 'sogecommerce',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error storing order:', error);
    }

    return NextResponse.json({
      success: true,
      formToken: paymentResponse.formToken,
      publicKey: paymentResponse.publicKey,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
