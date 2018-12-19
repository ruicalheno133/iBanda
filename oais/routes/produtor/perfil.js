var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET perfil */
router.get('/', function(req, res) {
   // axios.get('http://localhost:6001/api/users/' + req.params.id)
        
             res.render('produtor/perfil', {user : req.user})
         }
        
);


module.exports = router;