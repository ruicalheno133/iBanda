var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* GET admin page. */
router.get('/admin', function(req, res, next) {
  res.render("admin_layout");
});

/*GET musico page. */
router.get('/musico',function (req,res,next){
  res.render("musico_layout");
})

module.exports = router;
