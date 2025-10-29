# Procesos Dinámicos - Skill Matrix

## 📋 Descripción

Esta funcionalidad permite agregar nuevos procesos de certificación de forma dinámica sin necesidad de modificar el código o la estructura de la base de datos manualmente.

## 🚀 Cómo Usar

### 1. Ejecutar Migración (Primera Vez)

Antes de usar esta funcionalidad, debes ejecutar el script de migración para crear la tabla de procesos:

```bash
mysql -u root -p skills < backend/migrate_to_dynamic_processes.sql
```

### 2. Reiniciar Servicios

Después de la migración, reinicia ambos servicios:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Agregar un Nuevo Proceso

1. Inicia sesión en modo edición (botón "Editar")
2. Verás 3 botones en el header:
   - **Salir** - Sale del modo edición
   - **+ Proceso** (verde) - Abre el modal para agregar un nuevo proceso
   - **+ Empleado** (azul) - Abre el formulario para agregar un empleado

3. Haz clic en **"+ Proceso"**
4. Ingresa el nombre del proceso en el formato:
   ```
   Process 210
   Nombre descriptivo del proceso
   ```
5. Haz clic en **"Crear Proceso"**

### 4. ¿Qué Pasa Cuando Creas un Proceso?

1. Se crea un nuevo registro en la tabla `procesos`
2. Se asigna automáticamente un ID (op19, op20, op21, etc.)
3. Se agrega una nueva columna en la tabla `empleado` con valor predeterminado 0
4. **Todos los empleados** automáticamente tendrán ese proceso con nivel 0 (sin certificación)
5. El proceso aparece en:
   - La vista de resumen (estadísticas)
   - La vista de empleados
   - Los modales de skills individuales
   - El formulario de edición de empleados

## 🗄️ Estructura Técnica

### Tabla `procesos`

```sql
CREATE TABLE procesos (
  id VARCHAR(20) PRIMARY KEY,      -- op, op1, op2, ..., op19, op20, etc.
  nombre TEXT NOT NULL,             -- Nombre del proceso (puede tener \n)
  orden INT NOT NULL DEFAULT 0,    -- Orden de visualización
  activo BOOLEAN NOT NULL DEFAULT TRUE, -- Si está activo o no
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Endpoints del Backend

**GET /api/procesos**
- Obtiene todos los procesos activos
- No requiere autenticación
- Ordena por `orden` ASC

**POST /api/procesos**
- Crea un nuevo proceso
- Requiere autenticación (token JWT)
- Body: `{ "nombre": "Process XXX\nDescripción" }`
- Automáticamente:
  - Genera el próximo ID disponible (op19, op20, etc.)
  - Calcula el próximo orden
  - Agrega la columna a la tabla `empleado`
  - Establece valor predeterminado 0 para todos los empleados

**PUT /api/procesos/:id**
- Actualiza el nombre de un proceso
- Requiere autenticación

**DELETE /api/procesos/:id**
- Desactiva un proceso (soft delete)
- Requiere autenticación
- No elimina la columna ni los datos

## 📊 Ventajas

1. **Escalabilidad**: Agrega tantos procesos como necesites sin límite
2. **Compatibilidad**: Los procesos existentes (op a op18) funcionan igual
3. **Automático**: Todos los empleados obtienen el nuevo proceso automáticamente
4. **Persistencia**: Los procesos se cargan dinámicamente de la base de datos
5. **Flexibilidad**: Puedes desactivar procesos sin perder datos

## ⚠️ Notas Importantes

1. **No se pueden eliminar procesos físicamente** - Solo se desactivan
2. **Las columnas no se eliminan** - Por seguridad, las columnas en `empleado` permanecen
3. **Compatibilidad hacia atrás** - Los procesos hardcodeados siguen funcionando si la tabla no existe
4. **Autenticación requerida** - Solo usuarios con token JWT pueden crear procesos

## 🔄 Migración de Procesos Existentes

La migración:
1. Crea la tabla `procesos`
2. Inserta los 19 procesos existentes (op a op18)
3. NO modifica la tabla `empleado` (las columnas siguen igual)
4. Es compatible con datos existentes

## 🎨 UI/UX

- Botón verde **"+ Proceso"** en el header (solo en modo edición)
- Modal con formulario simple y claro
- Validación en tiempo real
- Estados de carga durante la creación
- Recarga automática de la lista tras crear
- Mensajes de éxito/error claros

## 🐛 Troubleshooting

**Error: "Column already exists"**
- La columna ya fue creada previamente
- No afecta la funcionalidad
- El proceso se agrega a la tabla `procesos` de todos modos

**Error: "procesos table doesn't exist"**
- Ejecuta el script de migración
- Verifica la conexión a la base de datos

**Los procesos no aparecen**
- Verifica que el backend esté corriendo
- Revisa la consola del navegador para errores
- Confirma que el endpoint `/api/procesos` responde

**No puedo crear procesos**
- Verifica que estés en modo edición
- Confirma que tu token JWT sea válido
- Revisa que tengas permisos de administrador
