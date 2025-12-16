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
// Permitir orígenes configurables: usar FRONTEND_URL en producción o caer al fallback con orígenes locales
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://gameorki-production.up.railway.app';
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:4200",
  "http://127.0.0.1:4200",
  "http://localhost:4201",
  "http://127.0.0.1:4201",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

console.log('✅ Allowed CORS origins:', allowedOrigins);

// Logear las peticiones entrantes para debug (se puede remover luego)
app.use((req, res, next) => {
  // Solo registrar peticiones relevantes para no llenar logs
  if (req.originalUrl.startsWith('/api/auth')) {
    console.log(`➡️ ${new Date().toISOString()} - Incoming request: ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin || 'no-origin'}`);
  }
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (ej. curl, Postman)
      console.log('🔎 CORS check for origin:', origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: origin not allowed'), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  })
);

// Asegurar que las peticiones OPTIONS siempre reciban respuesta para permitir preflight
app.options('*', cors());
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