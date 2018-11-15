var mongoose = require('mongoose')

/* User Schema */
var UserSchema = new mongoose.Schema(
    {
        id : {type: String},
        nome : {type: String},
        email : {type: String},
        password : {type: String}
    }
)

/* User Model */
var UserModel = mongoose.model('UserSchema', UserSchema)

/* Export User Model */
module.exports = UserModel