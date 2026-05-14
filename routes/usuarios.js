const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificarRol } = require('../middlewares/auth.middleware'); // Importamos tu nuevo middleware

// RF-01 y RF-02: Rutas Públicas (Cualquiera entra)
router.post('/registro', usuariosController.registrarUsuario);
router.post('/login', usuariosController.loginUsuario);

// RF-04: Ruta Protegida (¡SOLO EL ADMIN PUEDE ENTRAR!)
// Agregamos el middleware antes del controlador
router.put('/editar/:id', verificarRol(['admin']), usuariosController.editarUsuario);

module.exports = router;

