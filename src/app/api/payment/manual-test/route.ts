import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Manual test with exact CMI format
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceTest = searchParams.get('mode') === 'test';
    
    // Determine which credentials to use
    const mode = forceTest ? 'TEST' : 'PRODUCTION';
    const siteId = mode === 'TEST' 
      ? (process.env.SOGECOMMERCE_TEST_SITE_ID || '56994465')
      : (process.env.SOGECOMMERCE_PROD_SITE_ID || '56994465');
    const hmacKey = mode === 'TEST'
      ? (process.env.SOGECOMMERCE_TEST_HMAC_KEY || '')
      : (process.env.SOGECOMMERCE_PROD_HMAC_KEY || '');
    
    if (!hmacKey) {
      return NextResponse.json({ error: 'No HMAC key configured' }, { status: 500 });
    }

    // Generate fresh timestamp
    const now = new Date();
    const transDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const orderId = 'MANUAL-' + Date.now();
    const transId = orderId.replace(/\D/g, '').slice(-6).padStart(6, '0');
    
    // Build exactly as CMI expects - only include vads_ fields
    const vadsFields: Record<string, string> = {
      vads_site_id: siteId,
      vads_ctx_mode: mode === 'TEST' ? 'TEST' : 'PRODUCTION',
      vads_trans_id: transId,
      vads_trans_date: transDate,
      vads_amount: '1000',
      vads_currency: '978',
      vads_action_mode: 'INTERACTIVE',
      vads_page_action: 'PAYMENT',
      vads_version: 'V2',
      vads_payment_config: 'SINGLE',
      vads_capture_delay: '0',
      vads_validation_mode: '0',
    };

    // Add optional fields for testing
    vadsFields.vads_order_id = orderId;
    vadsFields.vads_cust_email = 'test@example.com';
    vadsFields.vads_cust_first_name = 'Test';
    vadsFields.vads_cust_last_name = 'User';
    vadsFields.vads_url_return = 'https://diesel-injecteurs.vercel.app/payment/success';
    vadsFields.vads_url_cancel = 'https://diesel-injecteurs.vercel.app/payment/cancel';
    
    // Get sorted keys
    const vadsKeys = Object.keys(vadsFields).sort((a, b) => a.localeCompare(b));
    
    // Build signature string exactly as CMI specifies
    const values = vadsKeys.map(key => vadsFields[key]);
    const signatureString = values.join('+') + '+' + hmacKey;
    
    // Generate HMAC-SHA256
    const hmac = crypto.createHmac('sha256', hmacKey);
    hmac.update(signatureString);
    const signature = hmac.digest('base64');
    
    // Build payment URL - IMPORTANT: Don't use URLSearchParams, build manually
    // to control exact encoding
    const baseUrl = mode === 'TEST'
      ? 'https://sogecommerce.societegenerale.eu/test/vads-payment/'
      : 'https://sogecommerce.societegenerale.eu/vads-payment/';
    
    // Build query string manually (no encoding needed for most fields)
    const queryParts: string[] = [];
    vadsKeys.forEach(key => {
      queryParts.push(`${key}=${encodeURIComponent(vadsFields[key])}`);
    });
    queryParts.push(`signature=${encodeURIComponent(signature)}`);
    
    const paymentUrl = baseUrl + '?' + queryParts.join('&');
    
    return NextResponse.json({
      mode,
      fieldCount: vadsKeys.length,
      hmacKeyPreview: hmacKey ? `${hmacKey.substring(0, 8)}...${hmacKey.substring(hmacKey.length - 8)}` : 'EMPTY',
      hmacKeyLength: hmacKey.length,
      timestamp: now.toISOString(),
      transDate,
      transId,
      vadsKeys,
      signatureString,
      signature,
      paymentUrl,
      testLink: paymentUrl,
      note: mode === 'TEST' 
        ? 'TEST mode - this should work even if production is not activated'
        : 'PRODUCTION mode - requires activated account',
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
