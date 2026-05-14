const mongoose = require('mongoose');

const regaloSchema = new mongoose.Schema({
  // Cambiamos 'nombre_articulo' por 'nombre' para que coincida con Laravel
  nombre: { type: String, required: true },
  
  // Agregamos descripción porque el frontend la está enviando
  descripcion: { type: String, default: '' },
  
  // Cambiamos 'link_compra' por 'url_imagen' o como lo llame tu colega
  url_imagen: { type: String, default: '' },

  categoria: { type: String, default: 'General' },
  estado: { 
    type: String, 
    enum: ['disponible', 'reservado'], 
    default: 'disponible' 
  },
  invitadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Regalo', regaloSchema);

