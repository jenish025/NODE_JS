const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token)
    return res.status(401).send({ error: 'Access denied. No token provided' });

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ error: 'Invalid token' });
  }
};
