var express = require('express');
var ObraController = require('../../controllers/obraController')
var formidable = require('formidable')
var AdmZip = require('adm-zip');
var jsonfile = require('jsonfile')
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
    var zipEnviado = files.ficheiro.path
    var zip = new AdmZip(zipEnviado); 
    //var zipEntries = zip.getEntries(); // entradas do zip
    var manifesto = zip.getEntry('iBanda-SIP.json') // procura manifesto

    if (!manifesto) { 
      res.status(500).jsonp('Não existe manifesto.')
      return 
    }
    else{
      zip.extractAllTo('./temp/', true)
      jsonfile.readFile('./temp/' + manifesto.entryName)
              .then(obra =>{
                for( n in obra.instrumentos) {
                  var partitura = obra.instrumentos[n].partitura.path;
                    if (!fs.existsSync('./temp/' + partitura)) {
                      res.status(500).jsonp("Partitura não existe.")
                      return
                    }              
              }
                
                ObraController.addObra(obra)
                              .then(result => {
                                zip.extractAllTo('./public/obras/' + obra._id, true)
                                var zipNovo = './public/obras/' + obra._id + '/' + files.ficheiro.name 
                                fs.rename(zipEnviado, zipNovo, erro => {
                                  if (!erro) return res.jsonp("Inserida com sucesso.")
                                  else res.status(500).jsonp("Erro ao inserir no Local Storage.")
                                  console.log(erro)
                                })

                              })
                              .catch(err => {
                                console.log(err)
                                res.status(500).jsonp("Erro ao inserir na BD.")
                              })
              })
              .catch(error => console.error(error))

        
    }
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