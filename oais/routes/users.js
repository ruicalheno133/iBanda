var express = require('express');
var formidable = require('formidable')
var encryptPassword = require('encrypt-password')
var UserController = require('../controllers/userController')
var router = express.Router();

/* GET lista de utiliadores */
router.get('/', function(req, res) {
  UserController.listAll()
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.render('erro', {error: err})
                })
});


/* GET um utilizador */
router.get('/:id', function(req, res) {
  UserController.getUser(req.params.id)
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                res.render('erro', {error: err})
                })
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
