import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Manual test with exact CMI format
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const useTest = searchParams.get('test') === 'true';
    
    // Use provided credentials
    const siteId = process.env.SOGECOMMERCE_PROD_SITE_ID || '56994465';
    const hmacKey = process.env.SOGECOMMERCE_PROD_HMAC_KEY || '';
    
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
      vads_ctx_mode: 'PRODUCTION',
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

    // Add optional fields if provided
    if (useTest) {
      vadsFields.vads_order_id = orderId;
      vadsFields.vads_cust_email = 'test@example.com';
      vadsFields.vads_cust_first_name = 'Test';
      vadsFields.vads_cust_last_name = 'User';
      vadsFields.vads_url_return = 'https://diesel-injecteurs.vercel.app/payment/success';
      vadsFields.vads_url_cancel = 'https://diesel-injecteurs.vercel.app/payment/cancel';
    }
    
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
    const baseUrl = 'https://sogecommerce.societegenerale.eu/vads-payment/';
    
    // Build query string manually (no encoding needed for most fields)
    const queryParts: string[] = [];
    vadsKeys.forEach(key => {
      queryParts.push(`${key}=${encodeURIComponent(vadsFields[key])}`);
    });
    queryParts.push(`signature=${encodeURIComponent(signature)}`);
    
    const paymentUrl = baseUrl + '?' + queryParts.join('&');
    
    return NextResponse.json({
      timestamp: now.toISOString(),
      transDate,
      transId,
      vadsKeys,
      signatureString,
      signature,
      paymentUrl,
      testLink: paymentUrl,
      note: 'Try this link. If it fails, check HMAC key in Sogecommerce back office.',
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
