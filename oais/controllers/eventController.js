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
    return EventModel.create(event)
} 

/* Remove um evento */
EventController.removeEvent = (id) => {
    return EventModel.findByIdAndDelete(id)
                     .exec()
}

/* Atualiza um evento */
EventController.updateEvent = (id, event) => {
    return EventModel.findByIdAndUpdate(id, event)
                     .exec()
}

/* Exporta o Event Controller */
module.exports = EventController