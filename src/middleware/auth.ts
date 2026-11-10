import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken | { uid: string; email?: string };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];

  // Support local account session token (email + password/pattern auth)
  if (token.startsWith('acct_tok_')) {
    try {
      const decodedJson = Buffer.from(token.slice('acct_tok_'.length), 'base64url').toString('utf8');
      const parsed = JSON.parse(decodedJson) as { uid: string; email: string };
      if (parsed && parsed.uid && parsed.email) {
        req.user = { uid: parsed.uid, email: parsed.email };
        return next();
      }
    } catch {
      return res.status(401).json({ error: 'Unauthorized: Invalid account token' });
    }
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
