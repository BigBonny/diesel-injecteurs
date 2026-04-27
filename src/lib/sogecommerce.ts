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
  const siteId = process.env.SOGECOMMERCE_SITE_ID || '';
  const mode = process.env.NEXT_PUBLIC_SOGECOMMERCE_MODE || 'test';
  const publicKey = mode === 'test' 
    ? process.env.SOGECOMMERCE_TEST_PUBLIC_KEY || ''
    : process.env.SOGECOMMERCE_PROD_PUBLIC_KEY || '';
  const hmacKey = mode === 'test' 
    ? process.env.SOGECOMMERCE_TEST_HMAC_KEY || ''
    : process.env.SOGECOMMERCE_PROD_HMAC_KEY || '';

  // Sogecommerce hosted payment page URL
  const paymentUrl = 'https://payment.sogecommerce.societegenerale.eu/standard-payment';

  // Build payment parameters
  const params = new URLSearchParams({
    siteId,
    amount: request.amount.toString(),
    currency: request.currency,
    orderId: request.orderId,
    customerEmail: request.customerEmail,
    customerName: request.customerName,
    returnURL: request.returnURL,
    cancelURL: request.cancelURL,
    notificationURL: request.notificationURL,
    publicKey,
  });

  // Generate signature using HMAC-SHA256
  const sortedParams = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
  const signatureString = sortedParams.map(([k, v]) => `${k}=${v}`).join('+') + '+' + hmacKey;
  const signature = crypto.createHmac('sha256', hmacKey).update(signatureString).digest('hex');
  params.append('signature', signature);

  // Build the full payment URL
  const fullPaymentUrl = `${paymentUrl}?${params.toString()}`;

  return {
    formToken: fullPaymentUrl,
    publicKey,
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
