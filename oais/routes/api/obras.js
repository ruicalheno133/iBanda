var express = require('express');
var ObraController = require('../../controllers/obraController')
var formidable = require('formidable')
var fs = require('fs')
var router = express.Router();


/**
 * @api {get} /api/obras Obtem lista de Obras
 * @apiName GetObras
 * @apiGroup Obras
 * 
 * @apiSuccess {Object[]} Obras Lista de Obras (é a resposta)
 * @apiSuccess {String} Obras.nome Nome da Obra
 * 
 */
router.get('/', function(req, res) {
    ObraController.listAll()
                  .then(dados => {
                    res.jsonp(dados)
                  })
                  .catch(err => {
                    res.jsonp(err)
                  })
  });

/**
 * @api {get} /api/obras/:id Obtem uma determinada obra
 * @apiName GetObra
 * @apiGroup Obras
 * 
 * @apiParam {String} id ID da obra
 * 
 * @apiSuccess {String} nome Nome da obra
 * 
 */
router.get('/:id', function(req, res) {
  ObraController.getObraById(req.params.id)
                .then(dados => {
                  if (dados)
                    res.jsonp(dados)
                  else 
                    res.status(500).jsonp("Obra não existe.")
                })
                .catch(err => {
                  res.jsonp(err)
                })
});

/**
 * @api {post} /api/obras Adiciona uma obra
 * @apiName AddObra
 * @apiGroup Obras
 * 
 */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();
  
  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    var fenviado = files.ficheiro.path
    var fnovo = 'public/uploaded/' + files.ficheiro.name
    files.ficheiro.path = fnovo
  
    fs.rename(fenviado, fnovo, erro =>{
      if(!erro)
        res.jsonp('Obra inserida com sucesso.')
      else {
        res.status(500).jsonp(erro)
      }
    })
  })
})

/**
 * @api {put} /api/events/:id Atualiza uma obra
 * @apiName UpdateObra
 * @apiGroup Obras
 * 
 * @apiParam {String} id ID da obra
 * 
 * 
 */
router.put('/:id', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      ObraController.updateObra(req.params.id, fields)
                    .then(result => {
                      if (result)
                        res.jsonp("Obra atualizada com sucesso.")
                      else 
                        res.status(500).jsonp("Obra não existe")
                    })
                    .catch(erro => {
                      res.status(500).jsonp(erro)
                    })
    } else {
      res.status(500).jsonp(err)
      res.end()
    }
  })
});

/**
 * @api {delete} /api/events/:id Elimina uma obra
 * @apiName DeleteObra
 * @apiGroup Obras
 * 
 * @apiParam {String} id ID da obra
 * 
 * 
 */
router.delete('/:id', function(req, res) {
  ObraController.removeObra(req.params.id)
                .then(result => {
                  if (result)
                    res.jsonp("Obra Removida com sucesso.")
                  else 
                    res.status(500).jsonp("Obra não existe.")
                })
                .catch(err => {
                  res.status(500).jsonp(err)
                })
});


module.exports = router;