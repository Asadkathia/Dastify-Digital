import type { PayloadRequest } from 'payload';

type UserLike = {
  role?: 'admin' | 'editor' | null;
};

function getUser(req: PayloadRequest): UserLike | null {
  return (req.user as UserLike | null) ?? null;
}

export function isAdmin(req: PayloadRequest): boolean {
  const role = getUser(req)?.role;
  // Backward compatibility for users created before the `role` field existed.
  if (!role) {
    return true;
  }
  return role === 'admin';
}

export function isAdminOrEditor(req: PayloadRequest): boolean {
  const role = getUser(req)?.role;
  return role === 'admin' || role === 'editor';
}
