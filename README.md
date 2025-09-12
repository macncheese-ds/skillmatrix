# SkillMatrix

SkillMatrix es una plataforma web para la gestión de habilidades, empleados y su matriz de competencias. Permite registrar, editar y consultar empleados, gestionar visualmente sus habilidades, subir fotos y controlar el acceso mediante autenticación y roles.

---

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso Básico](#uso-básico)
- [Rutas y Endpoints Principales](#rutas-y-endpoints-principales)
- [Variables de Entorno](#variables-de-entorno)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Notas y Recomendaciones](#notas-y-recomendaciones)

---

## Descripción General
SkillMatrix permite a las organizaciones gestionar la información de sus empleados y sus competencias, visualizar la matriz de habilidades y mantener un registro actualizado de fotos y datos relevantes. Es ideal para recursos humanos, capacitación y control de competencias.

## Tecnologías Utilizadas
- **Backend:** Node.js, Express, SQLite, JWT, Multer
- **Frontend:** React, Vite, TailwindCSS, Axios

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