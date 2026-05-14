// middleware/auth.middleware.js

// Este middleware verifica si el usuario tiene el rol necesario
exports.verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // En un sistema real, aquí leerías el usuario desde un Token (JWT)
        // Por ahora, asumiremos que el frontend envía el rol en los headers o body para pruebas
        const rolUsuario = req.headers['x-user-role']; 

        if (!rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({ 
                mensaje: "Acceso denegado: No tienes los permisos de " + rolesPermitidos.join(' o ') 
            });
        }
        next();
    };
};

