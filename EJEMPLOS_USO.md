# 📖 EJEMPLOS DE USO - GESTOR DE GASTOS Y PRESUPUESTOS

## 1️⃣ Primer Inicio (Sin Presupuestos)

### Paso 1: Login
```
Email: usuario@ejemplo.com
Contraseña: password123
```

**Resultado esperado:**
- Se autentica correctamente
- Token se guarda en localStorage
- Se redirige a `/presupuestos`
- No hay presupuestos aún

### Paso 2: Se Muestra Formulario Automático
```
El formulario aparece automáticamente con campos:
- Nombre del presupuesto: "Viaje a Lima"
- Monto total: "5000"
- Moneda: "PEN"
- Fecha inicio: "2024-02-15"
- Fecha fin: "2024-02-20"
```

### Paso 3: Crear Presupuesto
- Completa el formulario
- Click en "✅ Crear Presupuesto"
- El presupuesto aparece en el dashboard

---

## 2️⃣ Dashboard de Presupuestos

### Visualización
```
┌─────────────────────────────────────┐
│          💼 Mis Presupuestos        │
│                                     │
│  ➕ Nuevo Presupuesto               │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Viaje a Lima            [✏️ 🗑️]│
│  │                             │  │
│  │ Total: S/ 5000              │  │
│  │ Gastado: S/ 1200            │  │
│  │ Disponible: S/ 3800         │  │
│  │                             │  │
│  │ [████████░░░░░░░░░░] 24%    │  │
│  │                             │  │
│  │ ✅ Normal                   │  │
│  │ 👆 Haz clic para ver detalles│  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Acciones Disponibles
1. **Ver Detalle**: Click en el card
2. **Editar**: Click en ✏️ (estructura)
3. **Eliminar**: Click en 🗑️
4. **Crear Nuevo**: Click en ➕

---

## 3️⃣ Detalle de Presupuesto

### Sección de Resumen
```
┌─────────────────────────────────────┐
│ 💰 Total: S/ 5000                   │
│ 💸 Gastado: S/ 1200                 │
│ 💵 Disponible: S/ 3800              │
│ 📊 Utilizado: 24%                   │
│                                     │
│ [████████░░░░░░░░░░] 24%           │
└─────────────────────────────────────┘
```

### Sección de Estadísticas
```
┌─────────────────────────────────────┐
│ 🛒 Cantidad de gastos: 5             │
│ 📊 Promedio por gasto: S/ 240       │
│ 📅 Promedio diario: S/ 400          │
│                                     │
│ 💹 Gastos por Tipo                  │
│ Alimentación      [███████░░] 70%   │
│ Transporte        [██░░░░░░░░] 20%   │
│ Entretenimiento   [█░░░░░░░░░] 10%   │
└─────────────────────────────────────┘
```

### Crear Gasto
```
Formulario:
  Tipo: Alimentación (select)
  Monto: 250.50
  Fecha: 2024-02-16
  Descripción: Almuerzo en restaurante
  Lugar: Restaurante "El Jardín"
  Estado: ✓ Pagado

Click: "✅ Guardar Gasto"
```

### Resultado
```
Gasto agregado:
┌─────────────────────────────────────┐
│ 📌 Almuerzo en restaurante          │
│ 📍 Restaurante "El Jardín"           │
│                                     │
│ Alimentación | 2024-02-16 | ✓ Pagado│
│                               S/ 250.50│
│                            [✏️] [🗑️] │
└─────────────────────────────────────┘

Nuevo total: S/ 1450.50
Porcentaje: 29%
```

---

## 4️⃣ Filtros Avanzados

### Aplicar Filtros
```
Tipo: Alimentación
Desde: 2024-02-15
Hasta: 2024-02-20
Estado: Pagado
Ordenar: Mayor monto

