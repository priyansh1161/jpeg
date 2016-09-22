var mongoose = require('mongoose');
var Card  = mongoose.model('Card');
var ctrl = {};
function sendJsonResponse(status,res,obj){
    obj = obj || {};
    res.status(status);
    res.send(obj);
}
function updateCard(data,res,newData) {
    if(!newData)
        throw new Error('No data Send to update');
    for(var key in newData){
        if(newData.hasOwnProperty(key))
            data[key] = newData[key];
    }
    data.save(function (err,newCard) {
        if(err)
            throw err;
        else
            sendJsonResponse(201,res,newCard);
    })
}
ctrl.createCard = function (req,res) {
    var body = req.body;
    var userId = mongoose.Types.ObjectId(body._id);
    console.log(req.body);
    Card.create({
        title  : body.title,
        createdBy : userId,
        imgLink : body.imgLink
    },function (err,data) {
        if(err){
            console.log(err);
            sendJsonResponse(500,res,{err :'Failed to Create Card'});
        }
        else{
            sendJsonResponse(200,res,data);
        }
    })
};
ctrl.getCards = function(req,res){
    // this method is slow and i'll change it for better pagination but for now scaling is not a prob. lets use this
    if(req.query.page > 0) {
        var skipPages = 10 * (req.query.page - 1);
        console.log('pages');
        Card
            .find({})
            .skip(skipPages)
            .limit(10)
            .select('-reviews')
            .exec(function (err, data) {
                if (err) {
                    console.log(err);
                    sendJsonResponse(500, res, err);
                    return;
                }
                console.log('this is data',data);
                sendJsonResponse(200, res, data);
            });
    }
    else{
        sendJsonResponse(404,res,{err : 'page value must be greater then 1'});
    }
};

ctrl.updateCard = function (req,res) {
    var id = req.params.cardId;
    if(id){
        Card
            .findById(id)
            .exec(function (err,data) {
                if(err){
                    console.log(err);
                    sendJsonResponse(500,res,err);
                }
                else{
                    try {
                        updateCard(data,res,req.body);
                    } catch(e){
                        sendJsonResponse(500,res,e);
                    }
                }
            })
    } else {
        sendJsonResponse(404,res,{err : 'Provide an Id to Update'});
    }
};
ctrl.deleteCard = function (req,res) {
    var id = req.params.cardId;
    if(id){
        Card
            .findByIdAndRemove(id,function (err,data) {
                if(err)
                    sendJsonResponse(500,res,err);
                else
                    sendJsonResponse(200,res,null);
            })
    } else{
        sendJsonResponse(404,res,{err : 'Provide an Id to delete Resource'});
    }

}

module.exports = ctrl;