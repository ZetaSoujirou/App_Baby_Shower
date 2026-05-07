const mongoose = require('mongoose');

// Creamos el "molde" de cómo debe verse exactamente un Regalo
const regaloSchema = new mongoose.Schema({
    nombre_articulo: { 
        type: String, 
        required: true // Obligatorio
    },
    categoria: { 
        type: String, 
        default: 'General'
    },
    link_compra: { 
        type: String 
    },
    estado: { 
        type: String, 
        enum: ['disponible', 'reservado'], // Solo acepta estas dos palabras
        default: 'disponible' 
    },
    // Datos de la persona que lo regala (al principio estará vacío)
    invitado: {
        nombre: { type: String },
        email: { type: String }
    }
}, {
    timestamps: true // Esto agregará automáticamente la fecha de creación
});

// Exportamos el modelo para usarlo en el server.js
module.exports = mongoose.model('Regalo', regaloSchema);
