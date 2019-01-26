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
    res.clearCookie('my.connection.sid');
    res.redirect('/');
  });
});

/* GET home page. */

router.post('/processLogin', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => { 
          if(!user){
            return res.redirect('/')
          } 
          else if (err) { return next(err); }
          else {
          req.login(user, { session : false }, (error) => {
              if (error) return next(error)
              var token = jwt.sign({ user : user }, 'pri2018');
              req.session.token = token;
              if (user.tipo == "Músico") return res.redirect('/musico')
              else if (user.tipo == "Produtor") return res.redirect('/produtor')
              else return res.redirect('/admin')
          });
        }
  })(req, res, next);
});

/* GET admin page. */
router.get('/admin', passport.authenticate('jwt-admin', {session: false}), (req,res) => {
  res.render("admin/admin_layout");
});

/* GET Unauthorized */
router.get('/unauthorized', (req, res) => {
  res.render("unauthorized")
});

/*GET musico page. */
router.get('/musico', passport.authenticate('jwt-musico', {session: false}), (req,res) => {
  res.render("musico/musico_layout");
})

/*GET produtor page. */
router.get('/produtor',passport.authenticate('jwt-produtor', {session: false}), (req,res) => {
  res.render("produtor/produtor_layout", {id: req.user._id});
})

module.exports = router;
