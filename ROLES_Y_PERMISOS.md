# 🔐 Sistema de Roles y Permisos - Skill Matrix SMT

## 📋 Resumen de Roles

El sistema cuenta con **3 niveles de acceso** basados en roles:

### 👑 Administrador (The Goat)
**Rol en BD:** `THE GOAT` o `ADMINISTRADOR` → Mapeado a: `admin`

#### Permisos Completos:
- ✅ **Dashboard**: Acceso completo con todas las estadísticas
- ✅ **Matriz de Habilidades**: Visualización completa
- ✅ **Empleados**: 
  - Ver todos los empleados
  - Crear nuevos empleados
  - Editar información de empleados
  - Eliminar empleados
  - Subir fotos
- ✅ **Reportes**: 
  - Reportes por procesos
  - Ranking de empleados
  - Exportación de datos
- ✅ **Procesos**: 
  - Crear procesos dinámicos
  - Eliminar procesos (solo los nuevos)

#### Indicadores Visuales:
- Badge dorado en header: `👑 Administrador`
- Color de bienvenida: Amarillo/Dorado
- Acceso completo visible en todas las secciones

---

### ⚙️ Operador (Líder)
**Rol en BD:** `LIDER` o `OPERADOR` → Mapeado a: `operador`

#### Permisos de Visualización y Consulta:
- ✅ **Dashboard**: Acceso a estadísticas generales
- ✅ **Matriz de Habilidades**: Visualización completa de la matriz
- ✅ **Empleados**: 
  - Ver listado completo de empleados
  - Consultar información detallada
  - **NO** puede crear, editar ni eliminar
- ❌ **Reportes**: Sin acceso a esta sección
- ❌ **Gestión de Procesos**: No puede crear ni eliminar procesos

#### Indicadores Visuales:
- Badge azul en header: `⚙️ Operador`
- Color de bienvenida: Azul
- Mensaje "Vista de solo lectura" en tarjetas de empleados
- Pestañas de reportes ocultas

---

### 👤 Invitado (Guest)
**Rol en BD:** Cualquier otro rol → Mapeado a: `guest`

#### Permisos Mínimos (Solo Lectura):
- ✅ **Dashboard**: Vista básica con información limitada
- ✅ **Matriz de Habilidades**: Visualización de la matriz (solo lectura)
- ❌ **Empleados**: Sin acceso a esta sección
- ❌ **Reportes**: Sin acceso a esta sección
- ❌ **Gestión**: Sin permisos de edición en ninguna parte

#### Indicadores Visuales:
- Badge gris en header: `👤 Invitado`
- Color de bienvenida: Gris
- Solo pestañas de Dashboard y Matriz visibles
- Mensaje "Acceso limitado" en accesos rápidos

---

## 🎨 Comparación Visual de Accesos

| Sección | 👑 Admin | ⚙️ Operador | 👤 Invitado |
|---------|---------|------------|------------|
| **Dashboard** | ✅ Completo | ✅ Completo | ✅ Básico |
| **Matriz de Habilidades** | ✅ Completo | ✅ Solo lectura | ✅ Solo lectura |
| **Empleados** | ✅ CRUD completo | ✅ Solo lectura | ❌ Sin acceso |
| **Reportes** | ✅ Completo | ❌ Sin acceso | ❌ Sin acceso |
| **Crear Empleado** | ✅ Sí | ❌ No | ❌ No |
| **Editar Empleado** | ✅ Sí | ❌ No | ❌ No |
| **Eliminar Empleado** | ✅ Sí | ❌ No | ❌ No |
| **Crear Proceso** | ✅ Sí | ❌ No | ❌ No |
| **Eliminar Proceso** | ✅ Sí (nuevos) | ❌ No | ❌ No |
| **Exportar Datos** | ✅ Sí | ❌ No | ❌ No |

---

## 🔒 Seguridad Implementada

### Frontend
- Pestañas condicionales según rol
- Botones de acción ocultos para roles sin permisos
- Mensajes informativos de restricción
- Badges visuales de rol en header
- Card informativo de permisos en Dashboard

