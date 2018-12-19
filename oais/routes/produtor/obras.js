var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET página de registo de obras */
router.get('/register', function(req, res) {
    axios.get('http://localhost:6001/api/obras')
         .then(obras => {
             res.render('produtor/registo_obras', {obras: obras.data})
         })
});


/* GET lista de obras*/
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/obras')
         .then(obras => {
             res.render('produtor/obras', {obras: obras.data})
         })
});

/* POST cria obra */
router.post('/register', (req, res, next) => {
    axios.get('http://localhost:6001/api/obras')
        .then(res.render('produtor/registo_obras'))
});

/* PUT altera obra */

module.exports = router;