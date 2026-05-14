const Regalo = require('../models/Regalo');

// Ver todos los regalos
exports.obtenerRegalos = async (req, res) => {
    try {
        const lista = await Regalo.find().populate('invitadoId', 'nombre correo');
        res.json(lista);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener regalos', error: error.message });
    }
};

// Crear un regalo nuevo (Solo Admin/Anfitrión)
exports.crearRegalo = async (req, res) => {
    try {
        const nuevo = new Regalo(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear regalo', error: error.message });
    }
};

// Reservar un regalo (Invitado/Anfitrión)
exports.reservarRegalo = async (req, res) => {
    try {
        const { id } = req.params;
        const { invitadoId } = req.body;
        const regaloActualizado = await Regalo.findByIdAndUpdate(
            id,
            { estado: 'reservado', invitadoId: invitadoId },
            { new: true }
        );
        res.json({ mensaje: '¡Reservado con éxito!', regalo: regaloActualizado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al reservar', error: error.message });
    }
};

// Eliminar un regalo (Solo Admin/Anfitrión)
exports.eliminarRegalo = async (req, res) => {
    try {
        const { id } = req.params;
        await Regalo.findByIdAndDelete(id);
        res.json({ mensaje: 'Regalo eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
};

