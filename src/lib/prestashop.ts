// PrestaShop order integration helper
const PS_SCRIPT_URL = process.env.PS_SCRIPT_URL || 'http://192.162.69.186/create_ps_order.php';
const PS_SCRIPT_SECRET = process.env.PS_SCRIPT_SECRET || 'DIESEL_ORDER_SECRET_2024';

export async function createPrestashopOrder(
  orderId: string,
  amount: number,
  customerEmail: string,
  customerName: string
): Promise<string | null> {
  try {
    const firstName = (customerName.split(' ')[0] || 'Client').slice(0, 32);
    const lastName = (customerName.split(' ').slice(1).join(' ') || customerName).slice(0, 32) || 'Client';

    const body = new URLSearchParams({
      token: PS_SCRIPT_SECRET,
      action: 'create',
      email: customerEmail,
      first_name: firstName,
      last_name: lastName,
      amount: amount.toFixed(2),
      reference: orderId,
    });

    const resp = await fetch(PS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: AbortSignal.timeout(15000),
    });

    const text = await resp.text();
    console.log('PS script response:', resp.status, text.substring(0, 300));

    if (!resp.ok) {
      console.error('PS script failed - status:', resp.status);
      return null;
    }

    const data = JSON.parse(text);
    if (data.error) {
      console.error('PS script error:', data.error);
      return null;
    }

    console.log('PS order created with ID:', data.order_id);
    return String(data.order_id);
  } catch (e) {
    console.error('PS order creation error:', e);
    return null;
  }
}

export async function updatePrestashopOrderStatus(
  prestashopOrderId: number | string,
  status: 'paid' | 'cancelled' | 'refused' | 'failed' | 'expired',
  amount: number
): Promise<void> {
  const psStatusMap: Record<string, number> = {
    paid: 2,
    cancelled: 6,
    refused: 8,
    failed: 8,
    expired: 6,
  };

  const psNewState = psStatusMap[status];
  if (!psNewState) {
    console.log('PS status update skipped - unknown status:', status);
    return;
  }

  try {
    console.log(`Updating PS order ${prestashopOrderId} to state ${psNewState} via script...`);

    const body = new URLSearchParams({
      token: PS_SCRIPT_SECRET,
      action: 'update_status',
      order_id: String(prestashopOrderId),
      state: String(psNewState),
      amount: amount.toFixed(2),
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
}