Resultado: 2 gastos encontrados
```

### Limpiar Filtros
```
Click en "🔄 Limpiar"
→ Se resetean todos los filtros
→ Se muestran todos los gastos nuevamente
```

---

## 5️⃣ Crear Tipo de Gasto Dinámicamente

### Situación
Quieres crear un gasto de "Servicios" pero el tipo no existe

### Pasos
1. Abre formulario de nuevo gasto
2. En "Tipo de gasto", click en "Otro"
3. Aparece campo: "Nombre del nuevo tipo"
4. Escribe: "Servicios"
5. Crea el gasto
6. El tipo se crea automáticamente

**Backend hace:**
```php
// Usa firstOrCreate
$tipo = Tipo::firstOrCreate(
    ['nombre' => 'Servicios'],
    ['color' => null]
);
```

---

## 6️⃣ Eliminar Gasto

### Paso a Paso
```
1. En lista de gastos, click en 🗑️
2. Aparece confirmación:
   "¿Estás seguro de que deseas eliminar este gasto?"
3. Click en "OK" para confirmar
4. El gasto se elimina
5. Los totales se recalculan automáticamente
```

### Resultado
```
Antes:
  Gastado: S/ 1450.50
  Disponible: S/ 3549.50

Después (elimina gasto de S/ 250):
  Gastado: S/ 1200.50
  Disponible: S/ 3799.50
