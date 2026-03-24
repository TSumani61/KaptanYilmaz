import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-kaptanyilmaz-key';

export interface AdminPayload {
  id: string;
  username: string;
  name: string;
}

export function signToken(payload: AdminPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch (error) {
    return null;
  }
}

export function getAdminSession(): AdminPayload | null {
  const token = cookies().get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
