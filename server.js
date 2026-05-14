const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors'); 
require("dotenv").config();

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors()); 
app.use(express.json());

// --- CONEXIÓN A BASE DE DATOS (MONGODB ATLAS) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo conectado con éxito"))
  .catch((err) => console.log("❌ Error de conexión a Mongo:", err));

// --- REGISTRO DE RUTAS (API) ---

// 1. Rutas de Usuarios (Registro, Login, Perfiles)
app.use('/api/usuarios', require('./routes/usuarios'));

// 2. Rutas de Regalos (Listado, Creación, Reserva, Eliminación)
// Al usar este archivo, ya aplicamos la seguridad de los roles (Webmaster/Anfitrión/Invitado)
app.use('/api/regalos', require('./routes/regalos')); 

// --- RUTA BASE Y SERVIDOR ---
app.get("/", (req, res) => {
    res.send("🚀 API Baby Shower Online - Backend Funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en el puerto ${PORT}`);
    console.log(`✅ Rutas de Webmaster activas en /api/regalos`);
});

