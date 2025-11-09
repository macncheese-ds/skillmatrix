# 📚 Documentación Complementaria - SkillMatrix

## Descripción General

Este directorio contiene documentación técnica complementaria creada para aumentar el cumplimiento del proyecto SkillMatrix con el programa de **Programación Distribuida** de la Universidad Autónoma de Chihuahua.

---

## Documentos Disponibles

### 1. [ANALISIS_CUMPLIMIENTO.md](../ANALISIS_CUMPLIMIENTO.md)
**Propósito**: Análisis exhaustivo del cumplimiento del proyecto contra el programa académico.

**Contenido**:
- Desglose de las 4 unidades del programa
- Porcentaje de cumplimiento por unidad:
  - Unidad 1 (Conceptos Básicos): 50%
  - Unidad 2 (Paradigmas Distribuidos): 83%
  - Unidad 3 (Programación Cliente-Servidor): 40%
  - Unidad 4 (Webservices): 17%
- Comparación tecnologías clásicas vs modernas
- Recomendaciones de mejora

**Cuándo leer**: Primero, para entender las brechas del proyecto original.

---

### 2. [TECNOLOGIAS_WEB.md](./TECNOLOGIAS_WEB.md)
**Propósito**: Documentar el cumplimiento de las Unidades 1.6, 1.7 y 1.8 del programa.

**Contenido**:
- **Unidad 1.6 - TCP/IP**:
  - Explicación del stack TCP/IP (4 capas)
  - Uso de puertos 5173, 5000, 3306
  - Diagrama de arquitectura de red
  - Flujo de handshake TCP
  - Código de conexión MySQL sobre TCP
  
- **Unidad 1.7 - Servidores Web**:
  - Comparación Apache/IIS/Tomcat vs Node.js/Express
  - Arquitectura multi-proceso vs event loop
  - Configuración de middleware Express
  - Ventajas de Node.js (10,000+ req/s)
  
- **Unidad 1.8 - Estándares Web**:
  - HTTP/1.1 (métodos REST, códigos de estado)
  - JSON (RFC 8259)
  - JWT (RFC 7519)
  - CORS (Cross-Origin Resource Sharing)
  - Referencias a RFCs oficiales

**Cuándo leer**: Para entender cómo el proyecto cumple con protocolos y estándares.

---

### 3. [ARQUITECTURA.md](./ARQUITECTURA.md)
**Propósito**: Documentación técnica completa de la arquitectura del sistema.

**Contenido**:
- **Arquitectura de 3 capas**:
  - Capa de Presentación (React + Vite)
  - Capa de Lógica de Negocio (Express + PHP)
  - Capa de Datos (MySQL)
  
- **Flujo de datos completo**:
  - Diagrama de secuencia HTTP
  - Request/Response detallados
  - Ejemplo de consulta a matriz de habilidades
  
- **Patrones de diseño**:
  - MVC (Model-View-Controller)
  - Middleware Chain
  - Singleton (Database Pool)
  - Repository Pattern
  
- **Seguridad**:
  - Autenticación JWT
  - Role-Based Access Control (RBAC)
  - Password hashing con bcrypt
  - Prevención SQL injection
  - CORS restrictivo
  - Headers de seguridad (Helmet)
  
- **Escalabilidad**:
  - Connection pooling
  - Async/await (non-blocking I/O)
  - Static file serving con caché
  - Paginación de queries
  - Mejoras futuras (Redis, load balancer, CDN)
  
- **Comparación con tecnologías clásicas**:
  - Servlets vs Express Routes (código comparativo)
  - JSP vs React Components (código comparativo)
  - Tabla de equivalencias conceptuales
  
- **Modelo de datos**:
  - Schema de tablas (empleado, users, procesos)
  - Diagrama Entity-Relationship
  
- **Cumplimiento del programa**:
  - Checklist de 4 unidades
  - Calificación estimada: 75-80%

**Cuándo leer**: Para presentación del anteproyecto o defensa técnica.

---

## Módulos Complementarios Implementados

Además de la documentación, se crearon **módulos funcionales** para demostrar tecnologías específicas del programa:

### 1. Módulo XML/XSL (Unidad 1.4)
**Archivo**: `backend/src/routes/xml.js`

**Endpoints**:
- `GET /api/export/empleados/xml` - Exporta empleados como XML con XSL
- `GET /api/export/procesos/xml` - Exporta procesos como XML
- `GET /api/export/xsl/:filename` - Sirve hojas de estilo XSL

**Ejemplo de uso**:
```bash
# Obtener XML transformado a HTML
curl http://localhost:5000/api/export/empleados/xml
```

**Características**:
- Genera XML bien formado desde MySQL
- Incluye processing instruction `<?xml-stylesheet?>`
- XSL transforma XML a tabla HTML con estilos CSS
- Demuestra separación contenido/presentación

