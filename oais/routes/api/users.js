var express = require('express');
var formidable = require('formidable')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var fs = require('fs')
var passport = require('passport')
var UserController = require('../../controllers/userController')
var router = express.Router();

router.get('/*', passport.authenticate('jwt-admin', {session: false}), (req, res, next) => {next()})
router.put('/*', passport.authenticate('jwt-all', {session: false}), (req, res, next) => {next()})
router.post('/*', passport.authenticate('jwt-admin', {session: false}), (req, res, next) => {next()})
router.delete('/*', passport.authenticate('jwt-admin', {session: false}), (req, res, next) => {next()})

/**
 * @api {get} /api/users Obtem lista de utilizadores ordenados alfabeticamente
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
  console.log(req.config)
  UserController.listAll()
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.status(500).jsonp(err)
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
                .then(result => {
                  if(result)
                    res.jsonp(result)
                  else 
                    res.status(500).jsonp("Utilizador não existe.")
                })
                .catch(err => {
                  res.status(500).jsonp(err)
                })
});

/**
 * @api {post} /api/users Adiciona um utilizador
 * @apiName AddUser
 * @apiGroup Users
 * 
 * @apiParam {String} nome Nome do utilizador
 * @apiParam {String} sexo Sexo do utilizador 
 * @apiParam {String} tipo Tipo de utilizador (Músico ou Produtor)
 * @apiParam {String} email Email do utilizador 
 * @apiParam {String} password Password do utilizador 
 * 
 * @apiError (500) UtilizadorJaExiste Email do utilizador já existe.
 * 
 */

router.post('/', function(req, res) {
  /* Gets form data from request body  */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      /* Adds user to Database  */
      UserController.getUserByEmail(fields.email)
                    .then(user => {
                      if(!user) {
                        UserController.addUser(fields)
                        res.jsonp("Utilizador inserido com sucesso.")
                      } else {
                        res.status(500).jsonp("Utilizador já existe.")
                      }
                    })
                    .catch(erro => {
                      res.status(500).jsonp(erro)
                    })

    } else {
      res.status(500).jsonp(err)
    }
  })
}); 

/**
 * @api {put} /api/users/:id Atualiza um utilizador
 * @apiName UpdateUser
 * @apiGroup Users
 * 
 * @apiParam {String} [nome] Nome do utilizador
 * @apiParam {String} [sexo] Sexo do utilizador 
 * @apiParam {String} [tipo] Tipo de utilizador (Músico ou Produtor)
 * @apiParam {String} [email] Email do utilizador 
 * @apiParam {String} [password] Password do utilizador 
 * 
 * @apiError (500) UtilizadorNaoExiste Id do utilizador não encontrado.
 * 
 */
router.put('/:id', function(req, res) {
    /* Gets form data from request body */
    var form = new formidable.IncomingForm();
    console.log(req.body)
    console.log(form)
    /* Parses the form */
    form.parse(req, async (err, fields, files)=>{
      if (fields.password == '' || fields.password == undefined) {
        delete fields.password
      } else {
        fields.password = await bcrypt.hash(fields.password, 10)
      }
      if (!err){
        UserController.updateUser(req.params.id, fields)
                      .then(result => {
                        if (result) {
                          if (req.user.tipo != 'Admin') {
                            var newUser = {user: {...req.user, ...fields}}
                            req.session.token = jwt.sign(newUser, 'pri2018')
                          }
                          res.jsonp("Utilizador atualizado com sucesso.")
                      }
                        else 
                          res.status(500).jsonp("Utilizador não existe.")
                          
                      })
                      .catch(erro => {
                        res.status(500).jsonp(erro)
                        console.log(erro)
                      })

      } else {
        res.status(500).jsonp(err)
      }
    })
});

/**
 * @api {delete} /api/users/:id Elimina um utilizador
 * @apiName DeleteUser
 * @apiGroup Users
 * 
 */
router.delete('/:id', function(req, res) {
  UserController.removeUser(req.params.id)
                .then(result => {
                  if (result)
                    res.jsonp("Utilzador removido com sucesso.")
                  else 
                    res.status(500).jsonp("Utilizador não existe.")
                })
                .catch(err => {
                  res.status(500).jsonp(err)
                })
});


/**
 * @api {put} /api/users/:id Atualiza a foto de perfil de um utilizador
 * @apiName UpdateUserProfilePic
 * @apiGroup Users
 * 
 * @apiParam {File} ficheiro Fotografia de perfil
 * 
 * @apiError UtilizadorNaoExiste Id do utilizador não encontrado.
 * 
 */
router.put('/profile-pic/:id', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    var fenviado = files.ficheiro.path 
    var fnovo = 'public/uploaded/'+ files.ficheiro.name
    var fpath = '/uploaded/' + files.ficheiro.name

    if (!err){
      fs.rename(fenviado, fnovo, err => {
        if (!err) {
          UserController.updateProfilePic(req.params.id, fpath)
          .then(result => {
            if (result) {
              var newUser = {user: {...req.user, ...{profile_pic: fpath}}}
              req.session.token = jwt.sign(newUser, 'pri2018')
              res.jsonp("Foto de Perfil atualizada com sucesso.")
            } else 
              res.status(500).jsonp("Utilizador não existe")
          })
          .catch(erro => {
            res.status(500).jsonp(erro)
          })
        } else {
          res.status(500).jsonp(err)
        }
      })

    } else {
      res.status(500).jsonp(err)
    }
  })
});

module.exports = router;