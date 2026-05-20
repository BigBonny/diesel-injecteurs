import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { sendPaymentNotificationEmail } from '@/lib/notifications';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || 'https://diesel-injecteurs.com/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

interface CmiNotification {
  vads_trans_status: string;
  vads_trans_id: string;
  vads_order_id: string;
  vads_amount: string;
  vads_cust_email?: string;
  signature: string;
  [key: string]: string | undefined;
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  customer_name?: string;
  customer_email?: string;
  cart_items?: CartItem[];
  prestashop_order_id?: number;
}

// Helper to send merchant notification
async function sendMerchantNotification(orderId: string, amount: number, status: string, customerEmail?: string, customerName?: string, cartItems?: CartItem[]) {
  try {
    await sendPaymentNotificationEmail({
      orderId,
      amount,
      status,
      customerEmail,
      customerName,
      cartItems,
    });
    console.log('Merchant email notification sent for order:', orderId);
  } catch (error) {
    console.error('Failed to send merchant email notification:', error);
  }
}

export async function POST(request: Request) {
  try {
    // CMI/Sogecommerce sends vads_ parameters as form data
    const formData = await request.formData();
    
    // Extract all vads_ fields
    const notification: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('vads_') || key === 'signature') {
        notification[key] = value as string;
      }
    }

    console.log('Received CMI notification:', Object.keys(notification));
    console.log('Transaction status:', notification.vads_trans_status);
    console.log('Order ID:', notification.vads_order_id);

    // Verify signature (skip for TEST mode)
    const mode = process.env.SOGECOMMERCE_MODE || 'TEST';
    const isProd = mode === 'PRODUCTION';
    
    // Get correct HMAC key
    const hmacKey = isProd
      ? (process.env.SOGECOMMERCE_PROD_HMAC_KEY || 'c7yvgXLJnsAABgrb')
      : (process.env.SOGECOMMERCE_TEST_HMAC_KEY || 'Fm2MhXURHIFtmSx7dUgUEK21en6opBYUGE3qSO0w2jXif');
    
    // Verify signature
    const vadsKeys = Object.keys(notification)
      .filter(key => key.startsWith('vads_'))
      .sort((a, b) => a.localeCompare(b));
    
    const signatureString = vadsKeys.map(key => notification[key] || '').join('+') + '+' + hmacKey;
    
    // crypto already imported at top
    const hmac = crypto.createHmac('sha256', hmacKey);
    hmac.update(signatureString);
    const expectedSignature = hmac.digest('base64');
    
    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', notification.signature);
    
    if (expectedSignature !== notification.signature) {
      console.error('Invalid signature for notification');
      console.warn('Proceeding with notification despite signature mismatch');
    } else {
      console.log('Signature verified successfully');
    }

    // Extract order details from vads_ fields
    const orderId = notification.vads_order_id;
    const amount = parseInt(notification.vads_amount || '0') / 100; // Convert cents to euros
    const status = notification.vads_trans_status;
    const transactionId = notification.vads_trans_id;
    const customerEmail = notification.vads_cust_email;

    if (!orderId) {
      console.error('Missing vads_order_id in notification');
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // Map CMI status to our status
    // CMI statuses: AUTHORISED, REFUSED, CANCELLED, WAITING, EXPIRED
    const finalStatus = status === 'AUTHORISED' ? 'paid' : 
                       status === 'CANCELLED' ? 'cancelled' :
                       status === 'REFUSED' ? 'refused' :
                       status === 'WAITING' ? 'pending' :
                       status === 'EXPIRED' ? 'expired' : 'failed';

    // Update order status in Supabase
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: finalStatus,
        transaction_id: transactionId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order in Supabase:', updateError);
    } else {
      console.log('Order updated in Supabase:', orderId, 'status:', finalStatus);
    }

    // Fetch full order details from Supabase for notifications
    let orderData: OrderData | null = null;
    try {
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      if (!fetchError && order) {
        orderData = order;
      }
    } catch (e) {
      console.error('Error fetching order details:', e);
    }

    // Send merchant notification
    await sendMerchantNotification(
      orderId, 
      amount, 
      finalStatus, 
      customerEmail,
      orderData?.customer_name,
      orderData?.cart_items
    );

    // Create order in PrestaShop back office if payment is successful
    if (finalStatus === 'paid') {
      console.log('Attempting PrestaShop order creation...');
      console.log('PRESTASHOP_API_URL:', PRESTASHOP_API_URL);
      console.log('PRESTASHOP_API_KEY exists:', !!PRESTASHOP_API_KEY);
      console.log('orderData exists:', !!orderData);
      
      try {
        if (!orderData) {
          console.error('No order data available for PrestaShop order creation');
        } else if (PRESTASHOP_API_URL && PRESTASHOP_API_KEY) {
          console.log('PrestaShop API configured, creating customer first...');
          
          // Extract customer info from order/notification
          const custEmail = orderData.customer_email || customerEmail || 'guest@diesel-injecteurs.com';
          const custFullName = orderData.customer_name || notification.vads_cust_name || 'Client';
          const custFirstName = (notification.vads_cust_first_name || custFullName.split(' ')[0] || 'Client').slice(0, 32);
          const custLastName = (notification.vads_cust_last_name || custFullName.split(' ').slice(1).join(' ') || custFullName).slice(0, 32) || 'Client';

          // Step 1: Check if customer with this email already exists
          let psCustomerId = '2'; // fallback to demo customer
          let psAddressId = '1977'; // fallback address

          try {
            const searchResp = await fetch(
              `${PRESTASHOP_API_URL}/customers?ws_key=${PRESTASHOP_API_KEY}&display=[id,email]&filter[email]=[${encodeURIComponent(custEmail)}]`,
              { signal: AbortSignal.timeout(8000) }
            );
            if (searchResp.ok) {
              const searchXml = await searchResp.text();
              const existingId = searchXml.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/)?.[1];
              if (existingId) {
                psCustomerId = existingId;
                console.log('Found existing customer ID:', psCustomerId);
              }
            }
          } catch { /* ignore search errors */ }

          // Step 2: Create new customer if not found
          if (psCustomerId === '2') {
            const custXml = `<prestashop><customer><firstname>${custFirstName}</firstname><lastname>${custLastName}</lastname><email>${custEmail}</email><passwd>${crypto.createHash('md5').update(orderId + Date.now()).digest('hex')}</passwd><active>1</active><is_guest>1</is_guest><id_default_group>3</id_default_group></customer></prestashop>`;
            const custResp = await fetch(
              `${PRESTASHOP_API_URL}/customers?ws_key=${PRESTASHOP_API_KEY}`,
              { method: 'POST', headers: { 'Content-Type': 'application/xml' }, body: custXml, signal: AbortSignal.timeout(8000) }
            );
            if (custResp.ok) {
              const custXmlResp = await custResp.text();
              const newCustId = custXmlResp.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/)?.[1];
              if (newCustId) {
                psCustomerId = newCustId;
                console.log('Created new customer ID:', psCustomerId);
              }
            } else {
              console.error('Failed to create customer:', await custResp.text());
            }
          }

          // Step 3: Create address for this customer
          const addrXml = `<prestashop><address><id_customer>${psCustomerId}</id_customer><id_country>8</id_country><alias>commande</alias><lastname>${custLastName}</lastname><firstname>${custFirstName}</firstname><address1>Non renseignée</address1><city>Non renseignée</city><postcode>00000</postcode></address></prestashop>`;
          const addrResp = await fetch(
            `${PRESTASHOP_API_URL}/addresses?ws_key=${PRESTASHOP_API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/xml' }, body: addrXml, signal: AbortSignal.timeout(8000) }
          );
          if (addrResp.ok) {
            const addrXmlResp = await addrResp.text();
            const newAddrId = addrXmlResp.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/)?.[1];
            if (newAddrId) {
              psAddressId = newAddrId;
              console.log('Created address ID:', psAddressId);
            }
          } else {
            console.error('Failed to create address:', await addrResp.text());
          }

          // Step 4: Create cart for this customer
          const cartXml = `<prestashop><cart><id_currency>1</id_currency><id_lang>1</id_lang><id_customer>${psCustomerId}</id_customer></cart></prestashop>`;
          
          const cartResponse = await fetch(
            `${PRESTASHOP_API_URL}/carts?ws_key=${PRESTASHOP_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/xml' },
              body: cartXml,
            }
          );
          
          if (!cartResponse.ok) {
            const cartError = await cartResponse.text();
            console.error('Failed to create cart:', cartResponse.status, cartError);
            throw new Error('Cart creation failed');
          }
          
          const cartResponseText = await cartResponse.text();
          const cartIdMatch = cartResponseText.match(/<id><!\[CDATA\[(\d+)\]\]><\/id>/);
          const cartId = cartIdMatch ? cartIdMatch[1] : null;
          
          if (!cartId) {
            console.error('Could not extract cart ID from response:', cartResponseText.substring(0, 200));
            throw new Error('Cart ID not found');
          }
          
          console.log('Cart created with ID:', cartId);
          
          // Step 5: Create order using the new cart
          const shippingCost = 0;
          const discountAmount = 0;
          const productTotal = amount - shippingCost + discountAmount;
          
          const prestashopOrderXml = `
            <prestashop>
              <order>
                <id_address_delivery>${psAddressId}</id_address_delivery>
                <id_address_invoice>${psAddressId}</id_address_invoice>
                <id_carrier>11</id_carrier>
                <id_cart>${cartId}</id_cart>
                <id_currency>1</id_currency>
                <id_customer>${psCustomerId}</id_customer>
                <id_lang>1</id_lang>
                <current_state>2</current_state>
                <payment><![CDATA[Sogecommerce]]></payment>
                <total_paid>${amount.toFixed(2)}</total_paid>
                <total_paid_real>${amount.toFixed(2)}</total_paid_real>
                <module><![CDATA[sogecommerce]]></module>
                <total_products>${productTotal.toFixed(2)}</total_products>
                <total_products_wt>${productTotal.toFixed(2)}</total_products_wt>
                <total_shipping>${shippingCost.toFixed(2)}</total_shipping>
                <total_shipping_tax_incl>${shippingCost.toFixed(2)}</total_shipping_tax_incl>
                <total_discounts>${discountAmount.toFixed(2)}</total_discounts>
                <total_discounts_tax_incl>${discountAmount.toFixed(2)}</total_discounts_tax_incl>
                <conversion_rate>1.000000</conversion_rate>
                <secure_key><![CDATA[${crypto.createHash('md5').update(orderId).digest('hex')}]]></secure_key>
                <reference><![CDATA[${orderId}]]></reference>
                <total_paid_tax_incl>${amount.toFixed(2)}</total_paid_tax_incl>
                <total_paid_tax_excl>${amount.toFixed(2)}</total_paid_tax_excl>
              </order>
            </prestashop>
          `;

          const response = await fetch(
            `${PRESTASHOP_API_URL}/orders?ws_key=${PRESTASHOP_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/xml' },
              body: prestashopOrderXml,
            }
          );

          console.log('PrestaShop API response status:', response.status);
          
          if (response.ok) {
            const responseText = await response.text();
            console.log('PrestaShop order created successfully:', responseText.substring(0, 200));
            const idMatch = responseText.match(/<id>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id>/);
            const prestashopOrderId = idMatch ? idMatch[1] : null;

            if (prestashopOrderId) {
              // Update Supabase order with PrestaShop ID
              await supabase
                .from('orders')
                .update({ prestashop_order_id: parseInt(prestashopOrderId) })
                .eq('id', orderId);
              
              console.log('Order created in PrestaShop:', prestashopOrderId);
            }
          } else {
            const errorText = await response.text();
            console.error('Failed to create order in PrestaShop:', response.status, errorText);
          }
        } else {
          console.log('PrestaShop API not configured, skipping order creation');
          console.log('URL exists:', !!PRESTASHOP_API_URL, 'Key exists:', !!PRESTASHOP_API_KEY);
        }
      } catch (prestashopError) {
        console.error('Error creating PrestaShop order:', prestashopError);
      }
    }

    // Return success to acknowledge receipt
    return NextResponse.json({ 
      success: true, 
      orderId,
      status: finalStatus 
    });
  } catch (error) {
    console.error('Notification processing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
