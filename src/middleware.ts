import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'grl-ops-fallback-secret'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = userAgent(request);
  const isMobile = ua.device.type === 'mobile' || ua.device.type === 'tablet';

  // Even in desktop mode, many mobile browsers send these headers
  const chMobile = request.headers.get('sec-ch-ua-mobile');
  const reallyMobile = isMobile || chMobile === '?1';

  // Security Check: No mobile access for admin paths
  if (pathname.startsWith('/grl-ops-x7')) {
    if (reallyMobile) {
      // Return 404 as requested
      return new NextResponse(null, { status: 404 });
    }
  }

  // Protect all /grl-ops-x7 routes except login
  if (pathname.startsWith('/grl-ops-x7') && !pathname.startsWith('/grl-ops-x7/login')) {
    const token = request.cookies.get('grl_admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/grl-ops-x7/login', request.url));
    }

    try {
      const { payload } = (await jwtVerify(token, SECRET)) as { payload: any };
      
      const role = payload.role || 'editor';
      const perms = payload.permissions || [];
      const username = payload.username || '';

      // Permission mapping for paths
      const permMap: Record<string, string> = {
        '/grl-ops-x7/products':   'products',
        '/grl-ops-x7/product/':   'products',
        '/grl-ops-x7/categories': 'categories',
        '/grl-ops-x7/divisions':  'divisions',
        '/grl-ops-x7/blog':       'blog',
        '/grl-ops-x7/staff':      'admin',
        '/grl-ops-x7/settings':   'settings',
      };

      // Enforce: grladmin is always master. Everyone else checks roles.
      if (role !== 'admin' && username !== 'grladmin') {
        for (const [path, perm] of Object.entries(permMap)) {
          if (pathname.startsWith(path)) {
            if (!perms.includes(perm)) {
              return NextResponse.redirect(new URL('/grl-ops-x7/dashboard', request.url));
            }
          }
        }
      }

      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL('/grl-ops-x7/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/grl-ops-x7/:path*',
};
