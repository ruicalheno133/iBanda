var mongoose = require('mongoose')

/* Noticia Schema */
var NoticiaSchema = new mongoose.Schema(
    {
        titulo      : {type: String, required: true},
        texto       : {type: String},
        fonte       : {type: String},
        visibilidade: {type: Boolean, required: true},
        data        : {type: Date, required: true}
    }
)


/* Noticia Model */
var NoticiaModel = mongoose.model('NoticiaSchema', NoticiaSchema ,'noticias')

/* Export Noticia Model */
module.exports = NoticiaModel