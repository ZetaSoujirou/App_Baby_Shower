const mongoose = require('mongoose');

const invitadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  confirmado: { type: Boolean, default: false },
  regaloSeleccionado: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Regalo', // Conecta al invitado con un regalo de tu otra tabla
    default: null 
  }
});

module.exports = mongoose.model('Invitado', invitadoSchema);

