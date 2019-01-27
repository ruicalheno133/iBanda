var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET perfil */
router.get('/', function(req, res) {
        res.render('produtor/perfil', {user : req.user})
});

module.exports = router;