import { NextFunction, Request, Response } from 'express';
import Album from 'entities/models/album';

export default async function findOne(req: Request, res: Response, next: NextFunction) {
  let album;
  try {
    album = await Album.findById(req.params.id);
    if (album === null) {
      return res.status(404).json({ message: 'Cannot find album' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // @ts-ignore
  res.album = album;
  next();
}
