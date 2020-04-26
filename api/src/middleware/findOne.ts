import { NextFunction, Request, Response } from 'express';
import Show, { ShowDoc } from 'entities/models/show';

export default async function findOne(req: Request, res: Response, next: NextFunction) {
  let show: ShowDoc | null;

  try {
    show = await Show.findById(req.params.id);
    if (show === null) {
      return res.status(404).json({ message: 'Cannot find show' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.locals.show = show;
  next();
}
