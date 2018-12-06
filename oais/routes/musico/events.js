var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET lista de eventos*/
router.get('/', function(req, res) {
    res.render('events_mus')
});


module.exports = router;