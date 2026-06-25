// SumUp Payment Integration
// Required environment variables (add to .env.local, never commit):
//   SUMUP_MERCHANT_CODE=MCXXXXXX
//   SUMUP_API_KEY=sup_...        (preferred, if available in your SumUp dashboard)
// OR
//   SUMUP_CLIENT_ID=...          (OAuth2 client credentials)
//   SUMUP_CLIENT_SECRET=...
// Optional:
//   SUMUP_MODE=TEST|PRODUCTION   (defaults to TEST)
//   NEXT_PUBLIC_BASE_URL=https://votresite.com
import crypto from 'crypto';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SumUpPaymentRequest {
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

export interface SumUpPaymentResponse {
  checkoutId: string;
  checkoutUrl: string;
  status: string;
}

interface SumUpCheckout {
  id: string;
  checkout_reference: string;
  status: string;
  hosted_checkout_url?: string;
  redirect_url?: string;
  amount: number;
  currency: string;
  merchant_code: string;
  description?: string;
  transactions?: Array<{
    id: string;
    status: string;
    amount: number;
    currency: string;
  }>;
}

interface SumUpTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

const SUMUP_API_BASE = 'https://api.sumup.com';

export function getSumUpCredentials() {
  const merchantCode = process.env.SUMUP_MERCHANT_CODE;
  const apiKey = process.env.SUMUP_API_KEY;
  const clientId = process.env.SUMUP_CLIENT_ID;
  const clientSecret = process.env.SUMUP_CLIENT_SECRET;
  const mode = process.env.SUMUP_MODE || 'TEST';

  if (!merchantCode) {
    throw new Error('Missing SUMUP_MERCHANT_CODE');
  }

  if (!apiKey && (!clientId || !clientSecret)) {
    throw new Error('Missing SumUp credentials: provide SUMUP_API_KEY or both SUMUP_CLIENT_ID and SUMUP_CLIENT_SECRET');
  }

  return { merchantCode, apiKey, clientId, clientSecret, mode };
}

export async function getSumUpAccessToken(): Promise<string> {
  const { apiKey, clientId, clientSecret } = getSumUpCredentials();

  // If API key is provided, use it directly as Bearer token
  if (apiKey) {
    return apiKey;
  }

  // Otherwise use OAuth2 client credentials flow
  const response = await fetch(`${SUMUP_API_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId!,
      client_secret: clientSecret!,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SumUp token request failed: ${response.status} ${error}`);
  }

  const data = (await response.json()) as SumUpTokenResponse;
  return data.access_token;
}

export async function createSumUpCheckout(
  request: SumUpPaymentRequest
): Promise<SumUpPaymentResponse> {
  const { merchantCode } = getSumUpCredentials();
  const accessToken = await getSumUpAccessToken();

  const description = request.cartItems && request.cartItems.length > 0
    ? request.cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ').slice(0, 255)
    : `Order ${request.orderId}`;

  const payload = {
    amount: request.amount,
    checkout_reference: request.orderId.slice(0, 255),
    currency: request.currency || 'EUR',
    merchant_code: merchantCode,
    description: description.slice(0, 255),
    redirect_url: request.returnURL, // User returns here after payment attempt
    return_url: request.notificationURL, // SumUp sends status updates here
    hosted_checkout: { enabled: true },
  };

  console.log('[SumUp] Creating checkout:', {
    amount: payload.amount,
    currency: payload.currency,
    merchant_code: payload.merchant_code,
    checkout_reference: payload.checkout_reference,
  });

  const response = await fetch(`${SUMUP_API_BASE}/v0.1/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[SumUp] Checkout creation failed:', response.status, error);
    throw new Error(`SumUp checkout creation failed: ${response.status} ${error}`);
  }

  const checkout = (await response.json()) as SumUpCheckout;

  console.log('[SumUp] Checkout created:', checkout.id, checkout.status);

  const checkoutUrl = checkout.hosted_checkout_url || checkout.redirect_url;

  if (!checkoutUrl) {
    throw new Error('SumUp checkout did not return a payment URL');
  }

  return {
    checkoutId: checkout.id,
    checkoutUrl,
    status: checkout.status,
  };
}

export function verifySumUpWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expected = hmac.digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    return false;
  }
}

export function getSumUpCheckoutStatus(checkout: SumUpCheckout): 'pending' | 'paid' | 'failed' | 'unknown' {
  if (!checkout.transactions || checkout.transactions.length === 0) {
    return checkout.status === 'PENDING' ? 'pending' : 'unknown';
  }

  const transaction = checkout.transactions[0];
  if (transaction.status === 'SUCCESSFUL') return 'paid';
  if (transaction.status === 'FAILED' || transaction.status === 'CANCELLED') return 'failed';
  return 'pending';
}
