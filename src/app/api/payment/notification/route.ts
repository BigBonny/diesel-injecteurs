import { NextResponse } from 'next/server';
import { verifyNotification, SogecommerceNotification } from '@/lib/sogecommerce';
import { supabase } from '@/lib/supabase';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL;
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const krAnswer = formData.get('kr_answer') as string;
    const krHash = formData.get('kr_hash') as string;

    if (!krAnswer || !krHash) {
      console.error('Missing kr_answer or kr_hash in notification');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notification: SogecommerceNotification = {
      kr_answer: krAnswer,
      kr_hash: krHash,
    };

    // Verify signature (skip for test mode)
    const mode = process.env.NEXT_PUBLIC_SOGECOMMERCE_MODE || 'test';
    if (mode !== 'test' && !verifyNotification(notification)) {
      console.error('Invalid signature for notification');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse kr_answer to get order details
    let orderData;
    try {
      orderData = JSON.parse(krAnswer);
    } catch (e) {
      console.error('Failed to parse kr_answer:', e);
      return NextResponse.json({ error: 'Invalid kr_answer format' }, { status: 400 });
    }

    const orderId = orderData.orderDetails?.orderId || orderData.orderId;
    const amount = orderData.orderDetails?.amount || orderData.amount;
    const status = orderData.orderDetails?.status || orderData.status;

    if (!orderId) {
      console.error('Missing orderId in kr_answer');
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // Update order status in Supabase
    const finalStatus = status === 'PAID' ? 'paid' : 
                       status === 'CANCELLED' ? 'cancelled' : 'failed';

    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: finalStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
    }

    // Create order in PrestaShop if payment is successful
    if (finalStatus === 'paid') {
      try {
        // Fetch order details from Supabase
        const { data: order, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (fetchError || !order) {
          console.error('Error fetching order from Supabase:', fetchError);
        } else {
          // Create order in PrestaShop
          const prestashopOrderXml = `
            <prestashop>
              <order>
                <id_address_delivery>5</id_address_delivery>
                <id_address_invoice>5</id_address_invoice>
                <id_cart>1</id_cart>
                <id_currency>1</id_currency>
                <id_customer>1</id_customer>
                <id_lang>1</id_lang>
                <current_state>2</current_state>
                <payment><![CDATA[Sogecommerce]]></payment>
                <total_paid>${amount}</total_paid>
                <total_paid_real>${amount}</total_paid_real>
                <module><![CDATA[sogecommerce]]></module>
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
            console.error('Failed to create order in PrestaShop:', response.status);
          }
        }
      } catch (prestashopError) {
        console.error('Error creating PrestaShop order:', prestashopError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}
