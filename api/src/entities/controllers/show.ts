import { Request, Response } from 'express';
import Show, { ShowDoc } from 'models/show';

export const getAllShows = async (req: Request, res: Response) => {
  await Show.find()
    .then((shows) => {
      res.json(shows);
    })
    .catch((err: Error) => {
      res.status(500).json({ message: err.message });
    });
};

export const getShow = (req: Request, res: Response) => {
  res.json(res.locals.show);
};

export const createShow = async (req: Request, res: Response) => {
  const show = new Show({
    name: req.body.name,
    externalId: req.body.externalId,
  });

  await show
    .save()
    .then((show) => {
      res.status(201).json(show);
    })
    .catch((err: Error) => {
      res.status(400).json({ message: err.message });
    });
};

export const updateShow = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedShow: Partial<ShowDoc> = {
    name: req.body.name,
  };

  Show.findOneAndUpdate({ _id: id }, { $set: updatedShow }, (err: Error) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }
    res.status(200).json({ message: 'Product updated' });
  });
};

export const deleteShow = async (req: Request, res: Response) => {
  await res.locals.show
    .remove()
    .then(() => {
      res.json({ message: 'Deleted Show' });
    })
    .catch((err: Error) => {
      res.status(500).json({ message: err.message });
    });
};
