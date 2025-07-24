import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import envConfig from 'config/env';

const { JWT_KEY } = envConfig;

export type JWTData = {
  email: string;
  exp: number;
  iat: number;
  id: mongoose.Types.ObjectId;
};

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const providedToken = req.body?.token || req.query.token;

  if (!providedToken) {
    res.status(401).json({ message: 'Token required' });
    return;
  }

  jwt.verify(
    providedToken,
    JWT_KEY!,
    (err: JsonWebTokenError | NotBeforeError | TokenExpiredError | null, decodedData: any) => {
      const userId = (decodedData as JWTData)?.id;

      if (userId && !err) {
        res.locals.userId = userId;
        next();
      } else {
        res.status(401).json({ message: 'Check auth failed' });
        return next('Invalid user');
      }
    }
  );
}

export default verifyToken;
