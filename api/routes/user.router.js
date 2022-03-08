const router = require('express').Router();
const userCtrl = require('../controller/user.controller');
//follow user
router.post('/follow', userCtrl.FOLLOW_POST);
router.post('/unFollow', userCtrl.UN_FOLLOW_POST);
router.get('/following', userCtrl.FIND_FOLLOWING_USER_GET);
router.get('/follower', userCtrl.FIND_FOLLOWER_USER_GET);
//block user
router.post('/block', userCtrl.BLOCK_POST);
router.post('/unBlock', userCtrl.UN_BLOCK_POST);
router.get('/blocking', userCtrl.FIND_BLOCKING_USER_GET);

module.exports = router;
