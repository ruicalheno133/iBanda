var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET perfil */
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/users')
         .then(users => {
             res.render('produtor/perfil', {user: users.data})
         })
         .catch(err => {
            res.render('error', {error:err})
        })
});


module.exports = router;