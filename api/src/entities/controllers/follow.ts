import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from 'models/user';
import logger from 'utils/logger';

export const createFollow = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = res.locals.userId;
  const showId: number = req.body.showId;

  if (!userId || !showId) {
    return res.status(422).json({
      message: 'Incorrect parameters',
    });
  }

  try {
    await User.findOneAndUpdate({ _id: userId }, { $addToSet: { followedShows: showId } });
    res.status(201).json({ message: 'Follow added.' });
  } catch (error) {
    logger.error('Error adding follow:', error);
    return res.status(500).json({
      message: 'Failed to add follow. Please try again.',
    });
  }
};

export const deleteFollow = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = res.locals.userId;
  const showId: number = req.body.showId;

  if (!userId || !showId) {
    return res.status(422).json({
      message: 'Incorrect parameters',
    });
  }

  try {
    await User.findOneAndUpdate({ _id: userId }, { $pull: { followedShows: showId } });
    res.status(200).json({ message: 'Follow removed.' });
  } catch (error) {
    logger.error('Error removing follow:', error);
    return res.status(500).json({
      message: 'Failed to remove follow. Please try again.',
    });
  }
};

export const getFollows = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = res.locals.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json(user.followedShows);
    } else {
      return res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    logger.error('Error getting follows:', error);
    return res.status(500).json({
      message: 'Failed to get follows. Please try again.',
    });
  }
};
