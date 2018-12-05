var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var encryptPassword = require('encrypt-password')
var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash')

var indexRouter = require('./routes/index');
var adminUsersRouter = require('./routes/admin/users');
var adminEventsRouter = require('./routes/admin/events');
var usersAPIRouter = require('./routes/api/users')
var eventsAPIRouter = require('./routes/api/events')

var UserController = require('./controllers/userController')

var app = express();

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

// Estratégia de autenticação 
passport.use(new LocalStrategy({
  usernameField: 'email'
  },
  (email, password, done) => {
    UserController.getUser(email)
                  .then(user => {
                    if (!user) {
                      return done(null, false, {message: 'Utilizador inexistente!'})
                    }
                    var passwordEncrypted = encryptPassword(password, 'signatrue')
                    if (passwordEncrypted != user.password) {
                      return done(null, false, {message: 'Password inválida!'})
                    }
                    return done(null, user)
                  })
                  .catch(erro => done(erro))
}))

// Serialização do utilizador (Codificação)
passport.serializeUser((user, done) => {
  done(null, user._id)
})

// Deserialização do utilizador (Codificação)
passport.deserializeUser((uid, done) => {
  UserController.getUserById(uid)
                .then(user => done(null, user))
                .catch(erro => done(erro, false))
})



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
app.use('/admin/users', adminUsersRouter);
app.use('/admin/events', adminEventsRouter);
app.use('/api/users', usersAPIRouter);
app.use('/api/events', eventsAPIRouter);


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
