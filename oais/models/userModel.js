var mongoose = require('mongoose')

/* User Schema */
var UserSchema = new mongoose.Schema(
    {
        nome        : {type: String, required: true},
        sexo        : {type: String, required: true},
        email       : {type: String, required: true},
        password    : {type: String, required: true},
        tipo        : {type: String, required: true}
    }
)

/* User Model */
var UserModel = mongoose.model('UserSchema', UserSchema ,'users')

/* Export User Model */
module.exports = UserModel