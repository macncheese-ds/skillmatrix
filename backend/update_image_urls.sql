-- Script para actualizar las URLs de imágenes de la IP antigua a la nueva
-- Base de datos: skillmatrix
-- Fecha: 2025-10-27

USE skillmatrix;

-- Ver las URLs actuales antes del cambio
SELECT id, nombre, imagen_url 

-- Resumen de cambios
SELECT 
    'Total registros actualizados' as descripcion,
    COUNT(*) as cantidad
FROM empleados 
WHERE imagen_url LIKE '%10.229.52.220%';
