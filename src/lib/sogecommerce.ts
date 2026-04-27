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
  const mode = process.env.NEXT_PUBLIC_SOGECOMMERCE_MODE || 'test';
  const publicKey = mode === 'test' 
    ? process.env.SOGECOMMERCE_TEST_PUBLIC_KEY || ''
    : process.env.SOGECOMMERCE_PROD_PUBLIC_KEY || '';
  const hmacKey = mode === 'test' 
    ? process.env.SOGECOMMERCE_TEST_HMAC_KEY || ''
    : process.env.SOGECOMMERCE_PROD_HMAC_KEY || '';

  // Sogecommerce REST API endpoint
  const apiUrl = 'https://api-sogecommerce.societegenerale.eu/api-payment/V4/Charge/CreatePayment';

  // Build payment request body
  const paymentRequest = {
    amount: request.amount,
    currency: request.currency,
    orderId: request.orderId,
    customer: {
      email: request.customerEmail,
      reference: request.customerName,
    },
    formToken: {
      action: 'ASK_REGISTER_PAY',
    },
    transactionOptions: {
      cardOptions: {
        paymentMode: 'SINGLE',
      },
    },
    returnUrl: request.returnURL,
    cancelUrl: request.cancelURL,
    notificationUrl: request.notificationURL,
  };

  // Generate signature using HMAC-SHA256
  const signatureString = JSON.stringify(paymentRequest) + hmacKey;
  const signature = crypto.createHmac('sha256', hmacKey).update(signatureString).digest('hex');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': publicKey,
        'X-Signature': signature,
      },
      body: JSON.stringify(paymentRequest),
    });

    const responseText = await response.text();
    console.log('Sogecommerce API raw response:', responseText);

    if (!response.ok) {
      console.error('Sogecommerce API error:', responseText);
      throw new Error(`Sogecommerce API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Sogecommerce API parsed response:', JSON.stringify(data, null, 2));
    
    // Return the formToken for embedded payment
    if (!data.answer || !data.answer.formToken) {
      console.error('Invalid response structure:', data);
      throw new Error('No formToken in Sogecommerce response');
    }
    
    return {
      formToken: data.answer.formToken,
      publicKey,
    };
  } catch (error) {
    console.error('Sogecommerce payment creation error:', error);
    throw error;
  }
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
