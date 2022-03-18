const router = require('express').Router();
const conversationCtrl = require('../controller/conversation.controller');
const authMid = require('../middleware/authMiddleware');
router.post('/create', authMid.verify, conversationCtrl.CREATE_CONVERSATION_POST);
router.put('/delete', authMid.verify, conversationCtrl.DELETE_CONVERSATION_POST);
router.get('/', authMid.verify, conversationCtrl.GET_CONVERSATION_BY_USER_GET);

module.exports = router;
