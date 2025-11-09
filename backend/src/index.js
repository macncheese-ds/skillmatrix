import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';


import authRoutes from './routes/auth.js';
import empleadoRoutes from './routes/empleados.js';
import uploadRoutes from './routes/upload.js';
import procesosRoutes from './routes/procesos.js';
import xmlRoutes from './routes/xml.js';
import webserviceRoutes from './routes/webservice.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" },
//   crossOriginEmbedderPolicy: false
// }));
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como Postman) o desde localhost/IPs locales
    if (!origin || 
        origin.startsWith('http://localhost:') || 
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('http://10.') ||
        origin.startsWith('http://172.') ||
        origin.startsWith('http://192.168.')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));
app.use(morgan('dev'));

// Servir archivos estáticos (imágenes) con headers CORS
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
}, express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Verificar conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    // Test básico de conexión
    const [result] = await pool.query('SELECT 1 as test');
    
    // Verificar que existan las tablas
    const [tables] = await pool.query('SHOW TABLES');
    
    // Verificar estructura de la tabla empleado
    const [empleadoStructure] = await pool.query('DESCRIBE empleado');
    
    // Verificar estructura de la tabla users
    const [usersStructure] = await pool.query('DESCRIBE users');
    
    // Contar registros existentes
    const [empleadoCount] = await pool.query('SELECT COUNT(*) as count FROM empleado');
    const [usersCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    res.json({
      status: 'success',
      message: 'Conexión a la base de datos exitosa',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      connectionTest: result[0],
      tables: tables.map(t => Object.values(t)[0]),
      empleadoTable: {
        structure: empleadoStructure,
        count: empleadoCount[0].count
      },
      usersTable: {
        structure: usersStructure,
        count: usersCount[0].count
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error conectando a la base de datos',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/procesos', procesosRoutes);
app.use('/api/export', xmlRoutes);
app.use('/api/webservice', webserviceRoutes);

// Crea admin por única vez: username=admin, pass=admin123
app.post('/api/dev/seed-admin', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT username FROM users WHERE username="admin"');
    if (rows.length) return res.json({ message: 'Admin ya existe' });

    const bcrypt = (await import('bcryptjs')).default;
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (username, pass_hash, rol, nombre) VALUES ("admin", :p, "admin", "Administrador")',
      { p: hash }
    );
    res.json({ message: 'Admin creado', username: 'admin', password: 'admin123' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creando admin' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`API on ${PORT}`));

