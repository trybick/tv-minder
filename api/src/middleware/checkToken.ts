import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import envConfig from 'config/env';

export default function (req: Request, res: Response, next: NextFunction) {
  const tokenSource = req.body.token || req.query.token;

  envConfig?.JWT_KEY &&
    jwt.verify(tokenSource, envConfig?.JWT_KEY, function (
      err: JsonWebTokenError | NotBeforeError | TokenExpiredError | null,
      decoded: any
    ) {
      if (!decoded || err) {
        res.status(401).json({ message: 'Check auth failed' });
        return next('Invalid user');
      }

      res.locals.userId = decoded?.id;
    });

  next();
}
