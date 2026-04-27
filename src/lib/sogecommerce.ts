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

  // Build payment request body according to Sogecommerce V4 API
  const paymentRequest = {
    amount: Math.round(request.amount * 100), // Convert to cents
    currency: request.currency,
    orderId: request.orderId,
    customer: {
      email: request.customerEmail,
      billingDetails: {
        firstName: request.customerName.split(' ')[0] || request.customerName,
        lastName: request.customerName.split(' ').slice(1).join(' ') || request.customerName,
      },
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

  // Generate signature: HMAC-SHA256 of the JSON body
  const requestBody = JSON.stringify(paymentRequest);
  const signature = crypto.createHmac('sha256', hmacKey).update(requestBody).digest('hex');

  console.log('Sogecommerce request body:', requestBody);
  console.log('Sogecommerce signature:', signature);
  console.log('Sogecommerce publicKey:', publicKey);
  console.log('Sogecommerce hmacKey length:', hmacKey.length);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': publicKey,
        'X-Signature': signature,
      },
      body: requestBody,
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
