const jwt = require('jsonwebtoken');
const env = require('../config/env');

const checkToken = (req, res, next) => {
  const decoded = jwt.verify(req.body.token, env.JWT_KEY, function(err, decoded) {
    if (!decoded | err) {
      return res.status(res.status(401).json({ message: 'Check auth failed' }));
    }
  });
  req.userData = decoded;
  next();
};

module.exports = checkToken;
