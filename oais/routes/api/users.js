var express = require('express');
var formidable = require('formidable')
var bcrypt = require('bcrypt')
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

/*
router.post('/', (req, res, next) => {
  passport.authenticate('registo', (err, user, info) => {
    if (!err) res.end()
    else {
      res.status(500).end()
    }
  })(req,res,next)
})  */

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
    form.parse(req, async (err, fields, files)=>{
      if (fields.password == '' || fields.password == undefined) {
        delete fields.password
      } else {
        fields.password = await bcrypt.hash(fields.password, 10)
      }
      if (!err){
        //END
        UserController.updateUser(req.params.id, fields)
                      .then(result => {
                        if (result)
                          res.jsonp("Utilizador atualizado com sucesso.")
                        else 
                          res.status(500).jsonp("Utilizador não existe.")
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
                .then(result => {
                  if (result)
                    res.jsonp("Utilzador removido com sucesso."  + result)
                  else 
                    res.status(500).jsonp("Utilizador não existe.")
                })
                .catch(err => {
                  res.status(500).jsonp(err)
                })
});

module.exports = router;
