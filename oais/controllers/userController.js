var UserModel = require('../models/userModel')

var UserController = {}

/* Lista todos os utilizadores */
UserController.listAll = () => {
    UserModel.find()
} 

/* Adiciona um novo utilizador */
UserController.addUser = (user) => {
    UserModel.insertMany(user)
} 

/* Obtem palavra passe de utilizador */
UserController.getPassword = (username) => {
    UserModel.findOne({username: username}, {_id: 0, password: 1})
} 

/* Exporta o User Controller */
module.exports = UserController