```

---

## 7️⃣ Estados Visuales

### Normal (Bajo uso)
```
Estado: ✅ Normal
Desde: 0% hasta 79%
Color: Verde (#10b981)
```

### Alto (Uso elevado)
```
Estado: ⚠️ Alto
Desde: 80% hasta 99%
Color: Amarillo (#f59e0b)
```

### Excedido
```
Estado: ❌ Excedido
Desde: 100% o más
Color: Rojo (#ef4444)
```

---

## 8️⃣ Respuesta a Error: Excedencia de Presupuesto

### Intento
```
Presupuesto disponible: S/ 500
Intento crear gasto de: S/ 600
```

### Respuesta del Backend
```json
{
  "message": "Este gasto excede el presupuesto disponible",
  "presupuesto_total": 5000,
  "gastado_actual": 4500,
  "saldo_disponible": 500,
  "monto_solicitado": 600
}
```

### Visualización en Frontend
```
⚠️ Este gasto excede el presupuesto disponible

Presupuesto total: S/ 5000
Gastado: S/ 4500
Disponible: S/ 500
Intentas agregar: S/ 600 ❌
```

---

## 9️⃣ Caso de Uso Completo: Viaje

### Día 1: Crear Presupuesto
```
Nombre: Viaje a Arequipa
Monto: 3000
Moneda: PEN
Fechas: 01-03-2024 a 05-03-2024
```

### Día 1: Registrar Gastos
```
10:30 - Pasaje aéreo S/ 800 (Transportes)
14:00 - Hotel noche 1 S/ 200 (Alojamiento)
19:30 - Cena S/ 85 (Alimentación)

Total: S/ 1085
Restante: S/ 1915
```

### Día 2: Más Gastos
```
08:00 - Desayuno S/ 45 (Alimentación)
12:00 - Tour arqueológico S/ 150 (Entretenimiento)
20:00 - Hotel noche 2 S/ 200 (Alojamiento)
21:00 - Cena S/ 95 (Alimentación)

Total acumulado: S/ 1575
Restante: S/ 1425
Porcentaje usado: 52.5%
```

### Filtrar por Tipo: Alimentación
```
- Desayuno: S/ 45
- Cena día 1: S/ 85
- Cena día 2: S/ 95

Total Alimentación: S/ 225 (7.5% del presupuesto)
```

### Filtrar por Fecha: 02-03-2024
```
- Desayuno: S/ 45
- Tour: S/ 150
- Hotel: S/ 200
- Cena: S/ 95

Total día 2: S/ 490
Promedio por gasto: S/ 122.50
```

### Ver Estadísticas
```
📊 Resumen
- Cantidad de gastos: 8
- Promedio por gasto: S/ 196.88
- Promedio diario: S/ 787.50

💹 Gastos por Tipo
Alojamiento: 2 | S/ 400 (25.4%)
Transportes: 1 | S/ 800 (50.8%)
Alimentación: 3 | S/ 225 (14.3%)
Entretenimiento: 1 | S/ 150 (9.5%)

📅 Gastos por Día
01-03: S/ 1085
02-03: S/ 490
```

---

## 🔟 Logout

### Paso
```
Click en "🚪 Cerrar Sesión" en la esquina superior derecha
```

### Qué ocurre
```
1. Se ejecuta logout en el backend
2. Se elimina el token de localStorage
3. Se limpia el estado de autenticación
4. Se redirige a /login
```

---

## 📝 VALIDACIONES

### Presupuesto
```
❌ Nombre vacío
❌ Monto total vacío
❌ Monto total = 0 o negativo
❌ Fecha fin anterior a fecha inicio
✅ Todas las validaciones del lado del cliente
```

### Gasto
```
❌ Monto vacío
❌ Monto = 0 o negativo
❌ Fecha vacía
❌ Tipo no seleccionado (ni creado)
❌ Gasto excede presupuesto disponible
✅ Todas las validaciones del lado del cliente
✅ Validaciones adicionales del backend
```

---

## 🎯 ATAJOS Y TIPS

### Crear Presupuesto Rápido
```
1. Login
2. Se abre automáticamente el formulario
3. Llenar datos
4. Enter o click en botón
```

### Crear Tipo Rápido
```
1. En formulario de gasto
2. Click en "Otro" junto a tipo
3. Escribe el nombre
4. Automáticamente se usa ese tipo
```

### Filtrar Rápido
```
1. Selecciona tipo en select
2. Pon fechas
3. Los gastos se filtran al instante
```

### Ordenar Diferente
```
1. Cambiar en select "Ordenar"
2. Los gastos se reordenan automáticamente
```

---

## 🚨 MANEJO DE ERRORES

### Error: "El presupuesto no existe o no te pertenece"
```
Causa: Intentas acceder a un presupuesto que no es tuyo
Solución: Verifica que estés usando el presupuesto correcto
```

### Error: "Este gasto excede el presupuesto disponible"
```
Causa: El monto del gasto es mayor al saldo disponible
Solución: Aumenta el presupuesto o crea un gasto menor
```

### Error: "Debes seleccionar o crear un tipo"
```
Causa: No seleccionaste tipo ni ingresaste nombre de tipo nuevo
Solución: Elige un tipo existente o escribe uno nuevo
```

### Error: "Token no válido"
```
Causa: Tu sesión expiró o token fue invalidado
Solución: Haz logout y login nuevamente
```

---

## ✨ CARACTERÍSTICAS ESPECIALES

### 1. Moneda Personalizable
```
Por presupuesto puedes elegir:
- PEN (Soles peruanos)
- USD (Dólares estadounidenses)
- EUR (Euros)
```

### 2. Gastos Pagados/Pendientes
```
Puedes marcar un gasto como:
✓ Pagado - Ya fue pagado
⏳ Pendiente - Aún no lo pagas
```

### 3. Estadísticas en Tiempo Real
```
Al crear/eliminar un gasto:
- Los totales se actualizan
- El porcentaje se recalcula
- Las estadísticas se refresco
- El gráfico se actualiza
```

### 4. Múltiples Presupuestos
```
Puedes tener varios presupuestos simultáneamente:
- Presupuesto personal
- Presupuesto del hogar
- Presupuesto para viajes
- Etc.
```

---

¡Ahora estás listo para usar la aplicación! 🎉

Para más información, consulta:
- SETUP.md - Guía completa
- MEJORAS.md - Mejoras opcionales
- CAMBIOS.md - Resumen de cambios
