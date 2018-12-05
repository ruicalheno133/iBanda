var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET lista de eventos */
router.get('/', function(req, res) {
    res.render('events')
});


/* POST create a user */
router.post('/', function(req, res) {

});

/* PUT altera um utilizador */
router.put('/:id', function(req, res) {

});

module.exports = router;
