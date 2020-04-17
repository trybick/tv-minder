import { Request, Response } from 'express';
import Album, { AlbumDoc }from 'models/album';

export const getAllAlbums = async (req: Request, res: Response) => {
  await Album.find()
    .then((albums) => {
      res.json(albums);
    })
    .catch((err: Error) => {
      res.status(500).json({ message: err.message });
    });
};

export const getAlbum = (req: Request, res: Response) => {
  // @ts-ignore
  res.json(res.album);
};

export const createAlbum = async (req: Request, res: Response) => {
  const album = new Album({
    name: req.body.name,
    artist: req.body.artist,
    notes: req.body.notes,
  });

  await album
    .save()
    .then((album) => {
      res.status(201).json(album);
    })
    .catch((err: Error) => {
      res.status(400).json({ message: err.message });
    });
};

export const updateAlbum = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedAlbum: Partial<AlbumDoc> = {
    name: req.body.name,
    artist: req.body.artist,
  };

  Album.findOneAndUpdate({ _id: id }, { $set: updatedAlbum }, (err: Error) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }
    res.status(200).json({ message: 'Product updated' });
  });
};

export const deleteAlbum = async (req: Request, res: Response) => {
  // @ts-ignore
  await res.album
    .remove()
    .then(() => {
      res.json({ message: 'Deleted Album' });
    })
    .catch((err: Error) => {
      res.status(500).json({ message: err.message });
    });
};
