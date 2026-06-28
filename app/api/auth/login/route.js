/**
 * POST /api/auth/login
 * 
 * Authenticates an existing user.
 * Validates credentials, verifies password, starts session.
 */
import { findUserByEmail } from '../../../../lib/auth/db';
import { verifyPassword } from '../../../../lib/auth/password';
import { createSession } from '../../../../lib/auth/session';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // ── Validation ──
    const errors = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    // ── Find user ──
    const user = await findUserByEmail(email);
    if (!user) {
      return Response.json(
        { errors: { general: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // ── Verify password ──
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return Response.json(
        { errors: { general: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // ── Create session ──
    await createSession(user.id, user.email, user.name);

    // Return user without password
    const { password: _, ...safeUser } = user;
    return Response.json(
      { message: 'Login successful!', user: safeUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Login Error]', error);
    return Response.json(
      { errors: { general: 'Something went wrong. Please try again.' } },
      { status: 500 }
    );
  }
}
