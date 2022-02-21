const router = require('express').Router();
const passport = require('passport');
const authController = require('../controller/auth.controller');
const { verify } = require('../middleware/authMiddleware');
/** */
const CLIENT_URL = 'http://localhost:3000';
//
router.get('/login/failed', (req, res) => {
  res.status(401).json({ success: false, message: req.message });
  // res.status(401).json({ success: false, message: 'Failure' });
});
router.get('/login/success', authController.SOCIAL);
router.get('/logout', authController.LOGOUT_GET);

/**GOOGLE */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

/**GITHUB */
router.get('/github', passport.authenticate('github', { scope: ['profile', 'email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

/**FACEBOOK */
router.get('/facebook', passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: CLIENT_URL,
    failureRedirect: '/login/failed',
  })
);

/** */
router.post('/login', authController.LOGIN_POST);
router.post('/signup', authController.SIGNUP_POST);
router.get('/activate/:hash', authController.ACTIVATE_USER);
router.post('/refreshToken', authController.REFRESH_TOKEN_POST);
router.get('/test', (req, res) => {
  res.redirect('http://localhost:3000/auth/login');
});
module.exports = router;