### Backend
- Middleware de autenticación JWT
- Middleware de autorización por roles
- Validación de permisos en endpoints
- Mapeo automático de roles de BD a roles del sistema

---

## 📝 Ejemplos de Uso

### Cambiar Rol de un Usuario (SQL)
```sql
-- Promover a administrador
UPDATE credentials.users 
SET rol = 'ADMINISTRADOR' 
WHERE num_empleado = '1234A';

-- Cambiar a operador
UPDATE credentials.users 
SET rol = 'OPERADOR' 
WHERE num_empleado = '1234A';

-- Establecer como líder (mapeado a operador)
UPDATE credentials.users 
SET rol = 'LIDER' 
WHERE num_empleado = '1234A';
```

### Ver Rol en Login
El sistema muestra automáticamente el rol detectado durante el login:
```
Usuario detectado
[Nombre del usuario]
No. [número]
Rol: admin / operador / guest
```

---

## 🎯 Flujo de Autenticación y Autorización

1. **Usuario ingresa credenciales** en el login
2. **Backend valida** contra tabla `credentials.users`
3. **Backend mapea rol** según función `mapRole()`:
   - `THE GOAT` | `ADMINISTRADOR` → `admin`
   - `LIDER` | `OPERADOR` → `operador`
   - Otro → `guest`
4. **JWT generado** con información del usuario y rol
5. **Frontend decodifica JWT** y obtiene rol
6. **UI se adapta** mostrando/ocultando elementos según rol
7. **Backend valida permisos** en cada request protegido

---

## 🔧 Configuración de Roles

### Archivo: `backend/src/routes/auth.js`

```javascript
const mapRole = (credRole) => {
  const upperRole = (credRole || '').toUpperCase();
  if (upperRole === 'THE GOAT' || upperRole === 'ADMINISTRADOR') return 'admin';
  if (upperRole === 'LIDER' || upperRole === 'OPERADOR') return 'operador';
  return 'guest';
};
```

### Middleware de Autorización: `backend/src/middleware/roles.js`

```javascript
export function authorizeRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!allowed.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado para esta acción' });
    }
    next();
  };
}
```

---

## 📊 Estadísticas de Acceso por Rol

### Administrador
- **Pestañas visibles**: 4/4 (100%)
- **Acciones disponibles**: Todas
- **Nivel de acceso**: Completo

### Operador
- **Pestañas visibles**: 3/4 (75%)
- **Acciones disponibles**: Solo lectura
- **Nivel de acceso**: Consulta

### Invitado
- **Pestañas visibles**: 2/4 (50%)
- **Acciones disponibles**: Ninguna
- **Nivel de acceso**: Solo lectura básica

---

## 🎨 Colores por Rol

- **👑 Admin**: Amarillo/Dorado (`from-yellow-600 to-yellow-800`)
- **⚙️ Operador**: Azul (`from-blue-600 to-blue-800`)
- **👤 Invitado**: Gris (`from-gray-600 to-gray-800`)

---

## 🚀 Testing de Roles

### Crear usuarios de prueba:
```sql
-- Usuario administrador
INSERT INTO credentials.users (num_empleado, nombre, pass_hash, rol)
VALUES ('ADMIN1', 'Admin Test', '[hash]', 'THE GOAT');

-- Usuario operador
INSERT INTO credentials.users (num_empleado, nombre, pass_hash, rol)
VALUES ('OPE001', 'Operador Test', '[hash]', 'OPERADOR');

-- Usuario invitado
INSERT INTO credentials.users (num_empleado, nombre, pass_hash, rol)
VALUES ('GUEST1', 'Invitado Test', '[hash]', 'INVITADO');
```

---

## 📱 Responsive y Accesibilidad

- Todos los roles funcionan en móvil, tablet y desktop
- Indicadores visuales claros
- Mensajes informativos de restricción
- Tooltips explicativos
- Feedback visual en acciones restringidas

---

**Sistema desarrollado con seguridad y experiencia de usuario en mente** 🔒✨