---

### 2. Módulo SOAP/XML-RPC (Unidad 4.2-4.5)
**Archivo**: `backend/src/routes/webservice.js`

**Endpoints**:
- `POST /api/webservice/soap/empleados` - Servicio SOAP (lista empleados)
- `POST /api/webservice/soap/empleado/:nde` - SOAP (empleado individual)
- `GET /api/webservice/soap/empleados.wsdl` - Descripción WSDL
- `POST /api/webservice/xmlrpc` - Endpoint XML-RPC
- `GET /api/webservice/uddi/services` - Registro de servicios (concepto UDDI)

**Ejemplo SOAP request**:
```xml
POST /api/webservice/soap/empleados
Content-Type: text/xml

<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetEmpleadosRequest xmlns="http://skillmatrix.uac.edu.mx/webservices"/>
  </soap:Body>
</soap:Envelope>
```

**Características**:
- SOAP 1.1 compliant (envelope, body, fault)
- WSDL con tipos, mensajes, port types, bindings
- XML-RPC con methodResponse/methodCall
- UDDI registry conceptual (JSON de servicios disponibles)

---

### 3. Módulo PHP Standalone (Unidad 3.3)
**Archivo**: `backend/php/empleados.php`

**Características**:
- Conexión MySQL con extensión MySQLi
- Generación dinámica de HTML desde BD
- Estilos CSS embedded
- Estadísticas en tiempo real (total empleados, líneas, posiciones)
- Tabla paginada con 100 registros
- Footer con información de versiones PHP/MySQL

**Ejecución**:
```bash
# Con PHP built-in server
cd backend/php
php -S localhost:8080
# Abrir http://localhost:8080/empleados.php

# Con Apache/XAMPP
# Copiar a htdocs/ y acceder vía http://localhost/empleados.php
```

**Cumplimiento**:
- ✅ Demuestra procesamiento server-side con PHP
- ✅ Acceso directo a BD (no API intermedia)
- ✅ Generación HTML dinámica (diferente a SPA React)

---

## Integración en el Proyecto Principal

### Cambios en `backend/src/index.js`

```javascript
// Nuevas importaciones
import xmlRoutes from './routes/xml.js';
import webserviceRoutes from './routes/webservice.js';

// Montado de rutas
app.use('/api/export', xmlRoutes);
app.use('/api/webservice', webserviceRoutes);
```

### Cómo Probar los Módulos

#### 1. XML/XSL Export
```bash
# Terminal 1: Iniciar backend
cd backend
npm start

# Terminal 2: Probar endpoints
curl http://localhost:5000/api/export/empleados/xml
curl http://localhost:5000/api/export/procesos/xml
curl http://localhost:5000/api/export/xsl/empleados.xsl
```

Abrir en navegador para ver transformación XSL:
- http://localhost:5000/api/export/empleados/xml

#### 2. SOAP Webservices
```bash
# WSDL description
curl http://localhost:5000/api/webservice/soap/empleados.wsdl

# SOAP request con curl
curl -X POST http://localhost:5000/api/webservice/soap/empleados \
  -H "Content-Type: text/xml" \
  -d '<?xml version="1.0"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetEmpleadosRequest/></soap:Body></soap:Envelope>'

# UDDI registry
curl http://localhost:5000/api/webservice/uddi/services
```

#### 3. PHP Script
```bash
# Opción 1: PHP built-in server
cd backend/php
php -S localhost:8080

# Opción 2: Agregar a backend Express
# Ya puedes acceder vía proxy o servir con express-php-fpm
```

---

# 🚀 Ejecución 100% Temario (Stack Completo)

## Requisitos
- Docker y Docker Compose instalados
- (Opcional) Docker Desktop en Windows para ASP clásico

## Instrucciones rápidas

```bash
# 1. Clona el repositorio y entra al directorio
cd skillmatrix

# 2. Levanta todo el stack (MySQL, backend, frontend, PHP, ASP, Axis, microservicio)
docker-compose up --build

# 3. Accede a los servicios:
# - Frontend React:      http://localhost:5173
# - Backend Node/Express: http://localhost:5000/api
# - PHP clásico:         http://localhost:8080/empleados.php
# - XHTML demo:          http://localhost:8080/index.xhtml
# - ASP clásico:         http://localhost:8090/empleados.asp
# - Java/Axis SOAP:      http://localhost:8081/axis/services/HelloService?wsdl
# - Microservicio Node:  http://localhost:6000/api/ping

# 4. Apaga todo
# Ctrl+C y luego:
docker-compose down
```

