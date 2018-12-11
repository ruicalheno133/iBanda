var mongoose = require('mongoose')

/* User Schema */
var EventSchema = new mongoose.Schema(
    {
        nome        : {type: String, required: true},
        descricao   : {type: String},
        local       : {type: String},
        data        : {type: String, required: true},
        hora        : {type: String, required: true},
        aceite      : {type: [String], required: true},
        rejeitado   : {type: [String], required: true}
    }
)

/* Event Model */
var EventModel = mongoose.model('EventSchema', EventSchema ,'eventos')

/* Export Event Model */
module.exports = EventModel