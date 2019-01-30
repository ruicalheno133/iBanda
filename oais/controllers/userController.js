var UserModel = require('../models/userModel')

var UserController = {}

/* Lista todos os utilizadores */
UserController.listAll = () => {
    return UserModel.find()
                    .sort({nome: 1})
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

/* Atualiza a foto de Perfil */
UserController.updateProfilePic = (id, profile_pic) => {
    return UserModel.update({ _id: id},
                    { $set: { 
                        'profile_pic': profile_pic
                    }
                }).exec()
}

/* Exporta o User Controller */
module.exports = UserController