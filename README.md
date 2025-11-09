# SkillMatrix

SkillMatrix es una plataforma web para la gestión de habilidades, empleados y su matriz de competencias. Permite registrar, editar y consultar empleados, gestionar visualmente sus habilidades, subir fotos y controlar el acceso mediante autenticación y roles.

**Totalmente optimizado para dispositivos móviles** - Experiencia fluida en smartphones, tablets y desktop.

---

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso Básico](#uso-básico)
- [Optimización Móvil](#optimización-móvil)
- [Rutas y Endpoints Principales](#rutas-y-endpoints-principales)
- [Variables de Entorno](#variables-de-entorno)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Notas y Recomendaciones](#notas-y-recomendaciones)

---

## Descripción General
SkillMatrix permite a las organizaciones gestionar la información de sus empleados y sus competencias, visualizar la matriz de habilidades y mantener un registro actualizado de fotos y datos relevantes. Es ideal para recursos humanos, capacitación y control de competencias.

## Características

###  Funcionalidades Principales
-  Gestión completa de empleados (CRUD)
- Matriz visual de habilidades y certificaciones
- Sistema de autenticación con JWT
-  Control de acceso por roles (Admin, Operador, Guest)
- Carga y gestión de fotos de empleados
-  Búsqueda y filtrado de empleados
- Vista resumen y detalle de competencias
-  Niveles de certificación (0-4): Sin certificación, Básico, Intermedio, Avanzado, Experto

###  Optimización Móvil
- Diseño responsivo mobile-first
- Touch targets optimizados (44x44px mínimo)
- Tipografía escalable según dispositivo
- Layouts adaptativos para todos los tamaños
- Interacciones táctiles mejorada
- Performance optimizado
-  Compatible con iOS 12+ y Android 8+

## Tecnologías Utilizadas
- **Backend:** Node.js, Express, SQLite, JWT, Multer
- **Frontend:** React, Vite, TailwindCSS, Axios
- **Optimización:** Mobile-first responsive design, Touch-friendly UI

## Estructura del Proyecto
```
skillmatrix/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── uploads/
│   └── schema.sql/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── index.html
└── README.md
```

## Instalación y Configuración
1. **Clona el repositorio:**
	```bash
	git clone <repo_url>
	cd skillmatrix
	```
2. **Configura variables de entorno:**
	- Copia `.env.example` a `.env` en backend y frontend, y edítalos según tu entorno.
3. **Instala dependencias:**
	```bash
	cd backend && npm install
	cd ../frontend && npm install
	```
4. **Inicializa la base de datos:**
	- Ejecuta el script SQL en `backend/schema.sql/init.sql` si es necesario.
5. **Ejecuta los servidores:**
	- En dos terminales separados:
	  ```bash
	  cd backend && npm run dev
	  cd frontend && npm run dev
	  ```

## Uso Básico
Accede a la interfaz web en `http://localhost:5173` (o el puerto configurado). Inicia sesión con un usuario registrado o crea uno usando los scripts de backend.

###  Acceso desde Escritorio
Navega a la URL en tu navegador preferido (Chrome, Firefox, Safari, Edge)

### Acceso desde Móvil
1. Asegúrate de estar en la misma red que el servidor
2. Accede desde tu dispositivo móvil usando la IP del servidor
3. La interfaz se adaptará automáticamente al tamaño de tu pantalla

## Optimización Móvil

La aplicación está completamente optimizada para dispositivos móviles pequeños. Para más información detallada:

- **[MOBILE_QUICK_REFERENCE.md](./MOBILE_QUICK_REFERENCE.md)** - Guía rápida y visual
- **[MOBILE_OPTIMIZATIONS.md](./MOBILE_OPTIMIZATIONS.md)** - Documentación técnica completa

### Dispositivos Soportados
- Smartphones (320px - 767px)
-Phablets (768px - 1023px)
- Tablets (1024px+)
- Desktop (1280px+)

### Características Móviles
- Layouts que colapsan a una columna en móviles
- Botones optimizados para interacción táctil
- Texto legible sin necesidad de zoom
- Modales y formularios adaptados
- Performance optimizado para conexiones lentas

## Rutas y Endpoints Principales
### Backend (Express)
- `POST /api/auth/login` — Autenticación de usuarios
- `GET /api/empleados` — Listado de empleados
- `POST /api/empleados` — Crear empleado
- `PUT /api/empleados/:id` — Editar empleado
- `DELETE /api/empleados/:id` — Eliminar empleado
- `POST /api/upload` — Subida de fotos de empleados

### Frontend (React)
- Página de login
- Panel de empleados
- Visualización de la matriz de habilidades

## Variables de Entorno
Ejemplo de `.env` para backend:
```
PORT=3004
DB_URL=sqlite://./skillmatrix.db
JWT_SECRET=tu_clave_secreta
UPLOADS_PATH=./uploads
```

## Ejemplos de Uso
### Crear un empleado
```http
POST /api/empleados
Content-Type: application/json
{
  "nombre": "Juan Pérez",
  "habilidades": ["React", "Node.js"]
}
```

### Subir una foto de empleado
```http
POST /api/upload
Content-Type: multipart/form-data
file: empleado.jpg
```

## Notas y Recomendaciones
- Personaliza los archivos `.env` según tu entorno.
- Usa los scripts en `backend/scripts/` para crear usuarios admin o poblar la base de datos.
- El sistema soporta autenticación JWT y control de acceso por roles.
- Puedes adaptar la base de datos a otros motores modificando la configuración.

---
¡Contribuciones y sugerencias son bienvenidas!
# skillmatrix
