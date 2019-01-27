var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET lista de obras*/
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/obras')
         .then(obras => {
             res.render('admin/obras', {obras: obras.data})
         })
         .catch(err => {
            res.render('error', {error:err})
        })
});

router.get('/:id', (req,res) => {
    axios.get('http://localhost:6001/api/obras/' + req.params.id)
        .then(obras => {
            res.render('admin/obra', {obras: obras.data})
        })
})

module.exports = router;