import { NextResponse } from 'next/server';

const PS_AUTH_URL = process.env.PS_AUTH_URL || 'http://192.162.69.186/ps_auth.php';
const PS_SCRIPT_SECRET = process.env.PS_SCRIPT_SECRET || 'DIESEL_ORDER_SECRET_2024';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }

    // Forward the lead to the PrestaShop bridge (ps_emailsubscription).
    // We never block the UX on this: if the backend is unavailable we still
    // capture the lead in the server logs so it is not lost.
    try {
      const resp = await fetch(PS_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: PS_SCRIPT_SECRET,
          action: 'newsletter',
          email,
          source: source || 'popup',
        }).toString(),
        signal: AbortSignal.timeout(8000),
      });
      const text = await resp.text();
      console.log('Newsletter subscribe:', email, '->', resp.status, text.substring(0, 200));
    } catch (bridgeErr) {
      console.error('Newsletter bridge unavailable, lead logged:', email, bridgeErr);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Newsletter error:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
