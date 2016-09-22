var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
router.get('/',function (req,res) {
    res.render('signup');
});
router.post('/',function (req,res,next) {
   if(req.body.username && req.body.password){
       var user = new User();
       user.name = req.body.username;
       user.setPassword(req.body.password,function () {
           user.save(function (err,savedUser) {
               if(err){
                   console.log(err);
                   next(err);
               }
               else{
                   req.session.accessToken = savedUser._id;
                   res.redirect('/');
               }

           });
       });

   }
});
module.exports = router;