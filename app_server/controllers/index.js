var request = require('request');
var config = require('../../config/main');
var mongoose = require('mongoose');
var apiURI = config.dev.apiURI;
if(process.env.NODE_ENV=='production')
    apiURI = config.production.apiURI;

var ctrl = {};


var renderHome = function(req,res,body){
    var user = req.user;
    user.activity.forEach(function (data,i) {
       for(var j=0;j<body.length;j++){
           if(data == body[j]._id){
               body[j].liked = true;
           }
       }
    });
    console.log(body,'updated body');
    res.render('home',{body:body,name: req.user.name});
};
ctrl.toggleLikes = function (req,res,next) {
    //this is not a good way to this i will do it using sets later. for now array will work
    var user = req.user;
    var type = 'like';
    var cardId = req.params.cardId;
    var index = -1;
    //Bullshit way to do this. Sorry for even making this but i am too bored to make changes in previous code
    for(var i=0;i<user.activity.length;i++){
        if(user.activity[i]==cardId){
            type = 'dislike';
            console.log(i);
            index = i;
            break;
        }
    }
    console.log(type);
    if(type!=='dislike')
        user.activity.push(req.params.cardId);
    else{
        user.activity.splice(index,1);
        console.log(user.activity,index);
    }
    user.save(function(err){
        if(err){
            next(err);
        }
        else{
            var url = apiURI + '/' + type + '/' + req.params.cardId ;
            console.log(url);
            var apiOptions = {
                url : url,
                method : 'GET',
                json : {}
            };
            request(apiOptions,function(err,response,body){
                console.log(body,'fxcgvhbnm,');
              if(!err&&response.statusCode==200){
                  res.json(body);
              }
              else{
                  res.json(err);
              }
            });
        }
    })
};
ctrl.getHome = function (req,res,next) {
    var apiOptions = {
        url  : apiURI,
        method : 'GET',
        json : {},
        qs : {
            page : 1
        }
    };
    request(apiOptions,function (err,response,body) {
        if(err)
            next(err);
        console.log(body,'this is body');
        if(response.statusCode!=200) {
            console.log(response.statusCode,body);
        }
        else{
            renderHome(req,res,body);
        }
    })
};

module.exports = ctrl;