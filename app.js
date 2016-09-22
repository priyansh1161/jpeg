var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var sessions = require('client-sessions');
var bodyParser = require('body-parser');
;
require('./app_api/models/db');

var auth = require('./app_server/routes/auth');
var login = require('./app_server/routes/logins');
var signup = require('./app_server/routes/signup');
var routes = require('./app_server/routes/index');
var api = require('./app_api/routes/main');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessions({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'dsfdfdfdfdfdfdaaszzzxefkmmflll', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api',api);
app.use('/login',login);
app.use('/signup',signup);
// app.use('*',auth);
app.use('/', auth,routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
