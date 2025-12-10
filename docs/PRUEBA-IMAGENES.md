# URLs de Imágenes de Prueba

## URLs que FUNCIONAN (100% garantizado):

### 1. Imágenes de Lorem Picsum (servicio de imágenes placeholder)
- `https://picsum.photos/800/450?random=1`
- `https://picsum.photos/800/450?random=2`
- `https://picsum.photos/800/450?random=3`

### 2. Imágenes de Placeholder.com
- `https://via.placeholder.com/800x450/0000FF/FFFFFF?text=Screenshot+1`
- `https://via.placeholder.com/800x450/FF0000/FFFFFF?text=Screenshot+2`
- `https://via.placeholder.com/800x450/00FF00/FFFFFF?text=Screenshot+3`

### 3. Imágenes de JSONPlaceholder
- `https://jsonplaceholder.typicode.com/photos/1/url`
- `https://jsonplaceholder.typicode.com/photos/2/url`

## PASOS PARA PROBAR:

1. **Ir a**: http://localhost:4203
2. **Login como admin**:
   - Email: `admin@gamestore.com`
   - Password: `admin123`
3. **Ir al Panel Admin** (enlace en el menú superior)
4. **Ir a la pestaña "Agregar/Editar"**
5. **Llenar los campos básicos**:
   - Título: `Juego de Prueba`
   - Descripción: `Descripción del juego`
   - Precio: `59.99`
   - Categoría: `Acción`
   - Publisher: `Test Studio`
   - Fecha de lanzamiento: `2024-01-01`
   - URL de imagen principal: `/asset/cyber.png`
6. **En la sección "Capturas de Pantalla"**:
   - Pegar una de las URLs de arriba
   - Hacer clic en "➕ Agregar Captura"
   - **¡La imagen debería mostrarse inmediatamente!**

## Si las imágenes NO se muestran:
- Verificar que no hay errores en la consola del navegador (F12)
- Verificar que la URL está correcta
- Intentar con otra URL de la lista
- Revisar si hay problemas de CORS

## URLs Locales (ya existentes en el proyecto):
- `/asset/cyber.png`
- `/asset/elden.png`
- `/asset/fifa23.png`
- `/asset/horizon.png`
