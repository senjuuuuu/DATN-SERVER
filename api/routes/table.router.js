const router = require('express').Router();
const tableCtrl = require('../controller/table.controller');
const authMid = require('../middleware/authMiddleware');
router.post('/create', authMid.verify, tableCtrl.CREATE_TABLE_POST);
router.put('/edit', authMid.verify, tableCtrl.EDIT_TABLE_PUT);
router.delete('/delete', authMid.verify, tableCtrl.DELETE_TABLE_DELETE);
router.get('/save', authMid.verify, tableCtrl.SAVE_PIN_POST);
router.get('/unSave', authMid.verify, tableCtrl.UN_SAVE_PIN_POST);
router.get('/user=:user', authMid.verify, tableCtrl.GET_ALL_TABLE_BY_USER_GET);
router.get('/:tableId', authMid.verify, tableCtrl.GET_DETAILS_TABLE_POST);
router.post('/search', authMid.verify, tableCtrl.FIND_TABLE_POST);

module.exports = router;
