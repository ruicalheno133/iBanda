var mongoose = require('mongoose')

/* User Schema */
var EventSchema = new mongoose.Schema(
    {
        nome        : {type: String, required: true},
        descricao   : {type: String},
        local       : {type: String},
        data        : {type: Date, required: true},
        aceite      : {type: [String], required: true},
        rejeitado   : {type: [String], required: true}
    }
)

/* Antes de Save executa callback */
EventSchema.pre('save', async function (next){
    this.aceite = []
    this.rejeitado = []
    next()
})

/* Event Model */
var EventModel = mongoose.model('EventSchema', EventSchema ,'eventos')

/* Export Event Model */
module.exports = EventModel