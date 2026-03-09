import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from 'models/user';
import logger from 'utils/logger';

export const getSettings = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = res.locals.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    const settings = {
      showWelcomeStrip: user.settings?.showWelcomeStrip ?? true,
    };

    return res.status(200).json({ data: settings });
  } catch (error) {
    logger.error('Error getting settings:', error);
    return res.status(500).json({ error: { message: 'Failed to get settings.' } });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  const userId: mongoose.Types.ObjectId = res.locals.userId;

  try {
    const updateFields: Record<string, unknown> = {};

    if (typeof req.body.showWelcomeStrip === 'boolean') {
      updateFields['settings.showWelcomeStrip'] = req.body.showWelcomeStrip;
    }

    await User.findOneAndUpdate({ _id: userId }, { $set: updateFields });

    return res.status(204).send();
  } catch (error) {
    logger.error('Error updating settings:', error);
    return res.status(500).json({ error: { message: 'Failed to update settings.' } });
  }
};
