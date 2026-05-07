import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE  = 'grl_admin_token';
const SECRET  = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'grl-ops-fallback-secret'
);

export interface AdminPayload {
  username: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

/** Sign a JWT and set it as an HTTP-only cookie */
export async function createSession(user: { username: string; role: string; permissions: string[] }): Promise<void> {
  const token = await new SignJWT({ 
      username: user.username, 
      role: user.role, 
      permissions: user.permissions 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 8, // 8 hours
    path:     '/',
  });
}

/** Verify the session cookie — returns payload or null */
export async function verifySession(): Promise<AdminPayload | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return (payload as unknown) as AdminPayload;
  } catch {
    return null;
  }
}

/** Delete the session cookie (logout) */
export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** Check if the request is authenticated — use in API routes */
export async function requireAuth(): Promise<AdminPayload> {
  const session = await verifySession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
