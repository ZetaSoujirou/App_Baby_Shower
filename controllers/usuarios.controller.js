const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken'); // <-- ASEGÚRATE DE TENER ESTA LÍNEA ARRIBA

// RF-01: Registro de Usuario (Se queda como lo tenías)
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ mensaje: "El correo ya está en uso" });

    const nuevo = new Usuario({ 
      nombre, 
      correo, 
      contrasena, 
      rol: rol || 'invitado' 
    });
    
    await nuevo.save();
    res.status(201).json({ mensaje: "Usuario creado con éxito", usuario: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar", error: error.message });
  }
};

// RF-02: Inicio de Sesión (REEMPLAZA ESTA FUNCIÓN COMPLETA)
exports.loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const usuario = await Usuario.findOne({ correo, contrasena });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // 1. GENERAMOS LA LLAVE (TOKEN) CON EL ROL
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' } 
    );

    // 2. EXTRAEMOS DATOS SIN LA CONTRASEÑA
    const { contrasena: _, ...datosPublicos } = usuario._doc;

    // 3. RESPONDEMOS CON TODO
    res.status(200).json({ 
      mensaje: "Login exitoso",
      usuario: datosPublicos,
      token: token 
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

// RF-04: Editar Perfil (Se queda igual)
exports.editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const usuarioEditado = await Usuario.findByIdAndUpdate(
        id, 
        datosActualizados, 
        { new: true }
    );

    if (!usuarioEditado) {
      return res.status(400).json({ mensaje: "Error al actualizar: Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Perfil actualizado", usuario: usuarioEditado }); 
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
  }
};

