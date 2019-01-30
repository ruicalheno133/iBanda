var express = require('express');
var ObraController = require('../../controllers/obraController')
var formidable = require('formidable')
var AdmZip = require('adm-zip');
var jsonfile = require('jsonfile')
var rimraf = require('rimraf')
var passport = require('passport')
var fs = require('fs')
var router = express.Router();

router.get('/*', passport.authenticate('jwt-all', {session: false}), (req, res, next) => {next()})
router.post('/*', passport.authenticate('jwt-produtor', {session: false}), (req, res, next) => {next()})
router.delete('/*', passport.authenticate('jwt-prod-admin', {session: false}), (req, res, next) => {next()})

/**
 * @api {get} /api/obras Obtem lista de Obras ordenadas alfabeticamente
 * @apiName GetObras
 * @apiGroup Obras
 * 
 * @apiSuccess {Object[]} Obras Lista de Obras (é a resposta)
 * @apiSuccess {String} Obras.titulo Titulo da Obra
 * @apiSuccess {String} Obras.compositor Compositor da Obra
 * @apiSuccess {String} Obras.tipo Tipo da Obra
 * @apiSuccess {String} Obras.criador Nome dorodutor que adicionou a Obra
 * @apiSuccess {String} Obras.criador_id Ud dorodutor que adicionou a Obra
 * @apiSuccess {Object[]} Obras.instrumento Lista de instrumentos da Obra
 * @apiSuccess {String} Obras.instrumentos.nome Nome do instrumento
 * @apiSuccess {Object} Obras.instrumentos.partitura Partitura do instrumento
 * @apiSuccess {String} Obras.instrumentos.partitura.path Path para a partitura
 * @apiSuccess {String} Obras.instrumentos.partitura.clave Clave do instrumento
 * @apiSuccess {String} Obras.instrumentos.partitura.voz Voz do instrumento
 * @apiSuccess {String} Obras.instrumentos.partitura.afinacao Afinacao do instrumento
 * 
 * @apiSuccessExample {json} Success-Response:
 * [ 
        {
        "_id": "m2",
        "titulo": "Armindo Alves",
        "tipo": "Marcha de Desfile",
        "compositor": "Ilídio Costa",
        "criador": "produtor1",
        "criador_id": "5c50b97eff18b5fb4fc0d65c",
        "instrumentos": [
            {
              "nome": "Sax Barítono",
              "partitura": {
                  "path": "ArmindoAlves-saxB.tif"
              }
            },
            {
              "nome": "Sax Soprano",
              "partitura": {
              "path": "ArmindoAlves-saxS.tif"
            }
          }
        ]
      }
 * ]
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
 * @apiSuccess {Object[]} Obras Lista de Obras (é a resposta)
 * @apiSuccess {String} titulo Titulo da Obra
 * @apiSuccess {String} compositor Compositor da Obra
 * @apiSuccess {String} tipo Tipo da Obra
 * @apiSuccess {String} criador Nome dorodutor que adicionou a Obra
 * @apiSuccess {String} criador_id Ud dorodutor que adicionou a Obra
 * @apiSuccess {Object[]} instrumento Lista de instrumentos da Obra
 * @apiSuccess {String} instrumentos.nome Nome do instrumento
 * @apiSuccess {Object} instrumentos.partitura Partitura do instrumento
 * @apiSuccess {String} instrumentos.partitura.path Path para a partitura
 * @apiSuccess {String} instrumentos.partitura.clave Clave do instrumento
 * @apiSuccess {String} instrumentos.partitura.voz Voz do instrumento
 * @apiSuccess {String} instrumentos.partitura.afinacao Afinacao do instrumento
 * 
 * @apiSuccessExample {json} Success-Response:
        {
        "_id": "m2",
        "titulo": "Armindo Alves",
        "tipo": "Marcha de Desfile",
        "compositor": "Ilídio Costa",
        "criador": "produtor1",
        "criador_id": "5c50b97eff18b5fb4fc0d65c",
        "instrumentos": [
            {
              "nome": "Sax Barítono",
              "partitura": {
                  "path": "ArmindoAlves-saxB.tif"
              }
            },
            {
              "nome": "Sax Soprano",
              "partitura": {
              "path": "ArmindoAlves-saxS.tif"
            }
          }
        ]
      }
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
 * @apiParam {File} ficheiro Ficheiro ZIP composto pelo manifesto e partituras
 * 
 * @apiError manifestoNaoExiste ZIP nao contem manifesto 
 * @apiError partituraNaoExiste Partitura referenciada no manifesto nao existe
 * @apiError obraJaExiste Id da obra a inserir ja existe
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
                var partiturasErr = verifyPartituras(manifesto)
                /* Se não existirem - ERRO */
                if (partiturasErr != "") {
                  console.log(partiturasErr)
                  return res.status(500).jsonp(partiturasErr)
                }
                /* Metadados (manifesto + criador) */
                var obraUpdated = {...manifesto, ...{criador: req.user.nome, criador_id: req.user._id}}
                /* Adiciona metadados à base de dados mongo */
                ObraController.addObra(obraUpdated)
                              .then(result => {
                                /* Se inseriu na BD, extrai ZIP para Local Storage */
                                extraiZIP(zip, manifesto._id, zipEnviado, erro => {
                                  if (!erro) return res.jsonp("Obra '" + manifesto.titulo + "' inserida.")
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
    }
  return partiturasErr
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
 * @apiParam {File} ficheiro Ficheiro ZIP composto pelos novos manifesto e partituras
 * 
 * @apiError manifestoNaoExiste ZIP nao contem manifesto 
 * @apiError partituraNaoExiste Partitura referenciada no manifesto nao existe
 * @apiError obraJaExiste Id da obra a inserir ja existe
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
 * @apiError (500) obraNaoExiste Id da obra nao encontrado
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