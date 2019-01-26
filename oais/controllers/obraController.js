var ObraModel = require('../models/ObraModel')

var ObraController = {}

/* Lista todos os Obras */
ObraController.listAll = () => {
    return ObraModel.find()
                    .exec()
} 

/* Lista um determinado Obra */
ObraController.getObraById = (id) => {
    return ObraModel.findOne({_id: id})
                    .exec()
} 

/* Adiciona um novo Obra */
ObraController.addObra = (obra) => {
    return ObraModel.create(obra)
} 

/* Remove um Obra */
ObraController.removeObra = (id) => {
    return ObraModel.findByIdAndDelete(id)
                    .exec()
}

/* Atualiza um Obra */
ObraController.updateObra = (id, obra) => {
    return ObraModel.findByIdAndUpdate(id, obra)
                    .exec()
}

/* Exporta o Obra Controller */
module.exports = ObraController