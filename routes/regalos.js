const express = require('express');
const router = express.Router();
const regalosController = require('../controllers/regalos.controller');
const { verificarRol } = require('../middlewares/auth.middleware');

// --- RUTAS PÚBLICAS ---
// Cualquier invitado o persona puede ver la lista de regalos
router.get('/', regalosController.obtenerRegalos);

// --- RUTAS PROTEGIDAS (Admin o Anfitrión) ---
// Solo el Webmaster o el que organiza el Baby Shower pueden crear o borrar
router.post('/', verificarRol(['administrador', 'anfitrion']), regalosController.crearRegalo);
router.delete('/:id', verificarRol(['administrador', 'anfitrion']), regalosController.eliminarRegalo);

// --- RUTAS DE INTERACCIÓN (Invitado, Anfitrión o Administrador) ---
// CORREGIDO: Se añade 'administrador' a la lista para permitir liberar y editar desde el panel de control
router.put('/:id', verificarRol(['invitado', 'anfitrion', 'administrador']), regalosController.reservarRegalo);

module.exports = router;

