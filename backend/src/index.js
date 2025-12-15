const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { DataSource } = require("typeorm");

// Cargar rutas
const routes = require("./routes");

// Configuración de la base de datos
const dbConfig = require("./config/database");

// Cargar variables de entorno (.env)
dotenv.config({ path: path.join(__dirname, "../.env") });

// Crear app Express
const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// MIDDLEWARES
// ======================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// RUTAS
// ======================
app.use("/api", routes);

// Ruta de prueba (opcional)
app.get("/", (req, res) => {
  res.send("🚀 Backend GameOrki funcionando correctamente");
});

// ======================
// DATABASE (TypeORM)
// ======================
const AppDataSource = new DataSource(dbConfig);

// Hacer accesible el DataSource globalmente
global.AppDataSource = AppDataSource;

// ======================
// INICIAR SERVIDOR
// ======================
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conectado a la base de datos");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
  });
