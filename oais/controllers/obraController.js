var ObraModel = require('../models/ObraModel')

var ObraController = {}

/* Lista todas as Obras
   Por ordem alfabética
*/
ObraController.listAll = () => {
    return ObraModel.find()
                    .sort({titulo: 1})
                    .exec()
} 

/* Lista uma determinado Obra */
ObraController.getObraById = (id) => {
    return ObraModel.findOne({_id: id})
                    .exec()
} 

/* Adiciona uma nova Obra */
ObraController.addObra = (obra) => {
    return ObraModel.create(obra)
} 

/* Remove uma Obra */
ObraController.removeObra = (id) => {
    return ObraModel.findByIdAndDelete(id)
                    .exec()
}

/* Exporta o Obra Controller */
module.exports = ObraController