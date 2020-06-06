import { NextFunction, Request, Response } from 'express';

const allowedOrigins = ['http://localhost:4000', 'https://tv-minder.com'];

export const configureCors = (req: Request, res: Response, next: NextFunction) => {
  const { origin } = req.headers;

  if (origin && allowedOrigins.includes(origin as string)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Max-Age', '86400');

  next();
};
