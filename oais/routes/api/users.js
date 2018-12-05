var express = require('express');
var formidable = require('formidable')
var encryptPassword = require('encrypt-password')
var UserController = require('../../controllers/userController')
var router = express.Router();

/*
 * method: GET 
 * route : api/users
 * 
 * Obtem lista de utilizadores
 * 
 */
router.get('/', function(req, res) {
  UserController.listAll()
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.render('erro', {error: err})
                })
});

/*
 * method: GET 
 * route : api/users/:id
 * 
 * Obtem um determinado utilizador
 * 
 */
router.get('/:id', function(req, res) {
  UserController.getUserById(req.params.id)
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.render('erro', {error: err})
                })
});

/*
 * method: POST
 * route : api/users/:id
 * 
 * Adiciona um utilizador
 * 
 */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      fields.password = encryptPassword(fields.password, 'signatrue')
      /* Adds user to Database */
      UserController.addUser(fields)
      res.end()
    } else {
      res.render("error", {error: err})
    }
  })
});

/*
 * method: PUT
 * route : api/users/:id
 * 
 * Atualiza um utilizador
 * 
 */
router.put('/:id', function(req, res) {
    /* Gets form data from request body */
    var form = new formidable.IncomingForm();

    /* Parses the form */
    form.parse(req, (err, fields, files)=>{
      if (!err){
        /* Adds user to Database */
        UserController.updateUser(req.params.id, fields)
        res.end()
      } else {
        res.render("error", {error: err})
      }
    })

});

/*
 * method: DELETE
 * route : api/users/:id
 * 
 * Elimina um utilizador
 * 
 */
router.delete('/:id', function(req, res) {
  UserController.removeUser(req.params.id)
  res.end()
});

module.exports = router;
