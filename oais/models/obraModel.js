var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId;

/* Instrumento Schema */
var PartituraSchema = new mongoose.Schema(
    {
        path          : {type: String, required: true},
        voz           : {type: String},
        clave         : {type: String}
    }
)

/* Instrumento Schema */
var InstrumentoSchema = new mongoose.Schema(
    {
        nome        : {type: String, required: true},
        partitura   : {type: PartituraSchema},
    }
)

/* Obra Schema */
var ObraSchema = new mongoose.Schema(
    {
        _id             : {type: String, required: true},
        titulo          : {type: String, required: true},
        tipo            : {type: String},
        compositor      : {type: String},
        criador         : {type: String},
        criador_id      : {type: ObjectId},
        instrumentos    : {type: [InstrumentoSchema]}
    }
)

/* obra Model */
var ObraModel = mongoose.model('ObraSchema', ObraSchema ,'obras')

/* Export obra Model */
module.exports = ObraModel