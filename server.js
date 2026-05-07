const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Regalo = require('./models/Regalo');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());





// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ Mongo conectado");
})
.catch((err) => {
    console.log("❌ Error Mongo:");
    console.log(err);
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("🚀 Servidor funcionando");
});

// Ruta para reservar un regalo (PUT)
app.put('/api/regalos/:id', async (req, res) => {
    try {
        const { id } = req.params; // Sacamos el ID del regalo desde la URL
        const { invitado } = req.body; // Recibimos los datos de la persona

        const regaloActualizado = await Regalo.findByIdAndUpdate(
            id,
            { 
                estado: 'reservado', 
                invitado: invitado 
            },
            { returnDocument: 'after' } // Esto le dice a Mongoose que nos devuelva el dato ya modificado
        );

        if (!regaloActualizado) {
            return res.status(404).json({ mensaje: 'Regalo no encontrado' });
        }

        res.json({ mensaje: '¡Regalo reservado con éxito!', regalo: regaloActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al reservar el regalo', error: error.message });
    }
});

// Ruta para cancelar una reserva (PUT)
app.put('/api/regalos/:id/cancelar', async (req, res) => {
    try {
        const { id } = req.params; 

        const regaloCancelado = await Regalo.findByIdAndUpdate(
            id,
            { 
                estado: 'disponible', 
                invitado: { nombre: "", email: "" } // Limpiamos los datos
            },
            { returnDocument: 'after' } 
        );

        if (!regaloCancelado) {
            return res.status(404).json({ mensaje: 'Regalo no encontrado' });
        }

        res.json({ mensaje: '¡Reserva cancelada, regalo disponible nuevamente!', regalo: regaloCancelado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cancelar la reserva', error: error.message });
    }
});

// Ruta para eliminar un regalo de la lista (DELETE)
app.delete('/api/regalos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const regaloEliminado = await Regalo.findByIdAndDelete(id);

        if (!regaloEliminado) {
            return res.status(404).json({ mensaje: 'Regalo no encontrado' });
        }

        res.json({ mensaje: '¡Regalo eliminado de la lista con éxito!' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el regalo', error: error.message });
    }
});

// Puerto
const PORT = 3000;

// Ruta para crear un nuevo regalo (POST)
app.post('/api/regalos', async (req, res) => {
    try {
        const nuevoRegalo = new Regalo(req.body);
        await nuevoRegalo.save();
        res.status(201).json({ mensaje: '¡Regalo guardado con éxito!', regalo: nuevoRegalo });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al guardar el regalo', error: error.message });
    }
});

// Ruta para ver todos los regalos (GET)
app.get('/api/regalos', async (req, res) => {
    try {
        const listaRegalos = await Regalo.find();
        res.json(listaRegalos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los regalos', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});
