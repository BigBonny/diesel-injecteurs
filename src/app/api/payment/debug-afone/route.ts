import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, orderId, customerEmail, customerName, cartItems } = body;

    const siteId = process.env.AFONE_PROD_SITE_ID || 'VAD-393-138';
    const hmacKey = process.env.AFONE_PROD_HMAC_KEY || 'lM7iC1bY0gWv9ZxdQ15H';
    const baseUrl = 'https://sogecommerce.societegenerale.eu/vads-payment/';
    const returnBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://diesel-turbo-injection.com';

    const now = new Date();
    const transDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    
    // Generate 6-digit transaction ID
    const numeric = orderId.replace(/\D/g, '');
    const transId = numeric.length >= 6 ? numeric.slice(-6) : numeric.padStart(6, '0').slice(-6);

    const paymentData: Record<string, string> = {
      // Core required fields
      vads_site_id: siteId,
      vads_ctx_mode: 'PRODUCTION',
      vads_trans_id: transId,
      vads_trans_date: transDate,
      vads_amount: Math.round(amount * 100).toString(),
      vads_currency: '978',
      vads_action_mode: 'INTERACTIVE',
      vads_page_action: 'PAYMENT',
      vads_version: 'V2',
      vads_payment_config: 'SINGLE',
      vads_return_mode: 'GET',
      vads_language: 'fr',
      // URLs
      vads_url_return: `${returnBase}/payment/success?orderId=${orderId}`,
      vads_url_cancel: `${returnBase}/payment/cancel?orderId=${orderId}`,
      vads_url_check: `${returnBase}/api/payment/notification`,
      vads_url_refused: `${returnBase}/payment/cancel?orderId=${orderId}`,
      vads_url_error: `${returnBase}/payment/cancel?orderId=${orderId}`,
      // Customer info
      vads_cust_email: customerEmail.slice(0, 127),
      vads_cust_first_name: (customerName.split(' ')[0] || '').slice(0, 127),
      vads_cust_last_name: customerName.split(' ').slice(1).join(' ').slice(0, 127),
      // Order info
      vads_order_id: orderId.slice(0, 32),
      vads_nb_products: '1',
      // Optional
      vads_validation_mode: '0',
      vads_capture_delay: '0',
    };

    // Add cart items
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach((item: any, index: number) => {
        paymentData[`vads_product_ref${index}`] = String(item.id).slice(0, 63);
        paymentData[`vads_product_label${index}`] = String(item.name).slice(0, 255);
        paymentData[`vads_product_qty${index}`] = String(item.quantity);
        paymentData[`vads_product_amount${index}`] = String(Math.round(item.price * 100));
        paymentData[`vads_product_type${index}`] = 'FOOD_AND_GROCERY';
      });
      paymentData.vads_nb_products = String(cartItems.length);
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

    const queryParams = new URLSearchParams(paymentData).toString();
    const paymentUrl = `${baseUrl}?${queryParams}`;

    return NextResponse.json({
      debug: {
        siteId,
        transId,
        transDate,
        amount: paymentData.vads_amount,
        signatureString: signatureString.substring(0, 200),
        signature: signature.substring(0, 50),
        vadsKeys,
        paymentUrl: paymentUrl.substring(0, 500),
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: (error as Error).message 
    }, { status: 500 });
  }
}

// Also allow GET for easy testing
export async function GET() {
  return NextResponse.json({
    message: 'Send POST request with: amount, currency, orderId, customerEmail, customerName, cartItems',
    env: {
      siteIdConfigured: !!process.env.AFONE_PROD_SITE_ID,
      hmacConfigured: !!process.env.AFONE_PROD_HMAC_KEY,
    }
  });
}
