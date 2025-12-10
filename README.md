# Game Store - Tienda de Videojuegos

Una aplicación web completa de comercio electrónico para videojuegos desarrollada con Angular 19 en el frontend y Node.js/Express con TypeORM en el backend.

## 📋 Descripción del Proyecto

Game Store es una plataforma de venta de videojuegos que incluye:
- Catálogo de juegos con búsqueda y filtros
- Sistema de autenticación de usuarios
- Carrito de compras y procesamiento de órdenes
- Panel de administración para gestión de productos
- Foro comunitario para discusiones
- Sistema de temas visuales (dark, cyberpunk, retro)
- Generación de recibos en PDF
- Funcionalidad de captura de pantalla

## 🚀 Tecnologías Utilizadas

### Frontend (Angular 19)
- **Framework**: Angular 19.2.0 con componentes standalone
- **Lenguaje**: TypeScript 5.7.2
- **Estilos**: TailwindCSS 4.1.14 con animaciones
- **Librerías adicionales**:
  - HTML2Canvas para capturas de pantalla
  - jsPDF para generación de PDFs
  - RxJS para programación reactiva

### Backend (Node.js)
- **Runtime**: Node.js con Express.js 4.21.2
- **Lenguaje**: JavaScript/TypeScript
- **ORM**: TypeORM 0.3.24
- **Base de datos**: MySQL 2
- **Autenticación**: JWT (jsonwebtoken)
- **Seguridad**: bcrypt para hash de contraseñas
- **Email**: Nodemailer para envío de correos
- **CORS**: Configurado para múltiples orígenes

### Base de Datos
- **MySQL** con las siguientes entidades:
  - Users (usuarios)
  - Games (juegos)
  - Cart (carrito)
  - Orders & OrderItems (órdenes y items)
  - Forum, Threads, Posts (sistema de foro)

## 📁 Estructura del Proyecto

```
Game_Store/
├── src/                          # Frontend Angular
│   ├── app/
│   │   ├── components/          # Componentes Angular
│   │   ├── services/           # Servicios
│   │   ├── models/             # Modelos de datos
│   │   ├── interceptors/       # Interceptores HTTP
│   │   └── shared/             # Componentes compartidos
│   ├── public/                 # Assets públicos
│   └── styles/                 # Estilos globales
├── backend/                     # Backend Node.js
│   ├── src/
│   │   ├── controllers/        # Controladores de rutas
│   │   ├── entities/           # Entidades TypeORM
│   │   ├── routes/             # Definición de rutas
│   │   ├── middleware/         # Middleware personalizado
│   │   ├── utils/              # Utilidades (email, etc.)
│   │   └── config/             # Configuración DB
│   └── scripts/                # Scripts de inicialización
├── database/                   # Scripts SQL
├── docs/                       # Documentación
└── public/                     # Assets estáticos
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- MySQL Server
- Angular CLI (`npm install -g @angular/cli`)

### Configuración del Backend

1. **Navegar al directorio del backend**:
```bash
cd backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar base de datos**:
   - Crear una base de datos MySQL llamada `game_store_db`
   - Importar el archivo `database/gamestore_mysql.sql`
   - Crear archivo `.env` en el directorio `backend/` con:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=game_store_db
JWT_SECRET=tu_jwt_secret
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

4. **Iniciar el servidor de desarrollo**:
```bash
npm run dev
```
El backend estará disponible en `http://localhost:3000`

### Configuración del Frontend

1. **En el directorio raíz del proyecto**:
```bash
npm install
```

2. **Iniciar el servidor de desarrollo**:
```bash
ng serve
```
El frontend estará disponible en `http://localhost:4200`

## 📱 Funcionalidades Principales

### Para Usuarios
- ✅ Registro y autenticación de usuarios
- ✅ Navegación del catálogo de juegos
- ✅ Búsqueda y filtrado de productos
- ✅ Gestión del carrito de compras
- ✅ Procesamiento de órdenes
- ✅ Historial de compras con recibos PDF
- ✅ Participación en foros comunitarios
- ✅ Múltiples temas visuales

### Para Administradores
- ✅ Panel de administración completo
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de usuarios
- ✅ Moderación del foro
- ✅ Estadísticas de ventas

### Características Técnicas
- ✅ Arquitectura de componentes standalone (Angular 19)
- ✅ Interceptores HTTP para autenticación
- ✅ Diseño responsive con TailwindCSS
- ✅ Capturas de pantalla integradas
- ✅ Sistema de temas dinámicos
- ✅ API RESTful con TypeORM

## 🧪 Testing

### Frontend
```bash
ng test
```

### Backend
Los archivos de prueba están disponibles en `backend/test-*.js`:
```bash
node backend/test-backend.js
node backend/test-cart.js
node backend/test-email.js
node backend/test-register.js
```

## 📦 Construcción para Producción

### Frontend
```bash
ng build --configuration production
```

### Backend
```bash
npm start
```

### Evidencia de la migración:
- ✅ Configuración completa de Angular (angular.json, tsconfig.json)
- ✅ Dependencias Angular en package.json
- ✅ Componentes standalone Angular en uso
- ✅ Bootstrap de aplicación Angular en main.ts
- ✅ Servicios, interceptores y routing Angular

## 🤝 Contribución

Para contribuir a este proyecto, es necesario seguir el proceso de **Fork y Pull Request**:

### Proceso de Contribución:

1. **Haz un Fork del repositorio**
   - Haz clic en el botón "Fork" en la esquina superior derecha del repositorio
   - Esto creará una copia del proyecto en tu cuenta de GitHub

2. **Clona tu fork localmente**
   ```bash
   git clone https://github.com/TU_USUARIO/Game_Store.git
   cd Game_Store
   ```

3. **Configura el repositorio upstream**
   ```bash
   git remote add upstream https://github.com/ElRayoRapido09/Game_Store.git
   ```

4. **Mantén tu fork actualizado**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

5. **Realiza tus cambios directamente en main**
   ```bash
   git add .
   git commit -m 'Add: descripción clara de tu cambio'
   ```

6. **Push directo a la rama main de tu fork**
   ```bash
   git push origin main
   ```

7. **Crea un Pull Request**
   - Ve a tu fork en GitHub
   - Haz clic en "Compare & pull request" 
   - El PR se creará desde `tu-fork/main` hacia `ElRayoRapido09/main`
   - Describe claramente los cambios realizados
   - Espera la revisión y aprobación

### Directrices para Contribuciones:
- ✅ Sigue las convenciones de código existentes
- ✅ Incluye pruebas para nuevas funcionalidades
- ✅ Actualiza la documentación si es necesario
- ✅ Usa mensajes de commit descriptivos
- ✅ Una funcionalidad por Pull Request

**Nota**: Solo se aceptan contribuciones a través de Pull Requests desde forks. No se aceptan pushes directos al repositorio principal.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 📞 Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**Estado del proyecto**: ✅ Completamente funcional con Angular 19 + Node.js/Express + MySQL