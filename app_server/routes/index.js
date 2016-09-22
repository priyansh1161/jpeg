var express = require('express');
var indexCtrl = require('../controllers/index');
var router = express.Router();
//index
router.get('/',indexCtrl.getHome);
router.get('/new',function (req,res) {
   res.sendFile('/views/new.html',{root : '.'});
});
router.get('/likes/:cardId',indexCtrl.toggleLikes);

module.exports = router;