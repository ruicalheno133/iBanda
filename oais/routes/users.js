var express = require('express');
var formidable = require('formidable')
var encryptPassword = require('encrypt-password')
var UserController = require('../controllers/userController')
var router = express.Router();

/* GET lista de utiliadores */
router.get('/', function(req, res) {
  res.render('index');
});


/* GET um utilizador */
router.get('/:id', function(req, res) {
  res.send('Um utilizador específico.');
});

/* POST create a user */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!erro){
      /* Create a user with an Encrypted Password */
      var userEncrypted = new Object ({
        "nome" : fields.nome,
        "email": fields.email, 
        "password": encryptPassword('password', 'signatrue')
      })

      /* Adds user to Database */
      UserController.addUser(userEncrypted)
      res.end()
    } else {
      res.render("error", {error: err})
    }
  })
});

/* PUT altera um utilizador */
router.put('/:id', function(req, res) {
  res.send('Altera a informação de um utilizador.');
});



module.exports = router;
