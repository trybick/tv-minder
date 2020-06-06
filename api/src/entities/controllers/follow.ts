import { Request, Response } from 'express';
import User from 'models/user';

export const createFollow = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const showId: number = req.body.showId;

  if (!userId || !showId) {
    return res.status(422).json({
      error: 'Incorrect parameters',
    });
  }

  User.findOneAndUpdate({ _id: userId }, { $addToSet: { followedShows: showId } }, (err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      res.status(201).json({ message: 'Follow added.' });
    }
  });
};

export const deleteFollow = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const showId: number = req.body.showId;

  if (!userId || !showId) {
    return res.status(422).json({
      error: 'Incorrect parameters',
    });
  }

  User.findOneAndUpdate({ _id: userId }, { $pull: { followedShows: showId } }, (err) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      res.status(200).json({ message: 'Follow removed.' });
    }
  });
};

export const getFollows = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;

  User.findOne({ _id: userId }).exec((err, user) => {
    if (user && !err) {
      res.status(200).json(user.followedShows);
    } else {
      return res.status(500).json({
        error: err,
      });
    }
  });
};
