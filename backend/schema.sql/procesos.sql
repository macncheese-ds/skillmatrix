-- Tabla para gestionar procesos dinámicos
CREATE TABLE procesos(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre varchar(200),
  posicion varchar(200)
);

-- Insertar los 19 procesos existentes
INSERT INTO procesos (nombre, posicion) VALUES
('Process 10/110 - Bottom/Top PCB Loading', 'op'),
('Process 20/120 - Bottom/Top Laser Marking', 'op1'),
('Process 30/130 - Bottom/Top Solder Paste Printing', 'op2'),
('Process 40/140 - Bottom/Top Solder Paste Inspection (SPI)', 'op3'),
('Process 50/150 - Bottom/Top SMD Placement', 'op4'),
('Process 55/155 - Bottom/Top Auto Optical Inspection (Pre AOI)', 'op5'),
('Process 60/160 - Bottom/Top Reflow Soldering', 'op6'),
('Process 70/170 - Bottom/Top Auto Optical Inspection (Post AOI)', 'op7'),
('Process 80/180 - Bottom/Top Sideviewer', 'op8'),
('Process 185 - Bottom Inspection', 'op9'),
('Process 90/190 - Bottom/Top Unloading', 'op10'),
('Process 195 - Bottom & Top Side 3D X-ray Inspection', 'op11'),
('Process 200 - Etiquetado', 'op12'),
('Process - Viscosimetro', 'op13'),
('Process - Batidora de Pasta', 'op14'),
('Process - Soldadura', 'op15'),
('Process - Lavadora de Stenciles', 'op16'),
('Process - Lavadora de Squeegees', 'op17'),
('Process - MSL', 'op18');
