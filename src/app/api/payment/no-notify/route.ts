import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Test WITHOUT notification URL to see if that's the issue
export async function GET() {
  try {
    const mode = 'PRODUCTION';
    const siteId = process.env.SOGECOMMERCE_PROD_SITE_ID || '56994465';
    const hmacKey = process.env.SOGECOMMERCE_PROD_HMAC_KEY || '';
    
    if (!hmacKey) {
      return NextResponse.json({ error: 'No HMAC key' }, { status: 500 });
    }
    
    const now = new Date();
    const transDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const orderId = 'NO-NOTIFY-' + Date.now();
    const transId = orderId.replace(/\D/g, '').slice(-6).padStart(6, '0');
    
    // Build fields WITHOUT vads_url_check (notification URL)
    const paymentData: Record<string, string> = {
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
      vads_order_id: orderId,
      vads_cust_email: 'test@example.com',
      vads_cust_first_name: 'Test',
      vads_cust_last_name: 'User',
      vads_url_return: 'https://diesel-injecteurs.vercel.app/payment/success',
      vads_url_cancel: 'https://diesel-injecteurs.vercel.app/payment/cancel',
      // NOTICE: No vads_url_check, vads_url_refused, vads_url_error
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
    
    paymentData.signature = signature;
    
    const baseUrl = 'https://sogecommerce.societegenerale.eu/vads-payment/';
    const queryParams = new URLSearchParams(paymentData).toString();
    const paymentUrl = `${baseUrl}?${queryParams}`;
    
    return NextResponse.json({
      mode: 'PRODUCTION (without notification URL)',
      fieldCount: vadsKeys.length,
      vadsKeys,
      signatureString,
      signature,
      paymentUrl,
      testLink: paymentUrl,
      note: 'This test excludes vads_url_check to see if that was causing the issue',
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
