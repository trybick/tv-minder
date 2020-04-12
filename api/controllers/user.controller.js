const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const registerUser = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email already registered'
        });
      }
    })
    .then(() => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        const newUser = new User({
          email: req.body.email,
          password: hash
        });
        newUser
          .save()
          .then(() => {
            res.status(201).json({
              message: 'User created'
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
      });
    });
};

const loginUser = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed on user verify'
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (!result || err) {
          return res.status(401).json({
            message: 'Auth failed on password validation'
          });
        }
        const token = jwt.sign({ email: user.email }, env.JWT_KEY, {
          expiresIn: '5d'
        });

        return res.status(200).json({
          message: 'Auth successful',
          token
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

module.exports = {
  registerUser,
  loginUser
};
