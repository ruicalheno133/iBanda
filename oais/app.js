var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var adminUsersRouter = require('./routes/admin/users');
var usersAPIRouter = require('./routes/api/users')

var app = express();

// connect to mongoDB 
mongoose.connect('mongodb://127.0.0.1:27017/ibanda', {useNewUrlParser: true})
        .then(()=> {console.log('Mongo: Conexão efetuada (status: ' + mongoose.connection.readyState + ')')})
        .catch(()=> {console.log('Mongo: Erro na conexão')})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/users', adminUsersRouter);
app.use('/api/users', usersAPIRouter);

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
