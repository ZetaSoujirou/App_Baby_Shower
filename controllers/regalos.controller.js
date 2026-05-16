const Regalo = require('../models/Regalo');
const nodemailer = require('nodemailer'); // Importamos Nodemailer

// Configuración del transportador de correos (Usa las variables de tu archivo .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

// Reservar o Liberar un regalo (Dinámico + Automatización de Email)
exports.reservarRegalo = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, invitadoId, guest_name, guest_email } = req.body; // Leemos los nuevos datos de correo

        // Preparamos los cambios dinámicamente
        let actualizaciones = {};

        if (estado) {
            actualizaciones.estado = estado;
        }

        // SI EL ESTADO ES DISPONIBLE: Significa que el Admin lo liberó, por ende borramos al invitado
        if (estado === 'disponible') {
            actualizaciones.invitadoId = null;
        } else if (invitadoId) {
            // Si es una reserva normal, le asignamos el ID del invitado para vincularlo en Mongo
            actualizaciones.invitadoId = invitadoId;
        }

        const regaloActualizado = await Regalo.findByIdAndUpdate(
            id,
            actualizaciones,
            { new: true }
        ).populate('invitadoId', 'nombre correo');

        // AUTOMATIZACIÓN: Si se reserva con éxito y el invitado ingresó su correo, se dispara Nodemailer
        if (estado === 'reservado' && guest_email) {
            const mailOptions = {
                from: `"Baby Shower 🍼" <${process.env.EMAIL_USER}>`,
                to: guest_email,
                subject: '✨ ¡Gracias por reservar tu regalo! ✨',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; background-color: #ffffff;">
                        <h2 style="color: #4f46e5; text-align: center; margin-bottom: 8px;">¡Hola, ${guest_name}!</h2>
                        <p style="font-size: 16px; color: #334155; text-align: center; line-height: 1.5; margin-top: 0;">
                            Queremos agradecerte de todo corazón por confirmar tu presente para nuestro Baby Shower.
                        </p>
                        <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #4f46e5;">
                            <p style="margin: 0; font-weight: bold; color: #1e293b; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Regalo Registrado:</p>
                            <p style="margin: 6px 0 0 0; color: #4f46e5; font-size: 20px; font-weight: bold;">🎁 ${regaloActualizado.nombre}</p>
                            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Descripción: ${regaloActualizado.descripcion || 'Sin descripción adicional'}</p>
                        </div>
                        <p style="font-size: 15px; color: #475569; text-align: center;">
                            Tu selección ha quedado bloqueada en el sistema para que nadie más la repita. ¡Nos vemos muy pronto para celebrar juntos!
                        </p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
                            Sistema de Notificaciones Automáticas - Fenrir SPA.
                        </p>
                    </div>
                `
            };

            // Envío asíncrono del correo
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('❌ Error en Nodemailer:', error.message);
                } else {
                    console.log('📧 Notificación enviada con éxito a:', guest_email);
                }
            });
        }

        res.json({ mensaje: 'Regalo actualizado con éxito', regalo: regaloActualizado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al procesar la acción', error: error.message });
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

