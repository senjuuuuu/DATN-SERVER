const router = require('express').Router();
const userCtrl = require('../controller/user.controller');
const authMid = require('../middleware/authMiddleware');
const { image } = require('../config/multer');
//follow user
router.post('/follow', userCtrl.FOLLOW_POST);
router.post('/unFollow', userCtrl.UN_FOLLOW_POST);
router.get('/following', userCtrl.FIND_FOLLOWING_USER_GET);
router.get('/follower', userCtrl.FIND_FOLLOWER_USER_GET);
//block user
router.post('/block', userCtrl.BLOCK_POST);
router.post('/unBlock', userCtrl.UN_BLOCK_POST);
router.get('/blocking', userCtrl.FIND_BLOCKING_USER_GET);
//
router.post('/search', userCtrl.SEARCH_USER_POST);
router.get('/:id', authMid.verify, userCtrl.DETAILS_USER_GET);
router.put('/edit', image.single('avatar'), userCtrl.EDIT_USER_PUT);

module.exports = router;
