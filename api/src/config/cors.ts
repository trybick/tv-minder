import { NextFunction, Request, Response } from 'express';

export const configureCors = (req: Request, res: Response, next: NextFunction) => {
  // Consider replacing '*' with domain name once deployed
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Max-Age', '86400');

  next();
};
