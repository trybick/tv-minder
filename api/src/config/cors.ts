import { NextFunction, Request, Response } from 'express';

export const configureCors = (req: Request, res: Response, next: NextFunction) => {
  // Replace '*' with domain name once deployed
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};
