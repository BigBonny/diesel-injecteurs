import { NextResponse } from 'next/server';

const PS_SCRIPT_URL = process.env.PS_SCRIPT_URL || 'http://192.162.69.186/create_ps_order.php';
const PS_SCRIPT_SECRET = process.env.PS_SCRIPT_SECRET || 'DIESEL_ORDER_SECRET_2024';

export async function POST(request: Request) {
  try {
    const { email, password, firstname, lastname } = await request.json();

    if (!email || !password || !firstname || !lastname) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
    }

    const psAuthUrl = PS_SCRIPT_URL.replace('create_ps_order.php', 'ps_auth.php');

    const resp = await fetch(psAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: PS_SCRIPT_SECRET,
        action: 'register',
        email,
        password,
        firstname,
        lastname,
      }).toString(),
      signal: AbortSignal.timeout(10000),
    });

    const text = await resp.text();
    let data: { success?: boolean; error?: string; id?: string; firstname?: string; lastname?: string; email?: string };
    try { data = JSON.parse(text); } catch {
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
      },
    });
  } catch (e) {
    console.error('Register error:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
