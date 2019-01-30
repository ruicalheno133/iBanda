var NoticiaModel = require('../models/noticiaModel')

var NoticiaController = {}

/* Lista todas as noticias */
NoticiaController.listAll = () => {
    return NoticiaModel.find()
                       .exec()
} 

/* Lista uma determinada noticia */
NoticiaController.getNoticiaById = (id) => {
    return NoticiaModel.findOne({_id: id})
                       .exec()
} 

/* Adiciona uma nova noticia */
NoticiaController.addNoticia = (noticia) => {
    return NoticiaModel.create(noticia)
} 

/* Torna notícia visível */
NoticiaController.makeVisible = (noticia) => {
    return NoticiaModel.findByIdAndUpdate(noticia, {visibilidade: true})
                       .exec()
} 

/* Torna notícia não visível */
NoticiaController.makeNotVisible = (noticia) => {
    return NoticiaModel.findByIdAndUpdate(noticia, {visibilidade: false})
                       .exec()
} 

/* Remove uma noticia */
NoticiaController.removeNoticia = (id) => {
    return NoticiaModel.findByIdAndDelete(id)
                       .exec()
}

/* Atualiza uma noticia */
NoticiaController.updateNoticia = (id,noticia) => {
    return NoticiaModel.findByIdAndUpdate(id,noticia)
                       .exec()
}

/* Exporta o Event Controller */
module.exports = NoticiaController