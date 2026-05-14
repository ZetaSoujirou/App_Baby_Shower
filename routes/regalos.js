const express = require('express');
const router = express.Router();
const regalosController = require('../controllers/regalos.controller');
const { verificarRol } = require('../middlewares/auth.middleware');

// --- RUTAS PÚBLICAS ---
// Cualquier invitado o persona puede ver la lista de regalos
router.get('/', regalosController.obtenerRegalos);

// --- RUTAS PROTEGIDAS (Admin o Anfitrión) ---
// Solo el Webmaster o el que organiza el Baby Shower pueden crear o borrar
router.post('/', verificarRol(['admin', 'anfitrion']), regalosController.crearRegalo);
router.delete('/:id', verificarRol(['admin', 'anfitrion']), regalosController.eliminarRegalo);

// --- RUTAS DE INTERACCIÓN (Invitado o Anfitrión) ---
// Para reservar, necesitamos que sea un invitado o el anfitrión probando
router.put('/:id', verificarRol(['invitado', 'anfitrion']), regalosController.reservarRegalo);

module.exports = router;

