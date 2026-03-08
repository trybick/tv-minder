import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from 'models/user';
import logger from 'utils/logger';

export const createTrack = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = res.locals.userId;
  const showId: number = req.body.showId;

  if (!userId || !showId) {
    return res.status(422).json({
      error: { message: 'Incorrect parameters' },
    });
  }

  try {
    await User.findOneAndUpdate({ _id: userId }, { $addToSet: { trackedShows: showId } });
    res.status(204).send();
  } catch (error) {
    logger.error('Error adding track:', error);
    return res.status(500).json({
      error: { message: 'Failed to add track. Please try again.' },
    });
  }
};

export const deleteTrack = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = res.locals.userId;
  const showId = Number(req.params.showId);

  if (!userId || !Number.isFinite(showId)) {
    return res.status(422).json({
      error: { message: 'Incorrect parameters' },
    });
  }

  try {
    await User.findOneAndUpdate({ _id: userId }, { $pull: { trackedShows: showId } });
    res.status(204).send();
  } catch (error) {
    logger.error('Error removing track:', error);
    return res.status(500).json({
      error: { message: 'Failed to remove track. Please try again.' },
    });
  }
};

export const getTracks = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = res.locals.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      const shows = user.trackedShows ?? [];
      res.status(200).json({ data: shows });
    } else {
      return res.status(404).json({
        error: { message: 'User not found' },
      });
    }
  } catch (error) {
    logger.error('Error getting tracks:', error);
    return res.status(500).json({
      error: { message: 'Failed to get tracks. Please try again.' },
    });
  }
};
