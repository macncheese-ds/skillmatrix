-- Script para actualizar las URLs de imágenes de la IP antigua a la nueva
-- Base de datos: skillmatrix
-- Fecha: 2025-10-27

USE skillmatrix;

-- Ver las URLs actuales antes del cambio
SELECT id, nombre, imagen_url 
FROM empleados 
WHERE imagen_url LIKE '%10.229.52.84%'
LIMIT 10;

-- Actualizar las URLs de imágenes de la IP antigua a la nueva
UPDATE empleados 
SET imagen_url = REPLACE(imagen_url, 'http://10.229.52.84:5000', 'http://10.229.52.220:5000')
WHERE imagen_url LIKE '%10.229.52.84%';

-- Verificar los cambios
SELECT id, nombre, imagen_url 
FROM empleados 
WHERE imagen_url LIKE '%10.229.52.220%'
LIMIT 10;

-- Resumen de cambios
SELECT 
    'Total registros actualizados' as descripcion,
    COUNT(*) as cantidad
FROM empleados 
WHERE imagen_url LIKE '%10.229.52.220%';
