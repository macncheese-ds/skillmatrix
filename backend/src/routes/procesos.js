import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Obtener todos los procesos desde la tabla procesos
router.get('/', async (req, res) => {
  try {
    const [procesos] = await pool.query(`
      SELECT id, nombre, posicion 
      FROM procesos 
      ORDER BY id
    `);

    // Convertir a formato esperado por el frontend
    const procesosFormatted = procesos.map(proceso => ({
      id: proceso.posicion,
      nombre: proceso.nombre,
      orden: proceso.posicion === 'op' ? 0 : parseInt(proceso.posicion.replace('op', ''))
    }));

    res.json(procesosFormatted);
  } catch (error) {
    console.error('Error al obtener procesos:', error);
    res.status(500).json({ message: 'Error al obtener procesos', error: error.message });
  }
});

// Crear nuevo proceso (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre del proceso es requerido' });
    }

    // Obtener el último proceso para generar la siguiente posición
    const [ultimoProceso] = await pool.query(`
      SELECT posicion 
      FROM procesos 
      WHERE posicion REGEXP '^op[0-9]+$'
      ORDER BY CAST(SUBSTRING(posicion, 3) AS UNSIGNED) DESC
      LIMIT 1
    `);

    // Generar nueva posición (op19, op20, etc.)
    let nextNumber = 19;
    if (ultimoProceso.length > 0) {
      const lastPos = ultimoProceso[0].posicion;
      const lastNumber = parseInt(lastPos.replace('op', ''));
      nextNumber = lastNumber + 1;
    }

    const nextPos = `op${nextNumber}`;

    // Agregar columna en tabla empleado
    await pool.query(
      `ALTER TABLE empleado ADD COLUMN ${nextPos} INT NOT NULL DEFAULT 0`
    );

    // Insertar en tabla procesos
    await pool.query(
      `INSERT INTO procesos (nombre, posicion) VALUES (:nombre, :posicion)`,
      { nombre: nombre.trim(), posicion: nextPos }
    );

    res.status(201).json({
      id: nextPos,
      nombre: nombre.trim(),
      orden: nextNumber,
      message: 'Proceso creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating proceso:', error);
    
    if (error.code === 'ER_DUP_FIELDNAME') {
      return res.status(409).json({ 
        message: 'La columna ya existe en la tabla empleado',
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al crear proceso', 
      error: error.message,
      code: error.code 
    });
  }
});

// Eliminar proceso (elimina la columna de empleado y el registro) (requiere autenticación)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el proceso existe
    const [proceso] = await pool.query(
      'SELECT * FROM procesos WHERE posicion = :posicion',
      { posicion: id }
    );

    if (proceso.length === 0) {
      return res.status(404).json({ message: 'Proceso no encontrado' });
    }

    // Eliminar columna de tabla empleado
    await pool.query(`ALTER TABLE empleado DROP COLUMN ${id}`);

    // Eliminar de tabla procesos
    await pool.query(
      'DELETE FROM procesos WHERE posicion = :posicion',
      { posicion: id }
    );

    res.json({ 
      message: 'Proceso eliminado exitosamente',
      id: id,
      nombre: proceso[0].nombre
    });
  } catch (error) {
    console.error('Error deleting proceso:', error);
    
    if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
      return res.status(500).json({ 
        message: 'No se puede eliminar la columna',
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al eliminar proceso',
      error: error.message,
      code: error.code
    });
  }
});

export default router;
