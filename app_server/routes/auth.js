var express = require('express');
var mongoose = require('mongoose');
var Users = mongoose.model('User');
var router = express.Router();

function attachUser(req,res,token,cb){
    Users
        .findById(token)
        .exec(function (err,user) {
           if(err){
               console.log(err);
               cb(err);
           }
           if(!user){
               return false;
           }
            req.user = user;
            cb(null);
            console.log(user,'this is user');
        });
    return true;
}

router.use('*',function (req,res,next) {
    console.log('auth',req.session.accessToken);
   if(req.session.accessToken){
       var cb = function (err) {
           if(!err){
               next();
               return;
           }
           res.status(301);
           res.redirect('/login');
       };
       attachUser(req,res,req.session.accessToken,cb);
   }
   else {
       console.log('redir');
       res.status(301);
       res.render('landing');
   }
});
module.exports = router;