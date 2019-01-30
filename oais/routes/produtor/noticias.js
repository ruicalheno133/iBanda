var express = require('express');
var axios = require('axios');
var router = express.Router();

function getTokenFromRequest (req) {
    return '?api-key=' + req.session.token
}

/* GET lista de noticias */
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/noticias' + getTokenFromRequest(req))
         .then(noticias => {
             res.render('produtor/noticias', {noticias: noticias.data})
         })
         .catch(err => {
            res.render('error', {error:err})
        })
});


module.exports = router;