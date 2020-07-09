import { Request, Response } from 'express';
import User from 'models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envConfig from 'config/env';
import { emailRegex } from 'utils/constants';
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
        });
      });
    })
    .catch((err: Error) => {
      return res.status(500).json({
        error: err,
      });
    });
};
