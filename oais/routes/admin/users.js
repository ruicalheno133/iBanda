var express = require('express');
var formidable = require('formidable')
var encryptPassword = require('encrypt-password')
var UserController = require('../../controllers/userController')
var axios = require('axios')
var router = express.Router();

/* GET página de registo de utlizador */
router.get('/register', function(req, res) {
    res.render("registo");
  });

/* GET lista de utiliadores */
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/users')
         .then(users => {
             res.render('users', {users : users.data})
         })
});



/* GET um utilizador */
router.get('/:id', function(req, res) {
    axios.get('http://localhost:6001/api/users/' + req.params.id)
    .then(user => {
        res.render('user', {user : user.data})
    })
});

/* POST create a user */
router.post('/', function(req, res) {

});

/* PUT altera um utilizador */
router.put('/:id', function(req, res) {

});

module.exports = router;
