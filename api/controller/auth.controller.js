const jwtConfig = require('../config/jwt');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require('../config/mailer');
const User = require('../model/User.model');
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {};
  //incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'that email is not registered';
  }
  //incorrect email
  if (err.message === 'incorrect password') {
    errors.password = 'that password incorrect';
  }
  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }
  if (err.name === 'ValidationError') {
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }
  return errors;
};
let refreshTokens = [];
module.exports.REFRESH_TOKEN_POST = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json('You are not authenticated!');
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json('Refresh token is not valid!');
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, decodedToken) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = jwtConfig.generateAccessToken(decodedToken.id);
    const newRefreshToken = jwtConfig.generateRefreshToken(decodedToken.id);
    refreshTokens.push(newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};
module.exports.LOGIN_POST = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    if (user.isActive) {
      const accessToken = jwtConfig.generateAccessToken(user._id);
      const refreshToken = jwtConfig.generateRefreshToken(user._id);
      refreshTokens.push(refreshToken);
      res.status(200).json({ id: user._id, accessToken, refreshToken });
    } else {
      await sendConfirmationEmail(user);
      res.status(401).json({ hash: user._id, message: 'Please check email and confirm!' });
    }
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};
module.exports.SIGNUP_POST = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.status(400).json({ success: 'false', message: 'Confirm password not correct!' });
  }
  try {
    const newUser = await User.create({ name, email, password });
    await sendConfirmationEmail(newUser);
    res.status(200).json({ message: 'Please check email and confirm!' });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error });
  }
};
module.exports.LOGOUT_GET = async (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.cookie('session', '', { maxAge: 1 });
  req.logOut();
  res.status(200).json('You logged out successfully.');
};
module.exports.ACTIVATE_USER = async (req, res, next) => {
  const { hash } = req.params;
  // console.log(hash);
  try {
    const user = await User.findByIdAndUpdate({ _id: hash, isActive: false }, { isActive: true });
    // const accessToken = jwtConfig.generateAccessToken(user._id);
    // const refreshToken = jwtConfig.generateRefreshToken(user._id);
    // refreshTokens.push(refreshToken);
    res.redirect('http://localhost:3000/email/confirm-success');
  } catch {
    console.log('failed');
    res.status(402).json({ message: 'User cannot be activated!' });
  }
};
//social
module.exports.SOCIAL = async (req, res) => {
  if (req.user) {
    const id = req.user;
    const accessToken = jwtConfig.generateAccessToken(id);
    const refreshToken = jwtConfig.generateRefreshToken(id);
    refreshTokens.push(refreshToken);
    res.status(200).json({ id: id, accessToken, refreshToken });
  }
};
