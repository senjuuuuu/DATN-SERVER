const router = require('express').Router();
const commentCtrl = require('../controller/comment.controller');
const authMid = require('../middleware/authMiddleware');
router.post('/create', authMid.verify, commentCtrl.CREATE_SUB_COMMENT_POST);
router.get('/:commentId', authMid.verify, commentCtrl.GET_SUB_COMMENT_BY_COMMENT_GET);
router.put('/edit', authMid.verify, commentCtrl.UPDATE_SUB_COMMENT_PUT);
router.delete('/delete/:subComMentId', authMid.verify, commentCtrl.DELETE_SUB_COMMENT_PUT);
router.put('/like/:subComMentId', authMid.verify, commentCtrl.LIKE_SUB_COMMENT_PUT);
router.put('/unLike/:subComMentId', authMid.verify, commentCtrl.UN_LIKE_SUB_COMMENT_PUT);

module.exports = router;
