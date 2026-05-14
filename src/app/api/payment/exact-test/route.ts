import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSogecommercePayment } from '@/lib/sogecommerce';

// Test that EXACTLY matches the cart flow
export async function GET() {
  try {
    // Simulate exactly what the cart sends
    const orderId = 'TEST-' + Date.now();
    const amount = 10.00; // 10 EUR like in cart
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://diesel-injecteurs.vercel.app';
    
    // This calls the EXACT same function as the cart
    const paymentResponse = await createSogecommercePayment({
      amount,
      currency: 'EUR',
      orderId,
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      returnURL: `${baseUrl}/payment/success?orderId=${orderId}`,
      cancelURL: `${baseUrl}/payment/cancel?orderId=${orderId}`,
      notificationURL: `${baseUrl}/api/payment/notification`,
    });
    
    return NextResponse.json({
      success: true,
      orderId,
      amount,
      formToken: paymentResponse.formToken,
      publicKey: paymentResponse.publicKey,
      testLink: paymentResponse.formToken,
      note: 'This URL was generated using the EXACT same code as the cart',
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: (error as Error).message,
      stack: (error as Error).stack,
    }, { status: 500 });
  }
}

// Also test with raw signature calculation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode = 'PRODUCTION', amount = 1000 } = body;
    
    const isProd = mode === 'PRODUCTION';
    const siteId = isProd 
      ? process.env.SOGECOMMERCE_PROD_SITE_ID 
      : process.env.SOGECOMMERCE_TEST_SITE_ID;
    const hmacKey = isProd
      ? process.env.SOGECOMMERCE_PROD_HMAC_KEY 
      : process.env.SOGECOMMERCE_TEST_HMAC_KEY;
    
    if (!hmacKey) {
      return NextResponse.json({ error: 'No HMAC key' }, { status: 500 });
    }
    
    const now = new Date();
    const transDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const orderId = 'POST-' + Date.now();
    const transId = orderId.replace(/\D/g, '').slice(-6).padStart(6, '0');
    
    // Build ALL fields exactly like the main code
    const paymentData: Record<string, string> = {
      vads_site_id: siteId || '',
      vads_ctx_mode: isProd ? 'PRODUCTION' : 'TEST',
      vads_trans_id: transId,
      vads_trans_date: transDate,
      vads_amount: amount.toString(),
      vads_currency: '978',
      vads_action_mode: 'INTERACTIVE',
      vads_page_action: 'PAYMENT',
      vads_version: 'V2',
      vads_payment_config: 'SINGLE',
      vads_capture_delay: '0',
      vads_validation_mode: '0',
      vads_order_id: orderId,
      vads_cust_email: 'test@example.com',
      vads_cust_first_name: 'Test',
      vads_cust_last_name: 'User',
      vads_url_return: `https://diesel-injecteurs.vercel.app/payment/success?orderId=${orderId}`,
      vads_url_cancel: `https://diesel-injecteurs.vercel.app/payment/cancel?orderId=${orderId}`,
      vads_url_check: 'https://diesel-injecteurs.vercel.app/api/payment/notification',
      vads_url_refused: `https://diesel-injecteurs.vercel.app/payment/cancel?orderId=${orderId}`,
      vads_url_error: `https://diesel-injecteurs.vercel.app/payment/cancel?orderId=${orderId}`,
    };
    
    // Remove empty values
    Object.keys(paymentData).forEach(key => {
      if (paymentData[key] === undefined || paymentData[key] === null) {
        delete paymentData[key];
      }
    });
    
    // Ensure last name exists
    if (!paymentData.vads_cust_last_name) {
      paymentData.vads_cust_last_name = '';
    }
    
    // Generate signature
    const vadsKeys = Object.keys(paymentData)
      .filter(key => key.startsWith('vads_'))
      .sort((a, b) => a.localeCompare(b));
    
    const signatureString = vadsKeys.map(key => paymentData[key]).join('+') + '+' + hmacKey;
    
    const hmac = crypto.createHmac('sha256', hmacKey);
    hmac.update(signatureString);
    const signature = hmac.digest('base64');
    
    // Build URL with raw signature (let URLSearchParams handle encoding)
    paymentData.signature = signature;
    
    const baseUrl = isProd 
      ? 'https://sogecommerce.societegenerale.eu/vads-payment/'
      : 'https://sogecommerce.societegenerale.eu/test/vads-payment/';
    
    const queryParams = new URLSearchParams(paymentData).toString();
    const paymentUrl = `${baseUrl}?${queryParams}`;
    
    return NextResponse.json({
      mode,
      fieldCount: vadsKeys.length,
      vadsKeys,
      signatureStringPreview: signatureString.substring(0, 100) + '...',
      signature,
      signatureInUrl: paymentUrl.match(/signature=([^&]+)/)?.[1],
      paymentUrl,
      testLink: paymentUrl,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'POST test failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
