var express = require('express');
var axios = require('axios')
var router = express.Router();

function getTokenFromRequest (req) {
    return '?api-key=' + req.session.token
}

/* GET página de registo de obras */
router.get('/register', function(req, res) {
    res.render('produtor/registo_obras')
});

/* GET lista de obras*/
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/obras' + getTokenFromRequest(req))
         .then(obras => {
             res.render('produtor/obras', {obras: obras.data, user: req.user})
         })
         .catch(err => {
            res.render('error', {error:err})
        })
});

router.get('/:id', (req,res) => {
    axios.get('http://localhost:6001/api/obras/' + req.params.id + getTokenFromRequest(req))
        .then(obra => {
            res.render('produtor/obra', {obras: obra.data, user: req.user})
        })
})


module.exports = router;