import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production-32c'
);

const JWT_EXPIRY = '24h';

/**
 * Sign a JWT token for admin session
 */
export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(secret);
}

/**
 * Verify a JWT token
 * Returns payload if valid, null if invalid/expired
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Get the admin token from cookie
 */
export function getTokenFromCookies(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Create a Set-Cookie header string for secure admin token
 */
export function createAuthCookie(token) {
  const isProd = process.env.NODE_ENV === 'production';
  return [
    `admin_token=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Strict',
    `Max-Age=${24 * 60 * 60}`,
    isProd ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

/**
 * Create a clearing Set-Cookie header (for logout)
 */
export function clearAuthCookie() {
  return 'admin_token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0';
}
