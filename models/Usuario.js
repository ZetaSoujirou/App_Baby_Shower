const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  telefono: { type: String, default: "" },
  // 'anfitrion' es el dueño, 'invitado' es el que regala
  rol: { type: String, enum: ['anfitrion', 'invitado', 'administrador'], default: 'invitado' }
});

module.exports = mongoose.model('Usuario', usuarioSchema);

