import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Test endpoint to verify signature generation against CMI's expected format
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'PRODUCTION';
    
    const isProd = mode === 'PRODUCTION';
    const siteId = isProd 
      ? process.env.SOGECOMMERCE_PROD_SITE_ID 
      : process.env.SOGECOMMERCE_TEST_SITE_ID;
    const hmacKey = isProd 
      ? process.env.SOGECOMMERCE_PROD_HMAC_KEY 
      : process.env.SOGECOMMERCE_TEST_HMAC_KEY;
    
    if (!siteId || !hmacKey) {
      return NextResponse.json({
        error: 'Missing credentials',
        mode,
        hasSiteId: !!siteId,
        hasHmacKey: !!hmacKey,
      }, { status: 500 });
    }

    // Create test data matching exactly what we'd send to CMI
    const now = new Date();
    const transDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const orderId = 'TEST-' + Date.now();
    const transId = orderId.replace(/\D/g, '').slice(-6).padStart(6, '0');
    
    const paymentData: Record<string, string> = {
      vads_site_id: siteId,
      vads_ctx_mode: isProd ? 'PRODUCTION' : 'TEST',
      vads_trans_id: transId,
      vads_trans_date: transDate,
      vads_amount: '1000', // 10.00 EUR in cents
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
    };
    
    // Get sorted keys
    const vadsKeys = Object.keys(paymentData)
      .filter(key => key.startsWith('vads_'))
      .sort((a, b) => a.localeCompare(b));
    
    // Build signature string
    const signatureString = vadsKeys.map(key => paymentData[key]).join('+') + '+' + hmacKey;
    
    // Generate signature with standard Base64 (what CMI expects)
    const hmac = crypto.createHmac('sha256', hmacKey);
    hmac.update(signatureString);
    const signature = hmac.digest('base64');
    
    // Build full payment URL
    const baseUrl = isProd 
      ? 'https://sogecommerce.societegenerale.eu/vads-payment/'
      : 'https://sogecommerce.societegenerale.eu/test/vads-payment/';
    
    const paymentDataWithSig = { ...paymentData, signature };
    const paymentUrl = baseUrl + '?' + new URLSearchParams(paymentDataWithSig).toString();
    
    return NextResponse.json({
      mode,
      siteId,
      hmacKeyPreview: hmacKey.substring(0, 8) + '...' + hmacKey.substring(hmacKey.length - 8),
      transaction: {
        orderId,
        transId,
        transDate,
        amount: '10.00 EUR',
      },
      signatureDetails: {
        vadsKeys,
        signatureStringPreview: signatureString.substring(0, 120) + '...',
        signatureStringLength: signatureString.length,
        signature,
      },
      paymentUrlPreview: paymentUrl.substring(0, 300) + '...',
      testLink: paymentUrl,
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
