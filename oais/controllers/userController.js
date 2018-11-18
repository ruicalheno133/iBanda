var UserModel = require('../models/userModel')

var UserController = {}

/* Lista todos os utilizadores */
UserController.listAll = () => {
    return UserModel.find()
} 

/* Lista um determinado utilizador */
UserController.getUser = (id) => {
    return UserModel.findOne({_id: id})
} 

/* Adiciona um novo utilizador */
UserController.addUser = (user) => {
    UserModel.insertMany(user)
} 

/* Obtem palavra passe de utilizador */
UserController.getPassword = (username) => {
    return UserModel.findOne({username: username}, {_id: 0, password: 1})
} 

/* Exporta o User Controller */
module.exports = UserController