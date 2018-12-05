var express = require('express');
var EventController = require('../../controllers/eventController')
var router = express.Router();

/* GET Lists events */
router.get('/', function(req, res) {
    EventController.listAll()
                  .then(dados => {
                    res.jsonp(dados)
                  })
                  .catch(err => {
                    res.render('erro', {error: err})
                  })
  });

module.exports = router;