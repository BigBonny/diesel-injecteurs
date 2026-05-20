import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || 'http://192.162.69.186/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

async function createPrestashopOrder(orderId: string, amount: number, customerEmail: string, customerName: string): Promise<string | null> {
  try {
    const firstName = (customerName.split(' ')[0] || 'Client').slice(0, 32);
    const lastName = (customerName.split(' ').slice(1).join(' ') || customerName).slice(0, 32) || 'Client';

    // Check if customer already exists
    let psCustomerId: string | null = null;
    let psAddressId = '1977';

    try {
      const searchResp = await fetch(
        `${PRESTASHOP_API_URL}/customers?ws_key=${PRESTASHOP_API_KEY}&display=[id,email]&filter[email]=[${encodeURIComponent(customerEmail)}]`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (searchResp.ok) {
        const xml = await searchResp.text();
        const existingId = xml.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/)?.[1];
        if (existingId) psCustomerId = existingId;
      }
    } catch { /* ignore */ }

    // Create customer if not found
    if (!psCustomerId) {
      const custResp = await fetch(
        `${PRESTASHOP_API_URL}/customers?ws_key=${PRESTASHOP_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/xml' }, signal: AbortSignal.timeout(8000),
          body: `<prestashop><customer><firstname>${firstName}</firstname><lastname>${lastName}</lastname><email>${customerEmail}</email><passwd>${crypto.createHash('md5').update(orderId).digest('hex')}</passwd><active>1</active><is_guest>1</is_guest><id_default_group>3</id_default_group></customer></prestashop>` }
      );
      if (custResp.ok) {
        const xml = await custResp.text();
        psCustomerId = xml.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/)?.[1] || null;
      }
      if (!psCustomerId) {
        console.error('Failed to create PS customer, cannot create PS order');
        return null;
      }
    }

    // Create address
    const addrResp = await fetch(
      `${PRESTASHOP_API_URL}/addresses?ws_key=${PRESTASHOP_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/xml' }, signal: AbortSignal.timeout(8000),
        body: `<prestashop><address><id_customer>${psCustomerId}</id_customer><id_country>8</id_country><alias>commande</alias><lastname>${lastName}</lastname><firstname>${firstName}</firstname><address1>Non renseignée</address1><city>Non renseignée</city><postcode>00000</postcode></address></prestashop>` }
    );
    if (addrResp.ok) {
      const xml = await addrResp.text();
      psAddressId = xml.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/)?.[1] || '1977';
    }

    // Create cart
    const cartResp = await fetch(
      `${PRESTASHOP_API_URL}/carts?ws_key=${PRESTASHOP_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/xml' }, signal: AbortSignal.timeout(8000),
        body: `<prestashop><cart><id_currency>1</id_currency><id_lang>1</id_lang><id_customer>${psCustomerId}</id_customer></cart></prestashop>` }
    );
    if (!cartResp.ok) return null;
    const cartXml = await cartResp.text();
    const cartId = cartXml.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/)?.[1];
    if (!cartId) return null;

    // Create order with status 14 = En attente de paiement
    const productTotal = amount;
    const orderResp = await fetch(
      `${PRESTASHOP_API_URL}/orders?ws_key=${PRESTASHOP_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/xml' }, signal: AbortSignal.timeout(8000),
        body: `<prestashop><order><id_address_delivery>${psAddressId}</id_address_delivery><id_address_invoice>${psAddressId}</id_address_invoice><id_carrier>11</id_carrier><id_cart>${cartId}</id_cart><id_currency>1</id_currency><id_customer>${psCustomerId}</id_customer><id_lang>1</id_lang><current_state>14</current_state><payment>Sogecommerce</payment><total_paid>${amount.toFixed(2)}</total_paid><total_paid_real>0.00</total_paid_real><module>sogecommerce</module><total_products>${productTotal.toFixed(2)}</total_products><total_products_wt>${productTotal.toFixed(2)}</total_products_wt><total_shipping>0.00</total_shipping><total_shipping_tax_incl>0.00</total_shipping_tax_incl><total_discounts>0.00</total_discounts><total_discounts_tax_incl>0.00</total_discounts_tax_incl><conversion_rate>1.000000</conversion_rate><secure_key>${crypto.createHash('md5').update(orderId).digest('hex')}</secure_key><reference>${orderId.slice(0, 32)}</reference><total_paid_tax_incl>${amount.toFixed(2)}</total_paid_tax_incl><total_paid_tax_excl>${amount.toFixed(2)}</total_paid_tax_excl></order></prestashop>` }
    );
    if (!orderResp.ok) {
      console.error('PS order creation failed:', await orderResp.text());
      return null;
    }
    const orderXml = await orderResp.text();
    const psOrderId = orderXml.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/)?.[1] || null;
    console.log('PS order created with ID:', psOrderId);
    return psOrderId;
  } catch (e) {
    console.error('PS order creation error:', e);
    return null;
  }
}

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
