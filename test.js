require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ Mongo conectado");
})
.catch((err) => {
    console.log("❌ Error:");
    console.log(err);
});
