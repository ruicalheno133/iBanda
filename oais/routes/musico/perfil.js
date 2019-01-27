var express = require('express');
var axios = require('axios')
var router = express.Router();

//Ainda é preciso atualizar esta parte, de maneira a que o utilizador atualize a sua informação!
router.get('/',(req,res)=>{
    console.log(req.user)
    res.render('musico/perfil', {user: req.user})
});

module.exports = router;