const router = require('express').Router();
const messageCtrl = require('../controller/message.controller');
const authMid = require('../middleware/authMiddleware');
router.post('/create', authMid.verify, messageCtrl.CREATE_MESSAGE_GET);
router.get('/', authMid.verify, messageCtrl.GET_MESSAGE_GET);

module.exports = router;
