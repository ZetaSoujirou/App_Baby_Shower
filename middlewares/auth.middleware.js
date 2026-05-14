const jwt = require('jsonwebtoken');

exports.verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // 1. Obtener el token del header (Authorization: Bearer TOKEN)
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ mensaje: "No hay token, autorización denegada" });
        }

        try {
            // 2. Verificar el token usando tu clave secreta
            // Asegúrate de tener JWT_SECRET en tu archivo .env
            const cifrado = jwt.verify(token, process.env.JWT_SECRET);
            
            // 3. Guardar los datos del usuario en la petición
            req.usuario = cifrado;

            // 4. Validar si el rol que viene en el TOKEN está permitido
            if (!rolesPermitidos.includes(req.usuario.rol)) {
                return res.status(403).json({ 
                    mensaje: "Acceso denegado: No tienes los permisos de " + rolesPermitidos.join(' o ') 
                });
            }

            next();
        } catch (error) {
            res.status(401).json({ mensaje: "Token no es válido" });
        }
    };
};
