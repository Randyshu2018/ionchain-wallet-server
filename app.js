var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var config = require('./config/config');
var indexRouter = require('./routes/index');
var Tasks = require('./routes/Tasks');
var WalletUser = require('./routes/walletUser');
var WalletSms = require('./routes/walletSms');


var signature = require('./models/SignatureVerfy');

var app = express();

app.all('/*', function(request, response, next){
  if(config.signatureFlag){
      signature.verify(request, response, next);
  } else {
      next();
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', WalletUser);
app.use('/tasks',Tasks);
app.use('/sms',WalletSms);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
