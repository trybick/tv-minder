import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import envConfig from 'config/env';

export default function (req: Request, res: Response, next: NextFunction) {
  const decoded = jwt.verify(req.body.token, envConfig.JWT_KEY, function (
    err: Error,
    decoded: any
  ) {
    if (!decoded || err) {
      // @ts-ignore
      return res.status(res.status(401).json({ message: 'Check auth failed' }));
    }
  });
  // @ts-ignore
  req.userData = decoded;
  next();
}
