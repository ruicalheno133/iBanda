var EventModel = require('../models/eventModel')

var EventController = {}

/* Lista todos os eventos */
EventController.listAll = () => {
    return EventModel.find()
                    .exec()
} 

/* Lista um determinado evento */
EventController.getEventById = (id) => {
    return EventModel.findOne({_id: id})
                     .exec()
} 

/* Adiciona um novo evento */
EventController.addEvent = (event) => {
    EventModel.create(event)
} 

/* Remove um evento */
EventController.removeEvent = (id) => {
    EventModel.findByIdAndDelete(id).exec()
}

/* Atualiza um evento */
EventController.updateEvent = (id, Event) => {
    EventModel.findByIdAndUpdate(id, Event, {upsert: true})
             .exec()
}

/* Exporta o Event Controller */
module.exports = EventController