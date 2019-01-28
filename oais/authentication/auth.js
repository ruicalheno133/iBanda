var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var JWTstrategy = require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt
var UserController = require('../controllers/userController')

/*
// Serialização do utilizador (Codificação)
passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  
  // Deserialização do utilizador (Desodificação)
  passport.deserializeUser((uid, done) => {
    UserController.getUserById(uid)
                  .then(user => done(null, user))
                  .catch(erro => done(erro, false))
  })
  
*/
/* Registo de utilizadores */

passport.use('registo', new LocalStrategy({
    passReqToCallback: true
}, (req, done) => {
  /* Gets form data from request body  */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      /* Adds user to Database */
      UserController.getUser(fields.email)
                    .then(user => {
                      if(!user) {
                        UserController.addUser(fields)
                        return done(null, fields);
                      } else {
                        return done(user, null);
                      }
                    })
                    .catch(erro => {
                      return done(erro, null);
                    })

    } else {
      return done(err, null);
    }
  })
}))

/* Autenticação de Login */
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    (email, password, done) => {
      UserController.getUserByEmail(email)
                    .then(async user => {
                      if (!user) {
                        return done(null, null, {message: 'Utilizador inexistente!'})
                      }
                      var validate = await user.isValidPassword(password);
                      if (!validate) {
                        return done(null, null, {message: 'Password inválida!'})
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
      if(token.user.tipo === "Admin") return done(null, token.user)
      else return done(null, false)
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
      if(token.user.tipo === "Músico") return done(null, token.user)
      else return done(null, false)
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
      if(token.user.tipo === "Produtor") return done(null, token.user)
      else return done(null, false)
  }
  catch(erro){
      return done(erro)
  }
}))

passport.use('jwt-api-all', new JWTstrategy({
  secretOrKey: 'pri2018',
  jwtFromRequest: ExtractJWT.fromExtractors([extractFromSession, ExtractJWT.fromUrlQueryParameter('api-key')])
}, (token, done) => {
  try{
      return done(null, token.user)
  }
  catch(erro){
      return done(erro)
  }
}))

/*
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
