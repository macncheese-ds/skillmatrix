import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Listar todos los empleados (público)
router.get('/', async (_req, res) => {
  try {
  const [rows] = await pool.query('SELECT * FROM empleado ORDER BY nde ASC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error listando empleados' });
  }
});

// Obtener un empleado (público)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empleado WHERE id=:id', { id: req.params.id });
    if (!rows.length) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error obteniendo empleado' });
  }
});

// Crear empleado
router.post('/', authenticateToken, async (req, res) => {
  const data = req.body;
  const cols = ['nde','link','fi','gaveta','nombre','pos','line','op','op1','op2','op3','op4','op5','op6','op7','op8','op9','op10','op11','op12','op13','op14','op15','op16','op17','op18'];
  const placeholders = cols.map(c => `:${c}`).join(',');
  try {
    const [result] = await pool.query(
      `INSERT INTO empleado (${cols.join(',')}) VALUES (${placeholders})`,
      cols.reduce((acc,c)=>{acc[c]=data[c]??0; return acc;}, {})
    );
    const [rows] = await pool.query('SELECT * FROM empleado WHERE id=:id', { id: result.insertId });
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creando empleado' });
  }
});

// Actualizar empleado
router.put('/:id', authenticateToken, async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const cols = ['nde','link','fi','gaveta','nombre','pos','line','op','op1','op2','op3','op4','op5','op6','op7','op8','op9','op10','op11','op12','op13','op14','op15','op16','op17','op18'];
  const setSql = cols.map(c => `${c}=:${c}`).join(',');
  try {
    const [result] = await pool.query(
      `UPDATE empleado SET ${setSql} WHERE id=:id`, 
      { id, ...cols.reduce((a,c)=>{a[c]=data[c]??0; return a;}, {}) }
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Empleado no encontrado' });
    const [rows] = await pool.query('SELECT * FROM empleado WHERE id=:id', { id });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error actualizando empleado' });
  }
});

// Eliminar empleado
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM empleado WHERE id=:id', { id: req.params.id });
    if (!result.affectedRows) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.sendStatus(204);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error eliminando empleado' });
  }
});

export default router;