# Actualización del Sistema Skill Matrix - Integración con Credenciales

## Fecha: Octubre 28, 2025

## Resumen de Cambios

Se han realizado mejoras significativas en el sistema Skill Matrix:

1. **Migración a sistema de credenciales centralizado**
2. **Eliminación de emojis en toda la interfaz**
3. **Rediseño de vista de resumen (tabla compacta)**
4. **Tarjetas de empleados mejoradas**

---

## 1. Sistema de Credenciales Centralizado

### Cambios en Backend

#### Archivos Modificados:
- **`src/credentialsDb.js`** (NUEVO) - Conexión a base de datos de credenciales
- **`src/routes/auth.js`** - Actualizado para usar credenciales
- **`.env`** - Agregada variable `CRED_DB_NAME=credenciales`
- **`migrate_to_credentials.sql`** (NUEVO) - Script de migración

#### Mapeo de Roles:

| Rol en Credenciales | Rol en Skill Matrix | Permisos |
|---------------------|---------------------|----------|
| The Goat | admin | Acceso total |
| Administrador | admin | Acceso total |
| Lider | operador | Puede editar |
| Operador | operador | Puede editar |
| Invitado | guest | Solo lectura |

#### Nuevos Endpoints:
```javascript
// Lookup de usuario por número de empleado
GET /api/auth/lookup/:numEmpleado

// Login (ahora usa num_empleado en lugar de username)
POST /api/auth/login
{
  "username": "1234A",  // num_empleado
  "password": "contraseña"
}
```

### Cambios en Frontend

#### Archivos Modificados:
- **`src/pages/Login.jsx`** - Nuevo flujo de login con escaneo de gafete
- **`src/components/LoginModal.jsx`** (NUEVO) - Modal para escaneo

#### Nuevo Flujo de Login:
1. Usuario hace clic en "Escanear Gafete"
2. Se abre modal para escanear/ingresar número de empleado
3. Sistema busca usuario en base de credenciales
4. Se muestra información del usuario
5. Usuario ingresa contraseña
6. Sistema valida y permite acceso

---

## 2. Eliminación de Emojis

Se han eliminado todos los emojis de la interfaz y se reemplazaron con:
- Iconos SVG
- Texto descriptivo
- Símbolos HTML estándar

### Ejemplos de Cambios:

| Antes | Después |
|-------|---------|
| "✏️ Editar" | "Editar" |
| "❌ Salir" | "Salir" |
| "📊 Resumen" | "Resumen" |
| "👥 Empleados" | "Empleados" |
| "📷 Subir Imagen" | [Icono SVG] Subir Imagen |
| "👤" (avatar) | [Icono SVG] |
| "⚠️ Advertencia" | "ADVERTENCIA:" |

---

## 3. Rediseño de Vista de Resumen

### Antes:
- Cards individuales en grid
- Información distribuida en múltiples elementos
- Difícil de escanear visualmente

### Después:
- **Tabla compacta y legible**
- Columnas claramente definidas
- Código de colores mejorado
- Leyenda explicativa

#### Estructura de la Tabla:

| Columna | Descripción |
|---------|-------------|
| Proceso | Nombre del proceso SMT |
| Certificados | Número de empleados certificados (nivel >2) |
| Total | Total de empleados (solo desktop) |
| % | Porcentaje de cobertura |
| Cobertura | Barra de progreso visual (solo desktop) |

#### Código de Colores:

- 🔴 **Rojo (Crítico)**: ≤2 certificados
- 🟡 **Amarillo (Moderado)**: 3-5 certificados
- 🟢 **Verde (Óptimo)**: >5 certificados

---

## 4. Tarjetas de Empleados Mejoradas

### Antes:
- Lista de filas horizontales
- Mucha información visible
- Layout diferente móvil/desktop

### Después:
- **Grid de tarjetas pequeñas**
- Foto prominente
- Información esencial
- Consistente en todos los dispositivos

#### Layout de Tarjeta:

