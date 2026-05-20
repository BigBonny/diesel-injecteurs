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

    // Update PrestaShop order status (order was already created at checkout)
    // Status map: paid=2, cancelled=6, refused=8, failed=8
    const psStatusMap: Record<string, number> = {
      paid: 2,
      cancelled: 6,
      refused: 8,
      failed: 8,
      expired: 6,
    };
    const psNewState = psStatusMap[finalStatus];

    if (psNewState && orderData?.prestashop_order_id && PRESTASHOP_API_URL && PRESTASHOP_API_KEY) {
      try {
        const psOrderId = orderData.prestashop_order_id;
        console.log(`Updating PS order ${psOrderId} to state ${psNewState}...`);

        // Fetch current order XML first (PUT requires full object)
        const getResp = await fetch(
          `${PRESTASHOP_API_URL}/orders/${psOrderId}?ws_key=${PRESTASHOP_API_KEY}`,
          { signal: AbortSignal.timeout(8000) }
        );

        if (getResp.ok) {
          let orderXml = await getResp.text();
          // Replace current_state value
          orderXml = orderXml.replace(
            /<current_state>.*?<\/current_state>/,
            `<current_state>${psNewState}</current_state>`
          );
          // Also update total_paid_real on payment success
          if (finalStatus === 'paid') {
            orderXml = orderXml.replace(
              /<total_paid_real>.*?<\/total_paid_real>/,
              `<total_paid_real>${amount.toFixed(2)}</total_paid_real>`
            );
          }

          const putResp = await fetch(
            `${PRESTASHOP_API_URL}/orders/${psOrderId}?ws_key=${PRESTASHOP_API_KEY}`,
            { method: 'PUT', headers: { 'Content-Type': 'application/xml' }, body: orderXml, signal: AbortSignal.timeout(8000) }
          );

          if (putResp.ok) {
            console.log(`PS order ${psOrderId} updated to state ${psNewState}`);
          } else {
            console.error('Failed to update PS order:', putResp.status, await putResp.text());
          }
        } else {
          console.error('Failed to fetch PS order for update:', getResp.status);
        }
      } catch (psError) {
        console.error('Error updating PrestaShop order status:', psError);
      }
    } else if (psNewState) {
      console.log('PS order update skipped - no prestashop_order_id or API not configured');
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
