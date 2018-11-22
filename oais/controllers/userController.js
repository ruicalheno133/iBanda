var UserModel = require('../models/userModel')

var UserController = {}

/* Lista todos os utilizadores */
UserController.listAll = () => {
    return UserModel.find()
                    .exec()
} 

/* Lista um determinado utilizador */
UserController.getUser = (id) => {
    return UserModel.findOne({_id: id})
                    .exec()
} 

/* Adiciona um novo utilizador */
UserController.addUser = (user) => {
    UserModel.create(user)
} 

/* Remove um utilizador */
UserController.removeUser = (id) => {
    UserModel.findByIdAndDelete(id).exec()
}

/* Atualiza um utilizador */
UserController.updateUser = (id, user) => {
    UserModel.findByIdAndUpdate(id, user, {upsert: true})
             .exec()
}

/* Obtem palavra passe de utilizador */
UserController.getPassword = (username) => {
    return UserModel.findOne({username: username}, {_id: 0, password: 1})
} 

/* Exporta o User Controller */
module.exports = UserController