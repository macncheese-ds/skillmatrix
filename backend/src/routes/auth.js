import { Router } from 'express';
import credentialsPool from '../credentialsDb.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
dotenv.config();

const router = Router();

// Función para normalizar número de empleado
// Extrae solo los dígitos para comparación flexible
// Ejemplo: "179A", "0179", "179", "0179A" todos se normalizan a "179"
const normalizeNumEmpleado = (numEmpleado) => {
  if (!numEmpleado) return '';
  // Extraer solo los números, eliminar ceros a la izquierda
  const numeros = numEmpleado.toString().replace(/\D/g, ''); // elimina todo excepto dígitos
  return numeros.replace(/^0+/, ''); // elimina ceros a la izquierda
};

// Mapeo de roles de credenciales a roles de skillmatrix
const mapRole = (credRole) => {
  const upperRole = (credRole || '').toUpperCase();
  if (upperRole === 'THE GOAT' || upperRole === 'ADMINISTRADOR' || upperRole === 'RECURSOS HUMANOS') return 'admin';
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
      // Normalizar el número de empleado recibido
      const normalizedInput = normalizeNumEmpleado(username);
      
      // Buscar todos los usuarios y comparar por número normalizado
      const [rows] = await credentialsPool.query(
        'SELECT num_empleado, nombre, pass_hash, rol FROM users'
      );
      
      // Buscar coincidencia por número normalizado
      const user = rows.find(u => normalizeNumEmpleado(u.num_empleado) === normalizedInput);
      
      if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

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
    
    // Normalizar el número de empleado recibido
    const normalizedInput = normalizeNumEmpleado(numEmpleado);
    
    // Buscar todos los usuarios y comparar por número normalizado
    const [rows] = await credentialsPool.query(
      'SELECT num_empleado, nombre, rol FROM users'
    );
    
    // Buscar coincidencia por número normalizado
    const user = rows.find(u => normalizeNumEmpleado(u.num_empleado) === normalizedInput);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
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
