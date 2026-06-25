import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { createPrestashopOrder } from '@/lib/prestashop';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, orderId, customerEmail, customerName, cartItems } = body;

    // Use Sogecommerce credentials
    const isProd = process.env.SOGECOMMERCE_MODE === 'PRODUCTION';
    const siteId = isProd 
      ? (process.env.SOGECOMMERCE_PROD_SITE_ID || '56994465')
      : (process.env.SOGECOMMERCE_TEST_SITE_ID || '56994465');
    const hmacKey = isProd
      ? (process.env.SOGECOMMERCE_PROD_HMAC_KEY || 'c7yvgXLJnsAABgrb')
      : (process.env.SOGECOMMERCE_TEST_HMAC_KEY || 'Fm2MhXURHIFtmSx7dUgUEK21en6opBYUGE3qSO0w2jXif');
    const returnBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://diesel-injecteurs.vercel.app';

    // Create order in PrestaShop BEFORE payment (status: En attente de paiement)
    const psOrderId = await createPrestashopOrder(orderId, amount, customerEmail, customerName);

    // Save order to Supabase BEFORE payment
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_email: customerEmail,
        customer_name: customerName,
        amount: amount,
        currency: currency || 'EUR',
        status: 'pending',
        prestashop_order_id: psOrderId ? parseInt(psOrderId) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    
    if (orderError) {
      console.error('Error creating order in Supabase:', orderError);
    } else {
      console.log('Order created in Supabase:', orderId, 'PS order:', psOrderId);
    }

    const now = new Date();
    const transDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const numeric = orderId.replace(/\D/g, '');
    const transId = numeric.length >= 6 ? numeric.slice(-6) : numeric.padStart(6, '0').slice(-6);

    const paymentData: Record<string, string> = {
      vads_site_id: siteId,
      vads_ctx_mode: isProd ? 'PRODUCTION' : 'TEST',
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
      vads_url_return: `${returnBase}/payment/success?orderId=${orderId}`,
      vads_url_cancel: `${returnBase}/payment/cancel?orderId=${orderId}`,
      vads_url_check: `${returnBase}/api/payment/notification`,
      vads_url_refused: `${returnBase}/payment/cancel?orderId=${orderId}`,
      vads_url_error: `${returnBase}/payment/cancel?orderId=${orderId}`,
      vads_cust_email: customerEmail.slice(0, 127),
      vads_cust_first_name: (customerName.split(' ')[0] || '').slice(0, 127),
      vads_cust_last_name: customerName.split(' ').slice(1).join(' ').slice(0, 127),
      vads_order_id: orderId.slice(0, 32),
      vads_nb_products: '1',
    };

    interface CartItem { id: string; name: string; price: number; quantity: number }
    if (cartItems && cartItems.length > 0) {
      cartItems.forEach((item: CartItem, index: number) => {
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
    paymentData.signature = hmac.digest('base64');

    // Return HTML form that auto-submits
    const formFields = Object.entries(paymentData)
      .map(([key, value]) => `<input type="hidden" name="${key}" value="${value.replace(/"/g, '&quot;')}" />`)
      .join('\n');

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Redirection vers le paiement...</title>
</head>
<body onload="document.forms[0].submit()">
  <form method="POST" action="https://sogecommerce.societegenerale.eu/vads-payment/">
    ${formFields}
  </form>
  <p>Redirection vers la page de paiement sécurisée...</p>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
