import { Router } from 'express';
import credentialsPool from '../credentialsDb.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
dotenv.config();

const router = Router();

// Mapeo de roles de credenciales a roles de skillmatrix
const mapRole = (credRole) => {
  const upperRole = (credRole || '').toUpperCase();
  if (upperRole === 'THE GOAT' || upperRole === 'ADMINISTRADOR') return 'admin';
  if (upperRole === 'LIDER' || upperRole === 'OPERADOR') return 'operador';
  return 'guest';
};

router.post(
  '/login',
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;

    try {
      // Buscar usuario en credenciales por num_empleado
      const [rows] = await credentialsPool.query(
        'SELECT num_empleado, nombre, pass_hash, rol FROM users WHERE num_empleado = :u',
        { u: username }
      );
      
      if (!rows.length) return res.status(401).json({ message: 'Credenciales inválidas' });

      const user = rows[0];
      const bcrypt = (await import('bcryptjs')).default;
      const hash = Buffer.isBuffer(user.pass_hash) ? user.pass_hash.toString() : user.pass_hash;
      const ok = await bcrypt.compare(password, hash);
      
      if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

      // Mapear rol
      const rolMapped = mapRole(user.rol);

      const token = jwt.sign(
        { username: user.num_empleado, rol: rolMapped, nombre: user.nombre },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );
      
      res.json({ 
        token, 
        user: { 
          username: user.num_empleado, 
          rol: rolMapped, 
          nombre: user.nombre 
        } 
      });
    } catch (e) {
      console.error('Error en login:', e);
      res.status(500).json({ message: 'Error de servidor' });
    }
  }
);

// Endpoint para buscar usuario por num_empleado (para lookup en login)
router.get('/lookup/:numEmpleado', async (req, res) => {
  try {
    const { numEmpleado } = req.params;
    const [rows] = await credentialsPool.query(
      'SELECT num_empleado, nombre, rol FROM users WHERE num_empleado = :ne',
      { ne: numEmpleado }
    );
    
    if (!rows.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const user = rows[0];
    res.json({
      num_empleado: user.num_empleado,
      nombre: user.nombre,
      rol: mapRole(user.rol)
    });
  } catch (e) {
    console.error('Error en lookup:', e);
    res.status(500).json({ message: 'Error de servidor' });
  }
});

export default router;
