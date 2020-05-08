import { Request, Response } from 'express';
import User from 'models/user';

export const createFollow = async (req: Request, res: Response) => {
  const requestingUserId = res.locals.userId;

  User.findOneAndUpdate(
    { _id: requestingUserId },
    { $push: { followedShows: req.body.externalId } },
    (err, user) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        res.status(201).json({ message: 'Follow added.' });
      }
    }
  );
};

export const getFollows = async (req: Request, res: Response) => {
  const requestingUserId = res.locals.userId;

  User.findOne({ _id: requestingUserId })
    .exec((err, user) => {
      if (user && !err) {
        res.status(200).json(user.followedShows);
      } else {
        return res.status(500).json({
          error: err,
        });
      }
    });
};

export const deleteFollow = async (req: Request, res: Response) => {
  const requestingUserId = res.locals.userId;

  User.findOneAndUpdate(
    { _id: requestingUserId },
    { $pull: { followedShows: req.body.externalId } },
    (err, user) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        res.status(200).json({ message: 'Follow removed.' });
      }
    }
  );
};
