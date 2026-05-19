import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Log everything we receive
    const contentType = request.headers.get('content-type') || 'unknown';
    let body: any;
    
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = {} as Record<string, string>;
      for (const [key, value] of formData.entries()) {
        body[key] = value as string;
      }
    } else {
      const text = await request.text();
      body = { raw: text.substring(0, 1000) };
    }
    
    console.log('DEBUG NOTIFICATION received:', {
      contentType,
      body,
      headers: Object.fromEntries(request.headers.entries()),
    });
    
    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      bodyKeys: Object.keys(body),
    });
  } catch (error) {
    console.error('Debug notification error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Send POST with form data to test notification endpoint',
    testCommand: `curl -X POST https://diesel-injecteurs.com/api/payment/debug-notification -H "Content-Type: application/x-www-form-urlencoded" -d "vads_trans_status=AUTHORISED&vads_order_id=TEST123&vads_amount=10000"`
  });
}
