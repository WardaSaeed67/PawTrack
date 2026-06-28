/**
 * Session Management — JWT + HTTP-only Cookies
 * 
 * Uses 'jose' for JWT (Edge-compatible, works in middleware).
 * Sessions are stored as signed JWTs in HTTP-only cookies.
 */
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'pawtrack_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Get the JWT secret as a Uint8Array (required by jose)
 */
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in .env.local');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Create a session JWT and set it as an HTTP-only cookie.
 * @param {string} userId - The user's unique ID
 * @param {string} email - The user's email
 * @param {string} name - The user's display name
 * @returns {string} The signed JWT token
 */
export async function createSession(userId, email, name) {
  const token = await new SignJWT({ userId, email, name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(getSecret());

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return token;
}

/**
 * Verify a session JWT token.
 * @param {string} token - The JWT token string
 * @returns {object|null} The decoded payload or null if invalid
 */
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

/**
 * Get the current session from cookies.
 * @returns {object|null} The session payload or null
 */
export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifySession(cookie.value);
}

/**
 * Delete the session by clearing the cookie.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// Export cookie name for middleware use
export { COOKIE_NAME };
