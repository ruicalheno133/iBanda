var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var JWTstrategy = require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt
var encryptPassword = require('encrypt-password')
var UserController = require('../controllers/userController')

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
  

// Registo de utilizadores
/*
passport.use('registo', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
        UserController.addUser()
                      .then(user => {
                        return done(null, user)
                      })
                      .catch(erro => {
                        return done(erro)
                      })
}))
*/

/* Autenticação de Login */
passport.use('login', new LocalStrategy({
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


var extractFromSession = function(req){
    var token = null
    if(req && req.session) token = req.session.token
    return token
}

passport.use('jwt-admin', new JWTstrategy({
    secretOrKey: 'pri2018',
    jwtFromRequest: ExtractJWT.fromExtractors([extractFromSession])
}, (token, done) => {
    try{
      if(token.user.tipo == "Admin") return done(null, token.user)
      else return done(null, null)
    }
    catch(erro){
        return done(erro)
    }
}))

passport.use('jwt-musico', new JWTstrategy({
  secretOrKey: 'pri2018',
  jwtFromRequest: ExtractJWT.fromExtractors([extractFromSession])
}, (token, done) => {
  try{
      if(token.user.tipo == "Músico") return done(null, token.user)
      else return done(null, null)
  }
  catch(erro){
      return done(erro)
  }
}))

passport.use('jwt-produtor', new JWTstrategy({
  secretOrKey: 'pri2018',
  jwtFromRequest: ExtractJWT.fromExtractors([extractFromSession])
}, (token, done) => {
  try{
      if(token.user.tipo == "Produtor") return done(null, token.user)
      else return done(null, null)
  }
  catch(erro){
      return done(erro)
  }
}))

/*

passport.use('jwt-api-all', new JWTstrategy({
  secretOrKey: 'pri2018',
  jwtFromRequest: ExtractJWT.fromUrlQueryParameter('api-key')
}, (token, done) => {
  try{
      return done(null, token.user)
  }
  catch(erro){
      return done(erro)
  }
}))

passport.use('jwt-api-admin', new JWTstrategy({
  secretOrKey: 'pri2018',
  jwtFromRequest: ExtractJWT.fromUrlQueryParameter('api-key')
}, (token, done) => {
  try{
    if(token.user.tipo == "Admin") return done(null, token.user)
    else return done(null, null)
  }
  catch(erro){
      return done(erro)
  }
}))

*/
