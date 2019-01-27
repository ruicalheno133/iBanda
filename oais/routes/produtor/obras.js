var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET página de registo de obras */
router.get('/register', function(req, res) {
    res.render('produtor/registo_obras')
});


/* GET lista de obras*/
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/obras')
         .then(obras => {
             res.render('produtor/obras', {obras: obras.data})
         })
});

router.get('/:id', (req,res) => {
    axios.get('http://localhost:6001/api/obras/' + req.params.id)
        .then(obras => {
            res.render('produtor/obra', {obras: obras.data})
        })
})

/* POST cria obra */
router.post('/register', (req, res, next) => {
    axios.get('http://localhost:6001/api/obras')
        .then(res.render('produtor/registo_obras'))
});

/* PUT altera obra */

module.exports = router;