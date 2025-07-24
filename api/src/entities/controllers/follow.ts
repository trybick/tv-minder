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

  try {
    await User.findOneAndUpdate({ _id: userId }, { $addToSet: { followedShows: showId } });
    res.status(201).json({ message: 'Follow added.' });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

export const deleteFollow = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const showId: number = req.body.showId;

  if (!userId || !showId) {
    return res.status(422).json({
      error: 'Incorrect parameters',
    });
  }

  try {
    await User.findOneAndUpdate({ _id: userId }, { $pull: { followedShows: showId } });
    res.status(200).json({ message: 'Follow removed.' });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

export const getFollows = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json(user.followedShows);
    } else {
      return res.status(404).json({
        error: 'User not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
