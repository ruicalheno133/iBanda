var mongoose = require('mongoose')

/* User Schema */
var NoticiaSchema = new mongoose.Schema(
    {
        titulo      : {type: String, required: true},
        texto       : {type: String},
        data        : {type: Date, required: true},
    }
)

/* Event Model */
var NoticiaModel = mongoose.model('NoticiaSchema', NoticiaSchema ,'noticias')

/* Export Event Model */
module.exports = NoticiaModel