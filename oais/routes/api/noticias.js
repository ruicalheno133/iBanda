var express = require('express');
var NoticiasController = require('../../controllers/noticiaController')
var router = express.Router();


/**
 * @api {get} /api/noticias Obtem lista de noticias
 * @apiName GetNoticias
 * @apiGroup Noticias
 * 
 * @apiSuccess {Object[]} eventos Lista de Noticias(é a resposta)
 * @apiSuccess {String} noticias.titulo Titulo da Noticia
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
 * @api {post} /api/noticias Adiciona uma noticia
 * @apiName AddNoticia
 * @apiGroup Noticias
 * 
 */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();
 
  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      NoticiasController.addEvent(fields)
                        .then(result => {
                          res.jsonp("Evento inserido com sucesso.")
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
 * @api {delete} /api/noticias/:id Elimina uma noticia
 * @apiName DeleteNoticia
 * @apiGroup Noticias
 * 
 * @apiParam {String} id ID da noticia
 * 
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