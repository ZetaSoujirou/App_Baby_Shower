const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors'); 
require("dotenv").config();

const Regalo = require('./models/Regalo');
const app = express();

app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo conectado"))
  .catch((err) => console.log("❌ Error Mongo:", err));

// Rutas de Usuarios (Registro/Login)
app.use('/api/usuarios', require('./routes/usuarios'));

// --- RUTAS DE REGALOS ---

// Ver todos los regalos
app.get('/api/regalos', async (req, res) => {
    try {
        // .populate('invitadoId') permite traer los datos del invitado si eres admin
        const lista = await Regalo.find().populate('invitadoId', 'nombre correo');
        res.json(lista);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error', error: error.message });
    }
});

// Reservar un regalo (EL PASO 3)
app.put('/api/regalos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { invitadoId } = req.body; // Recibimos el ID del que logueó

        const regaloActualizado = await Regalo.findByIdAndUpdate(
            id,
            { estado: 'reservado', invitadoId: invitadoId },
            { new: true }
        );
        res.json({ mensaje: '¡Reservado con éxito!', regalo: regaloActualizado });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al reservar', error: error.message });
    }
});

// Crear regalo
app.post('/api/regalos', async (req, res) => {
    try {
        const nuevo = new Regalo(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error', error: error.message });
    }
});

app.get("/", (req, res) => res.send("🚀 API Baby Shower Online"));

app.listen(3000, () => console.log("🔥 Servidor en puerto 3000"));

