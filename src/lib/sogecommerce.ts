// Sogecommerce (CMI) Payment Integration
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
  formToken: string; // Actually the payment URL for hosted page
  publicKey: string;
}

export interface SogecommerceNotification {
  vads_trans_status: string;
  vads_trans_id: string;
  vads_order_id: string;
  vads_amount: string;
  vads_cust_email?: string;
  vads_cust_first_name?: string;
  vads_cust_last_name?: string;
  signature: string;
  [key: string]: string | undefined;
}

function getCredentials() {
  const mode = process.env.SOGECOMMERCE_MODE || 'TEST';
  const isProd = mode === 'PRODUCTION';
  
  const siteId = isProd 
    ? process.env.SOGECOMMERCE_PROD_SITE_ID 
    : process.env.SOGECOMMERCE_TEST_SITE_ID;
  const hmacKey = isProd 
    ? process.env.SOGECOMMERCE_PROD_HMAC_KEY 
    : process.env.SOGECOMMERCE_TEST_HMAC_KEY;
  
  if (!siteId || !hmacKey) {
    throw new Error(`Missing Sogecommerce credentials for ${mode} mode`);
  }
  
  return { mode, siteId, hmacKey, isProd };
}

function generateTransactionId(orderId: string): string {
  // Transaction ID must be exactly 6 numeric characters, 0-padded
  // Take last 6 chars and ensure they're numeric, or hash and take first 6
  const numeric = orderId.replace(/\D/g, '');
  if (numeric.length >= 6) {
    return numeric.slice(-6);
  }
  // Pad with zeros if needed
  return numeric.padStart(6, '0').slice(-6);
}

function generateSignature(paymentData: Record<string, string>, hmacKey: string): string {
  // Build signature string: only vads_ parameters, sorted alphabetically, joined with +
  const vadsKeys = Object.keys(paymentData)
    .filter(key => key.startsWith('vads_'))
    .sort((a, b) => a.localeCompare(b));
  
  const signatureString = vadsKeys.map(key => paymentData[key]).join('+') + '+' + hmacKey;
  
  console.log('Signature keys:', vadsKeys);
  console.log('Signature string (before HMAC):', signatureString);
  
  // Calculate HMAC-SHA256 and encode as Base64
  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(signatureString);
  const signature = hmac.digest('base64');
  
  console.log('Generated signature:', signature);
  
  return signature;
}

export async function createSogecommercePayment(
  request: SogecommercePaymentRequest
): Promise<SogecommercePaymentResponse> {
  const { mode, siteId, hmacKey, isProd } = getCredentials();
  
  console.log(`Creating Sogecommerce payment in ${mode} mode for order ${request.orderId}`);

  // Generate transaction date in format:YYYYMMDDHHMMSS
  const now = new Date();
  const transDate = now.toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);
  
  // Transaction ID must be unique per day and exactly 6 digits
  const transId = generateTransactionId(request.orderId);

  // Build payment parameters for Sogecommerce hosted payment page
  const paymentData: Record<string, string> = {
    vads_site_id: siteId,
    vads_ctx_mode: isProd ? 'PRODUCTION' : 'TEST',
    vads_trans_id: transId,
    vads_trans_date: transDate,
    vads_amount: Math.round(request.amount * 100).toString(), // Amount in cents
    vads_currency: '978', // EUR
    vads_action_mode: 'INTERACTIVE',
    vads_page_action: 'PAYMENT',
    vads_version: 'V2',
    vads_payment_config: 'SINGLE',
    vads_capture_delay: '0',
    vads_validation_mode: '0',
    vads_order_id: request.orderId.slice(0, 32), // Max 32 chars
    vads_cust_email: request.customerEmail.slice(0, 127),
    vads_cust_first_name: (request.customerName.split(' ')[0] || '').slice(0, 127),
    vads_cust_last_name: request.customerName.split(' ').slice(1).join(' ').slice(0, 127),
    vads_url_return: request.returnURL,
    vads_url_cancel: request.cancelURL,
    vads_url_check: request.notificationURL,
    vads_url_refused: request.cancelURL,
    vads_url_error: request.cancelURL,
  };

  // Clean up any undefined/null values
  Object.keys(paymentData).forEach(key => {
    if (!paymentData[key]) delete paymentData[key];
  });

  // Generate signature
  const signature = generateSignature(paymentData, hmacKey);
  paymentData.signature = signature;

  // Build the hosted payment page URL
  const baseUrl = isProd 
    ? 'https://sogecommerce.societegenerale.eu/vads-payment/'
    : 'https://sogecommerce.societegenerale.eu/test/vads-payment/';
    
  const queryParams = new URLSearchParams(paymentData).toString();
  const paymentUrl = `${baseUrl}?${queryParams}`;

  console.log('Payment URL length:', paymentUrl.length);
  console.log('Payment URL (truncated):', paymentUrl.substring(0, 200) + '...');

  return {
    formToken: paymentUrl,
    publicKey: siteId,
  };
}

export function verifyNotification(notification: SogecommerceNotification): boolean {
  try {
    const { hmacKey } = getCredentials();
    
    // Extract all vads_ fields from notification
    const vadsData: Record<string, string> = {};
    Object.keys(notification).forEach(key => {
      if (key.startsWith('vads_') && notification[key]) {
        vadsData[key] = notification[key]!;
      }
    });
    
    // Generate expected signature
    const expectedSignature = generateSignature(vadsData, hmacKey);
    
    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', notification.signature);
    
    return expectedSignature === notification.signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
