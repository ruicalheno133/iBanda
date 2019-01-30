var ObraModel = require('../models/ObraModel')

var ObraController = {}

/* Lista todos os Obras
   Por ordem alfabética
*/
ObraController.listAll = () => {
    return ObraModel.find()
                    .sort({titulo: 1})
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

/* Exporta o Obra Controller */
module.exports = ObraController