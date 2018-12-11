var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET lista de obras*/
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/obras')
         .then(obras => {
             res.render('musico/obras', {obras: obras.data})
         })
});


module.exports = router;