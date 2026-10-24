import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import HttpError from '../utils/http-error';

declare global {
  namespace Express {
    interface Request {
      userData?: { userId: string };
    }
  }
}

const checkAuth: RequestHandler = (req, _res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  const authHeader = req.get('authorization');
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return next(new HttpError('Authentication failed!', 401));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new HttpError('Authentication is not configured.', 500));
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    if (
      typeof decodedToken !== 'object' ||
      typeof decodedToken.userId !== 'string'
    ) {
      return next(new HttpError('Authentication failed!', 401));
    }

    req.userData = { userId: decodedToken.userId };
    return next();
  } catch {
    return next(new HttpError('Authentication failed!', 401));
  }
};

export default checkAuth;
