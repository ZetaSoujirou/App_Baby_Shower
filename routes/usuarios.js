const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// Definimos las rutas exactas del contrato (Registro, Login y Editar)
router.post('/registro', usuariosController.registrarUsuario);
router.post('/login', usuariosController.loginUsuario);
router.put('/:id', usuariosController.editarUsuario);

module.exports = router;

