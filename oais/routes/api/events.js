var express = require('express');
var EventController = require('../../controllers/eventController')
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
    EventController.listAll()
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
  EventController.getEventById(req.params.id)
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
  form.multiples = true
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
      EventController.updateEvent(req.params.id, fields)
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
  EventController.removeEvent(req.params.id)
  res.end()
});


module.exports = router;