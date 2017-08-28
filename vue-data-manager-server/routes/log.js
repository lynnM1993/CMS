var express = require('express');
var router = express.Router();
var dataCtrl = require('../controllers/log.controller'); // 引入控制器

router.delete('/:id', dataCtrl.remove);
router.put('/data/:id', dataCtrl.update);
router.post('/data', dataCtrl.create);
router.post('/removes', dataCtrl.removes);
router.post('/list', dataCtrl.list);

module.exports = router;