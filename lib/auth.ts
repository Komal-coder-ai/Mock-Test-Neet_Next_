import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';

export function authenticateApi(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret, { maxAge: '1d' });
    return decoded;
  } catch (err) {
    res.status(401).json({ error: 'Token expired or invalid' });
    return null;
  }
}
 