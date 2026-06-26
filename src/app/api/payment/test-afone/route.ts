import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { testType = 'standard' } = body;
    
    // Try different credential combinations
    const configs = [
      { name: 'Standard', siteId: 'VAD-393-138', hmacKey: 'lM7iC1bY0gWv9ZxdQ15H' },
      { name: 'Numeric ID', siteId: '393138', hmacKey: 'lM7iC1bY0gWv9ZxdQ15H' },
      { name: 'With Account ID', siteId: 'VAD-393-138', hmacKey: 'lM7iC1bY0gWv9ZxdQ15H', contrib: '10000152226' },
    ];
    
    const baseUrl = 'https://sogecommerce.societegenerale.eu/vads-payment/';
    const returnBase = 'https://diesel-turbo-injection.com';
    
    const now = new Date();
    const transDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const transId = '000001';
    
    const results = configs.map(config => {
      const paymentData: Record<string, string> = {
        vads_site_id: config.siteId,
        vads_ctx_mode: 'TEST',
        vads_trans_id: transId,
        vads_trans_date: transDate,
        vads_amount: '10000',
        vads_currency: '978',
        vads_action_mode: 'INTERACTIVE',
        vads_page_action: 'PAYMENT',
        vads_version: 'V2',
        vads_payment_config: 'SINGLE',
        vads_return_mode: 'GET',
        vads_language: 'fr',
        vads_url_return: `${returnBase}/payment/success`,
        vads_url_cancel: `${returnBase}/payment/cancel`,
        vads_url_check: `${returnBase}/api/payment/notification`,
        vads_url_refused: `${returnBase}/payment/cancel`,
        vads_url_error: `${returnBase}/payment/cancel`,
        vads_cust_email: 'test@test.com',
        vads_cust_first_name: 'Test',
        vads_cust_last_name: 'User',
        vads_order_id: 'TEST001',
        vads_nb_products: '1',
        vads_validation_mode: '',
        vads_capture_delay: '',
      };
      
      if (config.contrib) {
        paymentData.vads_contrib = config.contrib;
      }
      
      // Generate signature
      const vadsKeys = Object.keys(paymentData)
        .filter(key => key.startsWith('vads_'))
        .sort((a, b) => a.localeCompare(b));
      
      const signatureString = vadsKeys.map(key => paymentData[key]).join('+') + '+' + config.hmacKey;
      
      const hmac = crypto.createHmac('sha256', config.hmacKey);
      hmac.update(signatureString);
      const signature = hmac.digest('base64');
      paymentData.signature = signature;
      
      const queryParams = new URLSearchParams(paymentData).toString();
      const paymentUrl = `${baseUrl}?${queryParams}`;
      
      return {
        config: config.name,
        siteId: config.siteId,
        fullUrl: paymentUrl,
        testInstructions: 'Copy this URL to browser and test. If all give Erreur 02, Afone account is not activated.',
      };
    });
    
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST with {"testType": "standard"} to test different Afone configurations',
  });
}
