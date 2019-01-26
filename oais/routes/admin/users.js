var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GET página de registo de utlizador */
router.get('/register', function(req, res) {
    res.render("admin/registo");
  });

/* GET lista de utiliadores */
router.get('/', function(req, res) {
    axios.get('http://localhost:6001/api/users' )
         .then(users => {
             res.render('admin/users', {users : users.data})
         })
         .catch(err => {
             res.render('error', {error:err})
         })
});

/* GET um utilizador */
router.get('/:id', function(req, res) {
    axios.get('http://localhost:6001/api/users/' + req.params.id)
    .then(user => {
        res.render('admin/user', {user : user.data})
    })
    .catch(err => {
        res.render('error', {error:err})
    })
});

/* POST create a user */
router.post('/', function(req, res) {

});

/* PUT altera um utilizador */
router.put('/:id', function(req, res) {

});

module.exports = router;
