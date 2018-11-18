var express = require('express');
var UserController = require('../controllers/userController')
var router = express.Router();

/* GET lista de utiliadores */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET página de registo */
router.get('/register', function(req, res) {
  res.render("registo");
});

/* GET um utilizador */
router.get('/:id', function(req, res) {
  res.send('Um utilizador específico.');
});

/* POST cria um utilizador */
router.post('/', function(req, res) {
  res.send('Cria um utilizador.');
});

/* PUT altera um utilizador */
router.put('/:id', function(req, res) {
  res.send('Altera a informação de um utilizador.');
});



module.exports = router;
