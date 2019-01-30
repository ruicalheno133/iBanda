var express = require('express');
var formidable = require('formidable')
var NoticiasController = require('../../controllers/noticiaController')
var passport = require('passport')
var router = express.Router();

router.get('/*', passport.authenticate('jwt-all', {session: false}), (req, res, next) => {next()})
router.post('/*', passport.authenticate('jwt-admin', {session: false}), (req, res, next) => {next()})
router.delete('/*', passport.authenticate('jwt-admin', {session: false}), (req, res, next) => {next()})

/**
 * @api {get} /api/noticias Obtem lista de noticias
 * @apiName GetNoticias
 * @apiGroup Noticias
 * 
 * @apiSuccess {Object[]} eventos Lista de noticias(é a resposta)
 * @apiSuccess {String} noticias.titulo Titulo da noticia
 * @apiSuccess {String} noticias.texto Corpo da notícia
 * @apiSuccess {String} noticias.fonte Website fonte da notícia
 * @apiSuccess {String} noticias.data Data de criação da notícia
 * @apiSuccess {Boolean} noticias.visibilidade Indica se a notícia está visível
 * 
 * @apiSuccessExample {json} Success-Response:
 * [ 
 *  {
 *    "titulo"       : "Nova guitarra",
 *    "texto"        : "Guitarra da Fender disponível.",
 *    "fonte"        : "www.umsite.com",
 *    "data"         : 20/10/2019T15:00Z,
 *    "visibilidade" : true
 *  }
 * ]
 * 
 */
router.get('/', function(req, res) {
    NoticiasController.listAll()
                  .then(dados => {
                    res.jsonp(dados)
                  })
                  .catch(err => {
                    res.status(500).jsonp(err)
                  })
});

/**
  * @api {get} /api/noticias/:id Obtem uma determinada notícia
  * @apiName GetNoticia
  * @apiGroup Noticias
  * 
  * @apiSuccess {String} titulo Titulo da noticia
  * @apiSuccess {String} texto Corpo da notícia
  * @apiSuccess {String} fonte Website fonte da notícia
  * @apiSuccess {String} data Data de criação da notícia
  * @apiSuccess {Boolean} visibilidade Indica se a notícia está visível
  * 
  * @apiSuccessExample {json} Success-Response:
  *  {
  *    "titulo"       : "Nova guitarra",
  *    "texto"        : "Guitarra da Fender disponível.",
  *    "fonte"        : "www.umsite.com",
  *    "data"         : 20/10/2019T15:00Z,
  *    "visibilidade" : true
  *  }
  */
 router.get('/:id', function(req, res) {
  NoticiasController.getNoticiaById(req.params.id)
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.status(500).jsonp(err)
                })
});

/**
 * @api {post} /api/noticias Adiciona uma noticia
 * @apiName AddNoticia
 * @apiGroup Noticias
 * 
 * @apiParam {String} titulo Titulo da noticia
 * @apiParam {String} [texto] Corpo da notícia
 * @apiParam {String} [fonte] Website fonte da notícia
 *
 */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();
  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      fields.visibilidade = true;
      fields.data = Date.now()
      NoticiasController.addNoticia(fields)
                        .then(result => {
                          res.jsonp("Notícia inserida com sucesso.")
                        })
                        .catch(err => {
                          res.status(500).jsonp(err)
                        })
      } else {
        res.status(500).jsonp(err)
      }
  })
});

/**
 * @api {post} /api/noticias/:id/visivel Torna notícia vísivel
 * @apiName MakeNoticiaVisible
 * @apiGroup Noticias
 * 
 */
router.post('/:id/visivel', function(req, res) {
      NoticiasController.makeVisible(req.params.id, true)
                        .then(result => {
                          res.jsonp("Notícia é agora vísivel.")
                        })
                        .catch(err => {
                          res.status(500).jsonp(err)
                        })
});

/**
 * @api {put} /api/noticias/:id Atualiza uma noticia
 * @apiName UpdateNoticia
 * @apiGroup Noticias
 * 
 * @apiParam {String} titulo Titulo da noticia
 * @apiParam {String} [texto] Corpo da notícia
 * @apiParam {String} [fonte] Website fonte da notícia
 * 
 * @apiError (500) NoticiaNaoExiste Id da noticia não encontrado.
 */
router.put('/:id', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      NoticiasController.updateNoticia(req.params.id, fields)
                      .then(result => {
                        if(result)
                          res.jsonp("Notícia atualizada com sucesso.")
                        else 
                          res.status(500).jsonp("Notícia não existe.")
                      })
                      .catch(err => {
                        res.status(500).jsonp(err)
                      })
    } else {
      res.status(500).jsonp(err)
    }
  })
});

/**
 * @api {post} /api/noticias/:id/invisivel Torna notícia não vísivel
 * @apiName MakeNoticiaNotVisible
 * @apiGroup Noticias
 * 
 */
router.post('/:id/invisivel', function(req, res) {
  NoticiasController.makeNotVisible(req.params.id, false)
                    .then(result => {
                      res.jsonp("Notícia é agora vísivel.")
                    })
                    .catch(err => {
                      res.status(500).jsonp(err)
                    })
});

/**
 * @api {delete} /api/noticias/:id Elimina uma noticia
 * @apiName DeleteNoticia
 * @apiGroup Noticias
 * 
 * @apiError (500) noticiaNaoExiste Id da notícia não encontrado
 * 
 */
router.delete('/:id', function(req, res) {
  NoticiasController.removeNoticia(req.params.id)
                .then(result => {
                  if (result)
                    res.jsonp("Noticia removida com sucesso."  + result)
                  else 
                    res.status(500).jsonp("Noticia não existe.")
                })
                .catch(err => {
                  res.status(500).jsonp(err)
                })
});

module.exports = router;