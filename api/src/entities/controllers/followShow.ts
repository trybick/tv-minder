import { Request, Response } from 'express';
import User from 'models/user';

export const createFollow = async (req: Request, res: Response) => {
  const requestingUserId = res.locals.userId;
  const showData = { name: req.body.name, externalId: req.body.externalId };

  User.findOneAndUpdate(
    { _id: requestingUserId },
    { $push: { followedShows: showData } },
    (err, user) => {
      if (err) {
        res.status(500).json({
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
    .select('followedShows')
    .exec((err, user) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        res.status(200).json({ message: 'Success', followedShows: user?.followedShows });
      }
    });
};

export const removeFollow = async (req: Request, res: Response) => {
  const requestingUserId = res.locals.userId;
  const showData = { name: req.body.name, externalId: req.body.externalId };

  User.findOneAndUpdate(
    { _id: requestingUserId },
    { $pull: { followedShows: showData } },
    (err, user) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        console.log('user:', user);
        res.status(200).json({ message: 'Follow removed.' });
      }
    }
  );
};
