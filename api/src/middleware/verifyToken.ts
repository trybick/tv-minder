import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import env from 'config/env';

export type JWTData = {
  email: string;
  exp: number;
  iat: number;
  id: mongoose.Types.ObjectId;
};

const isJWTData = (decoded: unknown): decoded is JWTData => {
  return (
    typeof decoded === 'object' &&
    decoded !== null &&
    'id' in decoded &&
    'email' in decoded &&
    'exp' in decoded &&
    'iat' in decoded
  );
};

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const providedToken = req.body?.token || req.query.token;

  if (!providedToken) {
    res.status(401).json({ message: 'Token required' });
    return;
  }

  jwt.verify(providedToken, env.JWT_KEY, (err: VerifyErrors | null, decoded?: string | object) => {
    if (err || !decoded || !isJWTData(decoded)) {
      res.status(401).json({ message: 'Check auth failed' });
      return next('Invalid user');
    }

    const userId = decoded.id;
    res.locals.userId = userId;
    next();
  });
};

export default verifyToken;
