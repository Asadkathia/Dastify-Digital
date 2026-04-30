import type { Payload } from 'payload';

/**
 * Authoritative admin-session check for /api/admin/* routes.
 *
 * Two paths:
 * 1. Bearer `PAYLOAD_SECRET` — for tooling/tests that don't have a cookie.
 * 2. Payload-native `payload.auth({ headers })` — uses the same auth chain
 *    the admin UI uses. Avoids the v3 self-fetch quirk where forwarding the
 *    cookie to `/api/users/me` from a server route returned `{ user: null }`
 *    even when the session was valid for collection ops.
 *
 * Returns true for users with role `admin` or `editor`, or for users with
 * no role field at all (single-user installs).
 */
export async function hasAdminSession(request: Request, payload: Payload): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.PAYLOAD_SECRET;
  if (secret && authHeader === `Bearer ${secret}`) return true;

  try {
    const { user } = await payload.auth({ headers: request.headers });
    if (!user) return false;
    const role = (user as { role?: string }).role;
    if (!role) return true;
    return role === 'admin' || role === 'editor';
  } catch {
    return false;
  }
}
