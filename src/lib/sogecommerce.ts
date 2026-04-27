// Sogecommerce Payment Integration
import crypto from 'crypto';

export interface SogecommercePaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  returnURL: string;
  cancelURL: string;
  notificationURL: string;
}

export interface SogecommercePaymentResponse {
  formToken: string;
  publicKey: string;
}

export interface SogecommerceNotification {
  kr_answer: string;
  kr_hash: string;
}

export async function createSogecommercePayment(
  request: SogecommercePaymentRequest
): Promise<SogecommercePaymentResponse> {
  // Use production credentials from Sogecommerce Back Office
  const siteId = '56994465';
  const hmacKey = 'zFuFb9QpAMOJJVzv'; // Production key

  // Build payment parameters for Sogecommerce hosted payment page
  const paymentData: Record<string, string> = {
    vads_site_id: siteId,
    vads_ctx_mode: 'PRODUCTION',
    vads_trans_id: request.orderId.slice(-6), // Last 6 chars of order ID
    vads_trans_date: new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14),
    vads_amount: Math.round(request.amount * 100).toString(), // Convert to cents
    vads_currency: '978', // EUR currency code
    vads_action_mode: 'INTERACTIVE',
    vads_page_action: 'PAYMENT',
    vads_version: 'V2',
    vads_payment_config: 'SINGLE',
    vads_capture_delay: '0',
    vads_validation_mode: '0',
    vads_cust_email: request.customerEmail,
    vads_cust_first_name: request.customerName.split(' ')[0] || request.customerName,
    vads_cust_last_name: request.customerName.split(' ').slice(1).join(' ') || '',
    vads_url_return: request.returnURL,
    vads_url_cancel: request.cancelURL,
    vads_url_check: request.notificationURL,
    vads_url_refused: request.cancelURL,
  };

  // Build signature string: only vads_ parameters, sorted alphabetically, joined with +
  const vadsKeys = Object.keys(paymentData)
    .filter(key => key.startsWith('vads_'))
    .sort();
  const signatureString = vadsKeys.map(key => paymentData[key]).join('+') + '+' + hmacKey;
  const signature = crypto.createHmac('sha256', hmacKey).update(signatureString).digest('hex');

  // Add signature to payment data
  paymentData.signature = signature;

  console.log('Sogecommerce vads keys:', vadsKeys);
  console.log('Sogecommerce signature string:', signatureString);
  console.log('Sogecommerce signature:', signature);
  console.log('Sogecommerce hmacKey:', hmacKey);

  // Build the hosted payment page URL with query parameters
  // Use the correct Sogecommerce production payment URL
  const baseUrl = 'https://sogecommerce.societegenerale.eu/vads-payment/';
  const queryParams = new URLSearchParams(paymentData).toString();
  const paymentUrl = `${baseUrl}?${queryParams}`;

  console.log('Sogecommerce payment URL:', paymentUrl);

  // Return a formToken that is actually the payment URL
  // The payment page will use this URL directly
  return {
    formToken: paymentUrl,
    publicKey: siteId,
  };
}

function generateHMACSignature(data: string, key: string): string {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

export function verifyNotification(
  notification: SogecommerceNotification
): boolean {
  const mode = process.env.NEXT_PUBLIC_SOGECOMMERCE_MODE || 'test';
  const hmacKey = mode === 'test' 
    ? process.env.SOGECOMMERCE_TEST_HMAC_KEY || ''
    : process.env.SOGECOMMERCE_PROD_HMAC_KEY || '';

  // Verify HMAC signature
  const expectedHash = generateHMACSignature(notification.kr_answer, hmacKey);
  return notification.kr_hash === expectedHash;
}
