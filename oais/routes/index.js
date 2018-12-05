var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* GET home page. */
router.post('/processLogin', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/',
  failureFlash: true
}))

/* GET admin page. */
router.get('/admin', function(req, res, next) {
  res.render("admin/admin_layout");
});

module.exports = router;
