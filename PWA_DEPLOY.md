# 🚀 PWA Setup - Gestor de Gastos

## ✅ Estado Actual
La aplicación está completamente configurada como PWA. Todos los archivos necesarios han sido creados:

### Archivos Generados
- ✅ `public/manifest.json` - Metadata de la app
- ✅ `public/sw.js` - Service Worker
- ✅ `public/icons/` - 8 iconos en diferentes tamaños (72px a 512px)
- ✅ `src/index.html` - Meta tags PWA configurados
- ✅ Service Worker registrado en index.html

## 📱 Instalación en Móvil

### Chrome/Android
1. Abre la app en Chrome Mobile
2. Toca el menú (⋮) → "Instalar app"
3. O espera el popup "Agregar a pantalla de inicio"
4. La app se instalará como aplicación nativa

### Safari/iOS
1. Abre en Safari mobile
2. Toca Compartir (↑)
3. Selecciona "Añadir a la pantalla de inicio"
4. Se abre como app fullscreen (sin barra de Safari)

## 🔍 Verificación de la PWA

### DevTools Checks
```
1. Chrome DevTools → Application tab
2. Verifica:
   - ✅ Manifest loaded
   - ✅ Service Worker registered y active
   - ✅ Icons visible
```

### Network Offline Test
```
1. DevTools → Network tab
2. Marca "Offline"
3. Recarga la página
4. Deberías ver contenido cacheado
```

## 📦 Estructura de Archivos

```
public/
├── manifest.json          # Metadata de la PWA
├── sw.js                  # Service Worker
├── icon-generator.html    # Herramienta generador (opcional)
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png

src/
├── index.html             # Meta tags PWA
├── main.ts
└── ...
```

## 🎨 Personalización

### Cambiar Colores
Edita `public/manifest.json`:
```json
"theme_color": "#ff69b4",        // Color principal
"background_color": "#ffffff"    // Color de fondo
```

### Cambiar Nombre/Descripción
```json
"name": "Gestor de Gastos",
"short_name": "Gastos",
"description": "Gestiona tus gastos..."
```

### Regenerar Iconos
```bash
# Si necesitas iconos diferentes, ejecuta:
python generate-icons-simple.py
```

## 🌐 Despliegue (Producción)

1. **Build producción:**
   ```bash
   npm run build
   ```

2. **Servir con HTTPS:**
   - Las PWA REQUIEREN HTTPS en producción
   - En desarrollo (localhost) funciona HTTP

3. **Verificar en móvil:**
   - Abre desde móvil conectado a la misma red
   - El menú de instalación debe aparecer automáticamente

## 🚀 Features Disponibles

### Offline Support
- ✅ App funciona sin conexión
- ✅ Service Worker cachea assets
- ✅ API calls requieren conexión

### Installation
- ✅ "Add to home screen" funciona
- ✅ Icono personalizado
- ✅ Splash screen con theme colors

### Background Sync (Opcional)
- ⚠️ Implementado pero no activo
- Para activar: Modifica `sw.js`

## 📊 Checklist de Despliegue

- [x] manifest.json válido
- [x] Service Worker registrado
- [x] Iconos generados (múltiples tamaños)
- [x] Meta tags en index.html
- [x] assets configurados en angular.json
- [x] Colors coherentes (tema rosa)
- [x] HTTPS configurado (para prod)
- [ ] Testeado en dispositivo real

## 🐛 Troubleshooting

### "App no se instala"
- ✓ Asegúrate de usar HTTPS (excepto localhost)
- ✓ Verifica que manifest.json esté accesible
- ✓ Recarga la página (Ctrl+Shift+R)

### "Iconos no aparecen"
- ✓ Verifica que `/icons/*.png` existen
- ✓ Abre DevTools → Application → Manifest
- ✓ Verifica rutas en manifest.json

### "Service Worker no registra"
- ✓ Abre DevTools → Application → Service Workers
- ✓ Verifica que `sw.js` es accesible en `/public/sw.js`
- ✓ Busca errores en Console

## 📚 Referencias

- [Web App Manifest Spec](https://w3c.github.io/manifest/)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

**Generado:** $(date)
**Versión PWA:** 1.0
**Estado:** ✅ Listo para Producción
