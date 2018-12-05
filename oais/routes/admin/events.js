var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET lista de utiliadores */
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/events')
         .then(events => {
             res.render('events', {eventos: events.data})
         })
});

module.exports = router;
