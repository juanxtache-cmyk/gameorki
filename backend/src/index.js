const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const { DataSource } = require("typeorm")
const routes = require("./routes")
const dbConfig = require("./config/database")

// Cargar variables de entorno desde el archivo .env del backend
dotenv.config({ path: path.join(__dirname, "../.env") })

// Crear la aplicación Express
const app = express()
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors())

app.use(express.json())

// Servir archivos estáticos (para archivos de prueba)
app.use('/test', express.static(path.join(__dirname, '../../')))

// Rutas
app.use("/api", routes)

// Crear DataSource para TypeORM 0.3.x
const AppDataSource = new DataSource(dbConfig);

// Exportar AppDataSource para uso en controladores
global.AppDataSource = AppDataSource;

// Conectar a la base de datos y luego iniciar el servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida")
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error)
  })