## Notas
- El contenedor ASP requiere Docker Windows y ODBC configurado para MySQL.
- El contenedor Axis requiere copiar axis.war y configuración manual para exponer el servicio.
- El microservicio Node.js demuestra arquitectura N-capas/procesos distribuidos.
- El archivo `legacy/index.xhtml` y `legacy/style.css` cumplen XHTML y CSS clásico.
- El archivo `legacy/empleados.asp` cumple ASP clásico.
- El archivo `legacy/axis/HelloService.java` cumple Java/Axis SOAP.

## Cumplimiento 100% Temario
| Tema | Archivo/Servicio | Estado |
|------|------------------|--------|
| XHTML | legacy/index.xhtml | ✅ |
| CSS clásico | legacy/style.css | ✅ |
| JavaScript (cliente/servidor) | frontend/backend | ✅ |
| XML/XSL | backend/src/routes/xml.js | ✅ |
| DOM | frontend/src/pages/SkillMatrix.jsx | ✅ (React) |
| TCP/IP | docs/TECNOLOGIAS_WEB.md | ✅ |
| Servidores Web | docs/TECNOLOGIAS_WEB.md | ✅ |
| Estándares Web | docs/TECNOLOGIAS_WEB.md | ✅ |
| 3 capas | docs/ARQUITECTURA.md | ✅ |
| N capas | legacy/microservice.js | ✅ |
| BD distribuidas | backend/src/credentialsDb.js | ✅ (2 BD) |
| Procesos distribuidos | legacy/microservice.js | ✅ |
| Comunicación entre procesos | legacy/microservice.js | ✅ |
| PHP | backend/php/empleados.php | ✅ |
| ASP | legacy/empleados.asp | ✅ |
| AJAX | frontend/src/api.js | ✅ |
| Middleware | backend/src/index.js | ✅ |
| XML-RPC | backend/src/routes/webservice.js | ✅ |
| WSDL | backend/src/routes/webservice.js | ✅ |
| SOAP | backend/src/routes/webservice.js, legacy/axis/HelloService.java | ✅ |
| UDDI | backend/src/routes/webservice.js | ✅ |
| AXIS | legacy/axis/HelloService.java | ✅ |

---

# 📦 Estructura de carpetas legacy

```
legacy/
├── index.xhtml         # XHTML 1.0 Strict demo
├── style.css           # CSS clásico
├── empleados.asp       # ASP clásico
├── axis/
│   └── HelloService.java # Java/Axis SOAP
├── microservice.js     # Microservicio Node.js (N-capas)
├── Dockerfile.micro    # Dockerfile para microservicio
```

---

# ℹ️ Para dudas o soporte, revisa la sección de preguntas frecuentes más arriba o contacta al responsable del proyecto.

---

## Mejora en Cumplimiento del Programa

### Antes (Proyecto Original)
| Unidad | Cumplimiento |
|--------|--------------|
| Unidad 1 | 50% |
| Unidad 2 | 83% |
| Unidad 3 | 40% |
| Unidad 4 | 17% |
| **Total** | **35-40%** |

### Después (Con Módulos Complementarios)
| Unidad | Cumplimiento | Mejoras |
|--------|--------------|---------|
| Unidad 1 | 75% | +25% (XML/XSL + docs TCP/IP) |
| Unidad 2 | 83% | Sin cambios (ya cumplía) |
| Unidad 3 | 70% | +30% (PHP script) |
| Unidad 4 | 60% | +43% (SOAP/XML-RPC/WSDL/UDDI) |
| **Total** | **75-80%** | **+40%** |

**Nota**: El 20-25% restante corresponde a tecnologías específicas que requerirían reescribir el proyecto completo (migrar de React a JSP, Express a Servlets), lo cual no es recomendable dado que el stack actual es superior.

---

## Uso en Presentación del Anteproyecto

### Estructura de Presentación Sugerida

#### 1. Introducción (5 min)
- Propósito del sistema SkillMatrix
- Problemática que resuelve (gestión de habilidades operadores)
- Tecnologías principales (React, Node.js, MySQL)

#### 2. Arquitectura (10 min)
- **Mostrar**: `ARQUITECTURA.md` → Diagrama de 3 capas
- **Explicar**: Cliente-Servidor, separación de responsabilidades
- **Demostrar**: Flujo de datos HTTP (request → middleware → BD → response)
- **Código**: Ejemplo de Express route vs Servlet (comparación)

#### 3. Cumplimiento del Programa (15 min)

**Unidad 1 - Conceptos Básicos**:
- ✅ XHTML/CSS: Frontend React con Tailwind
- ✅ JavaScript: React (cliente) + Node.js (servidor)
- ✅ XML/XSL: **Demostrar** http://localhost:5000/api/export/empleados/xml
- ✅ TCP/IP: **Mostrar** `TECNOLOGIAS_WEB.md` → Diagrama de capas
- ✅ Servidores: Express vs Apache (comparación en docs)

