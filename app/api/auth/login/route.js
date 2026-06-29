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

    // ── Find or Auto-Create User (Mock DB Mode) ──
    let user = await findUserByEmail(email);
    
    if (!user) {
      // Since there is no real database yet, automatically create the user 
      // if they don't exist in the temporary in-memory array.
      // This ensures login ALWAYS works on serverless platforms like Vercel.
      const { hashPassword } = await import('../../../../lib/auth/password');
      const { createUser } = await import('../../../../lib/auth/db');
      const hashedPassword = await hashPassword(password);
      
      // Use the part before the @ as a default name
      const defaultName = email.split('@')[0];
      user = await createUser(defaultName, email, hashedPassword);
    } else {
      // If user DOES exist in memory, verify their password
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return Response.json(
          { errors: { general: 'Invalid email or password.' } },
          { status: 401 }
        );
      }
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
