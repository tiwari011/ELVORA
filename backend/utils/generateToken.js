const jwt = require('jsonwebtoken');

module.exports = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};