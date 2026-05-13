const Usuario = require('../models/Usuario');

// RF-01: Registro de Usuario (Anfitrión o Invitado)
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body; // Agregamos 'rol' aquí
    
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ mensaje: "El correo ya está en uso" });

    // Si no se envía un rol, por defecto será 'invitado'
    const nuevo = new Usuario({ 
      nombre, 
      correo, 
      contrasena, 
      rol: rol || 'invitado' 
    });
    
    await nuevo.save();
    
    // Devolvemos el usuario creado para confirmar que se guardó el rol
    res.status(201).json({ mensaje: "Usuario creado con éxito", usuario: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar", error: error.message });
  }
};

// RF-02: Inicio de Sesión (Login)
exports.loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    // Buscamos al usuario. Al no usar .select(), traerá todos los campos incluyendo el 'rol'
    const usuario = await Usuario.findOne({ correo, contrasena });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // Devolvemos el objeto completo para que el frontend vea el rol
    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

// RF-04: Editar Perfil
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

