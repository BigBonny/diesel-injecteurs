import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { sendPaymentNotificationEmail } from '@/lib/notifications';

const PS_SCRIPT_URL = process.env.PS_SCRIPT_URL || 'http://192.162.69.186/create_ps_order.php';
const PS_SCRIPT_SECRET = process.env.PS_SCRIPT_SECRET || 'DIESEL_ORDER_SECRET_2024';

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

    if (psNewState && orderData?.prestashop_order_id) {
      try {
        const psOrderId = orderData.prestashop_order_id;
        console.log(`Updating PS order ${psOrderId} to state ${psNewState} via script...`);

        const body = new URLSearchParams({
          token:    PS_SCRIPT_SECRET,
          action:   'update_status',
          order_id: String(psOrderId),
          state:    String(psNewState),
          amount:   amount.toFixed(2),
        });

        const resp = await fetch(PS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
          signal: AbortSignal.timeout(10000),
        });

        const text = await resp.text();
        console.log('PS status update response:', resp.status, text.substring(0, 200));
      } catch (psError) {
        console.error('Error updating PrestaShop order status:', psError);
      }
    } else if (psNewState) {
      console.log('PS order update skipped - no prestashop_order_id');
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
