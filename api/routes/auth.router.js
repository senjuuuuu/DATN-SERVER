const router = require('express').Router();
const passport = require('passport');
const authCtrl = require('../controller/auth.controller');
const authMid = require('../middleware/authMiddleware');
/** */
const CLIENT_URL = 'http://localhost:3000';
//
router.get('/login/failed', (req, res) => {
  res.status(401).json({ success: false, message: req.message });
  // res.status(401).json({ success: false, message: 'Failure' });
});
router.get('/login/success', authCtrl.SOCIAL);
router.get('/logout', authCtrl.LOGOUT_GET);

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
router.post('/login', authCtrl.LOGIN_POST);
router.post('/signup', authCtrl.SIGNUP_POST);
router.get('/activate/:hash', authCtrl.ACTIVATE_USER);
router.post('/refreshToken', authCtrl.REFRESH_TOKEN_POST);
/** */
router.post('/changePassword', authMid.verify, authCtrl.CHANGE_PASSWORD_POST);
router.post('/forgetPassword', authCtrl.FORGET_PASSWORD_POST);
module.exports = router;
