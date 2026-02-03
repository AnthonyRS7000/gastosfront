# 💼 Gestor de Gastos y Presupuestos - Frontend

## 📋 Descripción
Aplicación Angular para gestión de gastos y presupuestos con autenticación y estadísticas detalladas.

---

## ✨ Características Implementadas

### 🔐 Autenticación
- Login y Registro de usuarios
- Token JWT con Sanctum
- Interceptor automático de autenticación
- Gestión de sesión

### 💼 Gestión de Presupuestos
- **Dashboard de presupuestos**: Vista en carriles (cards) de todos los presupuestos
- **Crear presupuesto**: Formulario al hacer login si no hay presupuestos
- **Ver presupuesto**: Detalle completo con gastos y estadísticas
- **Editar presupuesto**: Modificar nombre, monto y fechas
- **Eliminar presupuesto**: Con confirmación

### 💰 Gestión de Gastos
- **Crear gasto**: Dentro de un presupuesto
- **Asignar tipo**: Seleccionar tipo existente o crear uno nuevo
- **Campos**: Monto, fecha, descripción, lugar, estado (pagado/pendiente)
- **Editar gasto**: Modificar datos del gasto
- **Eliminar gasto**: Con confirmación

### 📊 Filtros y Búsqueda
- Filtrar por tipo de gasto
- Filtrar por rango de fechas
- Filtrar por estado (pagado/pendiente)
- Ordenar por fecha o monto
- Limpiar filtros

### 📈 Estadísticas
- Total gastado vs presupuesto
- Saldo restante
- Porcentaje utilizado con barra visual
- Gastos por tipo (tabla y gráfico)
- Gastos por día
- Promedio por gasto
- Promedio diario

### 🎨 UI/UX Mejorada
- Diseño moderno con gradientes
- Animaciones suaves
- Tarjetas visuales para presupuestos
- Indicadores de estado (normal, alto, excedido)
- Responsive design
- Modo oscuro/claro

---

## 🗂️ Estructura de Carpetas

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.css
│   │   ├── presupuestos/
│   │   │   ├── presupuestos.component.ts
│   │   │   ├── presupuestos.component.html
│   │   │   └── presupuestos.component.css
│   │   ├── presupuesto-detalle/
│   │   │   ├── presupuesto-detalle.component.ts
│   │   │   ├── presupuesto-detalle.component.html
│   │   │   └── presupuesto-detalle.component.css
│   │   └── gastos/
│   │       ├── gastos.ts
│   │       ├── gastos.html
│   │       └── gastos.css
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── gasto.service.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── ...
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## 🚀 Flujo de la Aplicación

### 1. Login
- Usuario ingresa credenciales
- Se valida contra el backend
- Se guarda token JWT
- **Redirige a `/presupuestos`**

### 2. Dashboard de Presupuestos
- Si **no hay presupuestos**: Muestra formulario para crear uno
- Si **hay presupuestos**: Muestra carriles (cards) con:
  - Nombre del presupuesto
  - Total, Gastado, Disponible
  - Barra de progreso
  - Estado (Normal/Alto/Excedido)
  - Botones de editar y eliminar

### 3. Detalle de Presupuesto
- Al hacer clic en un presupuesto:
  - Resumen: Total, Gastado, Disponible, Porcentaje
  - Estadísticas: Cantidad, promedios, gastos por tipo
  - Lista de gastos con filtros avanzados
  - Formulario para crear nuevo gasto

### 4. Gestión de Gastos
- Crear gasto dentro del presupuesto
- Seleccionar tipo o crear uno nuevo
- Asignar monto, fecha, descripción
- Marcar como pagado/pendiente
- Ver lista con filtros y búsqueda

---

## 📱 Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/login` | LoginComponent | Formulario de login |
| `/presupuestos` | PresupuestosComponent | Dashboard de presupuestos |
| `/presupuesto/:id` | PresupuestoDetalleComponent | Detalle de presupuesto |
| `/gastos` | GastosComponent | Vista alternativa de gastos |

---

## 🔗 Endpoints del Backend Utilizados

### Autenticación
- `POST /api/register` - Registrar usuario
- `POST /api/login` - Login usuario
- `GET /api/me` - Obtener usuario actual
- `POST /api/logout` - Logout

### Presupuestos
- `GET /api/presupuestos` - Listar todos los presupuestos del usuario
- `POST /api/presupuestos` - Crear presupuesto
- `GET /api/presupuestos/{id}` - Obtener presupuesto con detalle
- `PUT /api/presupuestos/{id}` - Actualizar presupuesto
- `DELETE /api/presupuestos/{id}` - Eliminar presupuesto
- `GET /api/presupuestos/{id}/estadisticas` - Obtener estadísticas

### Gastos
- `GET /api/gastos` - Listar gastos (con filtro presupuesto_id opcional)
- `POST /api/gastos` - Crear gasto
- `GET /api/gastos/{id}` - Obtener gasto
- `PUT /api/gastos/{id}` - Actualizar gasto
- `DELETE /api/gastos/{id}` - Eliminar gasto

### Tipos
- `GET /api/tipos` - Listar tipos
- `POST /api/tipos` - Crear tipo

---

## 🛠️ Cómo Ejecutar

### Desarrollo
```bash
npm start
```
La aplicación estará disponible en `http://localhost:4200`

### Build Producción
```bash
npm run build
```

### Tests
```bash
npm test
```

---

## 📦 Dependencias Principales

- **Angular 17+** - Framework
- **TypeScript** - Lenguaje
- **RxJS** - Programación reactiva
- **Angular Router** - Rutas
- **HttpClient** - Comunicación HTTP

---

## ⚙️ Configuración

### Archivo `environment.ts`
```typescript
export const environment = {
  apiUrl: 'http://localhost:8000/api'
};
```

Asegúrate de que `apiUrl` apunta a tu servidor backend.

---

## 🎯 Características Futuras

- [ ] Editar presupuestos desde el dashboard
- [ ] Editar gastos desde el detalle
- [ ] Exportar reportes a PDF/CSV
- [ ] Gráficos más avanzados
- [ ] Categorías de presupuestos
- [ ] Límites de alerta personalizados
- [ ] Sincronización en tiempo real
- [ ] Modo offline
- [ ] Temas personalizables

---

## 🐛 Solución de Problemas

### Token no se guarda
- Verifica que `localStorage` esté habilitado
- Revisa la consola para errores del interceptor
- Asegúrate de que el backend envía el token correctamente

### CORS errors
- Configura CORS en el backend
- Asegúrate de que `apiUrl` es correcto

### Presupuestos no carga
- Verifica que estés autenticado
- Comprueba la consola para errores HTTP
- Revisa que el backend esté corriendo

---

## 📝 Notas de Desarrollo

- Los componentes son **standalone** (sin módulos)
- Uso de **reactive** con `CommonModule` y `FormsModule`
- **RxJS** para manejo de observables
- **TypeScript strict mode** habilitado
- ESLint configurado

---

## 👨‍💻 Autor

Generado con ❤️ para gestión inteligente de gastos

---

## 📄 Licencia

MIT
