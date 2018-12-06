var express = require('express');
var EventController = require('../../controllers/eventController')
var formidable = require('formidable')
var router = express.Router();


/**
 * @api {get} /api/events Obtem lista de eventos
 * @apiName GetEventos
 * @apiGroup Eventos
 * 
 * @apiSuccess {Object[]} eventos Lista de eventos (é a resposta)
 * @apiSuccess {String} eventos.nome Nome do evento
 * 
 */
router.get('/', function(req, res) {
    EventController.listAll()
                  .then(dados => {
                    res.jsonp(dados)
                  })
                  .catch(err => {
                    res.render('erro', {error: err})
                  })
  });

/**
 * @api {get} /api/events/:id Obtem um determinado evento
 * @apiName GetEvento
 * @apiGroup Eventos
 * 
 * @apiParam {String} id ID do evento
 * 
 * @apiSuccess {String} nome Nome do evento
 * 
 */
router.get('/:id', function(req, res) {
  EventController.getEventById(req.params.id)
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.render('erro', {error: err})
                })
});

/**
 * @api {post} /api/events Adiciona um evento
 * @apiName AddEvento
 * @apiGroup Eventos
 * 
 */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();
 
  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      /* Adds user to Database */
      EventController.addEvent(fields)
      res.end()
    } else {
      res.render("error", {error: err})
    }
  })
});

/**
 * @api {put} /api/events/:id Atualiza um evento
 * @apiName UpdateEvento
 * @apiGroup Eventos
 * 
 * @apiParam {String} id ID do evento
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
      EventController.updateEvent(req.params.id, fields)
      res.end()
    } else {
      res.render("error", {error: err})
    }
  })
});

/**
 * @api {delete} /api/events/:id Elimina um evento
 * @apiName DeleteEvento
 * @apiGroup Eventos
 * 
 * @apiParam {String} id ID do evento
 * 
 * 
 */
router.delete('/:id', function(req, res) {
  EventController.removeEvent(req.params.id)
  res.end()
});


module.exports = router;