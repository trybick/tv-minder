import { NextFunction, Request, Response } from 'express';
import Album, { AlbumDoc } from 'entities/models/album';

export default async function findOne(req: Request, res: Response, next: NextFunction) {
  let album: AlbumDoc | null;

  try {
    album = await Album.findById(req.params.id);
    if (album === null) {
      return res.status(404).json({ message: 'Cannot find album' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.locals.album = album;
  next();
}