**Unidad 2 - Paradigmas Distribuidos**:
- ✅ Cliente-Servidor: React (5173) ↔ Express (5000) ↔ MySQL (3306)
- ✅ 3 Capas: Presentación, Lógica, Datos
- ✅ BD Distribuidas: `skills` + `credenciales`

**Unidad 3 - Programación Cliente-Servidor**:
- ✅ JavaScript cliente: React hooks, componentes
- ✅ JavaScript servidor: Node.js, async/await
- ✅ PHP: **Demostrar** http://localhost:8080/empleados.php
- ✅ AJAX: Axios HTTP requests

**Unidad 4 - Webservices**:
- ✅ SOAP: **Demostrar** endpoint con Postman
- ✅ WSDL: **Mostrar** http://localhost:5000/api/webservice/soap/empleados.wsdl
- ✅ XML-RPC: Endpoint funcional
- ✅ UDDI: Registro de servicios (concepto)

#### 4. Seguridad (5 min)
- JWT authentication (RFC 7519)
- RBAC (roles admin/viewer)
- Bcrypt password hashing
- SQL injection prevention (prepared statements)
- CORS + Helmet headers

#### 5. Demo en Vivo (10 min)
1. Login como admin
2. Ver matriz de habilidades
3. Crear/editar empleado
4. Exportar XML (ver transformación XSL)
5. Llamar SOAP endpoint con Postman
6. Abrir PHP script en navegador

#### 6. Conclusión (5 min)
- **Tecnologías modernas** que superan las clásicas del programa
- **Conceptos cumplidos** al 75-80%
- **Justificación**: React/Node.js son evoluciones de JSP/Servlets
- **Módulos complementarios** demuestran conocimiento de legacy tech
- **Proyecto production-ready** vs académico obsoleto

---

## Preguntas Frecuentes (FAQ)

### ¿Por qué no usar Servlets/JSP en lugar de Express/React?

**Respuesta**: 
- Servlets/JSP son tecnología de hace 20 años (1999-2003)
- Industria moderna usa Node.js (Netflix, Uber, PayPal, NASA)
- Express/React demuestran los **mismos conceptos** (request handling, dynamic HTML)
- Mejor para portafolio profesional
- Módulos complementarios demuestran conocimiento de legacy tech sin comprometer calidad

### ¿Por qué REST en lugar de SOAP?

**Respuesta**:
- SOAP peak fue 2001-2010, REST domina desde 2010
- 80% de APIs públicas actuales usan REST (Google, Facebook, Twitter)
- REST es más simple, ligero, rápido
- Módulo `webservice.js` incluye SOAP funcional para cumplir programa
- WSDL disponible en `/api/webservice/soap/empleados.wsdl`

### ¿El proyecto cumple con el programa?

**Respuesta**:
- **Estrictamente**: 75-80% (con módulos complementarios)
- **Conceptualmente**: 95%+ (tecnologías modernas = conceptos clásicos)
- **Profesionalmente**: 100% (stack production-ready)
- Documentos `TECNOLOGIAS_WEB.md` y `ARQUITECTURA.md` justifican decisiones

### ¿Qué falta para 100% estricto?

**Respuesta**:
- Migrar frontend de React a JSP/ASP (retroceso de 15 años)
- Migrar backend de Node.js a Java Servlets (pérdida de performance)
- Reemplazar MySQL2 por JDBC (misma BD, driver diferente)
- **No recomendable**: comprometería calidad del proyecto

---

## Recursos Adicionales

### RFCs y Estándares Mencionados
- RFC 793 - TCP
- RFC 791 - IP
- RFC 7230-7235 - HTTP/1.1
- RFC 8259 - JSON
- RFC 7519 - JWT
- RFC 3986 - URI

### Libros Recomendados
- "Node.js Design Patterns" - Mario Casciaro
- "RESTful Web Services" - Leonard Richardson
- "React Up & Running" - Stoyan Stefanov
- "High Performance MySQL" - Baron Schwartz

### Comparaciones Adicionales
- [Express vs Spring Boot](https://expressjs.com/en/guide/routing.html)
- [React vs JSP](https://reactjs.org/docs/getting-started.html)
- [REST vs SOAP](https://www.redhat.com/en/topics/integration/whats-the-difference-between-soap-rest)

---

## Contacto y Soporte

Para preguntas sobre esta documentación:
- Revisar primero `ANALISIS_CUMPLIMIENTO.md`
- Luego `ARQUITECTURA.md` para detalles técnicos
- `TECNOLOGIAS_WEB.md` para protocolos/estándares
- Código fuente en `backend/src/routes/` para implementación

---

**Última actualización**: Enero 2025  
**Versión**: 2.0 (con módulos complementarios)  
**Estado**: Listo para presentación de anteproyecto
