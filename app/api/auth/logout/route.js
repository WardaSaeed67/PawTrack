/**
 * POST /api/auth/logout
 * 
 * Destroys the user session by clearing the HTTP-only cookie.
 */
import { deleteSession } from '../../../../lib/auth/session';

export async function POST() {
  try {
    await deleteSession();
    return Response.json({ message: 'Logged out successfully.' }, { status: 200 });
  } catch (error) {
    console.error('[Logout Error]', error);
    return Response.json(
      { error: 'Failed to logout.' },
      { status: 500 }
    );
  }
}
