var mongoose = require('mongoose');
var Cards = mongoose.model('Card');

function sendJsonResponse(status,res,obj){
    obj = obj || {};
    res.status(status);
    res.send(obj);
}
function createReview(data,res,review){
    data.comments.push({
        by : review.user,
        comment : review.comment
    });
    data.save(function(err,card){
        if(err)
            sendJsonResponse(500,res,err);
        else
            sendJsonResponse(201,res,card);
    })
}
function likesLogic(req,res,type){
    var id = req.params.cardId;
    if(id){
        Cards
            .findById(id)
            .select('likes')
            .exec(function(err,data){
                if(err) {
                    sendJsonResponse(500, res, err);
                    return;
                }
                if(type=='-'){
                    if(data.likes)
                        data.likes--;
                }
                else{
                    data.likes++;
                }
                data.save(function (err,card) {
                    if(err){
                        sendJsonResponse(500, res, err);
                        return;
                    }
                    sendJsonResponse(200,res,{likes : card.likes});
                })
            });
    } else{
        sendJsonResponse(404,res,{err : 'cardId required'});
    }
}
var ctrl = {likes:{}};
ctrl.createReview = function (req,res) {

    var id = req.params.cardId;
    console.log(id);
    if(id){
        Cards
            .findById(id)
            .exec(function (err,data) {
                if(!data){
                    sendJsonResponse(404,res,{err:'cardId is invalid'});
                }
                if(err){
                    sendJsonResponse(500,res,err);
                }
                else{
                    console.log(data);
                    console.log(req.body);
                    createReview(data,res,req.body);
                }
            })
    } else {
        sendJsonResponse(404,res,{err : 'cardId required '});
    }
}
ctrl.deleteReview = function (req,res) {
        var id = req.params.cardId;
        var reviewId = req.params.reviewId;
        if(id&&reviewId){
            Cards
                .findById(id)
                .select('comments likes')
                .exec(function (err,data) {
                    if(err){
                        sendJsonResponse(500,res,err);
                    }
                    if(!data){
                        sendJsonResponse(404,res,{err:'cardId is invalid'});
                    }
                    else{
                        data.comments.id(reviewId).remove();
                        data.save(function (err,data) {
                           if(err)
                               sendJsonResponse(500,res,err);
                            else
                                sendJsonResponse(200,res,null);
                        });
                    }
                })
        } else {
            sendJsonResponse(404,res,{err : 'cardId and reviewId required'});
        }
}

ctrl.getReviews = function (req,res) {
    var id = req.params.cardId;
    if(id){
        Cards
            .findById(id)
            .select('comments likes')
            .exec(function (err,data) {
                if(err){
                    sendJsonResponse(500,res,err);
                }
                if(!data){
                    sendJsonResponse(404,res,{err:'cardId is invalid'});
                }
                else{
                    sendJsonResponse(200,res,data);
                }
            })
    } else {
        sendJsonResponse(404,res,{err : 'cardId and reviewId required'});
    }
}
ctrl.getOneReview = function (req,res) {
}
ctrl.likes.addLikes = function (req,res) {
   likesLogic(req,res,'+');
}
ctrl.likes.dislike = function (req,res) {
    likesLogic(req,res,'-');
};
module.exports = ctrl;
