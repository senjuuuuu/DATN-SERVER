const crypto = require('crypto');

const hash = {
  randomPassword: () => {
    return crypto.randomBytes(5).toString('hex');
  },
};

module.exports = hash;
