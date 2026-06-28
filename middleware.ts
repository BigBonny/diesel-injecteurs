import { NextRequest, NextResponse } from 'next/server';

const OLD_HOSTS = ['diesel-injecteurs.com', 'www.diesel-injecteurs.com'];
const NEW_HOST = 'diesel-turbo-injection.com';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  if (OLD_HOSTS.includes(host.toLowerCase())) {
    const url = request.nextUrl.clone();
    url.protocol = 'https';
    url.host = NEW_HOST;
    url.port = '';
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|sitemap.xml|robots.txt).*)',
  ],
};
