var express = require('express');
var ObraController = require('../../controllers/obraController')
var formidable = require('formidable')
var router = express.Router();


/*
 * method: GET 
 * route : api/events
 * 
 * Obtem lista de eventos
 * 
 */
router.get('/', function(req, res) {
    ObraController.listAll()
                  .then(dados => {
                    res.jsonp(dados)
                  })
                  .catch(err => {
                    res.render('erro', {error: err})
                  })
  });

/*
 * method: GET 
 * route : api/events/:id
 * Obtem um determinado evento
 * 
 */
router.get('/:id', function(req, res) {
  ObraController.getObraById(req.params.id)
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.render('erro', {error: err})
                })
});

/*
 * method: POST
 * route : api/events/
 * Adiciona um evento
 * 
 */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();
  
  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    var fenviado = files.ficheiro.path
    var fnovo = 'uploaded/' + files.ficheiro.name
    files.desc = fields.desc
    files.ficheiro.path = fnovo
  
    fs.rename(fenviado, fnovo, erro =>{
      if(!erro)
        res.render('produtor/registo_obras')
      else{
        res.render('error.pug', {e: "Ocorreram erros na gravação do ficheiro enviado: " + erro})
        res.end()
      }
    })
  })
})
/*
 * method: PUT
 * route : api/events/:id
 * Atualiza um determinado evento
 * 
 */
router.put('/:id', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      /* Adds user to Database */
      ObraController.updateObra(req.params.id, fields)
      res.end()
    } else {
      res.render("error", {error: err})
    }
  })
});

/*
 * method: DELETE
 * route : api/events/:id
 * Elimina um determinado evento
 * 
 */
router.delete('/:id', function(req, res) {
  ObraController.removeObra(req.params.id)
  res.end()
});


module.exports = router;