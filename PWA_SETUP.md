# Configuración PWA - Instrucciones para iconos

## Generación de Iconos

Para completar la configuración PWA, necesitas generar iconos en diferentes tamaños. 

### Opción 1: Generar iconos automáticamente (Recomendado)

```bash
# Instala las herramientas necesarias
npm install -g imagemagick

# Luego ejecuta el script (si lo creamos):
node generate-icons.js
```

### Opción 2: Usar generador online

1. Ve a: https://www.favicon-generator.org/
2. Sube una imagen de al menos 512x512 píxeles (preferiblemente 1024x1024)
3. Descarga todos los iconos
4. Coloca los archivos en `public/icons/`

### Opción 3: Descargar iconos de ejemplo

Los iconos deben ir en: `public/icons/`

Con los siguientes tamaños:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- icon-192x192-maskable.png (versión maskable)
- icon-512x512-maskable.png (versión maskable)
- screenshot-1.png (540x720)
- screenshot-2.png (1080x1440)

## Estructura de carpetas

```
public/
  ├── manifest.json
  ├── sw.js
  ├── icons/
  │   ├── icon-72x72.png
  │   ├── icon-96x96.png
  │   ├── icon-128x128.png
  │   ├── icon-144x144.png
  │   ├── icon-152x152.png
  │   ├── icon-192x192.png
  │   ├── icon-384x384.png
  │   ├── icon-512x512.png
  │   ├── icon-192x192-maskable.png
  │   ├── icon-512x512-maskable.png
  │   ├── screenshot-1.png
  │   └── screenshot-2.png
```

## Características PWA activadas:

✅ Instalable como app en móvil
✅ Funciona sin conexión (offline first)
✅ Cache de assets
✅ Notificaciones push (preparado)
✅ Sincronización en background (preparado)
✅ Tema personalizado (Rosa #ff69b4)
✅ Icono en pantalla de inicio
✅ Splash screen automático

## Testing PWA

1. Abre Chrome DevTools (F12)
2. Ve a Application → Manifest
3. Verifica que manifest.json esté cargado correctamente
4. Ve a Application → Service Workers
5. Verifica que sw.js esté activo

## Deployment

Una vez que tengas los iconos:

1. Asegúrate de que `public/icons/` esté en tu repo
2. Deploy el proyecto normalmente
3. En móvil, abre el sitio en Chrome
4. Verás el botón "Agregar a pantalla de inicio"
5. O Chrome te mostrará un popup de instalación
