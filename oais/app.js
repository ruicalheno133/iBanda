var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('express-flash-messages')

var indexRouter = require('./routes/index');
var adminUsersRouter = require('./routes/admin/users');
var adminEventsRouter = require('./routes/admin/events');
var usersAPIRouter = require('./routes/api/users')
var eventsAPIRouter = require('./routes/api/events')
var obrasAPIRouter = require('./routes/api/obras')
var UserController = require('./controllers/userController')
var musicoEventsRouter = require('./routes/musico/events');
var usersAPIRouter = require('./routes/api/users');
var musicoObrasRouter = require('./routes/musico/obras')
var produtorEventsRouter = require('./routes/produtor/events')
var produtorObrasRouter = require('./routes/produtor/obras')
var produtorPerfilRouter = require('./routes/produtor/perfil')

require('./authentication/auth')

var app = express();

app.use(flash())


// Middleware da Sessão
app.use(session({
  genid: req => {
    return uuid()
  },
  store: new FileStore(), // para guardar a sessão na parte do servidor quando este vai abaixo
  secret: 'ibanda',
  resave: false,
  saveUninitialized: true
}))

// connect to mongoDB 
mongoose.connect('mongodb://127.0.0.1:27017/ibanda', {useNewUrlParser: true})
        .then(()=> {console.log('Mongo: Conexão efetuada (status: ' + mongoose.connection.readyState + ')')})
        .catch(()=> {console.log('Mongo: Erro na conexão')})


app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/users',  passport.authenticate('jwt-admin', {session: false}), adminUsersRouter);
app.use('/admin/events',passport.authenticate('jwt-admin', {session: false}), adminEventsRouter);
app.use('/api/users',usersAPIRouter);
app.use('/api/events',eventsAPIRouter);
app.use('/api/obras',obrasAPIRouter);
app.use('/musico/events',passport.authenticate('jwt-musico', {session: false}), musicoEventsRouter);
app.use('/musico/obras', passport.authenticate('jwt-musico', {session: false}), musicoObrasRouter);
app.use('/produtor/events', passport.authenticate('jwt-produtor', {session: false}), produtorEventsRouter);
app.use('/produtor/obras',passport.authenticate('jwt-produtor', {session: false}), produtorObrasRouter);
app.use('/produtor/perfil',passport.authenticate('jwt-produtor', {session: false}), produtorPerfilRouter);


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
