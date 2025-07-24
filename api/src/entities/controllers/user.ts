import { Request, Response } from 'express';
import User from 'models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import envConfig from 'config/env';
import { emailRegex, TOKEN_LIFESPAN_MINS } from 'utils/constants';
import { JWTData } from 'middleware/verifyToken';

export const registerUser = async (req: Request, res: Response) => {
  try {
    if (req.body.isGoogleUser) {
      const existingUsers = await User.find({ email: req.body.email });

      if (!existingUsers.length) {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          email: req.body.email,
          password: hash,
          followedShows: req.body.unregisteredFollowedShows || [],
        });
        await newUser.save();
        res.status(201).json({
          message: 'Google user stored to database',
        });
      } else {
        res.status(202).json({
          message: 'Google user is already registered in database',
        });
      }
    } else {
      const existingUsers = await User.find({ email: req.body.email });

      if (existingUsers.length) {
        return res.status(409).json({
          message: 'Email already registered',
        });
      }

      if (!emailRegex.test(req.body.email)) {
        return res.status(422).json({
          message: 'Email invalid',
        });
      }

      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        email: req.body.email,
        password: hash,
        followedShows: req.body.unregisteredFollowedShows || [],
      });
      await newUser.save();
      res.status(201).json({
        message: 'User created',
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: 'Auth failed on user verify',
      });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Auth failed on password validation',
      });
    }

    const tokenData: Pick<JWTData, 'email' | 'id'> = {
      email: user.email,
      id: user._id as mongoose.Types.ObjectId,
    };
    const token =
      envConfig?.JWT_KEY &&
      jwt.sign(tokenData, envConfig.JWT_KEY, {
        expiresIn: '300d',
      });

    if (!token) {
      return res.status(500).json({
        error: 'Failed to create token',
      });
    }

    return res.status(200).json({
      message: 'Auth successful',
      token,
      email: user.email,
      isGoogleUser: req.body?.isGoogleUser,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const requestOneTimeCode = async (req: Request, res: Response) => {
  try {
    const min = 100000;
    const max = 999999;
    const generatedCode = min + Math.floor(Math.random() * (max - min));

    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { oneTimeCode: generatedCode }
    );

    if (!user) {
      return res.status(404).json({
        message: 'Email is not registered',
      });
    }

    const client = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: envConfig.SENDGRID_KEY,
      },
    });

    const mailOptions = {
      from: 'admin@em792.timr.dev',
      to: user.email,
      subject: 'TV Minder: One-time code',
      text: 'Your one-time code is: ' + generatedCode.toString(),
    };

    await client.sendMail(mailOptions);
    res.status(200).json({ message: 'One-time code sent' });
  } catch (error) {
    console.log('Error in requestOneTimeCode: ', error);
    return res.status(500).json({ error });
  }
};

export const verifyOneTimeCode = async (req: Request, res: Response) => {
  try {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - TOKEN_LIFESPAN_MINS);

    const user = await User.findOne({
      email: req.body.email,
      oneTimeCode: req.body.oneTimeCode,
      updatedAt: { $gte: timestamp },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid One Time Code',
      });
    }

    res.status(200).json({
      message: 'One Time Code Verified',
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const changePasswordForReset = async (req: Request, res: Response) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { password: hash, oneTimeCode: undefined }
    );

    if (!user) {
      return res.status(400).json({
        message: 'Invalid Email',
      });
    }

    res.status(200).json({
      message: 'Password Changed',
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const changePasswordForSettings = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: 'Email does not exist',
      });
    }

    const isOldPasswordValid = await bcrypt.compare(req.body.oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        message: 'Failed on password validation',
      });
    }

    const hash = await bcrypt.hash(req.body.newPassword, 10);

    await User.findOneAndUpdate({ email: req.body.email }, { password: hash });

    return res.status(200).json({
      message: 'Password changed',
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
