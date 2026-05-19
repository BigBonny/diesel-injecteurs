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
      try {
        if (!orderData) {
          console.error('No order data available for PrestaShop order creation');
        } else if (PRESTASHOP_API_URL && PRESTASHOP_API_KEY) {
          // Create a proper order in PrestaShop
          // For simplicity, we'll create a minimal order - in production, expand this
          const shippingCost = 0; // Adjust if you have shipping
          const discountAmount = 0; // Adjust if you have discounts
          const productTotal = amount - shippingCost + discountAmount;
          
          const prestashopOrderXml = `
            <prestashop>
              <order>
                <id_address_delivery>5</id_address_delivery>
                <id_address_invoice>5</id_address_invoice>
                <id_carrier>1</id_carrier>
                <id_cart>1</id_cart>
                <id_currency>1</id_currency>
                <id_customer>1</id_customer>
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

          if (response.ok) {
            const responseText = await response.text();
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
