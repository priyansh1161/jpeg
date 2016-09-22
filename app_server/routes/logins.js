var express = require('express');
var fs = require('fs');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
router.get('/',function (req,res) {
    fs.readFile('./views/login.html',function (err,file) {
        if(err)
            res.render('error',{message : 'unable to login',error : err});
        else{
            res.status(200);
            res.send(file.toString());
        }
    });
});
router.post('/',function (req,res,next) {
    if(req.body.username && req.body.password){
       User
           .findOne({name : req.body.username})
           .select('name password salt')
           .exec(function (err,user) {
               console.log(user,'user');
              if(err){
                  next(err);
              }
              if(!user){
                  next(new Error('Invalid userName'));
              }
              else{
                  console.log('dxfgch');
                  var isValidated = user.validatePassword(req.body.password);
                  console.log('cf',isValidated);
                  if(!isValidated){
                      next(new Error('Invalid Password'));
                  }
                  else{
                      console.log('this');
                      req.session.accessToken = user._id;
                      res.redirect('/');
                  }
              }
           });
    }
})
module.exports = router;