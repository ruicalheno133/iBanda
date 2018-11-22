var express = require('express');
var formidable = require('formidable')
var encryptPassword = require('encrypt-password')
var UserController = require('../../controllers/userController')
var router = express.Router();

/* GET Lists users */
router.get('/', function(req, res) {
  UserController.listAll()
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.render('erro', {error: err})
                })
});

/* GET one specific user */
router.get('/:id', function(req, res) {
  UserController.getUser(req.params.id)
                .then(dados => {
                  res.jsonp(dados)
                })
                .catch(err => {
                  res.render('erro', {error: err})
                })
});

/* POST create a user */
router.post('/', function(req, res) {
  /* Gets form data from request body */
  var form = new formidable.IncomingForm();

  /* Parses the form */
  form.parse(req, (err, fields, files)=>{
    if (!err){
      fields.password = encryptPassword(fields.password, 'signatrue')
      /* Adds user to Database */
      UserController.addUser(fields)
      res.end()
    } else {
      res.render("error", {error: err})
    }
  })
});

/* PUT updates a user */
router.put('/:id', function(req, res) {
    /* Gets form data from request body */
    var form = new formidable.IncomingForm();

    /* Parses the form */
    form.parse(req, (err, fields, files)=>{
      if (!err){
        /* Adds user to Database */
        UserController.updateUser(req.params.id, fields)
        res.end()
      } else {
        res.render("error", {error: err})
      }
    })

});

/* DELETE removes a specific user */
router.delete('/:id', function(req, res) {
  UserController.removeUser(req.params.id)
  res.end()
});

module.exports = router;
