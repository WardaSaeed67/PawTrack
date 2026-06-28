/**
 * POST /api/auth/register
 * 
 * Registers a new user account.
 * Validates inputs, hashes password, creates user, starts session.
 */
import { createUser, findUserByEmail } from '../../../../lib/auth/db';
import { hashPassword } from '../../../../lib/auth/password';
import { createSession } from '../../../../lib/auth/session';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // ── Validation ──
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain uppercase, lowercase, and a number.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    // ── Check if user already exists ──
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return Response.json(
        { errors: { email: 'An account with this email already exists.' } },
        { status: 409 }
      );
    }

    // ── Create user ──
    const hashedPassword = await hashPassword(password);
    const user = await createUser(name.trim(), email.trim(), hashedPassword);

    // ── Create session ──
    await createSession(user.id, user.email, user.name);

    return Response.json(
      { message: 'Account created successfully!', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Register Error]', error);
    return Response.json(
      { errors: { general: 'Something went wrong. Please try again.' } },
      { status: 500 }
    );
  }
}
