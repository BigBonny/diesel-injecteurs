// Afone Paiement / Noelse (CMI) Payment Integration
import crypto from 'crypto';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface AfonePaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  returnURL: string;
  cancelURL: string;
  notificationURL: string;
  cartItems?: CartItem[];
}

export interface AfonePaymentResponse {
  formToken: string;
  publicKey: string;
}

export interface AfoneNotification {
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
  const mode = process.env.AFONE_MODE || 'TEST';
  const isProd = mode === 'PRODUCTION';
  
  const siteId = isProd 
    ? process.env.AFONE_PROD_SITE_ID 
    : process.env.AFONE_TEST_SITE_ID;
  const hmacKey = isProd 
    ? process.env.AFONE_PROD_HMAC_KEY 
    : process.env.AFONE_TEST_HMAC_KEY;
  
  if (!siteId || !hmacKey) {
    throw new Error(`Missing Afone Paiement credentials for ${mode} mode`);
  }
  
  return { mode, siteId, hmacKey, isProd };
}

function generateTransactionId(orderId: string): string {
  const numeric = orderId.replace(/\D/g, '');
  if (numeric.length >= 6) {
    return numeric.slice(-6);
  }
  return numeric.padStart(6, '0').slice(-6);
}

function generateSignature(paymentData: Record<string, string>, hmacKey: string): string {
  const vadsKeys = Object.keys(paymentData)
    .filter(key => key.startsWith('vads_'))
    .sort((a, b) => a.localeCompare(b));
  
  const signatureString = vadsKeys.map(key => paymentData[key]).join('+') + '+' + hmacKey;
  
  console.log('Signature keys:', vadsKeys);
  console.log('Signature string (before HMAC):', signatureString);
  
  const hmac = crypto.createHmac('sha256', hmacKey);
  hmac.update(signatureString);
  const signature = hmac.digest('base64');
  
  console.log('Generated signature:', signature);
  
  return signature;
}

export async function createAfonePayment(
  request: AfonePaymentRequest
): Promise<AfonePaymentResponse> {
  const { mode, siteId, hmacKey, isProd } = getCredentials();
  
  console.log(`Creating Afone Paiement in ${mode} mode for order ${request.orderId}`);

  const now = new Date();
  const transDate = now.toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);
  
  const transId = generateTransactionId(request.orderId);

  const paymentData: Record<string, string> = {
    vads_site_id: siteId,
    vads_ctx_mode: isProd ? 'PRODUCTION' : 'TEST',
    vads_trans_id: transId,
    vads_trans_date: transDate,
    vads_amount: Math.round(request.amount * 100).toString(),
    vads_currency: '978',
    vads_action_mode: 'INTERACTIVE',
    vads_page_action: 'PAYMENT',
    vads_version: 'V2',
    vads_payment_config: 'SINGLE',
    vads_capture_delay: '0',
    vads_validation_mode: '0',
    vads_order_id: request.orderId.slice(0, 32),
    vads_cust_email: request.customerEmail.slice(0, 127),
    vads_cust_first_name: (request.customerName.split(' ')[0] || '').slice(0, 127),
    vads_cust_last_name: request.customerName.split(' ').slice(1).join(' ').slice(0, 127),
    vads_url_return: request.returnURL,
    vads_url_cancel: request.cancelURL,
    vads_url_check: request.notificationURL,
    vads_url_refused: request.cancelURL,
    vads_url_error: request.cancelURL,
    vads_available_languages: '',
    vads_contrib: 'NextJS_Afone_1.0.0',
    vads_cust_address: '',
    vads_cust_cell_phone: '',
    vads_cust_city: '',
    vads_cust_country: '',
    vads_cust_id: '',
    vads_cust_legal_name: '',
    vads_cust_phone: '',
    vads_cust_title: '',
    vads_cust_zip: '',
    vads_ext_info_module_id: '',
    vads_language: 'fr',
    vads_nb_products: '1',
    vads_payment_cards: '',
    vads_return_mode: 'GET',
    vads_ship_to_city: '',
    vads_ship_to_country: '',
    vads_ship_to_first_name: '',
    vads_ship_to_last_name: '',
    vads_ship_to_legal_name: '',
    vads_ship_to_phone_num: '',
    vads_ship_to_street: '',
    vads_ship_to_street2: '',
    vads_ship_to_zip: '',
    vads_shipping_amount: '0',
    vads_shop_name: '',
    vads_shop_url: '',
    vads_tax_amount: '0',
    vads_totalamount_vat: '0',
  };

  if (request.cartItems && request.cartItems.length > 0) {
    request.cartItems.forEach((item, index) => {
      paymentData[`vads_product_ref${index}`] = item.id.slice(0, 63);
      paymentData[`vads_product_label${index}`] = item.name.slice(0, 255);
      paymentData[`vads_product_qty${index}`] = item.quantity.toString();
      paymentData[`vads_product_amount${index}`] = Math.round(item.price * 100).toString();
      paymentData[`vads_product_type${index}`] = 'FOOD_AND_GROCERY';
      paymentData[`vads_product_vat${index}`] = '0.0000';
    });
    paymentData.vads_nb_products = request.cartItems.length.toString();
  }

  Object.keys(paymentData).forEach(key => {
    if (paymentData[key] === undefined || paymentData[key] === null) {
      delete paymentData[key];
    }
  });
  
  if (!paymentData.vads_cust_last_name) {
    paymentData.vads_cust_last_name = '';
  }

  const signature = generateSignature(paymentData, hmacKey);
  paymentData.signature = signature;

  // Afone Paiement URLs (different from Sogecommerce)
  const baseUrl = isProd 
    ? 'https://secure.afonepaiement.com/vads-payment/'
    : 'https://secure-test.afonepaiement.com/vads-payment/';
    
  const queryParams = new URLSearchParams(paymentData).toString();
  const paymentUrl = `${baseUrl}?${queryParams}`;

  console.log('Afone Payment URL:', paymentUrl.substring(0, 200) + '...');

  return {
    formToken: paymentUrl,
    publicKey: siteId,
  };
}

export function verifyNotification(notification: AfoneNotification): boolean {
  try {
    const { hmacKey } = getCredentials();
    
    const vadsData: Record<string, string> = {};
    Object.keys(notification).forEach(key => {
      if (key.startsWith('vads_') && notification[key]) {
        vadsData[key] = notification[key]!;
      }
    });
    
    const expectedSignature = generateSignature(vadsData, hmacKey);
    
    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', notification.signature);
    
    return expectedSignature === notification.signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}
