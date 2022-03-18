const jwt = require('jsonwebtoken');

const authMid = {
  verify: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const accessToken = authHeader.split(' ')[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json('Token is not valid!');
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json('You are not Authenticated!');
    }
  },
  checkUser: async (req, res, next) => {
    if (!user) return res.status(401).json('You are not Authenticated!');
  },
};
module.exports = authMid;
