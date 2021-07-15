import { Request, Response } from 'express';
import User from 'models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import envConfig from 'config/env';
import { emailRegex, TOKEN_LIFESPAN_MINS } from 'utils/constants';
import { JWTData } from 'middleware/verifyToken';

export const registerUser = (req: Request, res: Response) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({
          message: 'Email already registered',
        });
        throw 'Email already registered';
      }
    })
    .then(() => {
      if (!emailRegex.test(req.body.email)) {
        res.status(422).json({
          message: 'Email invalid',
        });
        throw 'Email invalid';
      }
    })
    .then(() => {
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({ error });
        }
        const newUser = new User({
          email: req.body.email,
          password: hash,
          followedShows: req.body.unregisteredFollowedShows || [],
        });
        newUser.save().then(() => {
          res.status(201).json({
            message: 'User created',
          });
        });
      });
    })
    .catch((error: Error) => {
      return res.status(500).json({ error });
    });
};

export const loginUser = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed on user verify',
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (!result || err) {
          return res.status(401).json({
            message: 'Auth failed on password validation',
          });
        }
        const tokenData: Pick<JWTData, 'email' | 'id'> = { email: user.email, id: user._id };
        const token =
          envConfig?.JWT_KEY &&
          jwt.sign(tokenData, envConfig.JWT_KEY, {
            expiresIn: '300d',
          });

        if (!token) {
          return res.status(500).json({
            error: err,
          });
        }
        return res.status(200).json({
          message: 'Auth successful',
          token,
          email: user.email,
        });
      });
    })
    .catch((err: Error) => {
      return res.status(500).json({
        error: err,
      });
    });
};

export const requestOneTimeCode = (req: Request, res: Response) => {
  const min = 100000;
  const max = 999999;
  const generatedCode = min + Math.floor(Math.random() * (max - min));
  User.findOneAndUpdate({ email: req.body.email }, { oneTimeCode: generatedCode })
    .exec()
    .then((user) => {
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
        from: 'admin@em9332.timr.dev',
        to: user.email,
        subject: 'TV Minder: One-time code',
        text: 'Your one-time code is: ' + generatedCode.toString(),
      };
      client.sendMail(mailOptions, (error) => {
        if (error) {
          console.log('Nodemailer error: ', error);
        } else {
          res.status(200).json({ message: 'One-time code sent' });
        }
      });
    })
    .catch((error: Error) => {
      return res.status(500).json({ error });
    });
};

export const verifyOneTimeCode = (req: Request, res: Response) => {
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - TOKEN_LIFESPAN_MINS);
  User.findOne({
    email: req.body.email,
    oneTimeCode: req.body.oneTimeCode,
    updatedAt: { $gte: timestamp },
  })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message: 'Invalid One Time Code',
        });
      }
      res.status(200).json({
        message: 'One Time Code Verified',
      });
    })
    .catch((error: Error) => {
      return res.status(500).json({ error });
    });
};

export const changePasswordForReset = (req: Request, res: Response) => {
  bcrypt.hash(req.body.password, 10, (error, hash) => {
    if (error) {
      return res.status(500).json({ error });
    }
    User.findOneAndUpdate({ email: req.body.email }, { password: hash, oneTimeCode: undefined })
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            message: 'Invalid Email',
          });
        }
        res.status(200).json({
          message: 'Password Changed',
        });
      })
      .catch((error: Error) => {
        return res.status(500).json({ error });
      });
  });
};

export const changePasswordForSettings = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Email does not exist',
        });
      }
      bcrypt.compare(req.body.oldPassword, user.password, (err, result) => {
        if (!result || err) {
          return res.status(401).json({
            message: 'Failed on password validation',
          });
        }
        bcrypt.hash(req.body.newPassword, 10, (error, hash) => {
          if (error) {
            return res.status(500).json({ error });
          }
          User.findOneAndUpdate({ email: req.body.email }, { password: hash })
            .exec()
            .then(() => {
              return res.status(200).json({
                message: 'Password changed',
              });
            });
        });
      });
    })
    .catch((err: Error) => {
      return res.status(500).json({
        error: err,
      });
    });
};
