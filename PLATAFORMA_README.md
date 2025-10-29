# Skill Matrix SMT - Plataforma de Gestión de Habilidades

## 🎯 Descripción

Sistema completo de gestión de habilidades SMT con autenticación, navegación por pestañas, reportes y análisis de certificaciones.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Pantalla de login moderna con animaciones
- Lookup automático de usuarios por número de empleado
- Validación de contraseña segura
- Token JWT para sesiones

### 📊 Dashboard (Página de Bienvenida)
- Saludo personalizado con nombre del usuario
- Estadísticas en tiempo real:
  - Total de empleados
  - Total de procesos
  - Certificaciones avanzadas
  - Promedio de nivel general
- Accesos rápidos a funciones principales
- Información del sistema

### 🎯 Matriz de Habilidades
- Vista de resumen por proceso con indicadores de cobertura
- Matriz completa empleado-proceso
- Código de colores por nivel de certificación:
  - 🟢 Verde: Experto (4)
  - 🔵 Azul: Avanzado (3)
  - 🟡 Amarillo: Intermedio (2)
  - 🟠 Naranja: Básico (1)
  - ⚪ Gris: Sin certificación (0)
- Clic en celdas para ver detalles

### 👥 Gestión de Empleados
- Vista en tarjetas con fotos
- Búsqueda en tiempo real
- Agregar, editar y eliminar empleados
- Confirmación de eliminación segura
- Vista completa de información

### 📈 Reportes y Análisis
- **Reporte por Procesos:**
  - Cobertura de certificaciones
  - Desglose por niveles
  - Barras de progreso visuales
  - Indicadores críticos (≤2 certificados)
  
- **Reporte por Empleados:**
  - Ranking de empleados por certificaciones
  - Desglose individual por niveles
  - Podio visual (1°, 2°, 3°)

### 🎨 Navegación por Pestañas
- **📊 Dashboard**: Vista general y bienvenida
- **🎯 Matriz de Habilidades**: Matriz completa
- **👥 Empleados**: Gestión de personal
- **📈 Reportes**: Análisis y métricas

### 👤 Barra de Usuario
- Nombre del usuario actual
- Número de empleado
- Rol (Administrador/Operador)
- Botón de logout

## 🚀 Instalación y Ejecución

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🎨 Diseño y UX

- **Tema oscuro** (Dark mode) para reducir fatiga visual
- **Responsive design** - Funciona en móviles, tablets y desktop
- **Animaciones suaves** en transiciones y modales
- **Gradientes modernos** en elementos clave
- **Iconos SVG** para mejor rendimiento
- **Feedback visual** en todas las acciones

## 🔑 Usuarios de Ejemplo

Usa cualquier usuario de la tabla `users` en la base de datos de credenciales.

```
Número de empleado: [Tu número]
Contraseña: [Tu contraseña]
```

## 📱 Responsividad

- **Mobile**: Vista optimizada con navegación táctil
- **Tablet**: Layout adaptativo con 2-3 columnas
- **Desktop**: Vista completa con todas las funciones

## 🎯 Niveles de Certificación

| Nivel | Nombre | Color | Descripción |
|-------|--------|-------|-------------|
| 4 | Experto | 🟢 Verde | Dominio completo del proceso |
| 3 | Avanzado | 🔵 Azul | Conocimiento avanzado |
| 2 | Intermedio | 🟡 Amarillo | Conocimiento moderado |
| 1 | Básico | 🟠 Naranja | Conocimiento básico |
| 0 | Sin certificar | ⚪ Gris | Sin certificación |

## 🔒 Seguridad

- JWT tokens con expiración
- Validación de sesión en cada request
- Bcrypt para passwords
- CORS configurado
- Validación de inputs

## 📊 Métricas y KPIs

El sistema calcula automáticamente:
- Porcentaje de cobertura por proceso
- Total de certificaciones por empleado
- Promedio general de nivel
- Procesos críticos (baja cobertura)
- Empleados destacados (más certificaciones)

## 🎨 Colores de Estado

- **🔴 Rojo**: Crítico (≤2 certificados)
- **🟡 Amarillo**: Moderado (3-5 certificados)
- **🟢 Verde**: Óptimo (>5 certificados)

## 📝 Notas

- Los procesos se cargan dinámicamente desde la BD
- Las fotos de empleados son opcionales
- El sistema soporta agregar nuevos procesos
- Los datos se actualizan en tiempo real

---

**Desarrollado con React + Vite + TailwindCSS**
