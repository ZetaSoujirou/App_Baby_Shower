const mongoose = require('mongoose');

const regaloSchema = new mongoose.Schema({
  nombre_articulo: { type: String, required: true },
  categoria: { type: String, default: 'General' },
  link_compra: { type: String },
  estado: { 
    type: String, 
    enum: ['disponible', 'reservado'], 
    default: 'disponible' 
  },
  // Aquí conectamos con el ID del usuario/invitado
  invitadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Regalo', regaloSchema);
