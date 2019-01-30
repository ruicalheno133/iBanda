var express = require('express');
var EventController = require('../../controllers/eventController')
var formidable = require('formidable')
var passport = require('passport')
var router = express.Router();

router.get('/*', passport.authenticate('jwt-all', {session: false}), (req, res, next) => {next()})
router.post('/*', passport.authenticate('jwt-admin', {session: false}), (req, res, next) => {next()})
router.delete('/*', passport.authenticate('jwt-admin', {session: false}), (req, res, next) => {next()})

/**
 * @api {get} /api/events Obtem lista de eventos ordenados por data de realização
 * @apiName GetEventos
 * @apiGroup Eventos
 * 
 * @apiSuccess {Object[]} eventos Lista de eventos (é a resposta)
 * @apiSuccess {String} eventos.nome Nome do evento
 * @apiSuccess {String} eventos.descricao Descrição do evento
 * @apiSuccess {String} eventos.local Local do evento
 * @apiSuccess {Date} eventos.data Data do evento
 * 
 * @apiSuccessExample {json} Success-Response:
 * [ 
 *  {
 *    "nome"    : "Concerto de Natal",
 *    "descricao"    : "Na véspera de natal, concerto solidário.",
 *    "local"    : "Hospital de Braga",
 *    "data"   : 24/12/2019T15:00Z
 *  }
 * ]
 * 
 */
router.get('/', function(req, res) {
    EventController.listAll()
                  .then(dados => {
                    res.jsonp(dados)
                  })
                  .catch(err => {
                    res.status(500).jsonp(err)
                  })
  });

/**
 * @api {get} /api/events/:id Obtem um determinado evento
 * @apiName GetEvento
 * @apiGroup Eventos
 * 
 * @apiSuccess {String} nome Nome do evento
 * @apiSuccess {String} descricao Descrição do evento
 * @apiSuccess {String} local Local do evento
 * @apiSuccess {Date} data Data do evento
 * 
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "nome"    : "Concerto de Natal",
 *    "descricao"    : "Na véspera de natal, concerto solidário.",
 *    "local"    : "Hospital de Braga",
 *    "data"   : 24/12/2019T15:00Z
 *  }
 * 
 */
router.get('/:id', function(req, res) {
  EventController.getEventById(req.params.id)
                .then(dados => {
                  if(dados)
                    res.jsonp(dados)
                  else 
                    res.status(500).jsonp("Evento não existe.")
                })
                .catch(err => {
                  res.status(500).jsonp(err)
                })
});

/**
 * @api {post} /api/events Adiciona um evento
 * @apiName AddEvento
 * @apiGroup Eventos
 * 
 * @apiParam {String} nome Nome do evento
 * @apiParam {String} [descricao] Descrição do evento
 * @apiParam {String} local Local do evento
 * @apiParam {Date} data Data do evento
 * 
 */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();
 
  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      EventController.addEvent(fields)
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
 * @api {put} /api/events/:id Atualiza um evento
 * @apiName UpdateEvento
 * @apiGroup Eventos
 * 
 * @apiParam {String} nome Nome do evento
 * @apiParam {String} [descricao] Descrição do evento
 * @apiParam {String} local Local do evento
 * @apiParam {Date} data Data do evento
 * 
 * @apiError (500) EventoNaoExiste Id do evento não encontrado.
 */
router.put('/:id', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      EventController.updateEvent(req.params.id, fields)
                      .then(result => {
                        if(result)
                          res.jsonp("Evento atualizado com sucesso.")
                        else 
                          res.status(500).jsonp("Evento não existe.")
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
 * @api {delete} /api/events/:id Elimina um evento
 * @apiName DeleteEvento
 * @apiGroup Eventos
 * 
 * 
 * @apiError (500) EventoNaoExiste Id do evento não encontrado.
 * 
 */
router.delete('/:id', function(req, res) {
  EventController.removeEvent(req.params.id)
                .then(result => {
                  if (result)
                    res.jsonp("Evento removido com sucesso.")
                  else 
                    res.jsonp("Evento não existe.")
                })
                .catch(err => {
                  res.status(500).jsonp(err)
                })
});


module.exports = router;