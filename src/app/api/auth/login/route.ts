import { NextResponse } from 'next/server';

const PS_AUTH_URL = process.env.PS_AUTH_URL || 'http://192.162.69.186/ps_auth.php';
const PS_SCRIPT_SECRET = process.env.PS_SCRIPT_SECRET || 'DIESEL_ORDER_SECRET_2024';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const resp = await fetch(PS_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: PS_SCRIPT_SECRET, action: 'login', email, password }).toString(),
      signal: AbortSignal.timeout(8000),
    });

    const text = await resp.text();
    console.log('PS login response:', resp.status, text.substring(0, 200));

    let data: { success?: boolean; error?: string; id?: string; email?: string; firstname?: string; lastname?: string };
    try { data = JSON.parse(text); } catch {
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { id: data.id, email: data.email, firstname: data.firstname, lastname: data.lastname },
    });
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
