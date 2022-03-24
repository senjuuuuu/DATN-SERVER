const router = require('express').Router();
const pinCtrl = require('../controller/pin.controller');
const { image } = require('../config/multer');
const authMid = require('../middleware/authMiddleware');
//
router.post('/create', authMid.verify, image.single('file'), pinCtrl.CREATE_PIN_POST);
router.put('/edit', authMid.verify, pinCtrl.EDIT_PIN_PUT);
router.delete('/delete', authMid.verify, pinCtrl.DELETE_PIN_DELETE);
//
router.get('/hidden', authMid.verify, pinCtrl.HIDDEN_PIN_POST);
router.get('/home', authMid.verify, pinCtrl.HOME_OR_SEARCH_PIN_POST);
router.get('/following', authMid.verify, pinCtrl.FOLLOWING_OR_SEARCH_PIN_POST);
router.get('/:pinId', authMid.verify, pinCtrl.GET_DETAILS_PIN_GET);
router.get('/', authMid.verify, pinCtrl.GET_PIN_BY_USER_GET);

module.exports = router;