```
┌─────────────┐
│    FOTO     │ (circular, 80x80px móvil, 96x96px desktop)
│             │
├─────────────┤
│   Nombre    │ (truncado)
│  No. 1234A  │
│  Posición   │ (truncado)
│             │
│  [N cert.]  │ (badge)
├─────────────┤
│ Editar | X  │ (solo en modo edición)
├─────────────┤
│ Clic detalles│
└─────────────┘
```

#### Grid Responsivo:
- Móvil: 2 columnas
- Tablet: 3-4 columnas
- Desktop: 5-6 columnas

---

## Migración

### Paso 1: Configurar Variables de Entorno

Agregar a `.env`:
```properties
CRED_DB_NAME=credenciales
```

### Paso 2: Ejecutar Script de Migración

```bash
mysql -u root -p < backend/migrate_to_credentials.sql
```

Este script:
- Elimina la tabla `users` de la base `skills`
- Muestra mensaje de confirmación

### Paso 3: Reinstalar Dependencias (si es necesario)

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Paso 4: Reiniciar Servicios

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## Testing

### Verificar Login:
1. Acceder a la página de login
2. Hacer clic en "Escanear Gafete"
3. Ingresar número de empleado existente en credenciales
4. Verificar que se muestre información correcta
5. Ingresar contraseña
6. Verificar acceso correcto

### Verificar Roles:
- **Admin**: Debe poder editar y eliminar
- **Operador**: Debe poder editar
- **Guest**: Solo lectura

### Verificar UI:
- ✅ No hay emojis visibles
- ✅ Vista de resumen es tabla
- ✅ Tarjetas de empleados son pequeñas con fotos
- ✅ Responsive en todos los tamaños

---

## Notas Importantes

### Base de Datos Credenciales

Asegúrate de que la base de datos `credenciales` existe y tiene la tabla `users` con la siguiente estructura:

```sql
CREATE TABLE users (
  num_empleado VARCHAR(10) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  pass_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL
);
```

### Migración de Usuarios Existentes

Si tenías usuarios en la tabla `users` de `skills`, deberás migrarlos manualmente a `credenciales.users`:

```sql
INSERT INTO credenciales.users (num_empleado, nombre, pass_hash, rol)
SELECT username, nombre, pass_hash, 
  CASE 
    WHEN rol = 'admin' THEN 'Administrador'
    WHEN rol = 'operador' THEN 'Operador'
    ELSE 'Invitado'
  END as rol
FROM skills.users;
```

### Compatibilidad

- Las sesiones existentes seguirán funcionando hasta que expiren
- Los tokens JWT siguen siendo válidos
- La estructura de la base `skills` no cambia (excepto eliminación de tabla `users`)

---

## Troubleshooting

### Error: "Usuario no encontrado"
- Verificar que el usuario existe en `credenciales.users`
- Verificar que `CRED_DB_NAME` está configurado en `.env`
- Verificar conexión a base de datos

### Error: "Credenciales inválidas"
- Verificar que la contraseña es correcta
- Verificar que `pass_hash` está en formato bcrypt
- Verificar que el hash no está corrupto

### UI se ve rara
- Limpiar caché del navegador (Ctrl+Shift+R)
- Verificar que Tailwind CSS está compilando correctamente
- Verificar consola del navegador por errores

---

## Reversión (Rollback)

Si necesitas revertir los cambios:

1. Restaurar archivos del backend:
   - `src/routes/auth.js`
   - Eliminar `src/credentialsDb.js`

2. Restaurar archivos del frontend:
   - `src/pages/Login.jsx`
   - `src/pages/SkillMatrix.jsx`
   - Eliminar `src/components/LoginModal.jsx`

3. Recrear tabla users en skills:
```sql
USE skills;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  pass_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL,
  nombre VARCHAR(255)
);
```

4. Restaurar usuarios desde backup

---

## Próximos Pasos Sugeridos

- [ ] Implementar refresh token para sesiones más largas
- [ ] Agregar auditoría de cambios
- [ ] Implementar permisos más granulares
- [ ] Agregar filtros avanzados en vista de empleados
- [ ] Implementar exportación de reportes
- [ ] Agregar gráficos de tendencias

---

**Última actualización**: Octubre 28, 2025  
**Versión**: 2.0.0  
**Autor**: Sistema de Desarrollo
