var express = require('express');
var ObraController = require('../../controllers/obraController')
var formidable = require('formidable')
var AdmZip = require('adm-zip');
var jsonfile = require('jsonfile')
var rimraf = require('rimraf')
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
  rimraf.sync("./temp");
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();
  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    /* Unzipa */
    var zipEnviado = files.ficheiro.path;
    var zip = new AdmZip(zipEnviado); 
    var partiturasErr = ""

    /* Obtem manifesto */
    var manifesto = zip.getEntry('iBanda-SIP.json')

    /* Se não existir manifesto - ERRO */
    if (!manifesto) { 
      return res.status(500).jsonp('Não existe manifesto.')
    }
    else {
      /* Extrair conteudo do ZIP para pasta temporária */
      zip.extractAllTo('./temp/', true)
      /* Lê o manifesto */
      jsonfile.readFile('./temp/' + manifesto.entryName)
              .then(manifesto =>{
                /* Verifica se as partituras existem */
                partiturasErr = verifyPartituras(manifesto)
                /* Se não existirem - ERRO */
                if (partiturasErr != "") return res.status(500).jsonp(partiturasErr)
                /* Metadados (manifesto + criador) */
                var obraUpdated = {...manifesto, ...{criador: req.user.nome, criador_id: req.user._id}}
                /* Adiciona metadados à base de dados mongo */
                ObraController.addObra(obraUpdated)
                              .then(result => {
                                /* Se inseriu na BD, extrai ZIP para Local Storage */
                                extraiZIP(zip, manifesto._id, zipEnviado, erro => {
                                  if (!erro) return res.jsonp("Inserida com sucesso.")
                                  else return res.status(500).jsonp("Erro ao inserir no Local Storage.")
                                })
                              })
                              .catch(err => {
                                return res.status(500).jsonp("Erro ao inserir na BD.")
                              })
              })
              .catch(error => {return res.status(500).jsonp("Erro ao ler manifesto.")})
    }
  })
})

function verifyPartituras (manifesto) {
  var partiturasErr = ""
  for( n in manifesto.instrumentos) {
    var partitura = manifesto.instrumentos[n].partitura.path;
      if (!fs.existsSync('./temp/' + partitura)) {
        partiturasErr += `Partitura \'${partitura}\' não existe.\n`
      }     
  return partiturasErr
  }
}

function extraiZIP (zip, obraID, zipEnviado, callback) {
  var extractTO = './public/obras/' + obraID
  /* Extrai o conteudo do zip */
  zip.extractAllTo(extractTO, true)
  /* Guarda o zip no local storage */
  var zipNovo = extractTO +  '/' + obraID + '.zip'
  fs.rename(zipEnviado, zipNovo, erro => {
    callback(erro)
  })

}

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
  rimraf.sync("./temp");
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();
  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    /* Unzipa */
    var zip = new AdmZip(zipEnviado); 
    var partiturasErr = ""

    /* Obtem manifesto */
    var manifesto = zip.getEntry('iBanda-SIP.json')

    /* Se não existir manifesto - ERRO */
    if (!manifesto) { 
      return res.status(500).jsonp('Não existe manifesto.')
    }
    else {
      /* Extrair conteudo do ZIP para pasta temporária */
      zip.extractAllTo('./temp/', true)
      /* Lê o manifesto */
      jsonfile.readFile('./temp/' + manifesto.entryName)
              .then(manifesto =>{
                /* Verifica se as partituras existem */
                partiturasErr = verifyPartituras(manifesto)
                /* Se não existirem - ERRO */
                if (partiturasErr != "") return res.status(500).jsonp(partiturasErr)
                /* Metadados (manifesto + criador) */
                var obraUpdated = {...manifesto, ...{criador: req.user.nome, criador_id: req.user._id}}
                /* Adiciona metadados à base de dados mongo */
                ObraController.updateObra(req.params.id, obraUpdated)
                              .then(result => {
                                /* Se inseriu na BD, extrai ZIP para Local Storage */
                                return extraiZIP(zip, obra._id, zipEnviado)
                              })
                              .catch(err => {
                                return res.status(500).jsonp("Erro ao inserir na BD.")
                              })
              })
              .catch(error => {return res.status(500).jsonp("Erro ao ler manifesto.")})
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
  rimraf("./public/obras/" + req.params.id, err => {
    if (err) return res.status(500).jsonp('Impossível de remover obra.')
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

});


module.exports = router;