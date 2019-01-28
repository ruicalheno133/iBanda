var express = require('express');
var axios = require('axios')
var router = express.Router();

function getTokenFromRequest (req) {
    return '?api-key=' + req.session.token
}

/* GET lista de eventos */
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/events' + getTokenFromRequest(req))
         .then(events => {
             res.render('admin/events', {eventos: events.data})
         })
         .catch(err => {
            res.render('error', {error:err})
        })
});

module.exports = router;
