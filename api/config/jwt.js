const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;
module.exports.generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_KEY, {
    expiresIn: maxAge,
  });
};
module.exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_KEY);
};
