import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendPaymentNotificationEmail } from '@/lib/notifications';

interface SumUpWebhookPayload {
  event_type: string;
  checkout_id: string;
  checkout_reference?: string;
  status?: string;
  amount?: number;
  currency?: string;
  merchant_code?: string;
  transactions?: Array<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    transaction_code?: string;
    auth_code?: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SumUpWebhookPayload;

    console.log('[SumUp webhook] received:', payload.event_type, payload.checkout_id, payload.status);

    if (!payload.checkout_id) {
      return NextResponse.json({ error: 'Missing checkout_id' }, { status: 400 });
    }

    // Determine payment status from transactions or checkout status
    let status = 'pending';
    if (payload.transactions && payload.transactions.length > 0) {
      const tx = payload.transactions[0];
      status = tx.status === 'SUCCESSFUL' ? 'paid' : tx.status === 'FAILED' ? 'failed' : 'pending';
    } else if (payload.status) {
      status = payload.status === 'PAID' || payload.status === 'SUCCESSFUL' ? 'paid' : 'pending';
    }

    // Find order by checkout_id or checkout_reference
    let orderId = payload.checkout_reference;

    if (!orderId) {
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('checkout_id', payload.checkout_id)
        .single();
      if (order) orderId = order.id;
    }

    if (!orderId) {
      console.warn('[SumUp webhook] Could not match order for checkout:', payload.checkout_id);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('[SumUp webhook] Error updating order:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Send confirmation email on successful payment
    if (status === 'paid') {
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (order) {
        try {
          await sendPaymentNotificationEmail({
            orderId,
            amount: order.amount || 0,
            status: 'paid',
            customerEmail: order.customer_email || undefined,
            customerName: order.customer_name || undefined,
            transactionId: payload.transactions?.[0]?.id,
          });
          console.log('[SumUp webhook] Notification email sent for order:', orderId);
        } catch (emailError) {
          console.error('[SumUp webhook] Failed to send notification email:', emailError);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[SumUp webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
