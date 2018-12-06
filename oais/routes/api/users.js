var express = require('express');
var formidable = require('formidable')
var encryptPassword = require('encrypt-password')
var UserController = require('../../controllers/userController')
var router = express.Router();

/**
 * @api {get} /api/users Obtem lista de utilizadores
 * @apiName GetUsers
 * @apiGroup Users
 * 
 * @apiSuccess {Object[]} utilizadores Lista de utilizadores (é a resposta)
 * @apiSuccess {String} utilizadores.nome Nome do utilizador
 * @apiSuccess {String} utilizadores.sexo Sexo do utilizador 
 * @apiSuccess {String} utilizadores.tipo Tipo de utilizador (Músico ou Produtor)
 * @apiSuccess {String} utilizadores.email Email do utilizador 
 * @apiSuccess {String} utilizadores.password Password do utilizador
 * 
 * @apiSuccessExample {json} Success-Response:
 * [ 
 *  {
 *    "nome"    : "Joaquim Alberto",
 *    "sexo"    : "Masculino",
 *    "tipo"    : "Músico",
 *    "email"   : "ja123@mail.com",
 *    "password": "pass"
 *  }.
 *  {
 *    "nome"    : "Ana Matilde",
 *    "sexo"    : "Feminino",
 *    "tipo"    : "Produtor",
 *    "email"   : "am123@mail.com",
 *    "password": "pass"
 *  }
 * ]
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

/**
 * @api {get} /api/users/:id Obtem um determinado utilizador
 * @apiName GetUser
 * @apiGroup Users
 * 
 * @apiParam {String} id ID do utilizador
 * 
 * @apiSuccess {String} nome Nome do utilizador
 * @apiSuccess {String} sexo Sexo do utilizador 
 * @apiSuccess {String} tipo Tipo de utilizador (Músico ou Produtor)
 * @apiSuccess {String} email Email do utilizador 
 * @apiSuccess {String} password Password do utilizador
 * 
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "nome"    : "Joaquim Alberto",
 *    "sexo"    : "Masculino",
 *    "tipo"    : "Músico",
 *    "email"   : "ja123@mail.com",
 *    "password": "pass"
 *  }
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

/**
 * @api {post} /api/users Adiciona um utilizador
 * @apiName AddUser
 * @apiGroup Users
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

/**
 * @api {put} /api/users/:id Atualiza um utilizador
 * @apiName UpdateUser
 * @apiGroup Users
 * 
 * @apiParam {String} id ID do utilizador
 * 
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

/**
 * @api {delete} /api/users/:id Elimina um utilizador
 * @apiName DeleteUser
 * @apiGroup Users
 * 
 * @apiParam {String} id ID do utilizador
 * 
 * 
 */
router.delete('/:id', function(req, res) {
  UserController.removeUser(req.params.id)
  res.end()
});

module.exports = router;
