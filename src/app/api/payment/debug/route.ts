import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Debug endpoint to verify Sogecommerce configuration
export async function GET() {
  try {
    const mode = process.env.SOGECOMMERCE_MODE || 'TEST';
    const isProd = mode === 'PRODUCTION';
    
    const siteId = isProd 
      ? process.env.SOGECOMMERCE_PROD_SITE_ID 
      : process.env.SOGECOMMERCE_TEST_SITE_ID;
    const hmacKey = isProd 
      ? process.env.SOGECOMMERCE_PROD_HMAC_KEY 
      : process.env.SOGECOMMERCE_TEST_HMAC_KEY;
    
    // Test signature generation
    const testOrderId = 'ORD-1234567890';
    const testData: Record<string, string> = {
      vads_site_id: siteId || 'UNKNOWN',
      vads_ctx_mode: isProd ? 'PRODUCTION' : 'TEST',
      vads_trans_id: '123456',
      vads_trans_date: '20250101120000',
      vads_amount: '10000',
      vads_currency: '978',
      vads_action_mode: 'INTERACTIVE',
      vads_page_action: 'PAYMENT',
      vads_version: 'V2',
      vads_payment_config: 'SINGLE',
      vads_capture_delay: '0',
      vads_validation_mode: '0',
      vads_order_id: testOrderId,
    };
    
    // Generate signature
    const vadsKeys = Object.keys(testData)
      .filter(key => key.startsWith('vads_'))
      .sort((a, b) => a.localeCompare(b));
    
    const signatureString = vadsKeys.map(key => testData[key]).join('+') + '+' + (hmacKey || 'NO_KEY');
    
    let signature = 'NO_KEY_PROVIDED';
    if (hmacKey) {
      const hmac = crypto.createHmac('sha256', hmacKey);
      hmac.update(signatureString);
      signature = hmac.digest('base64');
      signature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    
    return NextResponse.json({
      mode,
      isProd,
      hasSiteId: !!siteId,
      hasHmacKey: !!hmacKey,
      siteId: siteId ? `${siteId.substring(0, 4)}...${siteId.substring(siteId.length - 4)}` : null,
      hmacKeyLength: hmacKey?.length || 0,
      testSignature: signature,
      signatureStringPreview: signatureString.substring(0, 100) + '...',
      vadsKeys,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
