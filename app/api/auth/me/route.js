/**
 * GET /api/auth/me
 * 
 * Returns the currently authenticated user's data from the session.
 */
import { getSession } from '../../../../lib/auth/session';
import { findUserById } from '../../../../lib/auth/db';

// This route uses cookies — must be dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch fresh user data from the database
    const user = await findUserById(session.userId);

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({ user }, { status: 200 });
  } catch (error) {
    console.error('[Me Error]', error);
    return Response.json(
      { error: 'Failed to fetch user data.' },
      { status: 500 }
    );
  }
}
