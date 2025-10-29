-- Migración para hacer los procesos dinámicos
-- Este script crea una tabla de procesos y migra los datos existentes

-- Crear tabla de procesos
CREATE TABLE IF NOT EXISTS procesos (
  id VARCHAR(20) PRIMARY KEY,
  nombre TEXT NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar los procesos existentes con sus nombres
INSERT INTO procesos (id, nombre, orden, activo) VALUES
('op', 'Process 10/110\nBottom/Top PCB Loading', 1, TRUE),
('op1', 'Process 20/120\nBottom/Top Laser Marking', 2, TRUE),
('op2', 'Process 30/130\nBottom/Top Solder Paste Printing', 3, TRUE),
('op3', 'Process 40/140\nBottom/Top Solder Paste Inspection (SPI)', 4, TRUE),
('op4', 'Process 50/150\nBottom/Top SMD Placement', 5, TRUE),
('op5', 'Process 55/155\nBottom/Top Auto Optical Inspection (Pre AOI)', 6, TRUE),
('op6', 'Process 60/160\nBottom/Top Reflow Soldering', 7, TRUE),
('op7', 'Process 70/170\nBottom/Top Auto Optical Inspection (Post AOI)', 8, TRUE),
('op8', 'Process 80/180\nBottom/Top Sideviewer', 9, TRUE),
('op9', 'Process 185\nBottom Inspection', 10, TRUE),
('op10', 'Process 90/190\nBottom/Top Unloading', 11, TRUE),
('op11', 'Process 195\nBottom & Top Side 3D X-ray Inspection', 12, TRUE),
('op12', 'Process 200\nEtiquetado', 13, TRUE),
('op13', 'Process\nViscosimetro', 14, TRUE),
('op14', 'Process\nBatidora de Pasta', 15, TRUE),
('op15', 'Process\nSoldadura', 16, TRUE),
('op16', 'Process\nLavadora de Stenciles', 17, TRUE),
('op17', 'Process\nMantenimiento Preventivo', 18, TRUE),
('op18', 'Process\nCalibración', 19, TRUE)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), orden=VALUES(orden);

-- Nota: No eliminamos las columnas op* de la tabla empleado por compatibilidad
-- Los nuevos procesos se guardarán en una tabla separada de certificaciones
