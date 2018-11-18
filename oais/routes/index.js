var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render("login");
});

/* GET página de registo */
router.get('/register', function(req, res) {
  res.render("registo");
});

module.exports = router;
