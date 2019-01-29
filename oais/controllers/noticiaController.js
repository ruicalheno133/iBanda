var NoticiaModel = require('../models/noticiaModel')

var NoticiaController = {}

/* Lista todos os eventos */
NoticiaController.listAll = () => {
    return NoticiaModel.find()
                       .exec()
} 

/* Lista um determinado evento */
NoticiaController.getNoticiaById = (id) => {
    return NoticiaModel.findOne({_id: id})
                       .exec()
} 

/* Adiciona um novo evento */
NoticiaController.addNoticia = (event) => {
    return NoticiaModel.create(event)
} 

/* Remove um evento */
NoticiaController.removeNoticia = (id) => {
    return NoticiaModel.findByIdAndDelete(id)
                       .exec()
}

/* Atualiza um evento */
NoticiaController.updateNoticia = (id, event) => {
    return NoticiaModel.findByIdAndUpdate(id, event)
                       .exec()
}

/* Exporta o Event Controller */
module.exports = NoticiaController