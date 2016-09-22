var express = require('express');
var router = express.Router();
var cardCtrl = require('../controllers/cards');
var reviewCtrl = require('../controllers/reviews');
// card routers
router.get('/',cardCtrl.getCards);
router.put('/:cardId',cardCtrl.updateCard);
router.delete('/:cardId',cardCtrl.deleteCard);
router.post('/',cardCtrl.createCard);
//review routers
router.get('/review/:cardId',reviewCtrl.getReviews);
router.get('/review/:cardId/one/:reviewId',reviewCtrl.getOneReview);
router.post('/review/:cardId',reviewCtrl.createReview);
router.delete('/review/:cardId/one/:reviewId',reviewCtrl.deleteReview);
//likes
router.get('/like/:cardId',reviewCtrl.likes.addLikes);
router.get('/dislike/:cardId',reviewCtrl.likes.dislike);
module.exports = router;