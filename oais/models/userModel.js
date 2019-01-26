var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

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

/* Antes de Save executa callback */
UserSchema.pre('save', async function (next){
    var hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

/* Antes de Save executa callback */
UserSchema.pre('update', async function (next){
    var hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

/* Metodo para verificar password */
UserSchema.methods.isValidPassword = async function (password) {
    var compare = await bcrypt.compare(password, this.password)
    return compare
}

/* User Model */
var UserModel = mongoose.model('UserSchema', UserSchema ,'users')

/* Export User Model */
module.exports = UserModel