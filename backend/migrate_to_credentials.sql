-- Script de migración para Skill Matrix - Sistema de credenciales
-- Fecha: 2025-10-28

USE skills;

-- Eliminar la tabla users local (ahora usamos credenciales.users)
DROP TABLE IF EXISTS users;

-- Mensaje de confirmación
SELECT 'Migración completada. Skill Matrix ahora usa la base de datos credenciales para autenticación.' AS mensaje;
SELECT 'Roles del sistema:' AS info;
SELECT '- The Goat y Administrador: Acceso total (admin)' AS rol1;
SELECT '- Lider y Operador: Puede editar (operador)' AS rol2;
SELECT '- Invitado: Solo lectura (guest)' AS rol3;
