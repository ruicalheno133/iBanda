var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* GET home page. */
router.get('/logout', function(req, res) {
  req.logout()
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

/* GET home page. */

router.post('/processLogin', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {     
      try {
          if(err || !user){
              res.redirect('/')
          }
          req.login(user, { session : false }, (error) => {
              if( error ) return next(error)
              var token = jwt.sign({ user : user },'pri2018');
              req.session.token = token
              if (user.tipo == "Músico") res.redirect('/musico')
              else if (user.tipo == "Produtor") res.redirect('/produtor')
              else res.redirect('/admin')
          });     
      } 
      catch (error) {
          return next(error);
      }
  })(req, res, next);
});

/* GET admin page. */
router.get('/admin', passport.authenticate('jwt-admin'), (req,res) => {
  res.render("admin/admin_layout");
});

/*GET musico page. */
router.get('/musico', passport.authenticate('jwt-musico'), (req,res) => {
  res.render("musico_layout");
})

/*GET produtor page. */
router.get('/produtor',passport.authenticate('jwt-produtor'), (req,res) => {
  res.render("produtor/produtor_layout", {id: req.user._id});
})

module.exports = router;
