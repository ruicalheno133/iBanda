var UserModel = require('../models/userModel')

var UserController = {}

/* Lista todos os utilizadores */
UserController.listAll = () => {
    return UserModel.find()
                    .exec()
} 

/* Adiciona um novo utilizador */
UserController.addUser = (user) => {
    return UserModel.create(user)
} 

/* Remove um utilizador */
UserController.removeUser = (id) => {
    return UserModel.findByIdAndRemove(id)
             .exec()
}

/* Atualiza um utilizador */
UserController.updateUser = (id, user) => {
    return UserModel.findByIdAndUpdate(id, user)
             .exec()
}

/* Obtem determinado utilizador */
UserController.getUserByEmail = (email) => {
    return UserModel.findOne({email: email})
                    .exec()
}

/* Obtem determinado utilizador */
UserController.getUserById = (id) => {
    return UserModel.findById(id)
                    .exec()
} 

/* Exporta o User Controller */
module.exports = UserController