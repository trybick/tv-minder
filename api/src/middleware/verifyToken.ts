import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import envConfig from 'config/env';

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const providedToken = req.body.token || req.query.token;
  const { JWT_KEY = '' } = envConfig;

  jwt.verify(
    providedToken,
    JWT_KEY,
    (err: JsonWebTokenError | NotBeforeError | TokenExpiredError | null, decodedData: any) => {
      if (decodedData && !err) {
        res.locals.userId = decodedData.id;
        next();
      } else {
        res.status(401).json({ message: 'Check auth failed' });
        return next('Invalid user');
      }
    }
  );
}

export default verifyToken;
