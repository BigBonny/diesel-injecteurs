import { NextResponse } from 'next/server';

const PS_API_URL = process.env.PRESTASHOP_API_URL || 'http://192.162.69.186/api';
const PS_API_KEY = process.env.PRESTASHOP_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    // Find customer by email in PrestaShop
    const searchResp = await fetch(
      `${PS_API_URL}/customers?ws_key=${PS_API_KEY}&display=[id,email,firstname,lastname,passwd,active]&filter[email]=[${encodeURIComponent(email)}]&output_format=JSON`,
      { signal: AbortSignal.timeout(8000) }
    );

    if (!searchResp.ok) {
      return NextResponse.json({ error: 'Erreur de connexion au serveur' }, { status: 500 });
    }

    const data = await searchResp.json();
    const customers = data.customers;

    if (!customers || customers.length === 0) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    const customer = customers[0];

    if (!customer.active || customer.active === '0') {
      return NextResponse.json({ error: 'Compte désactivé' }, { status: 401 });
    }

    // Verify password - PrestaShop uses md5(cookie_key + password) or bcrypt depending on version
    // Try md5 approach first, then sha1
    const crypto = await import('crypto');
    const md5Hash = crypto.createHash('md5').update(password).digest('hex');
    
    // PrestaShop 1.7+ stores passwords as bcrypt but legacy as md5
    // We check if stored passwd starts with $2y$ (bcrypt)
    let passwordValid = false;
    if (customer.passwd) {
      if (customer.passwd.startsWith('$2y$') || customer.passwd.startsWith('$2a$')) {
        // bcrypt - use PS API to verify via customer login endpoint
        // PrestaShop doesn't expose bcrypt verify via API, so we use a workaround
        // Check via the PS webservice by attempting to get customer with filter
        const verifyResp = await fetch(
          `${PS_API_URL}/customers?ws_key=${PS_API_KEY}&display=[id,email,firstname,lastname]&filter[email]=[${encodeURIComponent(email)}]&filter[passwd]=[${encodeURIComponent(customer.passwd)}]&output_format=JSON`,
          { signal: AbortSignal.timeout(8000) }
        );
        // Alternative: use a dedicated PHP verify endpoint
        const psScriptUrl = process.env.PS_SCRIPT_URL?.replace('create_ps_order.php', 'ps_auth.php');
        if (psScriptUrl) {
          const authResp = await fetch(psScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              token: process.env.PS_SCRIPT_SECRET || 'DIESEL_ORDER_SECRET_2024',
              action: 'login',
              email,
              password,
            }).toString(),
            signal: AbortSignal.timeout(8000),
          });
          if (authResp.ok) {
            const authData = await authResp.json();
            if (authData.success) {
              return NextResponse.json({
                success: true,
                user: {
                  id: authData.id,
                  email: authData.email,
                  firstname: authData.firstname,
                  lastname: authData.lastname,
                },
              });
            } else {
              return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
            }
          }
        }
        passwordValid = false;
      } else {
        // Legacy md5: PrestaShop 1.6 style
        passwordValid = customer.passwd === md5Hash;
      }
    }

    if (!passwordValid) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        firstname: customer.firstname,
        lastname: customer.lastname,
      },
    });
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
